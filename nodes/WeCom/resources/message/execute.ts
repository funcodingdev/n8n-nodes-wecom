import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest, uploadMedia } from '../../shared/transport';

export async function executeMessage(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const credentials = await this.getCredentials('weComApi');
			const agentId = credentials.agentId as string;

			const touser = this.getNodeParameter('touser', i, '') as string;
			const toparty = this.getNodeParameter('toparty', i, '') as string;
			const totag = this.getNodeParameter('totag', i, '') as string;

			if (!touser && !toparty && !totag) {
				throw new NodeOperationError(
					this.getNode(),
					'必须指定至少一个接收人（成员ID、部门ID或标签ID）',
					{ itemIndex: i },
				);
			}

			let body: IDataObject = {
				touser,
				toparty,
				totag,
				agentid: agentId,
			};

			if (operation === 'sendText') {
				const content = this.getNodeParameter('content', i) as string;
				const safe = this.getNodeParameter('safe', i, false) as boolean;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				body = {
					...body,
					msgtype: 'text',
					text: {
						content,
					},
					safe: safe ? 1 : 0,
					enable_id_trans: enable_id_trans ? 1 : 0,
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
			} else if (operation === 'sendMarkdown') {
				const content = this.getNodeParameter('content', i) as string;

				body = {
					...body,
					msgtype: 'markdown',
					markdown: {
						content,
					},
				};
			} else if (operation === 'sendImage') {
				const imageSource = this.getNodeParameter('imageSource', i) as string;
				let mediaId: string;

				if (imageSource === 'mediaId') {
					mediaId = this.getNodeParameter('media_id', i) as string;
				} else {
					// 上传图片
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

					mediaId = await uploadMedia.call(
						this,
						'image',
						buffer,
						binaryData.fileName || 'image.jpg',
					);
				}

				body = {
					...body,
					msgtype: 'image',
					image: {
						media_id: mediaId,
					},
				};
			} else if (operation === 'sendFile') {
				const fileSource = this.getNodeParameter('fileSource', i) as string;
				let mediaId: string;

				if (fileSource === 'mediaId') {
					mediaId = this.getNodeParameter('media_id', i) as string;
				} else {
					// 上传文件
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

					mediaId = await uploadMedia.call(
						this,
						'file',
						buffer,
						binaryData.fileName || 'file.bin',
					);
				}

				body = {
					...body,
					msgtype: 'file',
					file: {
						media_id: mediaId,
					},
				};
			}

			const response = await weComApiRequest.call(this, 'POST', '/cgi-bin/message/send', body);

			returnData.push({
				json: response as IDataObject,
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

