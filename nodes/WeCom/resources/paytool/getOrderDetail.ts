import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { paytoolApiRequest, requireText } from './utils';

/** 获取收款订单详情：https://developer.work.weixin.qq.com/document/path/98054 */
export async function getOrderDetail(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const orderId = requireText(this, this.getNodeParameter('orderId', index), '订单号', index, 64);
	return await paytoolApiRequest(this, index, {
		path: '/cgi-bin/paytool/get_order_detail',
		providerAccessToken: this.getNodeParameter('providerAccessToken', index),
		paytoolSecret: this.getNodeParameter('paytoolSecret', index),
		label: '获取收款订单详情',
		body: { order_id: orderId },
	});
}
