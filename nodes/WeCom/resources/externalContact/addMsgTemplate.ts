import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['addMsgTemplate'],
};

export const addMsgTemplateDescription: INodeProperties[] = [
	{
		displayName: '群发任务类型',
		name: 'chat_type',
		type: 'options',
		options: [
			{
				name: '单聊',
				value: 'single',
			},
			{
				name: '群聊',
				value: 'group',
			},
		],
		default: 'single',
		displayOptions: {
			show: showOnly,
		},
		hint: '群发任务的类型，默认为single，表示发送给客户，group表示发送到客户群',
		description: '群发任务的类型',
	},
	{
		displayName: '发送范围',
		name: 'sender',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON格式，包含sender字段（发送userid）和filter字段',
		description: '指定群发的成员范围',
	},
	{
		displayName: '消息内容',
		name: 'text',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON格式的消息内容',
		description: '消息内容，包含文本、图片、链接、小程序等',
	},
	{
		displayName: '是否允许成员在待发送客户列表中重新进行选择',
		name: 'allow_select',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnly,
		},
		hint: '是否允许成员在待发送客户列表中重新进行选择',
	},
];

