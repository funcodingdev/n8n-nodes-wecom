import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireText } from './utils';

/** 获取激活码详情：https://developer.work.weixin.qq.com/document/path/95552 */
export async function getActiveInfoByCode(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const activeCode = requireText(this, this.getNodeParameter('activeCode', index), '激活码', index);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/get_active_info_by_code',
		providerAccessToken,
		label: '获取激活码详情',
		body: { corpid, active_code: activeCode },
	});
}
