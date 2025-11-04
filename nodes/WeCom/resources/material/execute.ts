import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { getAccessToken } from '../../shared/transport';

export async function executeMaterial(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

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

				response = await this.helpers.httpRequest(uploadOptions) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new Error(`企业微信 API 错误: ${response.errmsg} (错误码: ${response.errcode})`);
				}
			} else if (operation === 'getTemp') {
				const media_ID = this.getNodeParameter('media_ID', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				const accessToken = await getAccessToken.call(this);

				const downloadOptions = {
					method: 'GET' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/media/get',
					qs: {
						access_token: accessToken,
						media_id: media_ID,
					},
					returnFullResponse: true,
				};

				const response = await this.helpers.httpRequest(downloadOptions);

				const contentType = (response.headers?.['content-type'] || response.headers?.['Content-Type'] || '') as string;
				if (contentType.includes('application/json') || contentType.includes('text/plain')) {
					let errorBody = response.body;
					if (Buffer.isBuffer(errorBody)) {
						errorBody = errorBody.toString('utf-8');
					} else if (errorBody instanceof ArrayBuffer) {
						errorBody = Buffer.from(errorBody).toString('utf-8');
					}
					
					try {
						const errorData = typeof errorBody === 'string' ? JSON.parse(errorBody) : errorBody;
						if (errorData.errcode && errorData.errcode !== 0) {
							throw new Error(`企业微信 API 错误: ${errorData.errmsg} (错误码: ${errorData.errcode})`);
						}
					} catch {
						throw new Error(`获取素材失败: ${String(errorBody)}`);
					}
				}

				let buffer: Buffer;
				let filename = 'file';

				if (response.body) {
					if (Buffer.isBuffer(response.body)) {
						buffer = response.body;
					} else if (response.body instanceof ArrayBuffer) {
						buffer = Buffer.from(response.body);
					} else if (typeof response.body === 'string') {
						buffer = Buffer.from(response.body, 'binary');
					} else if (ArrayBuffer.isView(response.body)) {
						buffer = Buffer.from(response.body.buffer);
					} else {
						buffer = Buffer.from(String(response.body));
					}
				} else {
					throw new Error('无法获取素材内容：响应中没有数据');
				}

				if (response.headers) {
					const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
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
					json: { media_ID },
					binary: {
						[binaryPropertyName]: binaryData,
					},
					pairedItem: { item: i },
				});
				continue;
			} else if (operation === 'uploadImage') {
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

				response = await this.helpers.httpRequest(uploadOptions) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new Error(`企业微信 API 错误: ${response.errmsg} (错误码: ${response.errcode})`);
				}
		} else if (operation === 'getHighQualityVoice') {
			const media_ID = this.getNodeParameter('media_ID', i) as string;
			const binaryPropertyName = this.getNodeParameter('binaryProperty', i, 'data') as string;

			const accessToken = await getAccessToken.call(this);

			const downloadOptions = {
				method: 'GET' as const,
				url: 'https://qyapi.weixin.qq.com/cgi-bin/media/get/jssdk',
				qs: {
					access_token: accessToken,
					media_id: media_ID,
				},
				returnFullResponse: true,
			};

			const voiceResponse = await this.helpers.httpRequest(downloadOptions);

			const contentType = (voiceResponse.headers?.['content-type'] || voiceResponse.headers?.['Content-Type'] || '') as string;
			if (contentType.includes('application/json') || contentType.includes('text/plain')) {
				let errorBody = voiceResponse.body;
				if (Buffer.isBuffer(errorBody)) {
					errorBody = errorBody.toString('utf-8');
				} else if (errorBody instanceof ArrayBuffer) {
					errorBody = Buffer.from(errorBody).toString('utf-8');
				}
				
				try {
					const errorData = typeof errorBody === 'string' ? JSON.parse(errorBody) : errorBody;
					if (errorData.errcode && errorData.errcode !== 0) {
						throw new Error(`企业微信 API 错误: ${errorData.errmsg} (错误码: ${errorData.errcode})`);
					}
				} catch {
					throw new Error(`获取高清语音失败: ${String(errorBody)}`);
				}
			}

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
				throw new Error('无法获取高清语音内容：响应中没有数据');
			}

			if (voiceResponse.headers) {
				const contentDisposition = voiceResponse.headers['content-disposition'] || voiceResponse.headers['Content-Disposition'];
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
				json: { media_ID },
				binary: {
					[binaryPropertyName]: binaryData,
				},
				pairedItem: { item: i },
			});
			continue;
		} else if (operation === 'uploadTempAsync') {
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

			response = await this.helpers.httpRequest(uploadOptions) as IDataObject;

			if (response.errcode !== undefined && response.errcode !== 0) {
				throw new Error(`企业微信 API 错误: ${response.errmsg} (错误码: ${response.errcode})`);
			}
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
