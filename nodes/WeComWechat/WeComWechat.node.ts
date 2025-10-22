import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { kfDescription } from '../WeCom/resources/kf';
import { executeKf } from '../WeCom/resources/kf/execute';
import { weComApiRequest } from '../WeCom/shared/transport';

export class WeComWechat implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信-连接微信',
		name: 'weComWechat',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: '企业微信连接微信功能 - 微信客服',
		defaults: {
			name: '企业微信-连接微信',
		},
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
						name: '微信客服',
						value: 'kf',
						description: '管理微信客服（客服账号、接待人员、消息收发等）',
					},
				],
				default: 'kf',
			},
			...kfDescription,
		],
		usableAsTool: true,
	};

	methods = {
		loadOptions: {
			// 获取客服账号列表
			async getKfAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					const response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/kf/account/list',
						{},
					);

					const accounts = response.account_list as Array<{
						open_kfid: string;
						name: string;
						avatar?: string;
					}>;

					if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
						return [
							{
								name: '暂无客服账号，请先创建',
								value: '',
							},
						];
					}

					return accounts.map((account) => ({
						name: account.name,
						value: account.open_kfid,
						description: account.open_kfid,
					}));
					// eslint-disable-next-line @typescript-eslint/no-unused-vars
				} catch (error) {
					return [
						{
							name: '获取客服账号列表失败',
							value: '',
						},
					];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		let returnData: INodeExecutionData[] = [];

		if (resource === 'kf') {
			returnData = await executeKf.call(this, operation as string, items);
		}

		return [returnData];
	}
}

