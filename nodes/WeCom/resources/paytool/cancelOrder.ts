import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { paytoolApiRequest, requireText } from './utils';

/** 取消收款订单：https://developer.work.weixin.qq.com/document/path/98046 */
export async function cancelOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const orderId = requireText(
		this,
		this.getNodeParameter('orderId', index),
		'收款订单号',
		index,
		64,
	);
	return await paytoolApiRequest(this, index, {
		path: '/cgi-bin/paytool/close_order',
		providerAccessToken: this.getNodeParameter('providerAccessToken', index),
		paytoolSecret: this.getNodeParameter('paytoolSecret', index),
		label: '取消收款订单',
		body: { order_id: orderId },
	});
}
