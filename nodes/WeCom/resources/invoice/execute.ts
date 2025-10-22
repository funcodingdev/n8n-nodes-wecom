import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeInvoice(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			if (operation === 'getInvoiceInfo') {
				const card_id = this.getNodeParameter('card_id', i) as string;
				const encrypt_code = this.getNodeParameter('encrypt_code', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/card/invoice/reimburse/getinvoiceinfo', {
					card_id,
					encrypt_code,
				});
			} else if (operation === 'updateInvoiceStatus') {
				const card_id = this.getNodeParameter('card_id', i) as string;
				const encrypt_code = this.getNodeParameter('encrypt_code', i) as string;
				const reimburse_status = this.getNodeParameter('reimburse_status', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/card/invoice/reimburse/updateinvoicestatus',
					{
						card_id,
						encrypt_code,
						reimburse_status,
					},
				);
			} else if (operation === 'batchUpdateInvoiceStatus') {
				const openid = this.getNodeParameter('openid', i) as string;
				const reimburse_status = this.getNodeParameter('reimburse_status', i) as string;
				const invoice_list = this.getNodeParameter('invoice_list', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/card/invoice/reimburse/updatestatusbatch',
					{
						openid,
						reimburse_status,
						invoice_list: JSON.parse(invoice_list),
					},
				);
			} else if (operation === 'batchGetInvoiceInfo') {
				const item_list = this.getNodeParameter('item_list', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/card/invoice/reimburse/getinvoiceinfobatch',
					{
						item_list: JSON.parse(item_list),
					},
				);
			} else {
				response = {};
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}

