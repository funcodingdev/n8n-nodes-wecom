import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const MAX_UINT32 = 4294967295;
const DAY_SECONDS = 86400;

interface DownloadResponse {
	body?: unknown;
	headers?: IDataObject;
}

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function text(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxBytes = 4096,
): string {
	const normalized = String(value ?? '').trim();
	if (!normalized) fail(context, `${label}不能为空`, itemIndex);
	if (Buffer.byteLength(normalized, 'utf8') > maxBytes) {
		fail(context, `${label}不能超过 ${maxBytes} 字节`, itemIndex);
	}
	return normalized;
}

function integer(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min: number,
	max: number,
): number {
	const normalized = Number(value);
	if (!Number.isSafeInteger(normalized) || normalized < min || normalized > max) {
		fail(context, `${label}必须是 ${min}–${max} 之间的整数`, itemIndex);
	}
	return normalized;
}

function timestamp(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	if (value === undefined || value === null || String(value).trim() === '') {
		fail(context, `${label}不能为空`, itemIndex);
	}
	const raw = String(value).trim();
	const normalized = /^\d+$/.test(raw) ? Number(raw) : Math.floor(Date.parse(raw) / 1000);
	if (!Number.isSafeInteger(normalized) || normalized < 1 || normalized > MAX_UINT32) {
		fail(context, `${label}不是有效的日期时间`, itemIndex);
	}
	return normalized;
}

function timeRange(
	context: IExecuteFunctions,
	startValue: unknown,
	endValue: unknown,
	label: string,
	itemIndex: number,
	maxDays: number,
): { starttime: number; endtime: number } {
	const starttime = timestamp(context, startValue, `${label}开始时间`, itemIndex);
	const endtime = timestamp(context, endValue, `${label}结束时间`, itemIndex);
	if (endtime <= starttime) fail(context, `${label}结束时间必须晚于开始时间`, itemIndex);
	if (endtime - starttime > maxDays * DAY_SECONDS) {
		fail(context, `${label}时间跨度不能超过 ${maxDays} 天`, itemIndex);
	}
	return { starttime, endtime };
}

function header(headers: IDataObject | undefined, name: string): string {
	if (!headers) return '';
	const key = Object.keys(headers).find(
		(candidate) => candidate.toLowerCase() === name.toLowerCase(),
	);
	return key ? String(headers[key] ?? '') : '';
}

function toBuffer(value: unknown): Buffer {
	if (Buffer.isBuffer(value)) return value;
	if (value instanceof ArrayBuffer) return Buffer.from(value);
	if (ArrayBuffer.isView(value)) {
		return Buffer.from(new Uint8Array(value.buffer, value.byteOffset, value.byteLength));
	}
	if (typeof value === 'string') return Buffer.from(value, 'binary');
	if (value === undefined || value === null) return Buffer.alloc(0);
	return Buffer.from(String(value));
}

function downloadUrl(context: IExecuteFunctions, value: unknown, itemIndex: number): string {
	const raw = text(context, value, '临时下载地址', itemIndex, 4096);
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		fail(context, '接口返回的临时下载地址无效', itemIndex);
	}
	if (!['http:', 'https:'].includes(parsed.protocol))
		fail(context, '临时下载地址必须使用 HTTP 或 HTTPS', itemIndex);
	return raw;
}

export async function executeJournal(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			if (operation === 'getRecordList') {
				const body: IDataObject = {
					...timeRange(
						this,
						this.getNodeParameter('starttime', i),
						this.getNodeParameter('endtime', i),
						'汇报记录查询',
						i,
						31,
					),
					cursor: integer(this, this.getNodeParameter('cursor', i, 0), '游标', i, 0, MAX_UINT32),
					limit: integer(this, this.getNodeParameter('limit', i, 50), '拉取数量', i, 1, 100),
				};
				if (this.getNodeParameter('enableFilters', i, false) as boolean) {
					const collection = this.getNodeParameter('filtersCollection', i, {}) as IDataObject;
					const rawFilters = (collection.filters as IDataObject[]) || [];
					if (!rawFilters.length) fail(this, '启用筛选后至少添加一个筛选条件', i);
					body.filters = rawFilters.map((filter, index) => {
						const key = String(filter.key ?? '');
						if (!['creator', 'department', 'template_id'].includes(key)) {
							fail(this, `第 ${index + 1} 个汇报筛选类型不受支持`, i);
						}
						return { key, value: text(this, filter.value, `第 ${index + 1} 个筛选值`, i, 256) };
					});
				}
				const response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/journal/get_record_list',
					body,
				);
				returnData.push({ json: response, pairedItem: { item: i } });
			} else if (operation === 'getRecordDetail') {
				const response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/journal/get_record_detail',
					{
						journaluuid: text(this, this.getNodeParameter('journalid', i), '汇报记录 ID', i, 256),
					},
				);
				returnData.push({ json: response, pairedItem: { item: i } });
			} else if (operation === 'getStatistics') {
				const response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/journal/get_stat_list',
					{
						template_id: text(this, this.getNodeParameter('template_id', i), '汇报模板 ID', i, 256),
						...timeRange(
							this,
							this.getNodeParameter('starttime', i),
							this.getNodeParameter('endtime', i),
							'汇报统计',
							i,
							366,
						),
					},
				);
				returnData.push({ json: response, pairedItem: { item: i } });
			} else if (operation === 'downloadFile') {
				const mode = String(this.getNodeParameter('downloadMode', i, 'binary'));
				if (!['credentials', 'binary'].includes(mode)) {
					fail(this, '结果方式只能是下载二进制数据或返回临时凭据', i);
				}
				let outputProperty = '';
				let fileName = '';
				if (mode === 'binary') {
					outputProperty = text(
						this,
						this.getNodeParameter('binaryProperty', i, 'data'),
						'二进制数据属性',
						i,
						128,
					);
					fileName = text(this, this.getNodeParameter('fileName', i), '输出文件名', i, 255);
					if (/[\0\r\n/\\]/.test(fileName)) fail(this, '输出文件名不能包含路径分隔符或换行符', i);
				}
				const credentials = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/journal/download_wedrive_file',
					{
						journaluuid: text(this, this.getNodeParameter('journaluuid', i), '汇报记录 ID', i, 256),
						fileid: text(this, this.getNodeParameter('fileid', i), '微盘文件 ID', i, 512),
					},
				);
				if (mode === 'credentials') {
					returnData.push({ json: credentials, pairedItem: { item: i } });
					continue;
				}
				const url = downloadUrl(this, credentials.download_url, i);
				const cookieName = text(this, credentials.cookie_name, '下载 Cookie 名称', i, 256);
				const cookieValue = text(this, credentials.cookie_value, '下载 Cookie 值', i, 4096);
				if (/[^!#$%&'*+\-.^_`|~0-9A-Za-z]/.test(cookieName) || /[\r\n;]/.test(cookieValue)) {
					fail(this, '接口返回的下载 Cookie 格式无效', i);
				}
				const downloadResponse = (await this.helpers.httpRequest({
					method: 'GET',
					url,
					headers: { Cookie: `${cookieName}=${cookieValue}` },
					encoding: 'arraybuffer',
					returnFullResponse: true,
				})) as DownloadResponse;
				const buffer = toBuffer(downloadResponse.body);
				if (!buffer.length) fail(this, '下载微盘文件失败：响应中没有文件数据', i);
				const contentType = header(downloadResponse.headers, 'content-type').split(';')[0];
				if (contentType.includes('json') || buffer.subarray(0, 1).toString() === '{') {
					try {
						const errorBody = JSON.parse(buffer.toString('utf8')) as IDataObject;
						if (Number(errorBody.errcode) !== 0) {
							fail(this, `下载微盘文件失败：${errorBody.errmsg}（错误码 ${errorBody.errcode}）`, i);
						}
					} catch (error) {
						if (error instanceof NodeOperationError) throw error;
					}
				}
				const binaryData = await this.helpers.prepareBinaryData(
					buffer,
					fileName,
					contentType || undefined,
				);
				returnData.push({
					json: {
						fileid: this.getNodeParameter('fileid', i),
						file_name: fileName,
						bytes: buffer.length,
					},
					binary: { [outputProperty]: binaryData },
					pairedItem: { item: i },
				});
			} else {
				fail(this, `不支持的汇报操作：${operation}`, i);
			}
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (this.continueOnFail()) {
				returnData.push({ json: { error: message }, pairedItem: { item: i } });
				continue;
			}
			if (error instanceof NodeOperationError) throw error;
			throw new NodeOperationError(this.getNode(), message, { itemIndex: i });
		}
	}

	return returnData;
}
