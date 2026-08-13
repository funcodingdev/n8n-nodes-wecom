import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireText } from './utils';

/** 提交余额支付订单任务：https://developer.work.weixin.qq.com/document/path/99415 */
export async function submitPayJob(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const payerUserid = requireText(
		this,
		this.getNodeParameter('payerUserid', index, '') ||
			this.getNodeParameter('payerUserid_selected', index, ''),
		'支付人 UserID',
		index,
	);
	const orderId = requireText(this, this.getNodeParameter('orderId', index), '订单 ID', index);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/submit_pay_job',
		providerAccessToken,
		label: '提交余额支付订单任务',
		body: { payer_userid: payerUserid, order_id: orderId },
	});
}
