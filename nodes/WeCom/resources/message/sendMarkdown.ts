import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendMarkdown = {
	resource: ['message'],
	operation: ['sendMarkdown'],
};

export const sendMarkdownDescription: INodeProperties[] = [
	...getRecipientFields('sendMarkdown'),
	{
		displayName: 'Markdown 内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendMarkdown,
		},
		description: 'Markdown 格式的消息内容，最长不超过2048个字节，必须是utf8编码',
	},
];

