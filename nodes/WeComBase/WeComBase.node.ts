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
			'企业微信基础功能 - 通讯录、应用消息、群聊、消息推送、企业互联、素材、系统、电子发票、第三方应用授权、第三方应用接口调用许可、第三方应用收银台、第三方应用推广二维码、账号ID、安全管理',
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
						description: '管理企业通讯录（成员、部门、标签）',
					},
					{
						name: '应用消息',
						value: 'message',
						description: '发送各类应用消息（文本、图片、文件等）',
					},
					{
						name: '群聊会话',
						value: 'appChat',
						description: '管理群聊会话和发送消息到群聊',
					},
					{
						name: '消息推送',
						value: 'pushMessage',
						description: '通过群机器人 Webhook 发送消息到群聊',
					},
					{
						name: '被动回复',
						value: 'passiveReply',
						description: '被动回复企业微信消息（需配合「企业微信消息接收（被动回复）触发器」使用）',
					},
					{
						name: '智能机器人被动回复',
						value: 'aibotPassiveReply',
						description: '被动回复智能机器人消息（需配合「企业微信智能机器人消息接收触发器」使用）',
					},
					{
						name: '企业互联',
						value: 'linkedcorp',
						description: '企业互联和上下游管理',
					},
					{
						name: '素材管理',
						value: 'material',
						description: '上传和管理素材文件',
					},
					{
						name: '系统信息',
						value: 'system',
						description: '获取企业微信系统信息（接口IP段、回调IP段、Access Token）',
					},
					{
						name: '电子发票',
						value: 'invoice',
						description: '电子发票管理（查询、更新发票状态）',
					},
					{
						name: '应用管理',
						value: 'agent',
						description: '管理企业应用（获取、设置应用信息）',
					},
					{
						name: '第三方应用授权',
						value: 'appAuth',
						description: '获取第三方应用凭证（suite_access_token）',
					},
					{
						name: '第三方应用接口调用许可',
						value: 'license',
						description: '接口调用许可管理（下单购买账号）',
					},
					{
						name: '第三方应用收银台',
						value: 'paytool',
						description: '第三方应用收银台（创建收款订单）',
					},
					{
						name: '对外收款',
						value: 'externalpay',
						description: '企业对外收款（商户号、收款记录、资金流水）',
					},
					{
						name: '小程序对外收款',
						value: 'miniapppay',
						description: '小程序接入对外收款（下单、退款、账单）',
					},
					{
						name: '第三方应用推广二维码',
						value: 'promotionQrcode',
						description: '第三方应用推广二维码（获取注册码）',
					},
					{
						name: '账号 ID',
						value: 'accountId',
						description: '自建应用与第三方应用的对接（userid转换、external_userid转换）',
					},
					{
						name: '文件解密',
						value: 'file',
						description: '解密接收到的加密文件',
					},
					{
						name: '安全管理',
						value: 'security',
						description: '文件防泄漏等安全管理功能',
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
