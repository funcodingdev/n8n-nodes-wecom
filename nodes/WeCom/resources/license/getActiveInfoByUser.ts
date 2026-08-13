import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireText } from './utils';

/** 获取成员的激活详情：https://developer.work.weixin.qq.com/document/path/95555 */
export async function getActiveInfoByUser(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const userid = requireText(this, this.getNodeParameter('userid', index), '企业成员 UserID', index);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/get_active_info_by_user',
		providerAccessToken,
		label: '获取成员的激活详情',
		body: { corpid, userid },
	});
}
