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
	generateEncryptedResponseXML,
	generateReplyMessageXML,
	parseXML,
} from '../WeCom/shared/crypto';
import {
	createNativeHitlContextHeaders,
	parseNativeHitlEventKey,
} from '../WeCom/shared/nativeHitl';

// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
export class WeComTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信消息接收触发器 (WeCom)',
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
				placeholder: '同一应用ID路径要求唯一',
				description: 'Webhook URL 的路径，建议使用应用 ID',
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
						name: '消息接收与发送-事件消息-成员关注',
						value: 'subscribe',
						description: '接收成员关注',
					},
					{
						name: '消息接收与发送-事件消息-成员取消关注',
						value: 'unsubscribe',
						description: '接收成员取消关注',
					},
					{
						name: '消息接收与发送-事件消息-进入应用',
						value: 'enter_agent',
						description: '接收进入应用',
					},
					{
						name: '消息接收与发送-事件消息-上报地理位置',
						value: 'LOCATION',
						description: '接收上报地理位置',
					},
					{
						name: '消息接收与发送-菜单事件-点击菜单拉取消息',
						value: 'click',
						description: '接收点击菜单拉取消息',
					},
					{
						name: '消息接收与发送-菜单事件-点击菜单跳转链接',
						value: 'view',
						description: '接收点击菜单跳转链接',
					},
					{
						name: '消息接收与发送-菜单事件-点击菜单跳转小程序',
						value: 'view_miniprogram',
						description: '接收点击菜单跳转小程序',
					},
					{
						name: '消息接收与发送-菜单事件-扫码推事件',
						value: 'scancode_push',
						description: '接收扫码推事件',
					},
					{
						name: '消息接收与发送-菜单事件-扫码推事件且弹出消息接收中提示框',
						value: 'scancode_waitmsg',
						description: '接收扫码推事件且弹出消息接收中提示框',
					},
					{
						name: '消息接收与发送-菜单事件-弹出系统拍照发图',
						value: 'pic_sysphoto',
						description: '接收弹出系统拍照发图',
					},
					{
						name: '消息接收与发送-菜单事件-弹出拍照或者相册发图',
						value: 'pic_photo_or_album',
						description: '接收弹出拍照或者相册发图',
					},
					{
						name: '消息接收与发送-菜单事件-弹出微信相册发图器',
						value: 'pic_weixin',
						description: '接收弹出微信相册发图器',
					},
					{
						name: '消息接收与发送-菜单事件-弹出地理位置选择器',
						value: 'location_select',
						description: '接收弹出地理位置选择器',
					},
					{
						name: '消息接收与发送-事件消息-审批状态通知',
						value: 'open_approval_change',
						description: '接收审批状态通知',
					},
					{
						name: '消息接收与发送-事件消息-企业互联共享应用变更',
						value: 'share_agent_change',
						description: '接收企业互联共享应用变更',
					},
					{
						name: '消息接收与发送-事件消息-上下游共享应用变更',
						value: 'share_chain_change',
						description: '接收上下游共享应用变更',
					},
					{
						name: '消息接收与发送-模板卡片事件-按钮点击',
						value: 'template_card_event',
						description: '接收按钮点击',
					},
					{
						name: '消息接收与发送-模板卡片事件-右上角菜单点击',
						value: 'template_card_menu_event',
						description: '接收右上角菜单点击',
					},
					{
						name: '消息接收与发送-应用活跃事件-长期未使用应用停用预警',
						value: 'inactive_alert',
						description: '接收长期未使用应用停用预警',
					},
					{
						name: '消息接收与发送-应用活跃事件-长期未使用应用临时停用',
						value: 'close_inactive_agent',
						description: '接收长期未使用应用临时停用',
					},
					{
						name: '消息接收与发送-应用活跃事件-长期未使用应用重新启用',
						value: 'reopen_inactive_agent',
						description: '接收长期未使用应用重新启用',
					},
					{
						name: '消息接收与发送-应用活跃事件-应用低活跃预警',
						value: 'low_active_alert',
						description: '接收应用低活跃预警',
					},
					{
						name: '消息接收与发送-应用活跃事件-低活跃应用',
						value: 'low_active',
						description: '接收低活跃应用',
					},
					{
						name: '消息接收与发送-应用活跃事件-低活跃应用活跃恢复',
						value: 'active_restored',
						description: '接收低活跃应用活跃恢复',
					},
					{
						name: '通讯录管理-异步任务完成-增量更新成员',
						value: 'batch_job_result_sync_user',
						description: '接收增量更新成员',
					},
					{
						name: '通讯录管理-异步任务完成-全量覆盖成员',
						value: 'batch_job_result_replace_user',
						description: '接收全量覆盖成员',
					},
					{
						name: '通讯录管理-异步任务完成-邀请成员关注',
						value: 'batch_job_result_invite_user',
						description: '接收邀请成员关注',
					},
					{
						name: '通讯录管理-异步任务完成-全量覆盖部门',
						value: 'batch_job_result_replace_party',
						description: '接收全量覆盖部门',
					},
					{
						name: '通讯录变更通知',
						value: 'change_contact',
						description: '接收通讯录变更通知',
					},
					{
						name: '通讯录管理-成员变更-新增成员',
						value: 'change_contact_create_user',
						description: '接收新增成员',
					},
					{
						name: '通讯录管理-成员变更-更新成员',
						value: 'change_contact_update_user',
						description: '接收更新成员',
					},
					{
						name: '通讯录管理-成员变更-删除成员',
						value: 'change_contact_delete_user',
						description: '接收删除成员',
					},
					{
						name: '通讯录管理-部门变更-新增部门',
						value: 'change_contact_create_party',
						description: '接收新增部门',
					},
					{
						name: '通讯录管理-部门变更-更新部门',
						value: 'change_contact_update_party',
						description: '接收更新部门',
					},
					{
						name: '通讯录管理-部门变更-删除部门',
						value: 'change_contact_delete_party',
						description: '接收删除部门',
					},
					{
						name: '通讯录管理-标签变更-标签成员变更',
						value: 'change_contact_update_tag',
						description: '接收标签成员变更',
					},
					{
						name: '家校沟通-家校通讯录变更-成员变更',
						value: 'change_school_contact',
						description: '接收成员变更',
					},
					{
						name: '家校沟通-家校通讯录成员变更-新增学生',
						value: 'change_school_contact_create_student',
						description: '接收新增学生',
					},
					{
						name: '家校沟通-家校通讯录成员变更-编辑学生',
						value: 'change_school_contact_update_student',
						description: '接收编辑学生',
					},
					{
						name: '家校沟通-家校通讯录成员变更-删除学生',
						value: 'change_school_contact_delete_student',
						description: '接收删除学生',
					},
					{
						name: '家校沟通-家校通讯录成员变更-新增家长',
						value: 'change_school_contact_create_parent',
						description: '接收新增家长',
					},
					{
						name: '家校沟通-家校通讯录成员变更-编辑家长',
						value: 'change_school_contact_update_parent',
						description: '接收编辑家长',
					},
					{
						name: '家校沟通-家校通讯录成员变更-删除家长',
						value: 'change_school_contact_delete_parent',
						description: '接收删除家长',
					},
					{
						name: '家校沟通-家校通讯录成员变更-家长关注',
						value: 'change_school_contact_subscribe',
						description: '接收家长关注',
					},
					{
						name: '家校沟通-家校通讯录成员变更-家长取消关注',
						value: 'change_school_contact_unsubscribe',
						description: '接收家长取消关注',
					},
					{
						name: '家校沟通-家校通讯录部门变更-创建部门',
						value: 'change_school_contact_create_department',
						description: '接收创建部门',
					},
					{
						name: '家校沟通-家校通讯录部门变更-更新部门',
						value: 'change_school_contact_update_department',
						description: '接收更新部门',
					},
					{
						name: '家校沟通-家校通讯录部门变更-删除部门',
						value: 'change_school_contact_delete_department',
						description: '接收删除部门',
					},
					{
						name: '客户联系-外部联系人变更回调',
						value: 'change_external_contact',
						description: '接收外部联系人变更回调',
					},
					{
						name: '客户联系-外部联系人变更-添加企业客户',
						value: 'change_external_contact_add_external_contact',
						description: '接收添加企业客户',
					},
					{
						name: '客户联系-外部联系人变更-编辑企业客户',
						value: 'change_external_contact_edit_external_contact',
						description: '接收编辑企业客户',
					},
					{
						name: '客户联系-外部联系人变更-外部联系人免验证添加成员',
						value: 'change_external_contact_add_half_external_contact',
						description: '接收外部联系人免验证添加成员',
					},
					{
						name: '客户联系-外部联系人变更-删除企业客户',
						value: 'change_external_contact_del_external_contact',
						description: '接收删除企业客户',
					},
					{
						name: '客户联系-外部联系人变更-删除跟进成员',
						value: 'change_external_contact_del_follow_user',
						description: '接收删除跟进成员',
					},
					{
						name: '客户联系-外部联系人变更-客户接替失败',
						value: 'change_external_contact_transfer_fail',
						description: '接收客户接替失败',
					},
					{
						name: '客户联系-客户群变更回调',
						value: 'change_external_chat',
						description: '接收客户群变更回调',
					},
					{
						name: '客户联系-客户群变更-客户群创建',
						value: 'change_external_chat_create',
						description: '接收客户群创建',
					},
					{
						name: '客户联系-客户群变更-客户群变更',
						value: 'change_external_chat_update',
						description: '接收客户群变更',
					},
					{
						name: '客户联系-客户群变更-客户群解散',
						value: 'change_external_chat_dismiss',
						description: '接收客户群解散',
					},
					{
						name: '客户联系-企业客户标签变更回调',
						value: 'change_external_tag',
						description: '接收企业客户标签变更回调',
					},
					{
						name: '客户联系-企业客户标签变更-企业客户标签创建',
						value: 'change_external_tag_create',
						description: '接收企业客户标签创建',
					},
					{
						name: '客户联系-企业客户标签变更-企业客户标签变更',
						value: 'change_external_tag_update',
						description: '接收企业客户标签变更',
					},
					{
						name: '客户联系-企业客户标签变更-企业客户标签删除',
						value: 'change_external_tag_delete',
						description: '接收企业客户标签删除',
					},
					{
						name: '客户联系-企业客户标签变更-企业客户标签重排',
						value: 'change_external_tag_shuffle',
						description: '接收企业客户标签重排',
					},
					{
						name: '客户联系-获客助手事件通知',
						value: 'customer_acquisition',
						description: '接收获客助手事件通知',
					},
					{
						name: '客户联系-获客助手事件-企业使用量即将耗尽',
						value: 'customer_acquisition_balance_low',
						description: '接收企业使用量即将耗尽',
					},
					{
						name: '客户联系-获客助手事件-使用量已经耗尽',
						value: 'customer_acquisition_balance_exhausted',
						description: '接收使用量已经耗尽',
					},
					{
						name: '客户联系-获客助手事件-使用量增加',
						value: 'customer_acquisition_balance_increased',
						description: '接收使用量增加',
					},
					{
						name: '客户联系-获客助手事件-获客链接异常',
						value: 'customer_acquisition_link_unavailable',
						description: '接收获客链接异常',
					},
					{
						name: '客户联系-获客助手事件-删除获客链接',
						value: 'customer_acquisition_delete_link',
						description: '接收删除获客链接',
					},
					{
						name: '客户联系-获客助手事件-获客使用量即将过期',
						value: 'customer_acquisition_quota_expire_soon',
						description: '接收获客使用量即将过期',
					},
					{
						name: '客户联系-获客助手事件-微信客户打开获客链接',
						value: 'customer_acquisition_open_profile',
						description: '接收微信客户打开获客链接',
					},
					{
						name: '客户联系-获客助手事件-通过获客链接发起好友请求',
						value: 'customer_acquisition_friend_request',
						description: '接收通过获客链接发起好友请求',
					},
					{
						name: '客户联系-获客助手事件-成员首次收消息',
						value: 'customer_acquisition_customer_start_chat',
						description: '接收成员首次收消息',
					},
					{
						name: '客户联系-获客助手事件-成员多次收消息',
						value: 'customer_acquisition_message_from_customer',
						description: '接收成员多次收消息',
					},
					{
						name: '微信客服-会话分配与消息收发-接收消息和事件',
						value: 'kf_msg_or_event',
						description: '接收微信客服消息和事件通知',
					},
					{
						name: '微信客服-回调通知-客服账号授权变更',
						value: 'kf_account_auth_change',
						description: '接收客服账号授权变更',
					},
					{
						name: '上下游-异步任务完成-导入上下游联系人',
						value: 'batch_job_result_import_chain_contact',
						description: '接收导入上下游联系人',
					},
					{
						name: '上下游-上下游变更回调',
						value: 'change_chain',
						description: '接收上下游变更回调',
					},
					{
						name: '上下游-上下游变更-创建上下游空间',
						value: 'change_chain_create_chain',
						description: '接收创建上下游空间',
					},
					{
						name: '上下游-上下游变更-更新上下游空间',
						value: 'change_chain_update_chain',
						description: '接收更新上下游空间',
					},
					{
						name: '上下游-上下游变更-删除上下游空间',
						value: 'change_chain_delete_chain',
						description: '接收删除上下游空间',
					},
					{
						name: '上下游-上下游变更-新增上下游分组',
						value: 'change_chain_create_group',
						description: '接收新增上下游分组',
					},
					{
						name: '上下游-上下游变更-更新上下游分组',
						value: 'change_chain_update_group',
						description: '接收更新上下游分组',
					},
					{
						name: '上下游-上下游变更-删除上下游分组',
						value: 'change_chain_delete_group',
						description: '接收删除上下游分组',
					},
					{
						name: '上下游-上下游变更-企业加入上下游',
						value: 'change_chain_corp_join',
						description: '接收企业加入上下游',
					},
					{
						name: '上下游-上下游变更-更新企业',
						value: 'change_chain_update_corp',
						description: '接收更新企业',
					},
					{
						name: '上下游-上下游变更-移除企业',
						value: 'change_chain_remove_corp',
						description: '接收移除企业',
					},
					{
						name: '安全管理-回调通知-企业微信域名IP变更',
						value: 'security_change_domain_ip',
						description: '接收企业微信域名IP变更',
					},
					{
						name: '接口许可失效通知',
						value: 'unlicensed_notify',
						description: '接收接口许可失效通知',
					},
					{
						name: '异步任务完成通知',
						value: 'batch_job_result',
						description: '接收异步任务完成通知',
					},
				],
				default: ['*'],
				required: true,
				description: '选择要接收的消息和事件类型',
			},
			{
				displayName: '返回原始数据',
				name: 'returnRawData',
				type: 'boolean',
				default: false,
				description: '是否返回未解析的原始XML数据',
				hint: '开启后会在输出中包含原始的 XML 字符串（解密后的XML）',
			},
			{
				displayName: '自动恢复原生 HITL 审批',
				name: 'autoResumeNativeHitl',
				type: 'boolean',
				default: true,
				description:
					'是否自动识别由本插件生成的原生审批按钮事件，并恢复对应的 n8n 等待执行',
				hint: '仅处理带有有效签名的 n8n HITL EventKey；普通模板卡片事件不受影响',
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
		const crypto = new WeComCrypto(encodingAESKey, corpId);
		const decryptedMsg = crypto.decrypt(Encrypt, this.getNode());

		// 解析解密后的 XML 消息
		const messageData = parseXML(decryptedMsg);

		// 过滤事件类型
		const events = this.getNodeParameter('events', []) as string[];
		const msgType = messageData.MsgType || 'unknown';
		const eventType = messageData.Event || 'unknown';
		let nativeHitlResult: IDataObject | undefined;
		let nativeHitlResponse = 'success';
		const autoResumeNativeHitl = this.getNodeParameter('autoResumeNativeHitl', true) as boolean;

		if (autoResumeNativeHitl && eventType === 'template_card_event') {
			const callbackUrl = this.getNodeWebhookUrl('default') ?? this.getInstanceBaseUrl();
			const eventKeyResult = parseNativeHitlEventKey(
				messageData.EventKey || '',
				messageData.TaskId || '',
				token,
				callbackUrl,
			);

			if (eventKeyResult.recognized && !eventKeyResult.valid) {
				nativeHitlResult = {
					status: 'invalid',
					reason: eventKeyResult.reason,
				};
			} else if (eventKeyResult.recognized && eventKeyResult.valid) {
				const callbackContext = {
					approved: eventKeyResult.payload.approved,
					selectedOption: eventKeyResult.payload.selectedOption,
					selectedLabel: eventKeyResult.payload.selectedLabel,
					respondedBy: messageData.FromUserName || '',
					responseCode: messageData.ResponseCode || '',
					taskId: messageData.TaskId || '',
				};

				try {
					await this.helpers.httpRequest({
						method: 'GET',
						url: eventKeyResult.payload.resumeUrl,
						headers: createNativeHitlContextHeaders(callbackContext, token),
						disableFollowRedirect: true,
						timeout: 3000,
					});

					nativeHitlResult = {
						status: 'resumed',
						approved: eventKeyResult.payload.approved,
						...(eventKeyResult.payload.selectedOption
							? { selectedOption: eventKeyResult.payload.selectedOption }
							: {}),
						...(eventKeyResult.payload.selectedLabel
							? { selectedLabel: eventKeyResult.payload.selectedLabel }
							: {}),
						respondedBy: callbackContext.respondedBy,
						taskId: callbackContext.taskId,
						responseCode: callbackContext.responseCode,
					};

					const isDefaultOption = !eventKeyResult.payload.isCustomOption;
					const selectedLabel = (
						eventKeyResult.payload.selectedLabel || eventKeyResult.payload.selectedOption
					)?.replace(/]]>/g, ']]]]><![CDATA[>');
					const resultTitle = isDefaultOption
						? eventKeyResult.payload.approved
							? '审批已通过'
							: '审批已拒绝'
						: `已选择：${selectedLabel}`;
					const replaceText = isDefaultOption
						? eventKeyResult.payload.approved
							? '已通过'
							: '已拒绝'
						: `已选择：${selectedLabel}`;
					const replyMessage = generateReplyMessageXML(
						callbackContext.respondedBy,
						messageData.ToUserName || corpId,
						'update_template_card',
						{
							TemplateCard: {
								CardType: 'button_interaction',
								MainTitle: {
									title: resultTitle,
									desc: `操作人：${callbackContext.respondedBy}`,
								},
								SubTitleText: 'n8n 工作流已恢复执行',
								TaskId: callbackContext.taskId,
								ReplaceText: replaceText,
							},
						},
					);
					nativeHitlResponse = generateEncryptedResponseXML(
						crypto,
						token,
						replyMessage,
						this.getNode(),
					);
				} catch {
					nativeHitlResult = {
						status: 'failed',
						reason: '等待执行不存在、已处理或已超时',
						taskId: callbackContext.taskId,
					};
				}
			}
		}

		const changeType = messageData.ChangeType || '';
		const jobType = messageData.JobType || '';
		const specificChangeContactEvent =
			eventType === 'change_contact' && changeType
				? `change_contact_${changeType}`
				: '';
		const specificChangeChainEvent =
			eventType === 'change_chain' && changeType
				? `change_chain_${changeType}`
				: '';
		const specificExternalContactEvent =
			eventType === 'change_external_contact' && changeType
				? `change_external_contact_${changeType}`
				: '';
		const specificExternalChatEvent =
			eventType === 'change_external_chat' && changeType
				? `change_external_chat_${changeType}`
				: '';
		const specificExternalTagEvent =
			eventType === 'change_external_tag' && changeType
				? `change_external_tag_${changeType}`
				: '';
		const specificCustomerAcquisitionEvent =
			eventType === 'customer_acquisition' && changeType
				? `customer_acquisition_${changeType}`
				: '';
		const normalizedSchoolContactChangeType =
			eventType === 'change_school_contact'
				? String(changeType).replace('deparmtment', 'department')
				: '';
		const specificSchoolContactEvent =
			eventType === 'change_school_contact' && normalizedSchoolContactChangeType
				? `change_school_contact_${normalizedSchoolContactChangeType}`
				: '';
		const specificSecurityEvent =
			eventType === 'security' && changeType
				? `security_${changeType}`
				: '';
		const specificBatchJobEvent =
			eventType === 'batch_job_result' && jobType
				? `batch_job_result_${jobType}`
				: '';

		// 检查是否匹配：支持按消息类型（MsgType）或事件类型（Event）过滤
		const shouldProcess =
			events.includes('*') ||
			events.includes(msgType) ||
			events.includes(eventType) ||
			(specificChangeContactEvent !== '' && events.includes(specificChangeContactEvent)) ||
			(specificChangeChainEvent !== '' && events.includes(specificChangeChainEvent)) ||
			(specificExternalContactEvent !== '' && events.includes(specificExternalContactEvent)) ||
			(specificExternalChatEvent !== '' && events.includes(specificExternalChatEvent)) ||
			(specificExternalTagEvent !== '' && events.includes(specificExternalTagEvent)) ||
			(specificCustomerAcquisitionEvent !== '' && events.includes(specificCustomerAcquisitionEvent)) ||
			(specificSchoolContactEvent !== '' && events.includes(specificSchoolContactEvent)) ||
			(specificSecurityEvent !== '' && events.includes(specificSecurityEvent)) ||
			(specificBatchJobEvent !== '' && events.includes(specificBatchJobEvent)) ||
			// 如果选择了"事件消息"（event），则接收所有事件类型
			(msgType === 'event' && events.includes('event'));

		if (!shouldProcess) {
			// 不处理此类型的消息，返回 success
			return {
				webhookResponse: nativeHitlResponse,
			};
		}

		// 准备返回数据
		const returnRawData = this.getNodeParameter('returnRawData', false) as boolean;
		const outputData: IDataObject = {
			...messageData,
			receivedAt: new Date().toISOString(),
			...(nativeHitlResult ? { hitlResume: nativeHitlResult } : {}),
		};

		if (returnRawData) {
			outputData.rawXML = decryptedMsg;
		}

		// 返回数据并响应 success
		return {
			workflowData: [
				[
					{
						json: outputData,
					},
				],
			],
			webhookResponse: nativeHitlResponse,
		};
	}
}
