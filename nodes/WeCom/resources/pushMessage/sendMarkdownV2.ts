import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendMarkdownV2 = {
	resource: ['pushMessage'],
	operation: ['sendMarkdownV2'],
};

export const sendMarkdownV2Description: INodeProperties[] = [
	{
		displayName: 'Markdown 内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 8,
		},
		displayOptions: {
			show: showOnlyForSendMarkdownV2,
		},
		default: '',
		required: true,
		description: 'Markdown V2 格式的消息内容',
		hint: '支持更多 Markdown 语法和样式',
	},
];

