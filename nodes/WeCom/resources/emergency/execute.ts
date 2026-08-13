import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const LIST_SEPARATOR = /[,，|\n\r]+/;

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function requiredText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxBytes: number,
): string {
	const normalized = String(value ?? '').trim();
	if (!normalized) fail(context, `${label}不能为空`, itemIndex);
	if (Buffer.byteLength(normalized, 'utf8') > maxBytes) {
		fail(context, `${label}不能超过 ${maxBytes} 字节`, itemIndex);
	}
	return normalized;
}

function listValues(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.flatMap((entry) => listValues(entry));
	}
	return String(value ?? '')
		.split(LIST_SEPARATOR)
		.map((entry) => entry.trim())
		.filter(Boolean);
}

function useridList(context: IExecuteFunctions, value: unknown, itemIndex: number): string[] {
	const unique = [...new Set(listValues(value))].map((userid) =>
		requiredText(context, userid, '被叫成员 UserID', itemIndex, 64),
	);
	if (!unique.length) fail(context, '被叫成员 UserID 列表不能为空', itemIndex);
	return unique;
}

function parseUserIdJson(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string[] {
	if (value === undefined || value === null || String(value).trim() === '') return [];
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch {
			fail(context, `${label}不是有效的 JSON`, itemIndex);
		}
	}
	if (!Array.isArray(parsed)) fail(context, `${label}必须是 JSON 数组`, itemIndex);
	if (parsed.length === 0) return [];
	return listValues(
		parsed.map((entry) => {
			if (typeof entry === 'string' || typeof entry === 'number') return entry;
			if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
				const row = entry as IDataObject;
				return row.userid ?? row.userid_selected ?? row.user_id ?? '';
			}
			return '';
		}),
	);
}

export async function executeEmergency(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let endpoint: string;
			let body: IDataObject;
			if (operation === 'makeVoiceCall') {
				endpoint = '/cgi-bin/pstncc/call';
				body = {
					callee_userid: useridList(
						this,
						[
							this.getNodeParameter('callee_userid', i, ''),
							this.getNodeParameter('callee_userid_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('calleeUseridsJson', i, '[]'),
								'被叫成员 JSON',
								i,
							),
						],
						i,
					),
				};
			} else if (operation === 'getCallStatus') {
				endpoint = '/cgi-bin/pstncc/getstates';
				body = {
					callee_userid: requiredText(
						this,
						this.getNodeParameter('callee_userid', i, '') ||
							this.getNodeParameter('callee_userid_selected', i, ''),
						'被叫成员 UserID',
						i,
						64,
					),
					callid: requiredText(this, this.getNodeParameter('callid', i), '通话 ID', i, 256),
				};
			} else {
				fail(this, `不支持的紧急通知操作：${operation}`, i);
			}

			const response = await weComApiRequest.call(this, 'POST', endpoint, body);
			returnData.push({ json: response || {}, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error instanceof Error ? error.message : String(error) },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
