import { createDecipheriv } from 'crypto';
import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const WECOM_DOWNLOAD_HOST_SUFFIX = '.myqcloud.com';

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function requireText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxLength = 128,
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	if (text.length > maxLength) {
		fail(context, `${label}不能超过 ${maxLength} 个字符`, itemIndex);
	}
	return text;
}

function toBuffer(context: IExecuteFunctions, value: unknown, itemIndex: number): Buffer {
	if (Buffer.isBuffer(value)) return value;
	if (value instanceof ArrayBuffer) return Buffer.from(value);
	if (ArrayBuffer.isView(value)) {
		return Buffer.from(value.buffer, value.byteOffset, value.byteLength);
	}
	fail(context, '下载结果不是可解析的二进制数据', itemIndex);
}

function validateDownloadUrl(context: IExecuteFunctions, value: unknown, itemIndex: number): string {
	const rawUrl = requireText(context, value, '文件 URL', itemIndex, 4096);
	let parsed: URL;
	try {
		parsed = new URL(rawUrl);
	} catch {
		fail(context, '文件 URL 格式无效', itemIndex);
	}
	if (
		parsed.protocol !== 'https:' ||
		!parsed.hostname.endsWith(WECOM_DOWNLOAD_HOST_SUFFIX) ||
		parsed.username ||
		parsed.password ||
		(parsed.port && parsed.port !== '443')
	) {
		fail(
			context,
			'文件 URL 必须是企业微信返回的 myqcloud.com HTTPS 下载地址',
			itemIndex,
		);
	}
	return parsed.toString();
}

function getAesKey(context: IExecuteFunctions, value: unknown, itemIndex: number): Buffer {
	const encodingAesKey = String(value ?? '').trim();
	if (!/^[A-Za-z0-9+/]{43}$/.test(encodingAesKey)) {
		fail(context, '凭证中的 EncodingAESKey 必须是 43 位 Base64 字符串', itemIndex);
	}
	const key = Buffer.from(`${encodingAesKey}=`, 'base64');
	if (key.length !== 32) {
		fail(context, '凭证中的 EncodingAESKey 解码后必须为 32 字节', itemIndex);
	}
	return key;
}

function decryptFile(
	context: IExecuteFunctions,
	encryptedData: Buffer,
	key: Buffer,
	itemIndex: number,
): Buffer {
	if (encryptedData.length === 0) fail(context, '加密文件内容不能为空', itemIndex);
	if (encryptedData.length % 16 !== 0) {
		fail(context, '加密文件长度必须是 AES 块大小 16 字节的倍数', itemIndex);
	}

	let decrypted: Buffer;
	try {
		const decipher = createDecipheriv('aes-256-cbc', key, key.subarray(0, 16));
		decipher.setAutoPadding(false);
		decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);
	} catch (error) {
		fail(context, `文件解密失败: ${(error as Error).message}`, itemIndex);
	}

	const pad = decrypted[decrypted.length - 1];
	if (pad < 1 || pad > 32 || pad > decrypted.length) {
		fail(context, '文件解密失败：PKCS#7 填充长度无效', itemIndex);
	}
	for (let offset = 0; offset < pad; offset++) {
		if (decrypted[decrypted.length - 1 - offset] !== pad) {
			fail(context, '文件解密失败：PKCS#7 填充字节不一致', itemIndex);
		}
	}
	return decrypted.subarray(0, decrypted.length - pad);
}

/**
 * 解密智能机器人回调中的图片、文件或视频。
 * 企业微信使用 AES-256-CBC，IV 为 AESKey 前 16 字节，并以 PKCS#7 填充到 32 字节的倍数。
 */
export async function executeFile(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			if (operation !== 'decryptFile') {
				fail(this, `不支持的文件操作: ${operation}`, i);
			}

			const inputType = String(this.getNodeParameter('inputType', i, 'url'));
			if (!['url', 'binary'].includes(inputType)) {
				fail(this, `不支持的输入方式: ${inputType}`, i);
			}
			const outputFormat = String(this.getNodeParameter('outputFormat', i, 'binary'));
			if (!['binary', 'base64'].includes(outputFormat)) {
				fail(this, `不支持的输出格式: ${outputFormat}`, i);
			}

			let credentials: { encodingAESKey?: unknown };
			try {
				credentials = (await this.getCredentials('weComReceiveApi')) as {
					encodingAESKey?: unknown;
				};
			} catch (error) {
				if (error instanceof NodeOperationError) throw error;
				fail(
					this,
					`获取企业微信消息接收 API 凭证失败: ${(error as Error).message}`,
					i,
				);
			}
			const key = getAesKey(this, credentials.encodingAESKey, i);

			let encryptedData: Buffer;
			if (inputType === 'url') {
				const url = validateDownloadUrl(this, this.getNodeParameter('url', i), i);
				try {
					const response = (await this.helpers.httpRequest({
						method: 'GET',
						url,
						encoding: 'arraybuffer',
						returnFullResponse: false,
						disableFollowRedirect: true,
						timeout: 30000,
					})) as unknown;
					encryptedData = toBuffer(this, response, i);
				} catch (error) {
					if (error instanceof NodeOperationError) throw error;
					fail(this, `下载加密文件失败: ${(error as Error).message}`, i);
				}
			} else {
				const binaryProperty = requireText(
					this,
					this.getNodeParameter('binaryProperty', i, 'data'),
					'加密文件二进制属性',
					i,
				);
				try {
					this.helpers.assertBinaryData(i, binaryProperty);
					encryptedData = await this.helpers.getBinaryDataBuffer(i, binaryProperty);
				} catch (error) {
					if (error instanceof NodeOperationError) throw error;
					fail(
						this,
						`读取二进制属性“${binaryProperty}”失败: ${(error as Error).message}`,
						i,
					);
				}
			}

			const decryptedData = decryptFile(this, encryptedData, key, i);
			const result: INodeExecutionData = {
				json: { size: decryptedData.length },
				pairedItem: { item: i },
			};
			if (outputFormat === 'base64') {
				const outputProperty = requireText(
					this,
					this.getNodeParameter('outputProperty', i, 'data'),
					'Base64 输出字段名',
					i,
				);
				result.json[outputProperty] = decryptedData.toString('base64');
			} else {
				const outputBinaryProperty = requireText(
					this,
					this.getNodeParameter('outputBinaryProperty', i, 'data'),
					'输出二进制属性',
					i,
				);
				const outputFileName = requireText(
					this,
					this.getNodeParameter('outputFileName', i, 'decrypted-file'),
					'输出文件名',
					i,
					255,
				);
				if (/[\0\r\n/\\]/.test(outputFileName)) {
					fail(this, '输出文件名不能包含路径分隔符或换行符', i);
				}
				const outputMimeType = requireText(
					this,
					this.getNodeParameter('outputMimeType', i, 'application/octet-stream'),
					'MIME 类型',
					i,
				);
				if (!/^[^\s/]+\/[^\s/]+$/.test(outputMimeType)) {
					fail(this, 'MIME 类型格式无效，例如 application/pdf', i);
				}
				const binaryData = await this.helpers.prepareBinaryData(
					decryptedData,
					outputFileName,
					outputMimeType,
				);
				result.binary = { [outputBinaryProperty]: binaryData };
			}
			returnData.push(result);
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message } as IDataObject,
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
