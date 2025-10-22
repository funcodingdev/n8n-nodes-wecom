import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';
import { kfDescription } from '../WeCom/resources/kf';
import { executeKf } from '../WeCom/resources/kf/execute';

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

