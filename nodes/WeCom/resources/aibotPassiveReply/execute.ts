import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { buildTemplateCardFromForm } from './templateCardForm';
import { validateTemplateCard } from '../message/execute';
import { WeComCrypto } from '../../shared/crypto';
import { createHash } from 'crypto';

/** 智能机器人主动回复官方路径（response_url 中包含此 path） */
const AIBOT_RESPONSE_PATH = '/cgi-bin/aibot/response';

function resolveTemplateCard(
	this: IExecuteFunctions,
	itemIndex: number,
	isUpdate = false,
): IDataObject {
	const mode = this.getNodeParameter('template_card_input_mode', itemIndex, 'form') as string;
	let templateCard: IDataObject;
	if (mode === 'form') {
		templateCard = buildTemplateCardFromForm(this, itemIndex);
	} else {
		const templateCardValue = this.getNodeParameter('template_card_json', itemIndex, '{}');
		try {
			const parsed = typeof templateCardValue === 'string'
				? JSON.parse(templateCardValue) as unknown
				: templateCardValue;
			if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
				throw new Error('必须是对象');
			}
			const parsedObject = parsed as IDataObject;
			const nested = parsedObject.template_card;
			if (nested !== undefined && (!nested || typeof nested !== 'object' || Array.isArray(nested))) {
				throw new Error('template_card 必须是对象');
			}
			templateCard = (nested as IDataObject | undefined) ?? parsedObject;
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`模板卡片必须是有效的 JSON 对象：${(error as Error).message}`,
				{ itemIndex },
			);
		}
	}
	validateTemplateCard(this, templateCard, itemIndex, isUpdate);
	return templateCard;
}

export async function executeAIBotPassiveReply(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	if (items.length !== 1) {
		throw new NodeOperationError(
			this.getNode(),
			items.length === 0
				? '没有收到可回复的消息。请连接“企业微信智能机器人消息接收”触发器，并确保中间节点没有过滤数据。'
				: `智能机器人一次只能回复 1 条回调，当前收到 ${items.length} 条数据。`,
		);
	}

	const itemIndex = 0;
	const fail = (message: string): never => {
		throw new NodeOperationError(this.getNode(), message, { itemIndex });
	};
	const requiredText = (value: unknown, label: string): string => {
		const text = String(value ?? '').trim();
		if (!text) fail(`${label}不能为空`);
		return text;
	};
	const validateByteLength = (
		value: unknown,
		label: string,
		maximum: number,
		required = false,
	): string | undefined => {
		const text = String(value ?? '').trim();
		if (!text) {
			if (required) fail(`${label}不能为空`);
			return undefined;
		}
		if (Buffer.byteLength(text, 'utf8') > maximum) fail(`${label}不能超过 ${maximum} 个字节`);
		return text;
	};
	const feedback = (value: unknown, label: string): IDataObject | undefined => {
		const id = validateByteLength(value, label, 256);
		return id ? { id } : undefined;
	};
	const streamImages = (value: unknown, finish: boolean): IDataObject[] => {
		const container = value && typeof value === 'object' && !Array.isArray(value)
			? value as IDataObject
			: {};
		const images = Array.isArray(container.image) ? container.image as IDataObject[] : [];
		if (images.length > 10) fail('流式消息最多支持 10 张图片');
		if (images.length && !finish) fail('流式消息图片只能在 finish=true 的最后一次回复中发送');
		return images.map((image, index) => {
			const base64 = requiredText(image.base64, `第 ${index + 1} 张图片 Base64`).replace(/\s+/g, '');
			if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)) {
				fail(`第 ${index + 1} 张图片 Base64 格式无效`);
			}
			const imageBuffer = Buffer.from(base64, 'base64');
			if (imageBuffer.length > 10 * 1024 * 1024) fail(`第 ${index + 1} 张图片不能超过 10M`);
			const isPng = imageBuffer.subarray(0, 8).equals(
				Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
			);
			const isJpeg = imageBuffer.length >= 3 &&
				imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8 && imageBuffer[2] === 0xff;
			if (!isPng && !isJpeg) fail(`第 ${index + 1} 张图片仅支持 JPG 或 PNG 格式`);
			const md5 = requiredText(image.md5, `第 ${index + 1} 张图片 MD5`).toLowerCase();
			if (!/^[a-f0-9]{32}$/.test(md5)) fail(`第 ${index + 1} 张图片 MD5 必须是 32 位十六进制字符串`);
			if (createHash('md5').update(imageBuffer).digest('hex') !== md5) {
				fail(`第 ${index + 1} 张图片 MD5 与图片内容不匹配`);
			}
			return {
				msgtype: 'image',
				image: { base64, md5 },
			};
		});
	};
	const passiveOperations = new Set(['replyWelcome', 'replyMessage', 'updateTemplateCard']);

	try {
		const item = items[itemIndex];
		const isPassive = passiveOperations.has(operation);
		const configuredMode = String(item.json._aibotResponseMode ?? '');
		const incomingMessageType = String(item.json.msgtype ?? '');
		const incomingEvent = item.json.event && typeof item.json.event === 'object'
			? item.json.event as IDataObject
			: {};
		const incomingEventType = String(incomingEvent.eventtype ?? '');
		const incomingTemplateEvent = incomingEvent.template_card_event &&
			typeof incomingEvent.template_card_event === 'object'
			? incomingEvent.template_card_event as IDataObject
			: {};
		const incomingTaskId = String(incomingTemplateEvent.task_id ?? '').trim();
		const incomingStream = item.json.stream && typeof item.json.stream === 'object'
			? item.json.stream as IDataObject
			: {};
		const incomingStreamId = String(incomingStream.id ?? '').trim();
		if (isPassive && configuredMode !== 'lastNode') {
			fail('当前操作是被动回复。请将智能机器人触发器的“响应方式”设为“等待工作流（被动回复）”。');
		}
		if (!isPassive && operation === 'activeReply' && configuredMode === 'lastNode') {
			fail('当前操作是主动回复。请将智能机器人触发器的“响应方式”设为“立即响应（主动回复）”。');
		}

		let replyBody: IDataObject = {};

		if (operation === 'replyWelcome') {
			if (incomingMessageType !== 'event' || incomingEventType !== 'enter_chat') {
				fail('回复欢迎语仅适用于 enter_chat（进入会话）回调');
			}
			const replyType = this.getNodeParameter('replyType', itemIndex) as string;

			if (replyType === 'text') {
				replyBody = {
					msgtype: 'text',
					text: {
						content: requiredText(this.getNodeParameter('content', itemIndex), '文本内容'),
					},
				};
			} else if (replyType === 'template_card') {
				const templateCard = resolveTemplateCard.call(this, itemIndex);
				replyBody = {
					msgtype: 'template_card',
					template_card: templateCard,
				};
			} else fail(`回复欢迎语不支持类型：${replyType}`);
		} else if (operation === 'replyMessage') {
			const replyType = this.getNodeParameter('replyType', itemIndex) as string;
			if (incomingMessageType === 'event' && incomingEventType !== 'enter_chat') {
				fail('回复用户消息不适用于当前事件回调；模板卡片事件请使用“更新模板卡片”');
			}
			if (incomingMessageType === 'stream' && replyType !== 'stream') {
				fail('流式消息刷新回调仅支持回复“流式消息”');
			}

			if (replyType === 'stream') {
				const configuredStreamId = (this.getNodeParameter(
					'stream_id',
					itemIndex,
					'',
				) as string).trim();
				if (configuredStreamId && incomingStreamId && configuredStreamId !== incomingStreamId) {
					fail('流式消息 ID 必须与刷新回调中的 stream.id 一致');
				}
				const streamId = configuredStreamId || incomingStreamId;
				if (!streamId) fail('首次回复流式消息时必须填写流式消息 ID');
				const finish = this.getNodeParameter('finish', itemIndex, false) as boolean;
				const content = validateByteLength(
					this.getNodeParameter('content', itemIndex, ''),
					'流式消息内容',
					20480,
				);
				const msgItems = streamImages(
					this.getNodeParameter('msg_item', itemIndex, {}),
					finish,
				);

				const streamData: IDataObject = {
					finish,
				};
				if (streamId) streamData.id = streamId;
				if (content) streamData.content = content;
				if (msgItems.length) streamData.msg_item = msgItems;
				const feedbackData = feedback(
					this.getNodeParameter('feedback_id', itemIndex, ''),
					'反馈 ID',
				);
				if (feedbackData && incomingMessageType === 'stream') {
					fail('反馈 ID 只能在流式消息首次回复时设置');
				}
				if (feedbackData) streamData.feedback = feedbackData;

				replyBody = {
					msgtype: 'stream',
					stream: streamData,
				};
			} else if (replyType === 'template_card') {
				const templateCard = resolveTemplateCard.call(this, itemIndex);
				const feedbackData = feedback(
					this.getNodeParameter('feedback_id', itemIndex, ''),
					'反馈 ID',
				);
				if (feedbackData) templateCard.feedback = feedbackData;

				replyBody = {
					msgtype: 'template_card',
					template_card: templateCard,
				};
			} else if (replyType === 'stream_with_template_card') {
				const configuredStreamId = (this.getNodeParameter(
					'stream_id',
					itemIndex,
					'',
				) as string).trim();
				if (configuredStreamId && incomingStreamId && configuredStreamId !== incomingStreamId) {
					fail('流式消息 ID 必须与刷新回调中的 stream.id 一致');
				}
				const streamId = configuredStreamId || incomingStreamId;
				if (!streamId) fail('首次回复流式消息时必须填写流式消息 ID');
				const finish = this.getNodeParameter('finish', itemIndex, false) as boolean;
				const content = validateByteLength(
					this.getNodeParameter('content', itemIndex, ''),
					'流式消息内容',
					20480,
				);
				const attachTemplateCard = this.getNodeParameter(
					'attach_template_card',
					itemIndex,
					true,
				) as boolean;

				const streamData: IDataObject = {
					id: streamId,
					finish,
				};
				if (content) streamData.content = content;
				const msgItems = streamImages(
					this.getNodeParameter('msg_item', itemIndex, {}),
					finish,
				);
				if (msgItems.length) streamData.msg_item = msgItems;
				const streamFeedback = feedback(
					this.getNodeParameter('stream_feedback_id', itemIndex, ''),
					'流式消息反馈 ID',
				);
				if (streamFeedback && incomingMessageType === 'stream') {
					fail('流式消息反馈 ID 只能在首次回复时设置');
				}
				if (streamFeedback) streamData.feedback = streamFeedback;

				const replyData: IDataObject = {
					msgtype: 'stream_with_template_card',
					stream: streamData,
				};

				if (attachTemplateCard) {
					const templateCard = resolveTemplateCard.call(this, itemIndex);
					const templateFeedback = feedback(
						this.getNodeParameter('template_card_feedback_id', itemIndex, ''),
						'模板卡片反馈 ID',
					);
					if (templateFeedback) templateCard.feedback = templateFeedback;
					replyData.template_card = templateCard;
				}

				replyBody = replyData;
			} else fail(`回复用户消息不支持类型：${replyType}`);
		} else if (operation === 'activeReply') {
			const replyType = this.getNodeParameter('replyType', itemIndex) as string;

			if (replyType === 'markdown') {
				const markdownData: IDataObject = {
					content: validateByteLength(
						this.getNodeParameter('content', itemIndex),
						'Markdown 内容',
						20480,
						true,
					),
				};
				const feedbackData = feedback(
					this.getNodeParameter('feedback_id', itemIndex, ''),
					'反馈 ID',
				);
				if (feedbackData) markdownData.feedback = feedbackData;

				replyBody = {
					msgtype: 'markdown',
					markdown: markdownData,
				};
			} else if (replyType === 'template_card') {
				const templateCard = resolveTemplateCard.call(this, itemIndex);
				const feedbackData = feedback(
					this.getNodeParameter('feedback_id', itemIndex, ''),
					'反馈 ID',
				);
				if (feedbackData) templateCard.feedback = feedbackData;

				replyBody = {
					msgtype: 'template_card',
					template_card: templateCard,
				};
			} else fail(`主动回复不支持类型：${replyType}`);
		} else if (operation === 'updateTemplateCard') {
			if (
				incomingMessageType !== 'event' ||
				incomingEventType !== 'template_card_event' ||
				!incomingTaskId
			) {
				fail('更新模板卡片仅适用于包含 task_id 的 template_card_event 回调');
			}
			const useridsStr = this.getNodeParameter('userids', itemIndex, '') as string;
			const useridsSelected = this.getNodeParameter('userids_selected', itemIndex, []) as string[];
			const useridsFromJson = (() => {
				const raw = this.getNodeParameter('useridsJson', itemIndex, '[]');
				if (raw === undefined || raw === null || String(raw).trim() === '') return [] as string[];
				let parsed: unknown = raw;
				if (typeof raw === 'string') {
					try {
						parsed = JSON.parse(raw);
					} catch {
						fail('用户列表 JSON 不是有效的 JSON');
					}
				}
				if (!Array.isArray(parsed)) fail('用户列表 JSON 必须是数组');
				return (parsed as unknown[]).flatMap((entry) => {
					if (typeof entry === 'string' || typeof entry === 'number') return [String(entry).trim()];
					if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
						const row = entry as IDataObject;
						const id = row.userid ?? row.userid_selected ?? row.user_id;
						return id ? [String(id).trim()] : [];
					}
					return [];
				}).filter(Boolean);
			})();
			const templateCard = resolveTemplateCard.call(this, itemIndex, true);
			const configuredTaskId = String(templateCard.task_id ?? '').trim();
			if (configuredTaskId && configuredTaskId !== incomingTaskId) {
				fail('模板卡片 task_id 必须与回调中的 task_id 一致');
			}
			templateCard.task_id = incomingTaskId;
			const feedbackData = feedback(
				this.getNodeParameter('feedback_id', itemIndex, ''),
				'反馈 ID',
			);
			if (feedbackData) templateCard.feedback = feedbackData;

			replyBody = {
				response_type: 'update_template_card',
				template_card: templateCard,
			};

			const mergedUserids = [
				...useridsStr.split(/[,|\n，]+/).map((id) => id.trim()).filter(Boolean),
				...useridsSelected.map((id) => String(id ?? '').trim()).filter(Boolean),
				...useridsFromJson,
			];
			if (mergedUserids.length) {
				replyBody.userids = [...new Set(mergedUserids)];
			}
		} else {
			fail(`不支持的操作类型：${operation}`);
		}

		if (isPassive) {
			const credentials = await this.getCredentials('weComReceiveApi') as {
				token: string;
				encodingAESKey: string;
			};
			const token = requiredText(credentials.token, '接收消息凭证 Token');
			const encodingAESKey = requiredText(
				credentials.encodingAESKey,
				'接收消息凭证 EncodingAESKey',
			);
			const nonce = requiredText(item.json._nonce, '_nonce');
			const timestamp = Math.floor(Date.now() / 1000).toString();
			const encrypt = new WeComCrypto(encodingAESKey, '').encrypt(
				JSON.stringify(replyBody),
				this.getNode(),
			);
			return [{
				json: {
					encrypt,
					msgsignature: WeComCrypto.generateSignature(token, timestamp, nonce, encrypt),
					timestamp: Number(timestamp),
					nonce,
				},
				pairedItem: { item: itemIndex },
			}];
		}

		const responseUrlValue = requiredText(
			item.json._responseUrl ?? item.json.response_url,
			'response_url',
		);
		const responseUrl = (() => {
			try {
				return new URL(responseUrlValue);
			} catch {
				return fail('response_url 不是有效链接');
			}
		})();
		if (
			responseUrl.protocol !== 'https:' ||
			responseUrl.hostname !== 'qyapi.weixin.qq.com' ||
			responseUrl.pathname !== AIBOT_RESPONSE_PATH ||
			!responseUrl.searchParams.get('response_code')
		) {
			fail('response_url 必须是企业微信下发的 qyapi.weixin.qq.com 智能机器人回复链接');
		}
		const response = await this.helpers.httpRequest({
			method: 'POST',
			url: responseUrl.toString(),
			body: replyBody,
			json: true,
			timeout: 5000,
		}) as IDataObject;
		if (response.errcode !== undefined && Number(response.errcode) !== 0) {
			fail(`主动回复失败：${String(response.errmsg ?? '未知错误')}（错误码 ${String(response.errcode)}）`);
		}
		return [{
			json: {
				success: true,
				repliedAt: new Date().toISOString(),
				response,
			},
			pairedItem: { item: itemIndex },
		}];
	} catch (error) {
		// 被动回复失败时必须让 Webhook 返回错误，由企业微信按协议重试；
		// continueOnFail 只适用于已经独立发出的主动回复请求。
		if (passiveOperations.has(operation)) throw error;
		if (this.continueOnFail()) {
			return [{
				json: {
					error: (error as Error).message,
					success: false,
				},
				pairedItem: { item: itemIndex },
			}];
		}
		throw error;
	}
}
