import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendMarkdown = {
	resource: ['pushMessage'],
	operation: ['sendMarkdown'],
};

export const sendMarkdownDescription: INodeProperties[] = [
	{
		displayName: 'Markdown 内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 8,
		},
		displayOptions: {
			show: showOnlyForSendMarkdown,
		},
		default: '',
		required: true,
		description: 'Markdown 格式的消息内容',
		hint: '支持标题、加粗、链接、图片等 Markdown 语法',
	},
];

