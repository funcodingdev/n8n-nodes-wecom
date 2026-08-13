import type {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

interface DownloadResponse {
	body?: unknown;
	headers?: IDataObject;
}

function getHeader(headers: IDataObject | undefined, name: string): string {
	if (!headers) return '';
	const wanted = name.toLowerCase();
	const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === wanted);
	return entry ? String(entry[1] ?? '') : '';
}

function toBuffer(body: unknown): Buffer {
	if (Buffer.isBuffer(body)) return body;
	if (body instanceof ArrayBuffer) return Buffer.from(body);
	if (ArrayBuffer.isView(body)) {
		return Buffer.from(new Uint8Array(body.buffer, body.byteOffset, body.byteLength));
	}
	if (typeof body === 'string') return Buffer.from(body, 'binary');
	if (body === undefined || body === null) return Buffer.alloc(0);
	return Buffer.from(String(body));
}

function getResponseFilename(headers: IDataObject | undefined): string {
	const disposition = getHeader(headers, 'content-disposition');
	const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
	const regular = disposition.match(/filename\s*=\s*(?:"([^"]*)"|([^;\s]+))/i);
	const raw = encoded ?? regular?.[1] ?? regular?.[2];
	if (!raw) return 'qrcode.png';
	try {
		return decodeURIComponent(raw).replace(/[\r\n]/g, '_');
	} catch {
		return raw.replace(/[\r\n]/g, '_');
	}
}

function assertBinaryResponse(
	context: IExecuteFunctions,
	response: DownloadResponse,
	buffer: Buffer,
	index: number,
): void {
	const contentType = getHeader(response.headers, 'content-type').toLowerCase();
	const trimmed = buffer.toString('utf8', 0, Math.min(buffer.length, 1024)).trimStart();
	if (!contentType.includes('json') && !trimmed.startsWith('{')) return;

	try {
		const parsed = JSON.parse(buffer.toString('utf8')) as IDataObject;
		if (parsed.errcode !== undefined && Number(parsed.errcode) !== 0) {
			throw new NodeOperationError(
				context.getNode(),
				`获取应用二维码失败: ${parsed.errmsg} (错误码: ${parsed.errcode})`,
				{ itemIndex: index },
			);
		}
		throw new NodeOperationError(
			context.getNode(),
			'获取应用二维码失败：接口返回了 JSON，而不是二维码图片',
			{ itemIndex: index },
		);
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		throw new NodeOperationError(
			context.getNode(),
			'获取应用二维码失败：图片响应格式无效',
			{ itemIndex: index },
		);
	}
}

/**
 * 获取应用二维码
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95430
 */
export async function getAppQrcode(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const suiteAccessToken = String(
		this.getNodeParameter('suiteAccessToken', index) ?? '',
	).trim();
	const suiteId = String(this.getNodeParameter('suiteId', index) ?? '').trim();
	const appid = Number(this.getNodeParameter('appid', index, 1));
	const state = String(this.getNodeParameter('state', index, '') ?? '').trim();
	const style = Number(this.getNodeParameter('style', index, 2));
	const resultType = Number(this.getNodeParameter('resultType', index, 1));
	const binaryProperty = String(
		this.getNodeParameter('binaryProperty', index, 'data') ?? '',
	).trim();

	if (!suiteAccessToken) {
		throw new NodeOperationError(this.getNode(), 'Suite Access Token不能为空', {
			itemIndex: index,
		});
	}
	if (!suiteId) {
		throw new NodeOperationError(this.getNode(), '第三方应用ID不能为空', {
			itemIndex: index,
		});
	}
	if (!Number.isSafeInteger(appid) || appid <= 0) {
		throw new NodeOperationError(this.getNode(), '应用 ID 必须是正整数', {
			itemIndex: index,
		});
	}
	if (!Number.isSafeInteger(style) || style < 0 || style > 4) {
		throw new NodeOperationError(this.getNode(), '二维码样式仅支持 0–4', {
			itemIndex: index,
		});
	}
	if (![1, 2].includes(resultType)) {
		throw new NodeOperationError(this.getNode(), '结果返回方式仅支持图片或 URL', {
			itemIndex: index,
		});
	}
	if (state && !/^[A-Za-z0-9]{1,32}$/.test(state)) {
		throw new NodeOperationError(
			this.getNode(),
			'State 只能包含英文字母和数字，且不能超过 32 个字符',
			{ itemIndex: index },
		);
	}
	if (resultType === 1 && !binaryProperty) {
		throw new NodeOperationError(this.getNode(), '二进制数据属性不能为空', {
			itemIndex: index,
		});
	}

	const body: IDataObject = {
		suite_id: suiteId,
		style,
		result_type: resultType,
	};
	if (appid !== 1) body.appid = appid;
	if (state) body.state = state;

	const baseUrl = await getWeComBaseUrl.call(this);
	try {
		if (resultType === 1) {
			const options: IHttpRequestOptions = {
				method: 'POST',
				url: `${baseUrl}/cgi-bin/service/get_app_qrcode`,
				qs: { suite_access_token: suiteAccessToken },
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
				encoding: 'arraybuffer',
				returnFullResponse: true,
			};
			const response = (await this.helpers.httpRequest(options)) as DownloadResponse;
			const buffer = toBuffer(response.body);
			if (buffer.length === 0) {
				throw new NodeOperationError(
					this.getNode(),
					'获取应用二维码失败：响应中没有图片数据',
					{ itemIndex: index },
				);
			}
			assertBinaryResponse(this, response, buffer, index);

			const filename = getResponseFilename(response.headers);
			const contentType = getHeader(response.headers, 'content-type').split(';')[0] || 'image/png';
			const binaryData = await this.helpers.prepareBinaryData(buffer, filename, contentType);
			return {
				json: {
					success: true,
					filename,
					content_type: contentType,
					bytes: buffer.length,
				},
				binary: { [binaryProperty]: binaryData },
			};
		}

		const response = (await this.helpers.httpRequest({
			method: 'POST',
			url: `${baseUrl}/cgi-bin/service/get_app_qrcode`,
			qs: { suite_access_token: suiteAccessToken },
			body,
			json: true,
		})) as IDataObject;
		if (response.errcode !== undefined && Number(response.errcode) !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取应用二维码失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}
		return { json: response };
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		throw new NodeOperationError(
			this.getNode(),
			`获取应用二维码失败: ${(error as Error).message}`,
			{ itemIndex: index },
		);
	}
}
