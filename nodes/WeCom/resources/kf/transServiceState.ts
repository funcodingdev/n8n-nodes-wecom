import type { INodeProperties } from 'n8n-workflow';

const showOnlyForTransServiceState = {
	resource: ['kf'],
	operation: ['transServiceState'],
};

export const transServiceStateDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
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
		description: '客服账号的唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/94669" target="_blank">官方文档</a>.',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
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
		description: '客户的外部联系人UserID，以"wm"开头。<a href="https://developer.work.weixin.qq.com/document/path/94669" target="_blank">官方文档</a>',
		placeholder: 'wmxxxxxxxxxxxxxxxxxx',
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
				name: '待人工接待',
				value: 2,
			},
			{
				name: '由人工接待',
				value: 3,
			},
			{
				name: '已结束',
				value: 4,
			},
		],
		default: 3,
		description: '变更后的服务状态。0-未处理 1-由智能助手接待 2-待人工接待 3-由人工接待 4-已结束。<a href="https://developer.work.weixin.qq.com/document/path/94669" target="_blank">官方文档</a>',
	},
	{
		displayName: '接待人员UserID',
		name: 'servicer_userid',
		type: 'string',
		displayOptions: {
			show: showOnlyForTransServiceState,
		},
		default: '',
		description: '接待人员的UserID，当service_state为3（由人工接待）时必填。<a href="https://developer.work.weixin.qq.com/document/path/94669" target="_blank">官方文档</a>',
		placeholder: 'zhangsan',
	},
];

