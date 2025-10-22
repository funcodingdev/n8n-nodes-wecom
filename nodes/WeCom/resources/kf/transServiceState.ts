import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTransServiceState = {
	resource: ['kf'],
	operation: ['transServiceState'],
};

export const transServiceStateDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForTransServiceState,
		},
		default: '',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		hint: '客服账号',
	},
	{
		displayName: '外部联系人ID',
		name: 'external_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForTransServiceState,
		},
		default: '',
		hint: '客户UserID',
	},
	{
		displayName: '服务状态',
		name: 'service_state',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForTransServiceState,
		},
		options: [
			{
				name: '未处理',
				value: 0,
			},
			{
				name: '由智能助手接待',
				value: 1,
			},
			{
				name: '待Human接待',
				value: 2,
			},
			{
				name: '由Human接待',
				value: 3,
			},
			{
				name: '已结束',
				value: 4,
			},
		],
		default: 3,
		hint: '变更的目标状态',
	},
	{
		displayName: '接待人员UserID',
		name: 'servicer_userid',
		type: 'string',
		displayOptions: {
			show: showOnlyForTransServiceState,
		},
		default: '',
		hint: '接待人员的userid（service_state=3时必填）',
	},
];

