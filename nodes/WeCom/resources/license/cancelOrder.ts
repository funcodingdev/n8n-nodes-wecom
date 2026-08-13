import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireText } from './utils';

/** 取消订单：https://developer.work.weixin.qq.com/document/path/96106 */
export async function cancelOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const orderId = requireText(this, this.getNodeParameter('orderId', index), '订单 ID', index);
	const isMultiCorpOrder = this.getNodeParameter('isMultiCorpOrder', index, false) as boolean;
	const body: IDataObject = { order_id: orderId };
	if (!isMultiCorpOrder) {
		body.corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	}
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/cancel_order',
		providerAccessToken,
		label: '取消订单',
		body,
	});
}
