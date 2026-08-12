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
} from '../WeCom/shared/crypto';

/**
 * 企业微信消息接收触发器（被动回复模式）
 *
 * 使用 responseMode: 'lastNode' 由最后一个节点处理响应
 * 工作流结构：本触发器 → 处理节点（可选）→ 企业微信被动回复节点
 */
// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
export class WeComPassiveTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信(WeCom)消息接收（被动回复）触发器',
		name: 'weComPassiveTrigger',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['trigger'],
		version: 1,
		subtitle: '接收消息并支持被动回复',
		description: '接收企业微信消息并支持被动回复（需配合"企业微信被动回复"节点使用）',
		defaults: {
			name: '企业微信消息接收（被动回复）',
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
				responseMode: 'lastNode',
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
				placeholder: '同一应用ID路径要求唯一',
				description: 'Webhook URL 的路径，建议使用应用 ID',
			},
			{
				displayName: '消息类型',
				name: 'events',
				type: 'multiOptions',
				// eslint-disable-next-line n8n-nodes-base/node-param-multi-options-type-unsorted-items
				options: [
					{
						name: '所有消息',
						value: '*',
						description: '接收所有消息',
					},
					{
						name: '消息接收与发送-普通消息-文本消息',
						value: 'text',
						description: '接收文本消息',
					},
					{
						name: '消息接收与发送-普通消息-图片消息',
						value: 'image',
						description: '接收图片消息',
					},
					{
						name: '消息接收与发送-普通消息-语音消息',
						value: 'voice',
						description: '接收语音消息',
					},
					{
						name: '消息接收与发送-普通消息-视频消息',
						value: 'video',
						description: '接收视频消息',
					},
					{
						name: '消息接收与发送-普通消息-位置消息',
						value: 'location',
						description: '接收位置消息',
					},
					{
						name: '消息接收与发送-普通消息-链接消息',
						value: 'link',
						description: '接收链接消息',
					},
					{
						name: '事件消息',
						value: 'event',
						description: '接收事件消息',
					},
					{
						name: '消息接收与发送-支持被动回复事件-成员关注',
						value: 'subscribe',
						description: '接收成员关注',
					},
					{
						name: '消息接收与发送-支持被动回复事件-进入应用',
						value: 'enter_agent',
						description: '接收进入应用',
					},
					{
						name: '消息接收与发送-支持被动回复事件-上报地理位置',
						value: 'LOCATION',
						description: '接收上报地理位置',
					},
					{
						name: '消息接收与发送-支持被动回复事件-点击菜单拉取消息',
						value: 'click',
						description: '接收点击菜单拉取消息',
					},
					{
						name: '消息接收与发送-支持被动回复事件-点击菜单跳转链接',
						value: 'view',
						description: '接收点击菜单跳转链接',
					},
					{
						name: '消息接收与发送-支持被动回复事件-点击菜单跳转小程序',
						value: 'view_miniprogram',
						description: '接收点击菜单跳转小程序',
					},
					{
						name: '消息接收与发送-支持被动回复事件-扫码推事件且弹出消息接收中提示框',
						value: 'scancode_waitmsg',
						description: '接收扫码推事件且弹出消息接收中提示框',
					},
					{
						name: '消息接收与发送-支持被动回复事件-通用模板卡片右上角菜单事件',
						value: 'template_card_menu_event',
						description: '接收通用模板卡片右上角菜单事件',
					},
				],
				default: ['*'],
				required: true,
				description: '选择要接收的消息类型',
			},
			{
				displayName: '返回原始数据',
				name: 'returnRawData',
				type: 'boolean',
				default: false,
				description: '是否返回未解析的原始XML数据',
				hint: '开启后会在输出中包含原始的 XML 字符串（解密后的XML）',
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
		const req = this.getRequestObject();
		let rawBody = '';
		if (req.rawBody) {
			rawBody = req.rawBody.toString('utf8');
		} else if (typeof req.body === 'string') {
			rawBody = req.body;
		} else if (req.body && typeof req.body === 'object') {
			const bodyData = req.body as IDataObject;
			if (bodyData.data && typeof bodyData.data === 'string') {
				rawBody = bodyData.data;
			} else if (bodyData.xml && typeof bodyData.xml === 'string') {
				rawBody = bodyData.xml;
			} else {
				rawBody = JSON.stringify(bodyData);
			}
		}

		if (!rawBody) {
			throw new NodeOperationError(this.getNode(), '无法获取请求体数据');
		}

		// 解析 XML
		const xmlData = parseXML(rawBody);
		const { Encrypt } = xmlData;

		if (!Encrypt) {
			throw new NodeOperationError(
				this.getNode(),
				`无效的消息格式：缺少加密数据。收到的数据：${rawBody.substring(0, 200)}`,
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
			throw new NodeOperationError(this.getNode(), '消息签名验证失败');
		}

		// 解密消息
		const crypto = new WeComCrypto(encodingAESKey, corpId);
		const decryptedMsg = crypto.decrypt(Encrypt, this.getNode());

		// 解析解密后的 XML 消息
		const messageData = parseXML(decryptedMsg);

		// 过滤消息类型
		const events = this.getNodeParameter('events', []) as string[];
		const msgType = messageData.MsgType || 'unknown';
		const eventType = messageData.Event || 'unknown';
		const shouldProcess =
			events.includes('*') ||
			events.includes(msgType) ||
			events.includes(eventType) ||
			(msgType === 'event' && events.includes('event'));

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
			outputData.rawXML = decryptedMsg;
		}

		// 添加加密信息供被动回复节点使用
		outputData._wecomCrypto = {
			token,
			encodingAESKey,
			corpId,
		};

		return {
			workflowData: [
				[
					{
						json: outputData,
					},
				],
			],
		};
	}
}
