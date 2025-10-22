import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['sendWelcomeMsg'],
};

export const sendWelcomeMsgDescription: INodeProperties[] = [
	{
		displayName: '欢迎语Code',
		name: 'welcome_code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '通过添加外部联系人事件推送获取的welcome_code',
		description: '通过添加外部联系人事件推送获取的welcome_code',
	},
	{
		displayName: '消息内容',
		name: 'text',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON格式的消息内容',
		description: '文本消息和附件消息，具体格式见企业微信API文档',
	},
];

