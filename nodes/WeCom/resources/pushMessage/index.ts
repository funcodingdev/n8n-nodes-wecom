import type { INodeProperties } from 'n8n-workflow';
import { sendTextDescription } from './sendText';
import { sendMarkdownDescription } from './sendMarkdown';
import { sendMarkdownV2Description } from './sendMarkdownV2';
import { sendImageDescription } from './sendImage';
import { sendNewsDescription } from './sendNews';
import { sendFileDescription } from './sendFile';
import { sendVoiceDescription } from './sendVoice';
import { sendTemplateCardDescription } from './sendTemplateCard';

const showOnlyForPushMessage = {
	resource: ['pushMessage'],
};

export const pushMessageDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForPushMessage,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
		{
			name: '发送 Markdown V2 消息',
			value: 'sendMarkdownV2',
			action: '发送 Markdown V2 消息',
			description: '发送 Markdown V2 格式的消息到群聊',
		},
		{
			name: '发送 Markdown 消息',
			value: 'sendMarkdown',
			action: '发送 Markdown 消息',
			description: '发送 Markdown 格式的消息到群聊',
		},
		{
			name: '发送图文消息',
			value: 'sendNews',
			action: '发送图文消息',
			description: '发送图文消息到群聊',
		},
		{
			name: '发送图片消息',
			value: 'sendImage',
			action: '发送图片消息',
			description: '发送图片消息到群聊',
		},
		{
			name: '发送文件消息',
			value: 'sendFile',
			action: '发送文件消息',
			description: '发送文件消息到群聊',
		},
		{
			name: '发送文本消息',
			value: 'sendText',
			action: '发送文本消息',
			description: '发送文本消息到群聊',
		},
		{
			name: '发送模板卡片消息',
			value: 'sendTemplateCard',
			action: '发送模板卡片消息',
			description: '发送模板卡片消息到群聊',
		},
		{
			name: '发送语音消息',
			value: 'sendVoice',
			action: '发送语音消息',
			description: '发送语音消息到群聊',
		},
	],
		default: 'sendText',
	},
	...sendTextDescription,
	...sendMarkdownDescription,
	...sendMarkdownV2Description,
	...sendImageDescription,
	...sendNewsDescription,
	...sendFileDescription,
	...sendVoiceDescription,
	...sendTemplateCardDescription,
];
