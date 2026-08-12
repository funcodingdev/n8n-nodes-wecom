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

// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
export class WeComSuiteTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信(WeCom)第三方应用指令回调触发器',
		name: 'weComSuiteTrigger',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['trigger'],
		version: 1,
		subtitle: '接收第三方应用指令回调事件',
		description: '接收企业微信第三方应用的指令回调事件（授权、通讯录变更、ticket变化等）',
		defaults: {
			name: '企业微信第三方应用指令回调',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'weComSuiteReceiveApi',
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
				placeholder: 'suite/receive',
				description: 'Webhook URL 的路径，建议使用应用相关的唯一标识',
				hint: '例如：suite/receive，对应指令回调URL：https://your-domain.com/suite/receive',
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
						description: '接收所有事件',
					},
					{
						name: '授权成功',
						value: 'create_auth',
						description: '接收授权成功',
					},
					{
						name: '变更授权',
						value: 'change_auth',
						description: '接收变更授权',
					},
					{
						name: '取消授权',
						value: 'cancel_auth',
						description: '接收取消授权',
					},
					{
						name: '通讯录变更',
						value: 'change_contact',
						description: '接收通讯录变更',
					},
					{
						name: '新增成员',
						value: 'change_contact_create_user',
						description: '接收新增成员',
					},
					{
						name: '更新成员',
						value: 'change_contact_update_user',
						description: '接收更新成员',
					},
					{
						name: '删除成员',
						value: 'change_contact_delete_user',
						description: '接收删除成员',
					},
					{
						name: '新增部门',
						value: 'change_contact_create_party',
						description: '接收新增部门',
					},
					{
						name: '更新部门',
						value: 'change_contact_update_party',
						description: '接收更新部门',
					},
					{
						name: '删除部门',
						value: 'change_contact_delete_party',
						description: '接收删除部门',
					},
					{
						name: '标签成员变更',
						value: 'change_contact_update_tag',
						description: '接收标签成员变更',
					},
					{
						name: 'Suite Ticket推送',
						value: 'suite_ticket',
						description: '接收Suite Ticket推送',
					},
					{
						name: '应用变更',
						value: 'change_app',
						description: '接收应用变更',
					},
					{
						name: '企业互联共享应用变更',
						value: 'share_agent_change',
						description: '接收企业互联共享应用变更',
					},
					{
						name: '上下游共享应用变更',
						value: 'share_chain_change',
						description: '接收上下游共享应用变更',
					},
					{
						name: '重置永久授权码通知',
						value: 'reset_permanent_code',
						description: '接收重置永久授权码通知',
					},
					{
						name: '应用管理员变更',
						value: 'change_app_admin',
						description: '接收应用管理员变更',
					},
					{
						name: '授权组织架构权限',
						value: 'corp_arch_auth',
						description: '接收授权组织架构权限',
					},
					{
						name: '获客助手权限确认',
						value: 'approve_special_auth',
						description: '接收获客助手权限确认',
					},
					{
						name: '获客助手权限取消',
						value: 'cancel_special_auth',
						description: '接收获客助手权限取消',
					},
					{
						name: '支付成功通知',
						value: 'license_pay_success',
						description: '接收支付成功通知',
					},
					{
						name: '退款结果通知',
						value: 'license_refund',
						description: '接收退款结果通知',
					},
					{
						name: '自动激活回调通知',
						value: 'auto_activate',
						description: '接收自动激活回调通知',
					},
					{
						name: '下单成功通知',
						value: 'open_order',
						description: '接收下单成功通知',
					},
					{
						name: '改单通知',
						value: 'change_order',
						description: '接收改单通知',
					},
					{
						name: '支付成功通知',
						value: 'pay_for_app_success',
						description: '接收支付成功通知',
					},
					{
						name: '退款通知',
						value: 'refund',
						description: '接收退款通知',
					},
					{
						name: '应用版本变更通知',
						value: 'change_editon',
						description: '接收应用版本变更通知',
					},
					{
						name: '取消订单通知',
						value: 'cancel_order',
						description: '接收取消订单通知',
					},
					{
						name: '注册完成回调',
						value: 'register_corp',
						description: '接收注册完成回调',
					},
					{
						name: '扫描推广二维码',
						value: 'enter_register_package',
						description: '接收扫描推广二维码',
					},
				],
				default: ['*'],
				required: true,
				description: '选择要接收的回调事件类型',
				hint: '可以选择多个类型，如果选择"所有事件"则接收所有回调事件',
			},
			{
				displayName: '返回原始数据',
				name: 'returnRawData',
				type: 'boolean',
				default: false,
				description: '是否返回未解析的原始XML数据',
				hint: '开启后会在输出中包含原始的XML字符串',
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
		const credentials = await this.getCredentials('weComSuiteReceiveApi');
		const { suiteId, token, encodingAESKey } = credentials as {
			suiteId: string;
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
			// 注意：在第三方回调事件中，receiveid的内容为suiteid
			const crypto = new WeComCrypto(encodingAESKey, suiteId);
			const decryptedEchostr = crypto.decrypt(echostr as string, this.getNode());

			return {
				webhookResponse: decryptedEchostr,
			};
		}

		// POST 请求：接收回调事件
		// 获取原始请求对象以读取 XML body
		const req = this.getRequestObject();
		let rawBody = '';

		// 尝试多种方式获取原始 XML 数据
		if (req.rawBody) {
			// n8n 在某些情况下会提供 rawBody
			rawBody = req.rawBody.toString('utf8');
		} else if (typeof req.body === 'string') {
			// body 本身就是字符串
			rawBody = req.body;
		} else if (req.body && typeof req.body === 'object') {
			// body 是对象，尝试从常见字段获取
			const bodyData = req.body as IDataObject;
			if (bodyData.data && typeof bodyData.data === 'string') {
				rawBody = bodyData.data;
			} else if (bodyData.xml && typeof bodyData.xml === 'string') {
				rawBody = bodyData.xml;
			} else {
				// 最后尝试 JSON 序列化（不太可能是正确的 XML）
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
		// 注意：在第三方回调事件中，receiveid的内容为suiteid
		const crypto = new WeComCrypto(encodingAESKey, suiteId);
		const decryptedMsg = crypto.decrypt(Encrypt, this.getNode());

		// 解析解密后的 XML 消息
		const messageData = parseXML(decryptedMsg);

		// 过滤事件类型
		const events = this.getNodeParameter('events', []) as string[];
		const infoType = messageData.InfoType || messageData.Event || 'unknown';
		const changeType = messageData.ChangeType || '';

		// 检查是否应该处理此事件
		let shouldProcess = false;

		// 如果选择了所有事件，直接处理
		if (events.includes('*')) {
			shouldProcess = true;
		} else {
			// 对于 change_contact 事件，需要检查 InfoType 和 ChangeType
			if (infoType === 'change_contact') {
				// 如果选择了 change_contact（所有通讯录变更事件），则处理
				if (events.includes('change_contact')) {
					shouldProcess = true;
				}
				// 如果选择了具体的 change_contact 子类型，检查 ChangeType
				else if (changeType) {
					const specificEventType = `change_contact_${changeType}`;
					if (events.includes(specificEventType)) {
						shouldProcess = true;
					}
				}
			} else {
				// 其他事件类型直接匹配 InfoType
				if (events.includes(infoType)) {
					shouldProcess = true;
				}
			}
		}

		if (!shouldProcess) {
			// 不处理此类型的事件，返回 success
			return {
				webhookResponse: 'success',
			};
		}

		// 准备返回数据
		const returnRawData = this.getNodeParameter('returnRawData', false) as boolean;
		const outputData: IDataObject = {
			...messageData,
			receivedAt: new Date().toISOString(),
			ToUserName: messageData.ToUserName || suiteId,
		};

		if (returnRawData) {
			outputData.rawXML = decryptedMsg;
		}

		// 返回数据并响应 success（必须返回 "success"）
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
