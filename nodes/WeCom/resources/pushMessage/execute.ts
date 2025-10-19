import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export async function executePushMessage(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const credentials = await this.getCredentials('weComWebhookApi');
			const webhookUrl = credentials.webhookUrl as string;

			let body: IDataObject = {};

			if (operation === 'sendText') {
				// 发送文本消息
				const content = this.getNodeParameter('content', i) as string;

				body = {
					msgtype: 'text',
					text: {
						content,
					},
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

				if (imageSource === 'base64') {
					const base64 = this.getNodeParameter('base64', i) as string;
					body = {
						msgtype: 'image',
						image: {
							base64,
						},
					};
				} else {
					const md5 = this.getNodeParameter('md5', i) as string;
					body = {
						msgtype: 'image',
						image: {
							md5,
						},
					};
				}

			} else if (operation === 'sendNews') {
				// 发送图文消息
				const articlesData = this.getNodeParameter('articles', i) as IDataObject;
				const articles = (articlesData.article as IDataObject[]) || [];

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
						media_ID: mediaId,
					},
				};

			} else if (operation === 'sendVoice') {
				// 发送语音消息
				const mediaId = this.getNodeParameter('mediaId', i) as string;

				body = {
					msgtype: 'voice',
					voice: {
						media_ID: mediaId,
					},
				};

			} else if (operation === 'sendTemplateCard') {
				// 发送模板卡片消息
				const cardType = this.getNodeParameter('cardType', i) as string;
				
				// 构建模板卡片数据
				const templateCard: IDataObject = {
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

				body = {
					msgtype: 'template_card',
					template_card: templateCard,
				};

			} else {
				throw new NodeOperationError(
					this.getNode(),
					`不支持的操作: ${operation}`,
					{ itemIndex: i },
				);
			}

			// 发送消息到 webhook
			const response = await this.helpers.httpRequest({
				method: 'POST',
				url: webhookUrl,
				body,
				json: true,
			});

			returnData.push({
				json: response as IDataObject,
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
