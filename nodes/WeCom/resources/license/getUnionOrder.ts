import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	licenseApiRequest,
	optionalText,
	requireInteger,
	requireText,
} from './utils';

/** 获取多企业订单详情：https://developer.work.weixin.qq.com/document/path/98893 */
export async function getUnionOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const orderId = requireText(this, this.getNodeParameter('orderId', index), '订单 ID', index);
	const limit = requireInteger(
		this,
		this.getNodeParameter('limit', index, 500),
		'返回最大记录数',
		index,
		1,
		1000,
	);
	const body: IDataObject = { order_id: orderId, limit };
	const cursor = optionalText(this.getNodeParameter('cursor', index, ''));
	if (cursor) body.cursor = cursor;
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/get_union_order',
		providerAccessToken,
		label: '获取多企业订单详情',
		body,
	});
}
