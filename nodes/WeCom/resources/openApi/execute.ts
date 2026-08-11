import type { IExecuteFunctions, INodeExecutionData, IDataObject, IHttpRequestMethods } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { OPEN_API_BY_ID } from './catalog';

function parseJsonObject(raw: string, label: string): IDataObject {
	if (!raw || !String(raw).trim()) return {};
	try {
		const v = JSON.parse(raw) as unknown;
		if (v && typeof v === 'object' && !Array.isArray(v)) {
			return v as IDataObject;
		}
		throw new Error(`${label} 必须是 JSON 对象`);
	} catch (e) {
		throw new Error(`${label} 解析失败: ${(e as Error).message}`);
	}
}

export async function executeOpenApi(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let method: IHttpRequestMethods = 'POST';
			let path = '';
			const body = parseJsonObject(
				String(this.getNodeParameter('requestBody', i, '{}') ?? '{}'),
				'请求体JSON',
			);
			const qs = parseJsonObject(
				String(this.getNodeParameter('requestQuery', i, '{}') ?? '{}'),
				'Query参数JSON',
			);

			if (operation === 'callCgiBin') {
				method = this.getNodeParameter('httpMethod', i, 'POST') as IHttpRequestMethods;
				path = (this.getNodeParameter('apiPath', i) as string).trim();
			} else {
				const entry = OPEN_API_BY_ID[operation];
				if (!entry) {
					throw new NodeOperationError(this.getNode(), `未知 openApi 操作: ${operation}`, {
						itemIndex: i,
					});
				}
				method = entry.method;
				path = entry.path;
			}

			if (!path.startsWith('/cgi-bin/')) {
				throw new NodeOperationError(this.getNode(), `路径必须以 /cgi-bin/ 开头: ${path}`, {
					itemIndex: i,
				});
			}

			const response = await weComApiRequest.call(
				this,
				method,
				path,
				method === 'GET' ? {} : body,
				qs,
			);

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
