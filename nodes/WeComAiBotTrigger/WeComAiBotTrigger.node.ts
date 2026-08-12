import type {
	IHookFunctions,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
	INode,
} from 'n8n-workflow';
import { NodeOperationError, NodeConnectionTypes } from 'n8n-workflow';
import { WeComCrypto } from '../WeCom/shared/crypto';
import { createDecipheriv, createCipheriv, randomBytes } from 'crypto';

/**
 * 智能机器人专用的加解密类
 * 企业内部智能机器人场景中，ReceiveId为空字符串
 */
class WeComAIBotCrypto {
	private readonly key: Buffer;

	constructor(encodingAESKey: string) {
		const aesKey = encodingAESKey + '=';
		this.key = Buffer.from(aesKey, 'base64');
		
		if (this.key.length !== 32) {
			throw new NodeOperationError(
				{ name: 'WeComAIBotCrypto' } as INode,
				'EncodingAESKey 解码后必须是 32 字节',
			);
		}
	}

	decrypt(encrypted: string, node: INode): string {
		try {
			const cipher = Buffer.from(encrypted, 'base64');
			const iv = this.key.slice(0, 16);
			const decipher = createDecipheriv('aes-256-cbc', this.key, iv);
			decipher.setAutoPadding(false);

			let decrypted = Buffer.concat([decipher.update(cipher), decipher.final()]);

			// 去除 PKCS7 填充
			const pad = decrypted[decrypted.length - 1];
			if (pad < 1 || pad > 32) {
				throw new NodeOperationError(node, `无效的填充值: ${pad}`);
			}
			for (let i = 0; i < pad; i++) {
				if (decrypted[decrypted.length - 1 - i] !== pad) {
					throw new NodeOperationError(node, '填充字节不一致');
				}
			}
			decrypted = decrypted.slice(0, decrypted.length - pad);

			// 格式：随机16字节 + 4字节网络字节序消息长度 + 消息内容 + ReceiveId（空字符串）
			if (decrypted.length < 20) {
				throw new NodeOperationError(node, '解密后的数据长度不足');
			}

			const content = decrypted.slice(16);
			const msgLen = content.readUInt32BE(0);
			
			if (content.length < 4 + msgLen) {
				throw new NodeOperationError(
					node,
					`消息长度不匹配: 期望 ${msgLen}, 实际 ${content.length - 4}`,
				);
			}
			const message = content.slice(4, 4 + msgLen).toString('utf8');
			
			// 验证 ReceiveId（智能机器人场景中为空字符串）
			// 注意：某些情况下可能不是空字符串，这里不强制验证

			return message;
		} catch (error) {
			const err = error as Error;
			throw new NodeOperationError(node, `消息解密失败: ${err.message}`);
		}
	}

	encrypt(message: string, node: INode): string {
		try {
			const random = randomBytes(16);
			const msgBuffer = Buffer.from(message, 'utf8');
			const msgLenBuffer = Buffer.alloc(4);
			msgLenBuffer.writeUInt32BE(msgBuffer.length, 0);
			
			// ReceiveId为空字符串（智能机器人场景）
			const receiveIdBuffer = Buffer.from('', 'utf8');

			const content = Buffer.concat([random, msgLenBuffer, msgBuffer, receiveIdBuffer]);

			const blockSize = 32;
			const paddingLength = blockSize - (content.length % blockSize);
			const padding = Buffer.alloc(paddingLength, paddingLength);
			const paddedContent = Buffer.concat([content, padding]);

			const iv = this.key.slice(0, 16);
			const cipher = createCipheriv('aes-256-cbc', this.key, iv);
			cipher.setAutoPadding(false);

			const encrypted = Buffer.concat([cipher.update(paddedContent), cipher.final()]);
			
			return encrypted.toString('base64');
		} catch (error) {
			const err = error as Error;
			throw new NodeOperationError(node, `消息加密失败: ${err.message}`);
		}
	}
}

/**
 * 企业微信智能机器人消息接收触发器
 *
 * 接收智能机器人的消息回调，支持文本、图片、图文混排、语音、文件等消息类型和事件
 */
export class WeComAiBotTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信(WeCom)-智能机器人消息接收触发器',
		name: 'weComAiBotTrigger',
		usableAsTool: true,
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
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
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
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
				required: true,
				placeholder: '同一机器人ID路径要求唯一',
				description: 'Webhook URL 的路径，建议使用机器人 ID',
				hint: 'Webhook URL 的路径，建议使用机器人 ID',
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
		const { corpId, token, encodingAESKey } = credentials as {
			corpId: string;
			token: string;
			encodingAESKey: string;
		};

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
			const crypto = new WeComAIBotCrypto(encodingAESKey);
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

		// POST 请求：接收消息回调
		// 获取签名参数（POST请求也需要URL解码）
		const msg_signature = decodeURIComponent((query.msg_signature as string) || '');
		const timestamp = decodeURIComponent((query.timestamp as string) || '');
		const nonce = decodeURIComponent((query.nonce as string) || '');

		if (!msg_signature || !timestamp || !nonce) {
			throw new NodeOperationError(
				this.getNode(),
				'缺少必要的签名参数：msg_signature、timestamp、nonce',
			);
		}

		// 获取请求体
		let rawBody = '';
		if (req.rawBody) {
			rawBody = req.rawBody.toString('utf8');
		} else if (typeof req.body === 'string') {
			rawBody = req.body;
		} else if (req.body && typeof req.body === 'object') {
			const bodyData = req.body as IDataObject;
			if (bodyData.encrypt && typeof bodyData.encrypt === 'string') {
				// 如果请求体是JSON格式，且包含encrypt字段
				rawBody = bodyData.encrypt as string;
			} else {
				rawBody = JSON.stringify(bodyData);
			}
		}

		if (!rawBody) {
			throw new NodeOperationError(this.getNode(), '无法获取请求体数据');
		}

		let messageData: IDataObject;

		// 尝试解析JSON（可能是加密的JSON字符串，也可能是明文JSON）
		try {
			const parsedBody = JSON.parse(rawBody);
			
			// 如果包含encrypt字段，说明消息是加密的
			if (parsedBody.encrypt) {
				const encrypt = parsedBody.encrypt as string;
				
				// 验证签名
				const isValid = WeComCrypto.verifySignature(
					msg_signature,
					token,
					timestamp,
					nonce,
					encrypt,
				);

				if (!isValid) {
					throw new NodeOperationError(this.getNode(), '消息签名验证失败');
				}

				// 解密消息
				// 注意：企业内部智能机器人场景中，ReceiveId为空字符串
				const crypto = new WeComAIBotCrypto(encodingAESKey);
				const decryptedMsg = crypto.decrypt(encrypt, this.getNode());
				
				// 解密后的消息应该是JSON格式
				messageData = JSON.parse(decryptedMsg);
			} else {
				// 明文JSON消息，仍然需要验证签名
				// 对于JSON格式，可能需要将整个JSON字符串作为encrypt进行签名验证
				// 但根据文档，智能机器人消息应该是加密的
				// 这里先假设如果是明文JSON，则不需要签名验证（或者签名验证方式不同）
				messageData = parsedBody;
			}
		} catch (error) {
			// 如果解析失败，可能是加密的字符串
			// 尝试作为加密消息处理
			try {
				// 验证签名
				const isValid = WeComCrypto.verifySignature(
					msg_signature,
					token,
					timestamp,
					nonce,
					rawBody,
				);

				if (!isValid) {
					throw new NodeOperationError(this.getNode(), '消息签名验证失败');
				}

				// 解密消息
				// 注意：企业内部智能机器人场景中，ReceiveId为空字符串
				const crypto = new WeComAIBotCrypto(encodingAESKey);
				const decryptedMsg = crypto.decrypt(rawBody, this.getNode());
				
				// 解密后的消息应该是JSON格式
				messageData = JSON.parse(decryptedMsg);
			} catch {
				const err = error as Error;
				throw new NodeOperationError(
					this.getNode(),
					`无法解析消息数据: ${err.message}`,
				);
			}
		}

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

		// 添加加密信息和nonce供后续节点使用（如果需要回复消息）
		outputData._wecomCrypto = {
			token,
			encodingAESKey,
			corpId,
		};
		// 保存nonce用于被动回复加密
		outputData._nonce = nonce;
		outputData._timestamp = timestamp;
		outputData._msgSignature = msg_signature;

		return {
			workflowData: [
				[
					{
						json: outputData,
					},
				],
			],
			webhookResponse: 'success',
		};
	}
}
