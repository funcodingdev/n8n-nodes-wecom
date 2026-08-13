import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireOption, requireText } from './utils';

/** 设置企业的许可自动激活状态：https://developer.work.weixin.qq.com/document/path/95873 */
export async function setAutoActiveStatus(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const autoActiveStatus = requireOption(
		this,
		this.getNodeParameter('autoActiveStatus', index),
		'许可自动激活状态',
		index,
		[0, 1],
	);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/set_auto_active_status',
		providerAccessToken,
		label: '设置企业的许可自动激活状态',
		body: { corpid, auto_active_status: autoActiveStatus },
	});
}
