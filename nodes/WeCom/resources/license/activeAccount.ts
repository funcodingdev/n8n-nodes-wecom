import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireText } from './utils';

/** 激活账号：https://developer.work.weixin.qq.com/document/path/95553 */
export async function activeAccount(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const activeCode = requireText(
		this,
		this.getNodeParameter('activeCode', index),
		'账号激活码',
		index,
	);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const userid = requireText(this, this.getNodeParameter('userid', index), '企业成员 UserID', index);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/active_account',
		providerAccessToken,
		label: '激活账号',
		body: { active_code: activeCode, corpid, userid },
	});
}
