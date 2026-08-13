import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	paytoolApiRequest,
	requireOption,
	requireText,
} from './utils';

/** 标记开票状态：https://developer.work.weixin.qq.com/document/path/99437 */
export async function markInvoiceStatus(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const orderId = requireText(this, this.getNodeParameter('orderId', index), '订单号', index);
	const operUserid = requireText(
		this,
		this.getNodeParameter('operUserid', index, '') ||
			this.getNodeParameter('operUserid_selected', index, ''),
		'操作人 UserID',
		index,
	);
	const invoiceStatus = requireOption(
		this,
		this.getNodeParameter('invoiceStatus', index),
		'开票状态',
		index,
		[1, 2, 3],
	);
	const invoiceNote = requireText(
		this,
		this.getNodeParameter('invoiceNote', index),
		'开票备注',
		index,
		200,
	);
	return await paytoolApiRequest(this, index, {
		path: '/cgi-bin/paytool/mark_invoice_status',
		providerAccessToken: this.getNodeParameter('providerAccessToken', index),
		label: '标记开票状态',
		body: {
			order_id: orderId,
			oper_userid: operUserid,
			invoice_status: invoiceStatus,
			invoice_note: invoiceNote,
		},
	});
}
