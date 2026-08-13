import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const REIMBURSE_STATUSES = [
	'INVOICE_REIMBURSE_INIT',
	'INVOICE_REIMBURSE_LOCK',
	'INVOICE_REIMBURSE_CLOSURE',
] as const;

export async function executeInvoice(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const fail = (message: string, itemIndex: number): never => {
		throw new NodeOperationError(this.getNode(), message, { itemIndex });
	};
	const requireText = (value: unknown, label: string, itemIndex: number): string => {
		const text = String(value ?? '').trim();
		if (!text) fail(`${label}不能为空`, itemIndex);
		return text;
	};
	const requireStatus = (value: unknown, itemIndex: number): string => {
		const status = requireText(value, '发票状态', itemIndex);
		if (!REIMBURSE_STATUSES.includes(status as (typeof REIMBURSE_STATUSES)[number])) {
			fail('发票状态不受支持', itemIndex);
		}
		return status;
	};
	const getInvoiceList = (
		itemIndex: number,
		collectionName: string,
		collectionKey: string,
		jsonName: string,
		label: string,
	): IDataObject[] => {
		const inputMode = this.getNodeParameter('invoiceInputMode', itemIndex, 'form') as string;
		let rawList: unknown;
		if (inputMode === 'json') {
			const rawJson = this.getNodeParameter(jsonName, itemIndex, '[]') as string;
			try {
				rawList = JSON.parse(rawJson);
			} catch (error) {
				fail(`${label} JSON 解析失败: ${(error as Error).message}`, itemIndex);
			}
		} else if (inputMode === 'form') {
			const collection = this.getNodeParameter(collectionName, itemIndex, {}) as IDataObject;
			rawList = collection[collectionKey];
		} else {
			fail('发票列表输入方式不受支持', itemIndex);
		}
		if (!Array.isArray(rawList) || rawList.length === 0) {
			throw new NodeOperationError(this.getNode(), `${label}至少需要一张发票`, {
				itemIndex,
			});
		}
		const identities = new Set<string>();
		return rawList.map((entry: unknown, entryIndex: number) => {
			if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
				fail(`${label}第 ${entryIndex + 1} 项必须是对象`, itemIndex);
			}
			const object = entry as IDataObject;
			const cardId = requireText(object.card_id, `${label}第 ${entryIndex + 1} 项的卡券 ID`, itemIndex);
			const encryptCode = requireText(
				object.encrypt_code,
				`${label}第 ${entryIndex + 1} 项的加密 Code`,
				itemIndex,
			);
			const identity = `${cardId}\u0000${encryptCode}`;
			if (identities.has(identity)) fail(`${label}中存在重复发票`, itemIndex);
			identities.add(identity);
			return { card_id: cardId, encrypt_code: encryptCode };
		});
	};
	const ensureSuccess = (response: IDataObject, label: string, itemIndex: number) => {
		if (response.errcode !== undefined && Number(response.errcode) !== 0) {
			fail(`${label}失败: ${response.errmsg} (错误码: ${response.errcode})`, itemIndex);
		}
	};

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject | undefined;
			if (operation === 'getInvoiceInfo') {
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/card/invoice/reimburse/getinvoiceinfo',
					{
						card_id: requireText(this.getNodeParameter('card_id', i), '发票卡券 ID', i),
						encrypt_code: requireText(this.getNodeParameter('encrypt_code', i), '加密 Code', i),
					},
				);
				ensureSuccess(response, '查询电子发票', i);
			} else if (operation === 'updateInvoiceStatus') {
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/card/invoice/reimburse/updateinvoicestatus',
					{
						card_id: requireText(this.getNodeParameter('card_id', i), '发票卡券 ID', i),
						encrypt_code: requireText(this.getNodeParameter('encrypt_code', i), '加密 Code', i),
						reimburse_status: requireStatus(
							this.getNodeParameter('reimburse_status', i),
							i,
						),
					},
				);
				ensureSuccess(response, '更新发票状态', i);
			} else if (operation === 'batchUpdateInvoiceStatus') {
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/card/invoice/reimburse/updatestatusbatch',
					{
						openid: requireText(this.getNodeParameter('openid', i), 'OpenID', i),
						reimburse_status: requireStatus(
							this.getNodeParameter('reimburse_status', i),
							i,
						),
						invoice_list: getInvoiceList(
							i,
							'invoiceCollection',
							'invoices',
							'invoiceListJson',
							'发票列表',
						),
					},
				);
				ensureSuccess(response, '批量更新发票状态', i);
			} else if (operation === 'batchGetInvoiceInfo') {
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/card/invoice/reimburse/getinvoiceinfobatch',
					{
						item_list: getInvoiceList(
							i,
							'itemCollection',
							'items',
							'itemListJson',
							'发票列表',
						),
					},
				);
				ensureSuccess(response, '批量查询电子发票', i);
			} else {
				fail(`不支持的操作: ${operation}`, i);
			}

			if (!response) {
				throw new NodeOperationError(this.getNode(), `操作 ${operation} 未返回结果`, {
					itemIndex: i,
				});
			}
			returnData.push({ json: response, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			if (error instanceof NodeOperationError) throw error;
			throw new NodeOperationError(this.getNode(), (error as Error).message, { itemIndex: i });
		}
	}

	return returnData;
}
