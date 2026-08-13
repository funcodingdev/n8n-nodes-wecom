import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	licenseApiRequest,
	requireInteger,
	requireText,
} from './utils';

/** 获取应用的接口许可状态：https://developer.work.weixin.qq.com/document/path/95844 */
export async function getAppLicenseInfo(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const suiteId = requireText(this, this.getNodeParameter('suiteId', index), '套件 ID', index);
	const body: IDataObject = { corpid, suite_id: suiteId };
	if (this.getNodeParameter('includeAppid', index, false) as boolean) {
		body.appid = requireInteger(
			this,
			this.getNodeParameter('appid', index),
			'旧套件应用 ID',
			index,
			1,
			Number.MAX_SAFE_INTEGER,
		);
	}
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/get_app_license_info',
		providerAccessToken,
		label: '获取应用的接口许可状态',
		body,
	});
}
