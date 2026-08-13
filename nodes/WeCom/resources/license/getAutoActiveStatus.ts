import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireText } from './utils';

/** 查询企业的许可自动激活状态：https://developer.work.weixin.qq.com/document/path/95874 */
export async function getAutoActiveStatus(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/get_auto_active_status',
		providerAccessToken,
		label: '查询企业的许可自动激活状态',
		body: { corpid },
	});
}
