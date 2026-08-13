import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['paytool'],
	operation: ['getBillList'],
};

export const getBillListDescription: INodeProperties[] = [
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '获客助手组件的应用凭证（suite_access_token）',
	},
	{
		displayName: '开始时间',
		name: 'beginTime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '流水记录开始时间（秒）',
	},
	{
		displayName: '结束时间',
		name: 'endTime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '流水记录结束时间（秒），起止间隔不能超过31天',
	},
	{
		displayName: '授权企业 CorpID',
		name: 'authCorpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填',
	},
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
			numberStepSize: 1,
		},
		displayOptions: {
			show: showOnly,
		},
		default: 100,
		description: '返回的最大记录数，默认值100，最大不超过1000',
	},
];
