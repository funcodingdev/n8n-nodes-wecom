import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	assertListSize,
	assertUnique,
	licenseApiRequest,
	readBatchInput,
	requireText,
} from './utils';

/**
 * 批量激活账号
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95553
 */
export async function batchActiveAccount(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const rows = readBatchInput(this, index, {
		modeName: 'activeListInputMode',
		jsonName: 'activeListJson',
		collectionName: 'activeListCollection',
		collectionGroup: 'accounts',
		label: '激活账号列表',
	});
	assertListSize(this, rows, '激活账号列表', index, 1000);
	const activeList = rows.map((row, rowIndex) => ({
		active_code: requireText(
			this,
			row.activeCode ?? row.active_code,
			`激活账号第 ${rowIndex + 1} 项的激活码`,
			index,
		),
		userid: requireText(
			this,
			row.userid,
			`激活账号第 ${rowIndex + 1} 项的 UserID`,
			index,
		),
	}));
	assertUnique(
		this,
		activeList.map((account) => account.active_code),
		'激活账号列表中的激活码',
		index,
	);

	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/batch_active_account',
		providerAccessToken,
		label: '批量激活账号',
		body: { corpid, active_list: activeList },
	});
}
