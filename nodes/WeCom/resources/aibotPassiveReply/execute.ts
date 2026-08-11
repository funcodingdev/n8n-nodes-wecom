import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { buildTemplateCardFromForm } from './templateCardForm';

/** 智能机器人主动回复官方路径（response_url 中包含此 path） */
const AIBOT_RESPONSE_PATH = '/cgi-bin/aibot/response';

function resolveTemplateCard(
	this: IExecuteFunctions,
	itemIndex: number,
): IDataObject {
	const mode = this.getNodeParameter('template_card_input_mode', itemIndex, 'json') as string;
	if (mode === 'form') {
		const title = this.getNodeParameter('tc_main_title', itemIndex, '') as string;
		if (!title) {
			throw new NodeOperationError(this.getNode(), '主标题不能为空', { itemIndex });
		}
		return buildTemplateCardFromForm({
			tc_main_title: title,
			tc_main_desc: this.getNodeParameter('tc_main_desc', itemIndex, '') as string,
			tc_sub_title_text: this.getNodeParameter('tc_sub_title_text', itemIndex, '') as string,
			tc_emphasis_title: this.getNodeParameter('tc_emphasis_title', itemIndex, '') as string,
			tc_emphasis_desc: this.getNodeParameter('tc_emphasis_desc', itemIndex, '') as string,
			tc_card_action_type: this.getNodeParameter('tc_card_action_type', itemIndex, 1) as number,
			tc_card_action_url: this.getNodeParameter('tc_card_action_url', itemIndex, '') as string,
			tc_card_action_appid: this.getNodeParameter('tc_card_action_appid', itemIndex, '') as string,
			tc_card_action_pagepath: this.getNodeParameter(
				'tc_card_action_pagepath',
				itemIndex,
				'',
			) as string,
			tc_source_desc: this.getNodeParameter('tc_source_desc', itemIndex, '') as string,
			tc_source_icon: this.getNodeParameter('tc_source_icon', itemIndex, '') as string,
			horizontalCollection: this.getNodeParameter(
				'tcHorizontalContentCollection',
				itemIndex,
				{},
			) as IDataObject,
			extraJson: this.getNodeParameter('template_card_extra_json', itemIndex, '{}') as string,
		});
	}

	const templateCardStr = this.getNodeParameter('template_card', itemIndex) as string;
	if (!templateCardStr) {
		throw new NodeOperationError(this.getNode(), '模板卡片不能为空', { itemIndex });
	}
	try {
		return JSON.parse(templateCardStr) as IDataObject;
	} catch (error) {
		throw new NodeOperationError(
			this.getNode(),
			`模板卡片必须是有效的JSON格式: ${(error as Error).message}`,
			{ itemIndex },
		);
	}
}

export async function executeAIBotPassiveReply(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	// 智能机器人回复节点
	// 注意：被动回复操作必须在工作流的最后一个节点，主动回复操作可以在任意位置
	if (items.length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			'没有接收到消息数据。请确保：1) 工作流结构为：企业微信智能机器人消息接收触发器 → [中间处理节点（可选）] → 本节点；2) 被动回复操作时本节点必须是最后一个节点；3) 中间节点没有过滤掉所有数据',
		);
	}

	const i = 0;
	try {
		const item = items[i];

		// 获取response_url
		const responseUrl = (item.json._responseUrl as string) || (item.json.response_url as string);

		if (!responseUrl) {
			throw new NodeOperationError(
				this.getNode(),
				'缺少response_url。请确保：1) 输入数据来自「企业微信智能机器人消息接收触发器」；2) 中间节点没有删除response_url字段',
				{ itemIndex: i },
			);
		}
		// 官方主动回复: POST /cgi-bin/aibot/response?response_code=...
		if (!String(responseUrl).includes(AIBOT_RESPONSE_PATH)) {
			throw new NodeOperationError(
				this.getNode(),
				`response_url 应包含 ${AIBOT_RESPONSE_PATH}，当前: ${responseUrl}`,
				{ itemIndex: i },
			);
		}

		let replyBody: IDataObject = {};

		if (operation === 'replyWelcome') {
			const replyType = this.getNodeParameter('replyType', i) as string;

			if (replyType === 'text') {
				const content = this.getNodeParameter('content', i) as string;
				if (!content) {
					throw new NodeOperationError(
						this.getNode(),
						'文本内容不能为空',
						{ itemIndex: i },
					);
				}
				replyBody = {
					msgtype: 'text',
					text: {
						content,
					},
				};
			} else if (replyType === 'template_card') {
				const templateCard = resolveTemplateCard.call(this, i);
				replyBody = {
					msgtype: 'template_card',
					template_card: templateCard,
				};
			}
		} else if (operation === 'replyMessage') {
			const replyType = this.getNodeParameter('replyType', i) as string;

			if (replyType === 'stream') {
				const streamId = this.getNodeParameter('stream_id', i, '') as string;
				const finish = this.getNodeParameter('finish', i, false) as boolean;
				const content = this.getNodeParameter('content', i, '') as string;
				const feedbackId = this.getNodeParameter('feedback_id', i, '') as string;
				const msgItemData = this.getNodeParameter('msg_item', i, {}) as IDataObject;

				const streamData: IDataObject = {
					finish,
				};

				if (streamId) {
					streamData.id = streamId;
				}

				if (content) {
					streamData.content = content;
				}

				if (msgItemData.image && Array.isArray(msgItemData.image)) {
					streamData.msg_item = (msgItemData.image as IDataObject[]).map((img) => ({
						msgtype: 'image',
						image: {
							base64: img.base64 as string,
							md5: img.md5 as string,
						},
					}));
				}

				if (feedbackId) {
					streamData.feedback = {
						id: feedbackId,
					};
				}

				replyBody = {
					msgtype: 'stream',
					stream: streamData,
				};
			} else if (replyType === 'template_card') {
				const templateCard = resolveTemplateCard.call(this, i);
				const feedbackId = this.getNodeParameter('feedback_id', i, '') as string;

				if (feedbackId) {
					templateCard.feedback = {
						id: feedbackId,
					};
				}

				replyBody = {
					msgtype: 'template_card',
					template_card: templateCard,
				};
			} else if (replyType === 'stream_with_template_card') {
				const streamId = this.getNodeParameter('stream_id', i) as string;
				const finish = this.getNodeParameter('finish', i, false) as boolean;
				const content = this.getNodeParameter('content', i, '') as string;
				const streamFeedbackId = this.getNodeParameter('stream_feedback_id', i, '') as string;
				const templateCardStr = this.getNodeParameter('template_card', i, '') as string;
				const templateCardFeedbackId = this.getNodeParameter('template_card_feedback_id', i, '') as string;
				const msgItemData = this.getNodeParameter('msg_item', i, {}) as IDataObject;

				if (!streamId) {
					throw new NodeOperationError(
						this.getNode(),
						'流式消息ID不能为空（首次回复时必须设置）',
						{ itemIndex: i },
					);
				}

				const streamData: IDataObject = {
					id: streamId,
					finish,
				};

				if (content) {
					streamData.content = content;
				}

				if (msgItemData.image && Array.isArray(msgItemData.image)) {
					streamData.msg_item = (msgItemData.image as IDataObject[]).map((img) => ({
						msgtype: 'image',
						image: {
							base64: img.base64 as string,
							md5: img.md5 as string,
						},
					}));
				}

				if (streamFeedbackId) {
					streamData.feedback = {
						id: streamFeedbackId,
					};
				}

				const replyData: IDataObject = {
					msgtype: 'stream_with_template_card',
					stream: streamData,
				};

				if (templateCardStr) {
					try {
						const templateCard = JSON.parse(templateCardStr);
						if (templateCardFeedbackId) {
							templateCard.feedback = {
								id: templateCardFeedbackId,
							};
						}
						replyData.template_card = templateCard;
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`模板卡片必须是有效的JSON格式: ${(error as Error).message}`,
							{ itemIndex: i },
						);
					}
				}

				replyBody = replyData;
			}
		} else if (operation === 'activeReply') {
			const replyType = this.getNodeParameter('replyType', i) as string;

			if (replyType === 'markdown') {
				const content = this.getNodeParameter('content', i) as string;
				const feedbackId = this.getNodeParameter('feedback_id', i, '') as string;

				if (!content) {
					throw new NodeOperationError(
						this.getNode(),
						'Markdown内容不能为空',
						{ itemIndex: i },
					);
				}

				const markdownData: IDataObject = {
					content,
				};

				if (feedbackId) {
					markdownData.feedback = {
						id: feedbackId,
					};
				}

				replyBody = {
					msgtype: 'markdown',
					markdown: markdownData,
				};
			} else if (replyType === 'template_card') {
				const templateCard = resolveTemplateCard.call(this, i);
				const feedbackId = this.getNodeParameter('feedback_id', i, '') as string;

				if (feedbackId) {
					templateCard.feedback = {
						id: feedbackId,
					};
				}

				replyBody = {
					msgtype: 'template_card',
					template_card: templateCard,
				};
			}
		} else if (operation === 'updateTemplateCard') {
			const useridsStr = this.getNodeParameter('userids', i, '') as string;
			const templateCardStr = this.getNodeParameter('template_card', i) as string;
			const feedbackId = this.getNodeParameter('feedback_id', i, '') as string;

			if (!templateCardStr) {
				throw new NodeOperationError(
					this.getNode(),
					'模板卡片不能为空',
					{ itemIndex: i },
				);
			}

			let templateCard: IDataObject;
			try {
				templateCard = JSON.parse(templateCardStr);
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`模板卡片必须是有效的JSON格式: ${(error as Error).message}`,
					{ itemIndex: i },
				);
			}

			if (feedbackId) {
				templateCard.feedback = {
					id: feedbackId,
				};
			}

			replyBody = {
				response_type: 'update_template_card',
				template_card: templateCard,
			};

			if (useridsStr) {
				replyBody.userids = useridsStr.split(',').map((id) => id.trim());
			}
		} else {
			throw new NodeOperationError(
				this.getNode(),
				`不支持的操作类型: ${operation}`,
				{ itemIndex: i },
			);
		}

		// 发送回复到response_url
		const response = await this.helpers.httpRequest({
			method: 'POST',
			url: responseUrl,
			body: replyBody,
			headers: {
				'Content-Type': 'application/json',
			},
			timeout: 5000, // 5秒超时
		});

		returnData.push({
			json: {
				success: true,
				repliedAt: new Date().toISOString(),
				response: response,
			} as IDataObject,
			pairedItem: { item: i },
		});
	} catch (error) {
		if (this.continueOnFail()) {
			returnData.push({
				json: {
					error: (error as Error).message,
					success: false,
				},
				pairedItem: { item: i },
			});
		} else {
			throw error;
		}
	}

	return returnData;
}
