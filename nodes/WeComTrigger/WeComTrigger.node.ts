import type {
	IHookFunctions,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError, NodeConnectionTypes } from 'n8n-workflow';
import {
	WeComCrypto,
	parseXML,
	generateReplyMessageXML,
	generateEncryptedResponseXML,
} from '../WeCom/shared/crypto';

// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
export class WeComTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信消息接收 Trigger',
		name: 'weComTrigger',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['trigger'],
		version: 1,
		subtitle: '接收企业微信消息回调',
		description: '接收企业微信应用消息、事件等回调通知',
		defaults: {
			name: '企业微信消息接收',
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
				description: 'Webhook URL 的路径，建议使用应用ID',
				hint: '注意：同一应用ID自能设置一个Webhook URL',
			},
			{
				displayName: '事件类型',
				name: 'events',
				type: 'multiOptions',
				// eslint-disable-next-line n8n-nodes-base/node-param-multi-options-type-unsorted-items
				options: [
					{
						name: '所有事件',
						value: '*',
						description: '接收所有类型的消息和事件',
					},
					{
						name: '事件消息',
						value: 'event',
						description: '接收事件推送（如成员变更、部门变更等）',
					},
					{
						name: '位置消息',
						value: 'location',
						description: '接收用户发送的位置消息',
					},
					{
						name: '图片消息',
						value: 'image',
						description: '接收用户发送的图片消息',
					},
					{
						name: '文本消息',
						value: 'text',
						description: '接收用户发送的文本消息',
					},
					{
						name: '视频消息',
						value: 'video',
						description: '接收用户发送的视频消息',
					},
					{
						name: '语音消息',
						value: 'voice',
						description: '接收用户发送的语音消息',
					},
					{
						name: '链接消息',
						value: 'link',
						description: '接收用户发送的链接消息',
					},
				],
				default: ['*'],
				required: true,
				description: '选择要接收的消息和事件类型',
				hint: '可以选择多个类型，如果选择"所有事件"则接收所有消息',
			},
			{
				displayName: '被动回复消息',
				name: 'enablePassiveReply',
				type: 'boolean',
				default: false,
				description: 'Whether to enable passive reply message',
				hint: '启用后可以在工作流中被动回复用户发送的消息（需工作流返回响应数据）',
			},
			{
				displayName: '回复消息类型',
				name: 'replyType',
				type: 'options',
				displayOptions: {
					show: {
						enablePassiveReply: [true],
					},
				},
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: '文本消息',
						value: 'text',
						description: '回复文本消息',
					},
					{
						name: '图片消息',
						value: 'image',
						description: '回复图片消息',
					},
					{
						name: '语音消息',
						value: 'voice',
						description: '回复语音消息',
					},
					{
						name: '视频消息',
						value: 'video',
						description: '回复视频消息',
					},
					{
						name: '图文消息',
						value: 'news',
						description: '回复图文消息',
					},
				],
				default: 'text',
				description: '被动回复的消息类型',
				hint: '根据此类型从工作流输出中读取相应字段进行回复',
			},
			{
				displayName: '文本内容字段',
				name: 'replyTextField',
				type: 'string',
				displayOptions: {
					show: {
						enablePassiveReply: [true],
						replyType: ['text'],
					},
				},
				default: 'replyContent',
				required: true,
				description: 'The field name containing reply text content from workflow output',
				hint: '从工作流输出数据中读取该字段作为回复的文本内容',
			},
			{
				displayName: '媒体ID字段',
				name: 'replyMediaIdField',
				type: 'string',
				displayOptions: {
					show: {
						enablePassiveReply: [true],
						replyType: ['image', 'voice', 'video'],
					},
				},
				default: 'mediaId',
				required: true,
				description: 'The field name containing media_id from workflow output',
				hint: '从工作流输出数据中读取该字段作为媒体ID（需先通过素材管理接口上传获得）',
			},
			{
				displayName: '图文消息字段',
				name: 'replyNewsField',
				type: 'string',
				displayOptions: {
					show: {
						enablePassiveReply: [true],
						replyType: ['news'],
					},
				},
				default: 'articles',
				required: true,
				description: 'The field name containing articles array from workflow output',
				hint: '从工作流输出数据中读取该字段作为图文消息数组（每个元素包含Title、Description、Url、PicUrl）',
			},
			{
				displayName: '返回原始数据',
				name: 'returnRawData',
				type: 'boolean',
				default: false,
				description: 'Whether to return unparsed raw XML data',
				hint: '开启后会在输出中包含原始的 XML 字符串',
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

		const query = this.getQueryData() as IDataObject;
		const { msg_signature, timestamp, nonce, echostr } = query;

		// GET 请求：URL 验证
		if (webhookName === 'setup') {
			if (!msg_signature || !timestamp || !nonce || !echostr) {
				throw new NodeOperationError(this.getNode(), '缺少必要的验证参数');
			}

			// 验证签名
			const isValid = WeComCrypto.verifySignature(
				msg_signature as string,
				token,
				timestamp as string,
				nonce as string,
				echostr as string,
			);

			if (!isValid) {
				throw new NodeOperationError(this.getNode(), '签名验证失败');
			}

			// 解密 echostr
			const crypto = new WeComCrypto(encodingAESKey, corpId);
			const decryptedEchostr = crypto.decrypt(echostr as string, this.getNode());

			return {
				webhookResponse: decryptedEchostr,
			};
		}

		// POST 请求：接收消息
		const bodyData = this.getBodyData() as IDataObject;
		const rawBody = (bodyData.data as string) || JSON.stringify(bodyData);

		// 解析 XML
		const xmlData = parseXML(rawBody);
		const { Encrypt } = xmlData;

		if (!Encrypt) {
			throw new NodeOperationError(this.getNode(), '无效的消息格式：缺少加密数据');
		}

		// 验证签名
		const isValid = WeComCrypto.verifySignature(
			msg_signature as string,
			token,
			timestamp as string,
			nonce as string,
			Encrypt,
		);

		if (!isValid) {
			throw new NodeOperationError(this.getNode(), '消息签名验证失败');
		}

		// 解密消息
		const crypto = new WeComCrypto(encodingAESKey, corpId);
		const decryptedMsg = crypto.decrypt(Encrypt, this.getNode());

		// 解析解密后的 XML 消息
		const messageData = parseXML(decryptedMsg);

		// 过滤事件类型
		const events = this.getNodeParameter('events', []) as string[];
		const msgType = messageData.MsgType || messageData.Event || 'unknown';

		if (!events.includes('*') && !events.includes(msgType)) {
			// 不处理此类型的消息，返回 success
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
			outputData.rawXML = decryptedMsg;
		}

		// 检查是否启用被动回复
		const enablePassiveReply = this.getNodeParameter('enablePassiveReply', false) as boolean;
		let webhookResponse: string | IDataObject = 'success';

		if (enablePassiveReply) {
			try {
				// 获取回复消息类型
				const replyType = this.getNodeParameter('replyType', 'text') as string;
				const toUser = messageData.FromUserName as string;
				const fromUser = corpId;

				let replyContent: Record<string, unknown> = {};

				// 根据消息类型构建回复内容
				switch (replyType) {
					case 'text': {
						const textField = this.getNodeParameter('replyTextField', 'replyContent') as string;
						// 从输出数据中读取文本内容（如果工作流有设置）
						// 这里提供一个默认值，实际使用时用户需要通过工作流设置
						const content =
							(outputData[textField] as string) || '感谢您的消息，我们已收到！';
						replyContent = { Content: content };
						break;
					}
					case 'image':
					case 'voice':
					case 'video': {
						const mediaIdField = this.getNodeParameter('replyMediaIdField', 'mediaId') as string;
						const mediaId = outputData[mediaIdField] as string;
						if (!mediaId) {
							throw new NodeOperationError(
								this.getNode(),
								`未找到媒体ID字段: ${mediaIdField}，请确保工作流中设置了该字段`,
							);
						}
						replyContent = { MediaId: mediaId };
						if (replyType === 'video') {
							replyContent.Title = (outputData.videoTitle as string) || '';
							replyContent.Description = (outputData.videoDescription as string) || '';
						}
						break;
					}
					case 'news': {
						const newsField = this.getNodeParameter('replyNewsField', 'articles') as string;
						const articles = outputData[newsField] as Array<{
							Title: string;
							Description?: string;
							Url: string;
							PicUrl?: string;
						}>;
						if (!articles || !Array.isArray(articles)) {
							throw new NodeOperationError(
								this.getNode(),
								`未找到图文消息字段: ${newsField}，请确保工作流中设置了该字段且格式正确`,
							);
						}
						replyContent = { Articles: articles };
						break;
					}
				}

				// 生成回复消息 XML
				const replyMessageXML = generateReplyMessageXML(
					toUser,
					fromUser,
					replyType as 'text' | 'image' | 'voice' | 'video' | 'news',
					replyContent,
				);

				// 生成加密的响应 XML
				const encryptedResponseXML = generateEncryptedResponseXML(
					crypto,
					token,
					replyMessageXML,
					this.getNode(),
				);

				webhookResponse = encryptedResponseXML;

				// 在输出数据中添加回复信息（方便调试）
				outputData._passiveReply = {
					enabled: true,
					type: replyType,
					content: replyContent,
				};
			} catch (error) {
				// 被动回复失败时，记录错误但不影响工作流执行
				const err = error as Error;
				outputData._passiveReplyError = {
					message: err.message,
					error: err.toString(),
				};
				// 回退到返回 success
				webhookResponse = 'success';
			}
		}

		// 返回响应
		return {
			workflowData: [
				[
					{
						json: outputData,
					},
				],
			],
			webhookResponse,
		};
	}
}
