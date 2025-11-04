import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getAccessToken } from '../../shared/transport';

/**
 * 素材管理操作执行函数
 * 官方文档：https://developer.work.weixin.qq.com/document/path/91054
 *
 * 实现的功能：
 * - uploadTemp: 上传临时素材（https://developer.work.weixin.qq.com/document/path/90253）
 * - uploadImage: 上传图片获取URL（https://developer.work.weixin.qq.com/document/path/90256）
 * - getTemp: 获取临时素材（https://developer.work.weixin.qq.com/document/path/90254）
 * - getHighQualityVoice: 获取高清语音素材（https://developer.work.weixin.qq.com/document/path/90255）
 * - uploadTempAsync: 异步上传临时素材（https://developer.work.weixin.qq.com/document/path/96219）
 */
export async function executeMaterial(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 上传临时素材
			if (operation === 'uploadTemp') {
				const type = this.getNodeParameter('type', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				const accessToken = await getAccessToken.call(this);

				const uploadOptions = {
					method: 'POST' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/media/upload',
					qs: {
						access_token: accessToken,
						type,
					},
					formData: {
						media: {
							value: dataBuffer,
							options: {
								filename: binaryData.fileName || 'file',
								contentType: binaryData.mimeType,
							},
						},
					},
					json: true,
				};

				response = (await this.helpers.httpRequest(uploadOptions)) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`上传临时素材失败: ${response.errmsg} (错误码: ${response.errcode})`,
					);
				}
			}
			// 上传图片获取URL
			else if (operation === 'uploadImage') {
				const binaryPropertyName = this.getNodeParameter('file', i, 'data') as string;
				const filename = this.getNodeParameter('filename', i, '') as string;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				const accessToken = await getAccessToken.call(this);

				const uploadOptions = {
					method: 'POST' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/media/uploadimg',
					qs: {
						access_token: accessToken,
					},
					formData: {
						media: {
							value: dataBuffer,
							options: {
								filename: filename || binaryData.fileName || 'image',
								contentType: binaryData.mimeType,
							},
						},
					},
					json: true,
				};

				response = (await this.helpers.httpRequest(uploadOptions)) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`上传图片失败: ${response.errmsg} (错误码: ${response.errcode})`,
					);
				}
			}
			// 获取临时素材
			else if (operation === 'getTemp') {
				const media_id = this.getNodeParameter('media_ID', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				const accessToken = await getAccessToken.call(this);

				const downloadOptions = {
					method: 'GET' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/media/get',
					qs: {
						access_token: accessToken,
						media_id,
					},
					encoding: null,
					returnFullResponse: true,
				};

				const downloadResponse = await this.helpers.httpRequest(downloadOptions);

				// 检查是否返回了错误（JSON格式）
				const contentType =
					(downloadResponse.headers?.['content-type'] ||
						downloadResponse.headers?.['Content-Type'] ||
						'') as string;

				if (contentType.includes('application/json') || contentType.includes('text/plain')) {
					let errorBody = downloadResponse.body;
					if (Buffer.isBuffer(errorBody)) {
						errorBody = errorBody.toString('utf-8');
					}

					try {
						const errorData =
							typeof errorBody === 'string' ? JSON.parse(errorBody) : errorBody;
						if (errorData.errcode && errorData.errcode !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`获取临时素材失败: ${errorData.errmsg} (错误码: ${errorData.errcode})`,
							);
						}
					} catch (error) {
						if (error instanceof NodeOperationError) {
							throw error;
						}
						throw new NodeOperationError(
							this.getNode(),
							`获取临时素材失败: ${String(errorBody)}`,
						);
					}
				}

				// 处理二进制响应
				let buffer: Buffer;
				let filename = 'file';

				if (downloadResponse.body) {
					if (Buffer.isBuffer(downloadResponse.body)) {
						buffer = downloadResponse.body;
					} else if (downloadResponse.body instanceof ArrayBuffer) {
						buffer = Buffer.from(downloadResponse.body);
					} else if (typeof downloadResponse.body === 'string') {
						buffer = Buffer.from(downloadResponse.body, 'binary');
					} else if (ArrayBuffer.isView(downloadResponse.body)) {
						buffer = Buffer.from(downloadResponse.body.buffer);
					} else {
						buffer = Buffer.from(String(downloadResponse.body));
					}
				} else {
					throw new NodeOperationError(this.getNode(), '无法获取素材内容：响应中没有数据');
				}

				// 尝试从响应头获取文件名
				if (downloadResponse.headers) {
					const contentDisposition =
						downloadResponse.headers['content-disposition'] ||
						downloadResponse.headers['Content-Disposition'];
					if (typeof contentDisposition === 'string') {
						const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
						if (match && match[1]) {
							filename = match[1].replace(/['"]/g, '');
							try {
								filename = decodeURIComponent(filename);
							} catch {
								// 解码失败使用原始文件名
							}
						}
					}
				}

				const binaryData = await this.helpers.prepareBinaryData(buffer, filename);

				returnData.push({
					json: { media_id },
					binary: {
						[binaryPropertyName]: binaryData,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			// 获取高清语音素材
			else if (operation === 'getHighQualityVoice') {
				const media_id = this.getNodeParameter('media_ID', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i, 'data') as string;

				const accessToken = await getAccessToken.call(this);

				const downloadOptions = {
					method: 'GET' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/media/get/jssdk',
					qs: {
						access_token: accessToken,
						media_id,
					},
					encoding: null,
					returnFullResponse: true,
				};

				const voiceResponse = await this.helpers.httpRequest(downloadOptions);

				// 检查是否返回了错误（JSON格式）
				const contentType =
					(voiceResponse.headers?.['content-type'] ||
						voiceResponse.headers?.['Content-Type'] ||
						'') as string;

				if (contentType.includes('application/json') || contentType.includes('text/plain')) {
					let errorBody = voiceResponse.body;
					if (Buffer.isBuffer(errorBody)) {
						errorBody = errorBody.toString('utf-8');
					}

					try {
						const errorData =
							typeof errorBody === 'string' ? JSON.parse(errorBody) : errorBody;
						if (errorData.errcode && errorData.errcode !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`获取高清语音失败: ${errorData.errmsg} (错误码: ${errorData.errcode})`,
							);
						}
					} catch (error) {
						if (error instanceof NodeOperationError) {
							throw error;
						}
						throw new NodeOperationError(
							this.getNode(),
							`获取高清语音失败: ${String(errorBody)}`,
						);
					}
				}

				// 处理二进制响应
				let buffer: Buffer;
				let filename = 'voice.amr';

				if (voiceResponse.body) {
					if (Buffer.isBuffer(voiceResponse.body)) {
						buffer = voiceResponse.body;
					} else if (voiceResponse.body instanceof ArrayBuffer) {
						buffer = Buffer.from(voiceResponse.body);
					} else if (typeof voiceResponse.body === 'string') {
						buffer = Buffer.from(voiceResponse.body, 'binary');
					} else if (ArrayBuffer.isView(voiceResponse.body)) {
						buffer = Buffer.from(voiceResponse.body.buffer);
					} else {
						buffer = Buffer.from(String(voiceResponse.body));
					}
				} else {
					throw new NodeOperationError(this.getNode(), '无法获取高清语音内容：响应中没有数据');
				}

				// 尝试从响应头获取文件名
				if (voiceResponse.headers) {
					const contentDisposition =
						voiceResponse.headers['content-disposition'] ||
						voiceResponse.headers['Content-Disposition'];
					if (typeof contentDisposition === 'string') {
						const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
						if (match && match[1]) {
							filename = match[1].replace(/['"]/g, '');
							try {
								filename = decodeURIComponent(filename);
							} catch {
								// 解码失败使用原始文件名
							}
						}
					}
				}

				const binaryData = await this.helpers.prepareBinaryData(buffer, filename);

				returnData.push({
					json: { media_id },
					binary: {
						[binaryPropertyName]: binaryData,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			// 异步上传临时素材
			else if (operation === 'uploadTempAsync') {
				const type = this.getNodeParameter('type', i) as string;
				const binaryPropertyName = this.getNodeParameter('file', i, 'data') as string;
				const filename = this.getNodeParameter('filename', i, '') as string;
				const attachment_type = this.getNodeParameter('attachment_type', i, 1) as number;
				const scene = this.getNodeParameter('scene', i, 1) as number;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				const accessToken = await getAccessToken.call(this);

				const uploadOptions = {
					method: 'POST' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/media/upload_by_url',
					qs: {
						access_token: accessToken,
						type,
						attachment_type,
						scene,
					},
					formData: {
						media: {
							value: dataBuffer,
							options: {
								filename: filename || binaryData.fileName || 'file',
								contentType: binaryData.mimeType,
							},
						},
					},
					json: true,
				};

				response = (await this.helpers.httpRequest(uploadOptions)) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`异步上传临时素材失败: ${response.errmsg} (错误码: ${response.errcode})`,
					);
				}
			} else {
				throw new NodeOperationError(this.getNode(), `不支持的操作: ${operation}`);
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
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
