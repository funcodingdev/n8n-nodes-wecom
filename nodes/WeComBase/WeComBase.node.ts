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
import { externalContactDescription } from '../WeCom/resources/externalContact';
import { invoiceDescription } from '../WeCom/resources/invoice';
import { executeMessage } from '../WeCom/resources/message/execute';
import { executeContact } from '../WeCom/resources/contact/execute';
import { executeMaterial } from '../WeCom/resources/material/execute';
import { executeAppChat } from '../WeCom/resources/appChat/execute';
import { executeLinkedcorp } from '../WeCom/resources/linkedcorp/execute';
import { executePushMessage } from '../WeCom/resources/pushMessage/execute';
import { executeSystem } from '../WeCom/resources/system/execute';
import { executeExternalContact } from '../WeCom/resources/externalContact/execute';
import { executeInvoice } from '../WeCom/resources/invoice/execute';
import { weComApiRequest } from '../WeCom/shared/transport';

export class WeComBase implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信-基础',
		name: 'weComBase',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: '企业微信基础功能 - 通讯录、应用消息、群聊、消息推送、企业互联、素材、系统、客户联系、电子发票',
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
							'externalContact',
							'invoice',
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
				// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
				options: [
					{
						name: '通讯录',
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
						name: '系统',
						value: 'system',
						description: '获取企业微信系统信息（IP段等）',
					},
					{
						name: '客户联系',
						value: 'externalContact',
						description: '客户联系管理（客户、标签、继承、客户群、朋友圈、群发等）',
					},
					{
						name: '电子发票',
						value: 'invoice',
						description: '电子发票管理（查询、更新发票状态）',
					},
				],
				default: 'pushMessage',
			},
		...contactDescription,
		...messageDescription,
		...appChatDescription,
		...pushMessageDescription,
		...linkedcorpDescription,
		...materialDescription,
		...systemDescription,
		...externalContactDescription,
		...invoiceDescription,
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
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		let returnData: INodeExecutionData[] = [];

		if (resource === 'contact') {
			returnData = await executeContact.call(this, operation as string, items);
		} else if (resource === 'message') {
			returnData = await executeMessage.call(this, operation as string, items);
		} else if (resource === 'appChat') {
			returnData = await executeAppChat.call(this, operation as string, items);
		} else if (resource === 'pushMessage') {
			returnData = await executePushMessage.call(this, operation as string, items);
		} else if (resource === 'linkedcorp') {
			returnData = await executeLinkedcorp.call(this, operation as string, items);
		} else if (resource === 'material') {
			returnData = await executeMaterial.call(this, operation as string, items);
		} else if (resource === 'system') {
			for (let i = 0; i < items.length; i++) {
				const responseData = await executeSystem.call(this, i);
				returnData.push({ json: responseData[0] });
			}
		} else if (resource === 'externalContact') {
			returnData = await executeExternalContact.call(this, operation as string, items);
		} else if (resource === 'invoice') {
			returnData = await executeInvoice.call(this, operation as string, items);
		}

		return [returnData];
	}
}

