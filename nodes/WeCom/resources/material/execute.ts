import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComMultipartUpload } from '../../shared/multipartUpload';
import { getAccessToken, getWeComBaseUrl, weComApiRequest } from '../../shared/transport';

const MEBIBYTE = 1024 * 1024;
const MAX_RANGE_BYTES = 20 * MEBIBYTE;

interface DownloadResponse {
	body?: unknown;
	headers?: IDataObject;
	statusCode?: number;
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

function getResponseFilename(headers: IDataObject | undefined, fallback: string): string {
	const disposition = getHeader(headers, 'content-disposition');
	const encoded = disposition.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
	const regular = disposition.match(/filename\s*=\s*(?:"([^"]*)"|([^;\s]+))/i);
	const raw = encoded ?? regular?.[1] ?? regular?.[2];
	if (!raw) return fallback;
	try {
		return decodeURIComponent(raw).replace(/[\r\n]/g, '_');
	} catch {
		return raw.replace(/[\r\n]/g, '_');
	}
}

function detectImageMime(buffer: Buffer): 'image/jpeg' | 'image/png' | undefined {
	if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
		return 'image/jpeg';
	}
	if (buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
		return 'image/png';
	}
	return undefined;
}

function getAmrDurationMilliseconds(buffer: Buffer): number | undefined {
	const narrowBand = buffer.subarray(0, 6).equals(Buffer.from('#!AMR\n'));
	const wideBand = buffer.subarray(0, 9).equals(Buffer.from('#!AMR-WB\n'));
	if (!narrowBand && !wideBand) return undefined;

	const frameSizes = wideBand
		? [18, 24, 33, 37, 41, 47, 51, 59, 61, 6]
		: [13, 14, 16, 18, 20, 21, 27, 32, 6];
	let offset = wideBand ? 9 : 6;
	let frameCount = 0;
	while (offset < buffer.length) {
		const frameType = (buffer[offset] >> 3) & 0x0f;
		const frameSize = frameType === 15 ? 1 : frameSizes[frameType];
		if (!frameSize || offset + frameSize > buffer.length) return undefined;
		offset += frameSize;
		frameCount++;
	}
	return frameCount * 20;
}

function isMp4(buffer: Buffer): boolean {
	return buffer.length >= 12 && buffer.subarray(4, 8).toString('ascii') === 'ftyp';
}

export async function executeMaterial(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const fail = (message: string, itemIndex: number): never => {
		throw new NodeOperationError(this.getNode(), message, { itemIndex });
	};
	const requireText = (
		value: unknown,
		label: string,
		itemIndex: number,
		maxBytes?: number,
	): string => {
		const text = String(value ?? '').trim();
		if (!text) fail(`${label}不能为空`, itemIndex);
		if (maxBytes !== undefined && Buffer.byteLength(text, 'utf8') > maxBytes) {
			fail(`${label}不能超过 ${maxBytes} 个字节`, itemIndex);
		}
		return text;
	};
	const ensureApiSuccess = (response: IDataObject, label: string, itemIndex: number) => {
		if (response.errcode !== undefined && Number(response.errcode) !== 0) {
			fail(`${label}失败: ${response.errmsg} (错误码: ${response.errcode})`, itemIndex);
		}
	};
	const assertNoDownloadError = (
		response: DownloadResponse,
		buffer: Buffer,
		label: string,
		itemIndex: number,
	) => {
		const contentType = getHeader(response.headers, 'content-type').toLowerCase();
		const mayBeJson = contentType.includes('json') || buffer.subarray(0, 1).toString() === '{';
		if (!mayBeJson) return;
		try {
			const parsed = JSON.parse(buffer.toString('utf8')) as IDataObject;
			if (parsed.errcode !== undefined && Number(parsed.errcode) !== 0) {
				fail(`${label}失败: ${parsed.errmsg} (错误码: ${parsed.errcode})`, itemIndex);
			}
		} catch (error) {
			if (error instanceof NodeOperationError) throw error;
			// application/json 也可能是用户上传的普通文件，不把无法解析的内容误判为 API 错误。
		}
	};

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject | undefined;

			if (operation === 'uploadTemp') {
				const type = this.getNodeParameter('type', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;
				if (!['image', 'voice', 'video', 'file'].includes(type)) {
					fail('素材类型仅支持 image、voice、video 或 file', i);
				}
				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
				const filename = binaryData.fileName || 'file';
				let maxBytes = 20 * MEBIBYTE;
				let contentType: string | undefined;
				if (type === 'image') {
					maxBytes = 10 * MEBIBYTE;
					contentType = detectImageMime(buffer);
					if (!contentType) fail('图片素材仅支持 JPG 或 PNG 格式', i);
				} else if (type === 'voice') {
					maxBytes = 2 * MEBIBYTE;
					const duration = getAmrDurationMilliseconds(buffer);
					if (duration === undefined) fail('语音素材仅支持有效的 AMR 格式', i);
					if (duration !== undefined && duration > 60_000) {
						fail('语音素材播放长度不能超过 60 秒', i);
					}
					contentType = 'voice/amr';
				} else if (type === 'video') {
					maxBytes = 10 * MEBIBYTE;
					if (!isMp4(buffer)) fail('视频素材仅支持 MP4 格式', i);
					contentType = 'video/mp4';
				}

				response = await weComMultipartUpload.call(this, {
					itemIndex: i,
					path: '/cgi-bin/media/upload',
					qs: { type },
					binaryPropertyName,
					filename,
					contentType,
					minBytes: 6,
					maxBytes,
				});
			} else if (operation === 'uploadImage') {
				const binaryPropertyName = this.getNodeParameter('file', i, 'data') as string;
				const requestedFilename = this.getNodeParameter('filename', i, '') as string;
				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
				const contentType = detectImageMime(buffer);
				if (!contentType) fail('图片仅支持 JPG 或 PNG 格式', i);
				response = await weComMultipartUpload.call(this, {
					itemIndex: i,
					path: '/cgi-bin/media/uploadimg',
					binaryPropertyName,
					filename: requestedFilename.trim() || binaryData.fileName || 'image',
					contentType,
					minBytes: 6,
					maxBytes: 2 * MEBIBYTE,
				});
			} else if (operation === 'getTemp') {
				const mediaId = requireText(this.getNodeParameter('media_ID', i), '素材 ID', i);
				const binaryPropertyName = requireText(
					this.getNodeParameter('binaryProperty', i),
					'二进制数据属性',
					i,
				);
				const useRange = this.getNodeParameter('useRange', i, false) as boolean;
				const requestHeaders: IDataObject = {};
				let requestedRange: string | undefined;
				if (useRange) {
					const start = Number(this.getNodeParameter('rangeStart', i));
					const end = Number(this.getNodeParameter('rangeEnd', i));
					if (!Number.isSafeInteger(start) || start < 0) fail('分片起始位置必须是非负整数', i);
					if (!Number.isSafeInteger(end) || end < start) {
						fail('分片结束位置必须是不小于起始位置的整数', i);
					}
					const length = end - start + 1;
					if (length > MAX_RANGE_BYTES) fail('单个下载分片不能超过 20MB', i);
					const encryptedMaterial = this.getNodeParameter('encryptedMaterial', i, false) as boolean;
					if (encryptedMaterial && (start % 16 !== 0 || length % 16 !== 0)) {
						fail('加密素材的分片起始位置和分片长度必须按 16 字节对齐', i);
					}
					requestedRange = `bytes=${start}-${end}`;
					requestHeaders.Range = requestedRange;
				}

				const accessToken = await getAccessToken.call(this);
				const downloadResponse = (await this.helpers.httpRequest({
					method: 'GET',
					url: `${await getWeComBaseUrl.call(this)}/cgi-bin/media/get`,
					qs: { access_token: accessToken, media_id: mediaId },
					headers: requestHeaders,
					encoding: 'arraybuffer',
					returnFullResponse: true,
				})) as DownloadResponse;
				const buffer = toBuffer(downloadResponse.body);
				assertNoDownloadError(downloadResponse, buffer, '获取临时素材', i);
				if (buffer.length === 0) fail('获取临时素材失败：响应中没有文件数据', i);
				const contentType = getHeader(downloadResponse.headers, 'content-type').split(';')[0];
				const filename = getResponseFilename(downloadResponse.headers, 'material');
				const binaryData = await this.helpers.prepareBinaryData(
					buffer,
					filename,
					contentType || undefined,
				);
				const output: IDataObject = {
					media_id: mediaId,
					filename,
					content_type: contentType,
					bytes: buffer.length,
				};
				if (requestedRange) {
					output.range = {
						requested: requestedRange,
						content_range: getHeader(downloadResponse.headers, 'content-range'),
						accept_ranges: getHeader(downloadResponse.headers, 'accept-ranges'),
					};
				}
				returnData.push({
					json: output,
					binary: { [binaryPropertyName]: binaryData },
					pairedItem: { item: i },
				});
				continue;
			} else if (operation === 'getHighQualityVoice') {
				const mediaId = requireText(this.getNodeParameter('media_ID', i), '素材 ID', i);
				const binaryPropertyName = requireText(
					this.getNodeParameter('binaryProperty', i, 'data'),
					'二进制数据属性',
					i,
				);
				const accessToken = await getAccessToken.call(this);
				const voiceResponse = (await this.helpers.httpRequest({
					method: 'GET',
					url: `${await getWeComBaseUrl.call(this)}/cgi-bin/media/get/jssdk`,
					qs: { access_token: accessToken, media_id: mediaId },
					encoding: 'arraybuffer',
					returnFullResponse: true,
				})) as DownloadResponse;
				const buffer = toBuffer(voiceResponse.body);
				assertNoDownloadError(voiceResponse, buffer, '获取高清语音素材', i);
				if (buffer.length === 0) fail('获取高清语音素材失败：响应中没有文件数据', i);
				const contentType = getHeader(voiceResponse.headers, 'content-type').split(';')[0];
				const filename = getResponseFilename(voiceResponse.headers, 'voice.speex');
				const binaryData = await this.helpers.prepareBinaryData(
					buffer,
					filename,
					contentType || 'voice/speex',
				);
				returnData.push({
					json: {
						media_id: mediaId,
						filename,
						content_type: contentType || 'voice/speex',
						bytes: buffer.length,
					},
					binary: { [binaryPropertyName]: binaryData },
					pairedItem: { item: i },
				});
				continue;
			} else if (operation === 'uploadTempAsync') {
				const scene = Number(this.getNodeParameter('scene', i));
				const type = String(this.getNodeParameter('type', i));
				const filename = requireText(this.getNodeParameter('filename', i), '文件名', i, 128);
				const url = requireText(this.getNodeParameter('url', i), '文件 CDN URL', i, 1024);
				const md5 = requireText(this.getNodeParameter('md5', i), '文件 MD5', i, 32).toLowerCase();
				if (scene !== 1) fail('异步上传场景值目前仅支持 1', i);
				if (!['video', 'file'].includes(type)) fail('异步上传素材类型仅支持 video 或 file', i);
				if (type === 'video' && !filename.toLowerCase().endsWith('.mp4')) {
					fail('异步上传的视频仅支持 MP4 格式，文件名应以 .mp4 结尾', i);
				}
				try {
					const parsedUrl = new URL(url);
					if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error();
				} catch {
					fail('文件 CDN URL 必须是有效的 HTTP(S) 链接', i);
				}
				if (!/^[a-f0-9]{32}$/.test(md5)) fail('文件 MD5 必须是 32 位十六进制字符串', i);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/media/upload_by_url',
					{ scene, type, filename, url, md5 },
				);
				ensureApiSuccess(response, '生成异步上传任务', i);
			} else if (operation === 'getUploadByUrlResult') {
				const jobid = requireText(this.getNodeParameter('jobid', i), '任务 ID', i, 128);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/media/get_upload_by_url_result',
					{ jobid },
				);
				ensureApiSuccess(response, '查询异步任务结果', i);
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
