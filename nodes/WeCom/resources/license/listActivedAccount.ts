import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	licenseApiRequest,
	optionalText,
	requireInteger,
	requireText,
} from './utils';

/** 获取企业的账号列表：https://developer.work.weixin.qq.com/document/path/95544 */
export async function listActivedAccount(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const limit = requireInteger(
		this,
		this.getNodeParameter('limit', index, 500),
		'返回最大记录数',
		index,
		1,
		1000,
	);
	const body: IDataObject = { corpid, limit };
	const cursor = optionalText(this.getNodeParameter('cursor', index, ''));
	if (cursor) body.cursor = cursor;
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/list_actived_account',
		providerAccessToken,
		label: '获取企业的账号列表',
		body,
	});
}
