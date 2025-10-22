import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['addMomentTask'],
};

export const addMomentTaskDescription: INodeProperties[] = [
	{
		displayName: '可见范围',
		name: 'visible_range',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON格式，包含sender_list字段',
		description: '可见范围。包含sender_list（发表成员userid列表）',
	},
	{
		displayName: '朋友圈内容',
		name: 'text',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON格式的朋友圈内容',
		description: '文本消息和附件消息，具体格式见企业微信API文档',
	},
];

