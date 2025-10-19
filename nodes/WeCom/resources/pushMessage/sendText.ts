import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendText = {
	resource: ['pushMessage'],
	operation: ['sendText'],
};

export const sendTextDescription: INodeProperties[] = [
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: '',
		required: true,
		description: '文本消息内容',
		hint: '支持换行符',
	},
];

