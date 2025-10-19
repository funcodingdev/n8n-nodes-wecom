import type {
	IHookFunctions,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError, NodeConnectionTypes } from 'n8n-workflow';
import { WeComCrypto, parseXML } from '../WeCom/shared/crypto';

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
				path: 'webhook',
			},
			{
				name: 'setup',
				httpMethod: 'GET',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: '事件类型',
				name: 'events',
				type: 'multiOptions',
				options: [
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
						name: '所有事件',
						value: '*',
						description: '接收所有类型的消息和事件',
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
				displayName: '返回原始数据',
				name: 'returnRawData',
				type: 'boolean',
				default: false,
				description: 'Whether to return unparsed raw XML data',
				hint: '开启后会在输出中包含原始的 XML 字符串',
			},
		],
		usableAsTool: true,
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
				throw new NodeOperationError(
					this.getNode(),
					'缺少必要的验证参数',
				);
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
				throw new NodeOperationError(
					this.getNode(),
					'签名验证失败',
				);
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
			throw new NodeOperationError(
				this.getNode(),
				'无效的消息格式：缺少加密数据',
			);
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
			throw new NodeOperationError(
				this.getNode(),
				'消息签名验证失败',
			);
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

		// 返回成功响应
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

