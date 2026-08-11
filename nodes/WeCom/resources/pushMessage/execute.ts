import { createHash } from 'crypto';
import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/** 群机器人发送消息官方路径 */
const WEBHOOK_SEND_PATH = '/cgi-bin/webhook/send';
/** 群机器人上传媒体官方路径 */
const WEBHOOK_UPLOAD_MEDIA_PATH = '/cgi-bin/webhook/upload_media';

export async function executePushMessage(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const parseOptionalJsonParameter = (
		value: unknown,
		parameterName: string,
		itemIndex: number,
	): IDataObject | IDataObject[] | undefined => {
		if (value === undefined || value === null) {
			return undefined;
		}
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed || trimmed === '{}' || trimmed === '[]') {
				return undefined;
			}
			try {
				return JSON.parse(trimmed) as IDataObject | IDataObject[];
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`${parameterName} 必须是有效的 JSON: ${(error as Error).message}`,
					{ itemIndex },
				);
			}
		}
		return value as IDataObject | IDataObject[];
	};

	for (let i = 0; i < items.length; i++) {
		try {
			const credentials = await this.getCredentials('weComWebhookApi');
			const webhookUrl = credentials.webhookUrl as string;

			let body: IDataObject = {};
			let isUploadMedia = false;

			if (operation === 'uploadMedia') {
				// 上传媒体文件操作使用 webhook 凭证中的 key
				isUploadMedia = true;
				let webhookKey: string | null = null;
				try {
					const webhookUrlObject = new URL(webhookUrl);
					webhookKey = webhookUrlObject.searchParams.get('key');
				} catch {
					throw new NodeOperationError(
						this.getNode(),
						'Webhook URL 无效，无法解析 key 参数',
						{ itemIndex: i },
					);
				}

				if (!webhookKey) {
					throw new NodeOperationError(
						this.getNode(),
						'Webhook URL 缺少 key 参数',
						{ itemIndex: i },
					);
				}

				const mediaType = this.getNodeParameter('mediaType', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
				const fileName = (binaryData.fileName || 'file');
				const contentType = binaryData.mimeType || 'application/octet-stream';
				const fileLength = dataBuffer.length;

				// 手动构建 multipart/form-data 请求体
				const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
				const CRLF = '\r\n';

				// 构建 multipart body
				const header = `--${boundary}${CRLF}Content-Disposition: form-data; name="media";filename="${fileName}"; filelength=${fileLength}${CRLF}Content-Type: ${contentType}${CRLF}${CRLF}`;
				const footer = `${CRLF}--${boundary}--${CRLF}`;

				const headerBuffer = Buffer.from(header, 'utf-8');
				const footerBuffer = Buffer.from(footer, 'utf-8');
				const bodyBuffer = Buffer.concat([headerBuffer, dataBuffer, footerBuffer]);

				const baseUrl = await getWeComBaseUrl.call(this, 'weComWebhookApi');
				const uploadUrl = `${baseUrl}${WEBHOOK_UPLOAD_MEDIA_PATH}?key=${webhookKey}&type=${mediaType}`;

				const response = (await this.helpers.httpRequest({
					method: 'POST',
					url: uploadUrl,
					body: bodyBuffer,
					headers: {
						'Content-Type': `multipart/form-data; boundary=${boundary}`,
						'Content-Length': bodyBuffer.length.toString(),
					},
				})) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`上传媒体文件失败: ${response.errmsg} (错误码: ${response.errcode})`,
						{ itemIndex: i },
					);
				}

				returnData.push({
					json: response,
					pairedItem: { item: i },
				});

			} else if (operation === 'sendText') {
				// 发送文本消息
				const content = this.getNodeParameter('content', i) as string;
				const mentionedList = this.getNodeParameter('mentionedList', i, '') as string;
				const mentionedMobileList = this.getNodeParameter('mentionedMobileList', i, '') as string;

				const textBody: IDataObject = {
					content,
				};

				// 处理 mentioned_list
				if (mentionedList.trim()) {
					const mentioned = mentionedList.split(',').map(item => item.trim()).filter(item => item);
					if (mentioned.length > 0) {
						textBody.mentioned_list = mentioned;
					}
				}

				// 处理 mentioned_mobile_list
				if (mentionedMobileList.trim()) {
					const mentionedMobile = mentionedMobileList.split(',').map(item => item.trim()).filter(item => item);
					if (mentionedMobile.length > 0) {
						textBody.mentioned_mobile_list = mentionedMobile;
					}
				}

				body = {
					msgtype: 'text',
					text: textBody,
				};

			} else if (operation === 'sendMarkdown') {
				// 发送 Markdown 消息
				const content = this.getNodeParameter('content', i) as string;

				body = {
					msgtype: 'markdown',
					markdown: {
						content,
					},
				};

			} else if (operation === 'sendImage') {
				// 发送图片消息
				const imageSource = this.getNodeParameter('imageSource', i) as string;
				let base64: string;
				let md5: string;

				if (imageSource === 'binary') {
					const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;
					this.helpers.assertBinaryData(i, binaryPropertyName);
					const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					base64 = dataBuffer.toString('base64');
					md5 = createHash('md5').update(dataBuffer).digest('hex');
				} else {
					base64 = this.getNodeParameter('base64', i) as string;
					md5 = this.getNodeParameter('md5', i) as string;
				}

				body = {
					msgtype: 'image',
					image: {
						base64,
						md5,
					},
				};

			} else if (operation === 'sendNews') {
				// 发送图文消息
				const newsInputMode = this.getNodeParameter('news_input_mode', i, 'form') as string;
				const newsJson = newsInputMode === 'json'
					? parseOptionalJsonParameter(
						this.getNodeParameter('news_json', i, '[]') as string,
						'news_json',
						i,
					)
					: undefined;
				const articlesData = this.getNodeParameter('articles', i) as IDataObject;
				let articles: IDataObject[] = [];

				if (newsInputMode === 'json') {
					if (!newsJson) {
						throw new NodeOperationError(
							this.getNode(),
							'请选择 JSON 输入并提供 news_json',
							{ itemIndex: i },
						);
					}
					if (Array.isArray(newsJson)) {
						articles = newsJson as IDataObject[];
					} else if ((newsJson as IDataObject).news) {
						const newsPayload = (newsJson as IDataObject).news as IDataObject;
						if (!Array.isArray(newsPayload.articles)) {
							throw new NodeOperationError(
								this.getNode(),
								'news_json.news 必须包含 articles 数组',
								{ itemIndex: i },
							);
						}
						articles = newsPayload.articles as IDataObject[];
					} else if (Array.isArray((newsJson as IDataObject).articles)) {
						articles = (newsJson as IDataObject).articles as IDataObject[];
					} else {
						throw new NodeOperationError(
							this.getNode(),
							'news_json 必须是图文数组或包含 articles 的对象',
							{ itemIndex: i },
						);
					}
				} else {
					articles = (articlesData.article as IDataObject[]) || [];
				}

				body = {
					msgtype: 'news',
					news: {
						articles: articles.map((article) => ({
							title: article.title,
							description: article.description,
							url: article.url,
							picurl: article.picurl,
						})),
					},
				};

			} else if (operation === 'sendMarkdownV2') {
				// 发送 Markdown V2 消息
				const content = this.getNodeParameter('content', i) as string;

				body = {
					msgtype: 'markdown_v2',
					markdown_v2: {
						content,
					},
				};

			} else if (operation === 'sendFile') {
				// 发送文件消息
				const mediaId = this.getNodeParameter('mediaId', i) as string;

				body = {
					msgtype: 'file',
					file: {
						media_id: mediaId,
					},
				};

			} else if (operation === 'sendVoice') {
				// 发送语音消息
				const mediaId = this.getNodeParameter('mediaId', i) as string;

				body = {
					msgtype: 'voice',
					voice: {
						media_id: mediaId,
					},
				};

			} else if (operation === 'sendTemplateCard') {
				// 发送模板卡片消息
				const templateCardInputMode = this.getNodeParameter(
					'template_card_input_mode',
					i,
					'form',
				) as string;
				const templateCardJson = templateCardInputMode === 'json'
					? parseOptionalJsonParameter(
						this.getNodeParameter('template_card_json', i, '{}') as string,
						'template_card_json',
						i,
					)
					: undefined;
				const cardType = this.getNodeParameter('cardType', i) as string;

				let templateCard: IDataObject;

				if (templateCardInputMode === 'json') {
					if (!templateCardJson) {
						throw new NodeOperationError(
							this.getNode(),
							'请选择 JSON 输入并提供 template_card_json',
							{ itemIndex: i },
						);
					}
					if (Array.isArray(templateCardJson)) {
						throw new NodeOperationError(
							this.getNode(),
							'template_card_json 必须是对象',
							{ itemIndex: i },
						);
					}
					const templateCardPayload = (templateCardJson as IDataObject).template_card as IDataObject | undefined;
					templateCard = templateCardPayload ?? (templateCardJson as IDataObject);
					if (!templateCard.card_type) {
						throw new NodeOperationError(
							this.getNode(),
							'template_card_json 必须包含 card_type',
							{ itemIndex: i },
						);
					}
				} else {
					// 构建模板卡片数据
					templateCard = {
						card_type: cardType,
					};

					// 卡片来源
					const sourceData = this.getNodeParameter('source', i, {}) as IDataObject;
					if (sourceData.sourceValue) {
						templateCard.source = sourceData.sourceValue;
					}

					// 主要内容
					const mainTitleData = this.getNodeParameter('mainTitle', i) as IDataObject;
					if (mainTitleData.mainTitleValue) {
						templateCard.main_title = mainTitleData.mainTitleValue;
					}

					// 关键数据样式（仅文本通知）
					if (cardType === 'text_notice') {
						const emphasisData = this.getNodeParameter('emphasisContent', i, {}) as IDataObject;
						if (emphasisData.emphasisValue) {
							templateCard.emphasis_content = emphasisData.emphasisValue;
						}
					}

					// 图文展示样式（仅图文展示）
					if (cardType === 'news_notice') {
						const imageTextData = this.getNodeParameter('imageTextArea', i, {}) as IDataObject;
						if (imageTextData.imageTextValue) {
							templateCard.image_text_area = imageTextData.imageTextValue;
						}
					}

					// 二级普通文本
					const subTitleText = this.getNodeParameter('subTitleText', i, '') as string;
					if (subTitleText) {
						templateCard.sub_title_text = subTitleText;
					}

					// 二级标题+文本列表
					const horizontalData = this.getNodeParameter('horizontalContentList', i, {}) as IDataObject;
					if (horizontalData.item && Array.isArray(horizontalData.item)) {
						templateCard.horizontal_content_list = horizontalData.item;
					}

					// 跳转链接
					const jumpListData = this.getNodeParameter('jumpList', i, {}) as IDataObject;
					if (jumpListData.jump && Array.isArray(jumpListData.jump)) {
						templateCard.jump_list = jumpListData.jump;
					}

					// 整体卡片点击跳转
					const cardActionData = this.getNodeParameter('cardAction', i, {}) as IDataObject;
					if (cardActionData.actionValue) {
						templateCard.card_action = cardActionData.actionValue;
					}
				}

				body = {
					msgtype: 'template_card',
					template_card: templateCard,
				};

			} else if (!isUploadMedia) {
				throw new NodeOperationError(
					this.getNode(),
					`不支持的操作: ${operation}`,
					{ itemIndex: i },
				);
			}

			if (!isUploadMedia) {
				// 官方路径: /cgi-bin/webhook/send?key=KEY
				let sendUrl = webhookUrl;
				if (!sendUrl.includes(WEBHOOK_SEND_PATH)) {
					// 若凭证只配了 key，拼官方 send 地址
					try {
						const u = new URL(webhookUrl);
						const key = u.searchParams.get('key');
						if (key) {
							sendUrl = `${u.origin}${WEBHOOK_SEND_PATH}?key=${key}`;
						}
					} catch {
						// keep original
					}
				}
				const response = await this.helpers.httpRequest({
					method: 'POST',
					url: sendUrl,
					body,
					json: true,
				});

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			}

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
