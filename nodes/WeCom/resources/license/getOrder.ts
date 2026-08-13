import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireText } from './utils';

/** 获取订单详情：https://developer.work.weixin.qq.com/document/path/95648 */
export async function getOrder(this: IExecuteFunctions, index: number): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const orderId = requireText(this, this.getNodeParameter('orderId', index), '订单 ID', index);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/get_order',
		providerAccessToken,
		label: '获取订单详情',
		body: { order_id: orderId },
	});
}
