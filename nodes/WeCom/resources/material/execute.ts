import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest, getAccessToken } from '../../shared/transport';

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

				// 获取 access token
				const accessToken = await getAccessToken.call(this);

				// 直接使用 n8n 的 httpRequest 发送 multipart/form-data
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

				// 获取临时素材
				// 官方文档：https://developer.work.weixin.qq.com/document/path/90254
				const accessToken = await getAccessToken.call(this);

				const downloadOptions = {
					method: 'GET' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/media/get',
					qs: {
						access_token: accessToken,
						media_id: media_ID,
					},
					returnFullResponse: true,
					encoding: 'arraybuffer' as const,
				};

				const response = await this.helpers.httpRequest(downloadOptions);

				// 处理响应数据
				let buffer: Buffer;
				let filename = 'file';

				// response 是完整的响应对象
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
						// 其他类型尝试转换为 Buffer
						buffer = Buffer.from(String(response.body));
					}
				} else {
					throw new Error('无法获取素材内容：响应中没有数据');
				}

				// 尝试从响应头获取文件名
				if (response.headers) {
					const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
					if (typeof contentDisposition === 'string') {
						const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
						if (match && match[1]) {
							filename = match[1].replace(/['"]/g, '');
							// 解码 URL 编码的文件名
							try {
								filename = decodeURIComponent(filename);
							} catch {
								// 如果解码失败，使用原始文件名
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
			} else if (operation === 'uploadPermanent') {
				const type = this.getNodeParameter('type', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				// 获取 access token
				const accessToken = await getAccessToken.call(this);

				// 直接使用 n8n 的 httpRequest 发送 multipart/form-data
				const uploadOptions = {
					method: 'POST' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/material/add_material',
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
			} else if (operation === 'getPermanent') {
				const media_ID = this.getNodeParameter('media_ID', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				// 获取永久素材
				// 参考官方文档：https://developer.work.weixin.qq.com/document/path/90254
				const accessToken = await getAccessToken.call(this);

				const downloadOptions = {
					method: 'GET' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/material/get',
					qs: {
						access_token: accessToken,
						media_id: media_ID,
					},
					returnFullResponse: true,
					encoding: 'arraybuffer' as const,
				};

				const response = await this.helpers.httpRequest(downloadOptions);

				// 处理响应数据
				let buffer: Buffer;
				let filename = 'file';

				// response 是完整的响应对象
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
						// 其他类型尝试转换为 Buffer
						buffer = Buffer.from(String(response.body));
					}
				} else {
					throw new Error('无法获取素材内容：响应中没有数据');
				}

				// 尝试从响应头获取文件名
				if (response.headers) {
					const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
					if (typeof contentDisposition === 'string') {
						const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
						if (match && match[1]) {
							filename = match[1].replace(/['"]/g, '');
							// 解码 URL 编码的文件名
							try {
								filename = decodeURIComponent(filename);
							} catch {
								// 如果解码失败，使用原始文件名
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

				// 获取 access token
				const accessToken = await getAccessToken.call(this);

				// 上传图片接口
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

				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/media/get/jssdk',
					{},
					{ media_ID },
				);
			} else if (operation === 'uploadTempAsync') {
				const type = this.getNodeParameter('type', i) as string;
				const binaryPropertyName = this.getNodeParameter('file', i, 'data') as string;
				const filename = this.getNodeParameter('filename', i, '') as string;
				const attachment_type = this.getNodeParameter('attachment_type', i, 1) as number;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				// 获取 access token
				const accessToken = await getAccessToken.call(this);

				// 异步上传接口
				const uploadOptions = {
					method: 'POST' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/media/upload_by_url',
					qs: {
						access_token: accessToken,
						type,
						attachment_type,
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

