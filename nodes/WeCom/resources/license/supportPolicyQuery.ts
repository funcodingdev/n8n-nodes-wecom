import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireText } from './utils';

/** 民生优惠条件查询：https://developer.work.weixin.qq.com/document/path/96515 */
export async function supportPolicyQuery(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/support_policy_query',
		providerAccessToken,
		label: '民生优惠条件查询',
		body: { corpid },
	});
}
