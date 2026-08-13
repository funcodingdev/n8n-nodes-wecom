import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	assertListSize,
	assertUnique,
	licenseApiRequest,
	optionalText,
	readBatchInput,
	requireOption,
	requireText,
} from './utils';

/**
 * 创建续期任务
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95646
 */
export async function createRenewOrderJob(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const rows = readBatchInput(this, index, {
		modeName: 'renewInputMode',
		jsonName: 'accountListJson',
		collectionName: 'accountCollection',
		collectionGroup: 'accounts',
		label: '续期账号列表',
	});
	assertListSize(this, rows, '续期账号列表', index, 1000);
	const accountList = rows.map((row, rowIndex) => {
		const userid = requireText(
			this,
			row.userid || row.userid_selected,
			`续期账号第 ${rowIndex + 1} 项的 UserID`,
			index,
		);
		const type = requireOption(
			this,
			row.type,
			`续期账号第 ${rowIndex + 1} 项的账号类型`,
			index,
			[1, 2],
		);
		return { userid, type };
	});
	assertUnique(
		this,
		accountList.map((account) => `${account.userid}\u0000${account.type}`),
		'续期账号列表',
		index,
	);

	const body: IDataObject = { corpid, account_list: accountList };
	const jobid = optionalText(this.getNodeParameter('jobid', index, ''));
	if (jobid) body.jobid = jobid;
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/create_renew_order_job',
		providerAccessToken,
		label: '创建续期任务',
		body,
	});
}
