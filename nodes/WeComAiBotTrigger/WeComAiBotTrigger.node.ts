import type {
	IHookFunctions,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError, NodeConnectionTypes } from 'n8n-workflow';
import { WeComCrypto } from '../WeCom/shared/crypto';
import { weComReceiveApiTest } from '../WeCom/shared/credentialTest';

/**
 * 企业微信智能机器人消息接收触发器
 *
 * 接收智能机器人的消息回调，支持文本、图片、图文混排、语音、文件等消息类型和事件
 */
// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
export class WeComAiBotTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信(WeCom)-智能机器人消息接收触发器',
		name: 'weComAiBotTrigger',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['trigger'],
		version: 1,
		subtitle: '接收智能机器人消息和事件',
		description: '接收企业微信智能机器人的消息回调（文本、图片、图文混排、语音、文件等）和事件（进入会话、模板卡片、用户反馈等）',
		defaults: {
			name: '企业微信智能机器人消息接收',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'weComReceiveApi',
				required: true,
				testedBy: 'weComReceiveApiTest',
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: '={{$parameter.responseMode}}',
				responseData: 'firstEntryJson',
				responseContentType:
					'={{$parameter.responseMode === "lastNode" ? "application/json" : "text/plain"}}',
				path: '={{$parameter.path}}',
				isFullPath: true,
			},
			{
				name: 'setup',
				httpMethod: 'GET',
				responseMode: 'onReceived',
				path: '={{$parameter.path}}',
				isFullPath: true,
			},
		],
		properties: [
			{
				displayName: '路径',
				name: 'path',
				type: 'string',
				default: '',
				required: true,
				placeholder: '同一机器人ID路径要求唯一',
				description: 'Webhook URL 的路径，建议使用机器人 ID',
				hint: 'Webhook URL 的路径，建议使用机器人 ID',
			},
			{
				displayName: '响应方式',
				name: 'responseMode',
				type: 'options',
				options: [
					{
						name: '立即响应（主动回复）',
						value: 'onReceived',
						description: '立即向企业微信返回 success，工作流中使用 response_url 主动回复。',
					},
					{
						name: '等待工作流（被动回复）',
						value: 'lastNode',
						description: '等待最后一个节点生成加密回复，必须在 5 秒内完成。',
					},
				],
				default: 'onReceived',
				required: true,
				description: '主动回复与被动回复使用不同的 HTTP 响应流程。',
			},
			{
				displayName: '消息类型',
				name: 'events',
				type: 'multiOptions',
				// eslint-disable-next-line n8n-nodes-base/node-param-multi-options-type-unsorted-items
				options: [
					{
						name: '所有消息和事件',
						value: '*',
						description: '接收所有消息和事件',
					},
					{
						name: '消息接收与发送-智能机器人-接收消息-文本消息',
						value: 'text',
						description: '接收文本消息',
					},
					{
						name: '消息接收与发送-智能机器人-接收消息-图片消息',
						value: 'image',
						description: '接收图片消息',
					},
					{
						name: '消息接收与发送-智能机器人-接收消息-图文混排消息',
						value: 'mixed',
						description: '接收图文混排消息',
					},
					{
						name: '消息接收与发送-智能机器人-接收消息-语音消息',
						value: 'voice',
						description: '接收语音消息',
					},
					{
						name: '消息接收与发送-智能机器人-接收消息-文件消息',
						value: 'file',
						description: '接收文件消息',
					},
					{
						name: '消息接收与发送-智能机器人-接收消息-视频消息',
						value: 'video',
						description: '接收视频消息',
					},
					{
						name: '消息接收与发送-智能机器人-接收消息-流式消息刷新',
						value: 'stream',
						description: '接收流式消息刷新',
					},
					{
						name: '消息接收与发送-智能机器人-接收事件-进入会话',
						value: 'enter_chat',
						description: '接收进入会话',
					},
					{
						name: '消息接收与发送-智能机器人-接收事件-模板卡片事件',
						value: 'template_card_event',
						description: '接收模板卡片事件',
					},
					{
						name: '消息接收与发送-智能机器人-接收事件-按钮交互模板卡片事件',
						value: 'template_card_event_button_interaction',
						description: '接收按钮交互模板卡片事件',
					},
					{
						name: '消息接收与发送-智能机器人-接收事件-投票选择模板卡片事件',
						value: 'template_card_event_vote_interaction',
						description: '接收投票选择模板卡片事件',
					},
					{
						name: '消息接收与发送-智能机器人-接收事件-多项选择模板卡片事件',
						value: 'template_card_event_multiple_interaction',
						description: '接收多项选择模板卡片事件',
					},
					{
						name: '消息接收与发送-智能机器人-接收事件-模板卡片右上角菜单事件',
						value: 'template_card_event_menu',
						description: '接收模板卡片右上角菜单事件',
					},
					{
						name: '消息接收与发送-智能机器人-接收事件-用户反馈',
						value: 'feedback_event',
						description: '接收用户反馈',
					},
				],
				default: ['*'],
				required: true,
				description: '选择要接收的消息类型和事件类型',
			},
			{
				displayName: '返回原始数据',
				name: 'returnRawData',
				type: 'boolean',
				default: false,
				description: '是否返回未解析的原始JSON数据',
				hint: '开启后会在输出中包含原始的 JSON 字符串',
			},
		],
	};

	methods = {
		credentialTest: {
			weComReceiveApiTest,
		},
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const webhookName = this.getWebhookName();
		const credentials = await this.getCredentials('weComReceiveApi');
		const { token, encodingAESKey } = credentials as {
			token: string;
			encodingAESKey: string;
		};
		const responseMode = this.getNodeParameter('responseMode', 'onReceived') as
			| 'onReceived'
			| 'lastNode';

		const req = this.getRequestObject();
		const query = req.query as IDataObject;

		// GET 请求：URL 验证
		if (webhookName === 'setup') {
			// 获取请求参数时需要做Urldecode处理
			const msg_signature = decodeURIComponent((query.msg_signature as string) || '');
			const timestamp = decodeURIComponent((query.timestamp as string) || '');
			const nonce = decodeURIComponent((query.nonce as string) || '');
			const echostr = decodeURIComponent((query.echostr as string) || '');

			if (!msg_signature || !timestamp || !nonce || !echostr) {
				throw new NodeOperationError(
					this.getNode(),
					'缺少必要的验证参数：msg_signature、timestamp、nonce、echostr',
				);
			}

			// 验证签名
			const isValid = WeComCrypto.verifySignature(
				msg_signature,
				token,
				timestamp,
				nonce,
				echostr,
			);

			if (!isValid) {
				throw new NodeOperationError(this.getNode(), '签名验证失败');
			}

			// 解密 echostr
			// 注意：企业内部智能机器人场景中，ReceiveId为空字符串
			const crypto = new WeComCrypto(encodingAESKey, '');
			const decryptedEchostr = crypto.decrypt(echostr, this.getNode());

			// 解析解密后的JSON，提取msg字段
			try {
				const decryptedData = JSON.parse(decryptedEchostr);
				const msg = decryptedData.msg || decryptedEchostr;
				
				// 在1秒内响应GET请求，响应内容为明文消息内容（不能加引号，不能带bom头，不能带换行符）
				return {
					webhookResponse: msg,
				};
			} catch {
				// 如果解析失败，直接返回解密后的内容
				return {
					webhookResponse: decryptedEchostr,
				};
			}
		}

		// POST 请求：接收消息回调。n8n 已解析 URL 查询参数，不再重复解码。
		const msg_signature = String(query.msg_signature ?? '').trim();
		const timestamp = String(query.timestamp ?? '').trim();
		const nonce = String(query.nonce ?? '').trim();

		if (!msg_signature || !timestamp || !nonce) {
			throw new NodeOperationError(
				this.getNode(),
				'缺少必要的签名参数：msg_signature、timestamp、nonce',
			);
		}

		let rawBody = '';
		if (req.rawBody) rawBody = req.rawBody.toString('utf8');
		else if (typeof req.body === 'string') rawBody = req.body;
		else if (req.body && typeof req.body === 'object') rawBody = JSON.stringify(req.body);

		if (!rawBody) {
			throw new NodeOperationError(this.getNode(), '无法获取请求体数据');
		}

		let parsedBody: unknown;
		try {
			parsedBody = JSON.parse(rawBody) as unknown;
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`请求体必须是包含 encrypt 字段的有效 JSON：${(error as Error).message}`,
			);
		}
		if (!parsedBody || typeof parsedBody !== 'object' || Array.isArray(parsedBody)) {
			throw new NodeOperationError(this.getNode(), '请求体必须是包含 encrypt 字段的 JSON 对象');
		}
		const encrypt = String((parsedBody as IDataObject).encrypt ?? '').trim();
		if (!encrypt) {
			throw new NodeOperationError(this.getNode(), '智能机器人回调必须包含非空的 encrypt 字段');
		}
		if (!WeComCrypto.verifySignature(msg_signature, token, timestamp, nonce, encrypt)) {
			throw new NodeOperationError(this.getNode(), '消息签名验证失败');
		}

		// 企业内部智能机器人 ReceiveId 固定为空字符串。
		const decryptedMsg = new WeComCrypto(encodingAESKey, '').decrypt(encrypt, this.getNode());
		let parsedMessage: unknown;
		try {
			parsedMessage = JSON.parse(decryptedMsg) as unknown;
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`无法解析解密后的消息：${(error as Error).message}`,
			);
		}
		if (!parsedMessage || typeof parsedMessage !== 'object' || Array.isArray(parsedMessage)) {
			throw new NodeOperationError(this.getNode(), '解密后的消息必须是 JSON 对象');
		}
		const messageData = parsedMessage as IDataObject;

		// 过滤消息类型和事件类型
		const events = this.getNodeParameter('events', []) as string[];
		const msgType = (messageData.msgtype as string) || 'unknown';

		// 检查是否应该处理此消息/事件
		let shouldProcess = false;

		if (events.includes('*')) {
			shouldProcess = true;
		} else if (msgType === 'event') {
			// 对于事件类型，需要检查具体的事件类型
			const eventData = messageData.event as IDataObject;
			const eventType = (eventData?.eventtype as string) || '';
			const templateCardEvent = eventData?.template_card_event as IDataObject;
			const cardType = (templateCardEvent?.card_type as string) || '';
			const hasSelectedItems = Boolean(templateCardEvent?.selected_items);
			const specificTemplateCardEvent =
				eventType === 'template_card_event' && cardType
					? `template_card_event_${cardType}`
					: '';

			// 检查是否匹配事件类型
			if (eventType === 'template_card_event' && events.includes('template_card_event')) {
				shouldProcess = true;
			} else if (specificTemplateCardEvent && events.includes(specificTemplateCardEvent)) {
				shouldProcess = true;
			} else if (
				eventType === 'template_card_event' &&
				['text_notice', 'news_notice', 'button_interaction'].includes(cardType) &&
				!hasSelectedItems &&
				events.includes('template_card_event_menu')
			) {
				shouldProcess = true;
			} else if (eventType === 'enter_chat' && events.includes('enter_chat')) {
				shouldProcess = true;
			} else if (eventType === 'feedback_event' && events.includes('feedback_event')) {
				shouldProcess = true;
			}
		} else if (events.includes(msgType)) {
			// 普通消息类型匹配
			shouldProcess = true;
		}

		if (!shouldProcess) {
			// 不处理的消息类型，直接返回成功响应
			return {
				webhookResponse: 'success',
			};
		}

		// 准备返回数据
		const returnRawData = this.getNodeParameter('returnRawData', false) as boolean;
		const outputData: IDataObject = {
			...messageData,
			receivedAt: new Date().toISOString(),
		};

		if (returnRawData) {
			outputData.rawJSON = typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
		}

		// 添加response_url供后续节点使用
		if (messageData.response_url) {
			outputData._responseUrl = messageData.response_url;
		}

		// 仅保存被动回复所需的非敏感上下文；Token/AESKey 始终留在凭证存储中。
		outputData._nonce = nonce;
		outputData._aibotResponseMode = responseMode;

		const workflowData = {
			workflowData: [
				[
					{
						json: outputData,
					},
				],
			],
		};
		return responseMode === 'onReceived'
			? { ...workflowData, webhookResponse: 'success' }
			: workflowData;
	}
}
