import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['addGroupWelcomeTemplate'],
};

export const addGroupWelcomeTemplateDescription: INodeProperties[] = [
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
		description: '群欢迎语的消息内容，具体格式见企业微信API文档',
	},
	{
		displayName: '适用成员',
		name: 'agentid',
		type: 'number',
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '授权方安装的应用agentid，仅旧的第三方多应用套件需要填此参数',
		description: '授权方安装的应用agentid',
	},
	{
		displayName: '是否通知',
		name: 'notify',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnly,
		},
		hint: '是否通知成员将这条入群欢迎语应用到客户群中',
		description: 'Whether to notify members to apply this group welcome message to customer groups',
	},
];

