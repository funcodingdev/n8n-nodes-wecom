import type { INodeProperties } from 'n8n-workflow';
import { sendTextDescription } from './sendText';
import { sendMarkdownDescription } from './sendMarkdown';
import { sendImageDescription } from './sendImage';
import { sendFileDescription } from './sendFile';

const showOnlyForMessage = {
	resource: ['message'],
};

export const messageDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMessage,
		},
		options: [
			{
				name: '发送文本消息',
				value: 'sendText',
				action: '发送文本消息',
				description: '发送文本类型的消息',
			},
			{
				name: '发送 Markdown 消息',
				value: 'sendMarkdown',
				action: '发送 Markdown 消息',
				description: '发送 Markdown 格式的消息',
			},
			{
				name: '发送图片消息',
				value: 'sendImage',
				action: '发送图片消息',
				description: '发送图片类型的消息',
			},
			{
				name: '发送文件消息',
				value: 'sendFile',
				action: '发送文件消息',
				description: '发送文件类型的消息',
			},
		],
		default: 'sendText',
	},
	...sendTextDescription,
	...sendMarkdownDescription,
	...sendImageDescription,
	...sendFileDescription,
];

