import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { messageDescription } from './resources/message';
import { contactDescription } from './resources/contact';
import { materialDescription } from './resources/material';
import { executeMessage } from './resources/message/execute';
import { executeContact } from './resources/contact/execute';
import { executeMaterial } from './resources/material/execute';
import { weComApiRequest } from './shared/transport';

export class WeCom implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信',
		name: 'weCom',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: '企业微信API接口汇总',
		defaults: {
			name: '企业微信',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'weComApi',
				required: true,
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
						name: '消息',
						value: 'message',
						description: '发送各类消息（文本、图片、文件等）',
					},
					{
						name: '通讯录',
						value: 'contact',
						description: '获取通讯录信息（成员、部门）',
					},
					{
						name: '素材管理',
						value: 'material',
						description: '上传和管理素材文件',
					},
				],
				default: 'message',
			},
			...messageDescription,
			...contactDescription,
			...materialDescription,
		],
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
				const users = response.userlist as Array<{ userid: string; name: string; position?: string }>;
				return users.map((user) => ({
					name: user.position ? `${user.name} - ${user.position} (${user.userid})` : `${user.name} (${user.userid})`,
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
				const users = response.userlist as Array<{ userid: string; name: string; department?: number[] }>;
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

		if (resource === 'message') {
			returnData = await executeMessage.call(this, operation as string, items);
		} else if (resource === 'contact') {
			returnData = await executeContact.call(this, operation as string, items);
		} else if (resource === 'material') {
			returnData = await executeMaterial.call(this, operation as string, items);
		}

		return [returnData];
	}
}

