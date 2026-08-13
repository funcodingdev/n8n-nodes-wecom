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
		description: '要变更会话状态的客服账号。<a href="https://developer.work.weixin.qq.com/document/path/94669" target="_blank">官方文档</a>',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '客户 External UserID',
		name: 'external_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForTransServiceState,
		},
		default: '',
		description: '要变更会话状态的微信客户 external_userid。<a href="https://developer.work.weixin.qq.com/document/path/94669" target="_blank">官方文档</a>',
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
				name: '转入待接入池',
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
		description: '目标状态。实际可用流转取决于当前状态；状态 4 不允许继续变更。<a href="https://developer.work.weixin.qq.com/document/path/94669" target="_blank">官方文档</a>',
	},
	{
		displayName: '接待人员UserID',
		name: 'servicer_userid',
		type: 'string',
		displayOptions: {
			show: { ...showOnlyForTransServiceState, service_state: [3] },
		},
		default: '',
		description:
			'目标状态为「由人工接待」时必填；接待人员必须已激活且正在接待。第三方应用使用密文 UserID。<a href="https://developer.work.weixin.qq.com/document/path/94669" target="_blank">官方文档</a>；可与下方选择二选一',
		placeholder: 'zhangsan',
	},
	{
		displayName: '接待人员(选择)',
		name: 'servicer_userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: { ...showOnlyForTransServiceState, service_state: [3] },
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];
