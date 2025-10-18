import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

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

				// 使用n8n内置的FormData构建方式
				const formData = {
					media: {
						value: dataBuffer,
						options: {
							filename: binaryData.fileName || 'file',
							contentType: binaryData.mimeType,
						},
					},
				};

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/media/upload',
					{},
					{ type },
					{},
					{ formData },
				);
			} else if (operation === 'getTemp') {
				const media_id = this.getNodeParameter('media_id', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				const responseData = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/media/get',
					{},
					{ media_id },
					{},
					{ encoding: null, resolveWithFullResponse: true },
				);

				// 处理响应数据
				let buffer: Buffer;
				let filename = 'file';

				if (Buffer.isBuffer(responseData.body)) {
					buffer = responseData.body;
				} else {
					buffer = Buffer.from(responseData.body as string);
				}

				// 尝试从响应头获取文件名
				if (responseData.headers && responseData.headers['content-disposition']) {
					const match = (responseData.headers['content-disposition'] as string).match(/filename="?(.+?)"?$/);
					if (match) {
						filename = match[1];
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
			} else if (operation === 'uploadPermanent') {
				const type = this.getNodeParameter('type', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				// 使用n8n内置的FormData构建方式
				const formData = {
					media: {
						value: dataBuffer,
						options: {
							filename: binaryData.fileName || 'file',
							contentType: binaryData.mimeType,
						},
					},
				};

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/material/add_material',
					{},
					{ type },
					{},
					{ formData },
				);
			} else if (operation === 'getPermanent') {
				const media_id = this.getNodeParameter('media_id', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				const responseData = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/material/get',
					{},
					{ media_id },
					{},
					{ encoding: null, resolveWithFullResponse: true },
				);

				// 处理响应数据
				let buffer: Buffer;
				let filename = 'file';

				if (Buffer.isBuffer(responseData.body)) {
					buffer = responseData.body;
				} else {
					buffer = Buffer.from(responseData.body as string);
				}

				// 尝试从响应头获取文件名
				if (responseData.headers && responseData.headers['content-disposition']) {
					const match = (responseData.headers['content-disposition'] as string).match(/filename="?(.+?)"?$/);
					if (match) {
						filename = match[1];
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

