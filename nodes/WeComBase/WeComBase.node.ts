import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { messageDescription } from '../WeCom/resources/message';
import { contactDescription } from '../WeCom/resources/contact';
import { materialDescription } from '../WeCom/resources/material';
import { appChatDescription } from '../WeCom/resources/appChat';
import { linkedcorpDescription } from '../WeCom/resources/linkedcorp';
import { pushMessageDescription } from '../WeCom/resources/pushMessage';
import { systemDescription } from '../WeCom/resources/system';
import { invoiceDescription } from '../WeCom/resources/invoice';
import { passiveReplyDescription } from '../WeCom/resources/passiveReply';
import { aibotPassiveReplyDescription } from '../WeCom/resources/aibotPassiveReply';
import { agentDescription } from '../WeCom/resources/agent';
import { appAuthDescription } from '../WeCom/resources/appAuth';
import { licenseDescription } from '../WeCom/resources/license';
import { paytoolDescription } from '../WeCom/resources/paytool';
import { externalpayDescription } from '../WeCom/resources/externalpay';
import { miniapppayDescription } from '../WeCom/resources/miniapppay';
import { mchpayDescription } from '../WeCom/resources/mchpay';
import { chatdataDescription } from '../WeCom/resources/chatdata';
import { msgauditDescription } from '../WeCom/resources/msgaudit';
import { promotionQrcodeDescription } from '../WeCom/resources/promotionQrcode';
import { accountIdDescription } from '../WeCom/resources/accountId';
import { fileDescription } from '../WeCom/resources/file';
import { securityDescription } from '../WeCom/resources/security';
import { executeMessage } from '../WeCom/resources/message/execute';
import { executeContact } from '../WeCom/resources/contact/execute';
import { executeMaterial } from '../WeCom/resources/material/execute';
import { executeAppChat } from '../WeCom/resources/appChat/execute';
import { executeLinkedcorp } from '../WeCom/resources/linkedcorp/execute';
import { executePushMessage } from '../WeCom/resources/pushMessage/execute';
import { executeSystem } from '../WeCom/resources/system/execute';
import { executeInvoice } from '../WeCom/resources/invoice/execute';
import { executePassiveReply } from '../WeCom/resources/passiveReply/execute';
import { executeAIBotPassiveReply } from '../WeCom/resources/aibotPassiveReply/execute';
import { executeAgent } from '../WeCom/resources/agent/execute';
import { executeAppAuth } from '../WeCom/resources/appAuth/execute';
import { executeLicense } from '../WeCom/resources/license/execute';
import { executePaytool } from '../WeCom/resources/paytool/execute';
import { executeExternalpay } from '../WeCom/resources/externalpay/execute';
import { executeMiniapppay } from '../WeCom/resources/miniapppay/execute';
import { executeMchpay } from '../WeCom/resources/mchpay/execute';
import { executeChatdata } from '../WeCom/resources/chatdata/execute';
import { executeMsgaudit } from '../WeCom/resources/msgaudit/execute';
import { executePromotionQrcode } from '../WeCom/resources/promotionQrcode/execute';
import { executeAccountId } from '../WeCom/resources/accountId/execute';
import { executeFile } from '../WeCom/resources/file/execute';
import { executeSecurity } from '../WeCom/resources/security/execute';
import { weComApiRequest } from '../WeCom/shared/transport';

export class WeComBase implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信-基础 (WeCom)',
		name: 'weComBase',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['transform'],
		version: 1,
		subtitle:
			'={{$parameter["resource"] === "passiveReply" ? "reply: " + $parameter["resource"] : ($parameter["resource"] === "system" ? $parameter["resource"] : $parameter["operation"] + ": " + $parameter["resource"])}}',
		description:
			'企业微信基础功能 - 通讯录、应用消息、群聊、消息推送、企业互联、素材、系统、电子发票、第三方应用授权、接口调用许可、收银台、对外收款、小程序对外收款、企业红包/向员工付款、数据与智能专区、会话内容存档、推广二维码、账号ID、安全管理',
		defaults: {
			name: '企业微信-基础',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'weComApi',
				required: true,
				displayOptions: {
					show: {
						resource: [
							'message',
							'appChat',
							'contact',
							'material',
							'linkedcorp',
							'system',
							'invoice',
							'agent',
							'accountId',
							'security',
							'externalpay',
							'miniapppay',
							'chatdata',
							'msgaudit',
						],
					},
				},
			},
			{
				name: 'weComWebhookApi',
				required: true,
				displayOptions: {
					show: {
						resource: ['pushMessage'],
					},
				},
			},
			{
				// 被动回复不需要凭证，因为加密信息从输入数据中获取
				name: 'weComApi',
				required: false,
				displayOptions: {
					show: {
						resource: ['passiveReply'],
					},
				},
			},
			{
				// 智能机器人被动回复不需要凭证，因为使用response_url回复
				name: 'weComApi',
				required: false,
				displayOptions: {
					show: {
						resource: ['aibotPassiveReply'],
					},
				},
			},
			{
				// 应用授权不需要 weComApi 凭证，因为使用的是 suite_id/suite_secret
				name: 'weComApi',
				required: false,
				displayOptions: {
					show: {
						resource: ['appAuth'],
					},
				},
			},
			{
				// 接口调用许可不需要 weComApi 凭证，因为使用的是 provider_access_token
				name: 'weComApi',
				required: false,
				displayOptions: {
					show: {
						resource: ['license'],
					},
				},
			},
			{
				// 第三方应用收银台不需要 weComApi 凭证，因为使用的是 provider_access_token
				name: 'weComApi',
				required: false,
				displayOptions: {
					show: {
						resource: ['paytool'],
					},
				},
			},
			{
				// 企业红包 / 向员工付款：商户 XML + 双向证书
				name: 'weComMchPayApi',
				required: true,
				displayOptions: {
					show: {
						resource: ['mchpay'],
					},
				},
			},
			{
				// 第三方应用推广二维码不需要 weComApi 凭证，因为使用的是 provider_access_token
				name: 'weComApi',
				required: false,
				displayOptions: {
					show: {
						resource: ['promotionQrcode'],
					},
				},
			},
			{
				// 文件解密可以使用 weComReceiveApi 凭证获取 EncodingAESKey
				name: 'weComReceiveApi',
				required: false,
				displayOptions: {
					show: {
						resource: ['file'],
					},
				},
			},
		],
		requestDefaults: {
			baseURL: 'https://qyapi.weixin.qq.com',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: '资源',
				name: 'resource',
				type: 'options',
				noDataExpression: true,

				options: [
					{
						name: '通讯录管理',
						value: 'contact',
						description: '通讯录管理（成员、部门、标签等）',
					},
					{
						name: '应用消息',
						value: 'message',
						description: '应用消息管理（文本、图片、文件、图文等）',
					},
					{
						name: '群聊会话',
						value: 'appChat',
						description: '群聊会话管理（创建群聊、更新群聊、群消息等）',
					},
					{
						name: '消息推送',
						value: 'pushMessage',
						description: '消息推送管理（群机器人文本、图片、图文、文件等）',
					},
					{
						name: '被动回复',
						value: 'passiveReply',
						description: '被动回复管理（文本、图片、图文等，需配合消息接收触发器）',
					},
					{
						name: '智能机器人被动回复',
						value: 'aibotPassiveReply',
						description: '智能机器人被动回复管理（欢迎语、流式回复、模板卡片等，需配合机器人触发器）',
					},
					{
						name: '企业互联',
						value: 'linkedcorp',
						description: '企业互联与上下游管理（企业信息、应用共享、对接规则等）',
					},
					{
						name: '素材管理',
						value: 'material',
						description: '素材管理（临时素材、图片上传、素材获取等）',
					},
					{
						name: '系统信息',
						value: 'system',
						description: '系统信息管理（接口 IP、回调 IP、访问凭证等）',
					},
					{
						name: '电子发票',
						value: 'invoice',
						description: '电子发票管理（查询发票、更新报销状态等）',
					},
					{
						name: '应用管理',
						value: 'agent',
						description: '应用管理（应用信息、菜单、工作台等）',
					},
					{
						name: '第三方应用授权',
						value: 'appAuth',
						description: '第三方应用授权管理（授权码、企业授权信息等）',
					},
					{
						name: '第三方应用接口调用许可',
						value: 'license',
						description: '接口调用许可管理（下单、激活账号、续期等）',
					},
					{
						name: '第三方应用收银台',
						value: 'paytool',
						description: '第三方应用收银台管理（创建订单、查询订单等）',
					},
					{
						name: '对外收款',
						value: 'externalpay',
						description: '对外收款管理（商户号、收款记录、资金流水等）',
					},
					{
						name: '小程序对外收款',
						value: 'miniapppay',
						description: '小程序对外收款管理（下单、退款、账单、进件等）',
					},
					{
						name: '企业红包与向员工付款',
						value: 'mchpay',
						description: '企业支付管理（企业红包、向员工付款及查询等）',
					},
					{
						name: '数据与智能专区',
						value: 'chatdata',
						description: '数据与智能专区管理（公钥、回调、专区程序、调试等）',
					},
					{
						name: '会话内容存档',
						value: 'msgaudit',
						description: '会话内容存档管理（开启成员、同意情况、内部群、机器人等）',
					},
					{
						name: '第三方应用推广二维码',
						value: 'promotionQrcode',
						description: '推广二维码管理（获取注册码等）',
					},
					{
						name: '账号 ID',
						value: 'accountId',
						description: '账号 ID 转换管理（成员 ID、外部联系人 ID 等）',
					},
					{
						name: '文件解密',
						value: 'file',
						description: '加密文件解密管理（解密回调加密文件等）',
					},
					{
						name: '安全管理',
						value: 'security',
						description: '安全管理（文件防泄漏、设备与操作日志等）',
					},
				],
				default: 'pushMessage',
			},
			...contactDescription,
			...messageDescription,
			...appChatDescription,
			...pushMessageDescription,
			...passiveReplyDescription,
			...aibotPassiveReplyDescription,
			...linkedcorpDescription,
			...materialDescription,
			...systemDescription,
			...invoiceDescription,
			...agentDescription,
			...appAuthDescription,
			...licenseDescription,
			...paytoolDescription,
			...externalpayDescription,
			...miniapppayDescription,
			...mchpayDescription,
			...chatdataDescription,
			...msgauditDescription,
			...promotionQrcodeDescription,
			...accountIdDescription,
			...fileDescription,
			...securityDescription,
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			// 获取部门列表
			async getDepartments(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await weComApiRequest.call(this, 'GET', '/cgi-bin/department/list', {});
				const departments = response.department as Array<{ id: number; name: string }>;
				return departments.map((dept) => ({
					name: dept.name,
					value: dept.id.toString(),
				}));
			},

			// 获取部门成员列表
			async getDepartmentUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const departmentId = (this.getNodeParameter('department_id', 0) as string) || '1';
				const response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/user/simplelist',
					{},
					{
						department_id: departmentId,
						fetch_child: 0,
					},
				);
				const users = response.userlist as Array<{ userid: string; name: string }>;
				return users.map((user) => ({
					name: `${user.name} (${user.userid})`,
					value: user.userid,
				}));
			},

			// 获取部门成员详情列表
			async getDepartmentUsersDetail(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const departmentId = (this.getNodeParameter('department_id', 0) as string) || '1';
				const response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/user/list',
					{},
					{
						department_id: departmentId,
						fetch_child: 0,
					},
				);
				const users = response.userlist as Array<{
					userid: string;
					name: string;
					position?: string;
				}>;
				return users.map((user) => ({
					name: user.position
						? `${user.name} - ${user.position} (${user.userid})`
						: `${user.name} (${user.userid})`,
					value: user.userid,
				}));
			},

			// 获取标签列表
			async getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await weComApiRequest.call(this, 'GET', '/cgi-bin/tag/list', {});
				const tags = response.taglist as Array<{ tagid: number; tagname: string }>;
				return tags.map((tag) => ({
					name: tag.tagname,
					value: tag.tagid.toString(),
				}));
			},

			// 获取标签成员列表
			async getTagUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const tagId = this.getNodeParameter('tagid', 0) as string;
				const response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/tag/get',
					{},
					{
						tagid: tagId,
					},
				);
				const users = response.userlist as Array<{ userid: string; name: string }>;
				return users.map((user) => ({
					name: `${user.name} (${user.userid})`,
					value: user.userid,
				}));
			},

			// 获取所有成员列表（从根部门递归获取）
			async getAllUsers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/user/list',
					{},
					{
						department_id: '1',
						fetch_child: 1,
					},
				);
				const users = response.userlist as Array<{
					userid: string;
					name: string;
					department?: number[];
				}>;
				return users.map((user) => ({
					name: `${user.name} (${user.userid})`,
					value: user.userid,
				}));
			},

			async getAllUsersWithAllOption(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/user/list',
					{},
					{
						department_id: '1',
						fetch_child: 1,
					},
				);
				const users = response.userlist as Array<{
					userid: string;
					name: string;
					department?: number[];
				}>;

				return [
					{
						name: '所有人 (@all)',
						value: '@all',
					},
					...users.map((user) => ({
						name: `${user.name} (${user.userid})`,
						value: user.userid,
					})),
				];
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0);

		let returnData: INodeExecutionData[] = [];

		if (resource === 'system') {
			// System resource doesn't have an operation parameter
			for (let i = 0; i < items.length; i++) {
				const responseData = await executeSystem.call(this, i);
				returnData.push({ json: responseData[0] });
			}
		} else if (resource === 'passiveReply') {
			// passiveReply only has 'reply' operation, use it directly
			returnData = await executePassiveReply.call(this, 'reply', items);
		} else if (resource === 'aibotPassiveReply') {
			// aibotPassiveReply has operation parameter
			const operation = this.getNodeParameter('operation', 0) as string;
			returnData = await executeAIBotPassiveReply.call(this, operation, items);
		} else {
			// All other resources have an operation parameter
			const operation = this.getNodeParameter('operation', 0) as string;

			if (resource === 'contact') {
				returnData = await executeContact.call(this, operation, items);
			} else if (resource === 'message') {
				returnData = await executeMessage.call(this, operation, items);
			} else if (resource === 'appChat') {
				returnData = await executeAppChat.call(this, operation, items);
			} else if (resource === 'pushMessage') {
				returnData = await executePushMessage.call(this, operation, items);
			} else if (resource === 'linkedcorp') {
				returnData = await executeLinkedcorp.call(this, operation, items);
			} else if (resource === 'material') {
				returnData = await executeMaterial.call(this, operation, items);
			} else if (resource === 'invoice') {
				returnData = await executeInvoice.call(this, operation, items);
			} else if (resource === 'agent') {
				returnData = await executeAgent.call(this, operation, items);
			} else if (resource === 'appAuth') {
				returnData = await executeAppAuth.call(this, operation, items);
			} else if (resource === 'license') {
				returnData = await executeLicense.call(this, operation, items);
			} else if (resource === 'paytool') {
				returnData = await executePaytool.call(this, operation, items);
			} else if (resource === 'externalpay') {
				returnData = await executeExternalpay.call(this, operation, items);
			} else if (resource === 'miniapppay') {
				returnData = await executeMiniapppay.call(this, operation, items);
			} else if (resource === 'mchpay') {
				returnData = await executeMchpay.call(this, operation, items);
			} else if (resource === 'chatdata') {
				returnData = await executeChatdata.call(this, operation, items);
			} else if (resource === 'msgaudit') {
				returnData = await executeMsgaudit.call(this, operation, items);
			} else if (resource === 'promotionQrcode') {
				returnData = await executePromotionQrcode.call(this, operation, items);
			} else if (resource === 'accountId') {
				returnData = await executeAccountId.call(this, operation, items);
			} else if (resource === 'file') {
				returnData = await executeFile.call(this, operation, items);
			} else if (resource === 'security') {
				for (let i = 0; i < items.length; i++) {
					const responseData = await executeSecurity.call(this, i);
					returnData.push({ json: responseData[0], pairedItem: { item: i } });
				}
			}
		}

		return [returnData];
	}
}
