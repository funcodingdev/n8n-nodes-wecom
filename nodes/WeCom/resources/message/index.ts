import type { INodeProperties } from 'n8n-workflow';
import { sendTextDescription } from './sendText';
import { sendMarkdownDescription } from './sendMarkdown';
import { sendImageDescription } from './sendImage';
import { sendFileDescription } from './sendFile';
import { sendVoiceDescription } from './sendVoice';
import { sendVideoDescription } from './sendVideo';
import { sendTextCardDescription } from './sendTextCard';
import { sendNewsDescription } from './sendNews';
import { sendMpNewsDescription } from './sendMpNews';
import { sendMiniprogramNoticeDescription } from './sendMiniprogramNotice';
import { sendTaskCardDescription } from './sendTaskCard';
import { sendTemplateCardDescription } from './sendTemplateCard';

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
				name: '发送语音消息',
				value: 'sendVoice',
				action: '发送语音消息',
				description: '发送语音类型的消息',
			},
			{
				name: '发送视频消息',
				value: 'sendVideo',
				action: '发送视频消息',
				description: '发送视频类型的消息',
			},
			{
				name: '发送文件消息',
				value: 'sendFile',
				action: '发送文件消息',
				description: '发送文件类型的消息',
			},
			{
				name: '发送文本卡片消息',
				value: 'sendTextCard',
				action: '发送文本卡片消息',
				description: '发送文本卡片类型的消息',
			},
			{
				name: '发送图文消息',
				value: 'sendNews',
				action: '发送图文消息',
				description: '发送图文消息（news类型）',
			},
			{
				name: '发送图文消息（mpnews）',
				value: 'sendMpNews',
				action: '发送图文消息（mpnews）',
				description: '发送图文消息（mpnews类型）',
			},
			{
				name: '发送小程序通知消息',
				value: 'sendMiniprogramNotice',
				action: '发送小程序通知消息',
				description: '发送小程序通知类型的消息',
			},
			{
				name: '发送任务卡片消息',
				value: 'sendTaskCard',
				action: '发送任务卡片消息',
				description: '发送任务卡片类型的消息',
			},
			{
				name: '发送模板卡片消息',
				value: 'sendTemplateCard',
				action: '发送模板卡片消息',
				description: '发送模板卡片类型的消息',
			},
		],
		default: 'sendText',
	},
	...sendTextDescription,
	...sendMarkdownDescription,
	...sendImageDescription,
	...sendVoiceDescription,
	...sendVideoDescription,
	...sendFileDescription,
	...sendTextCardDescription,
	...sendNewsDescription,
	...sendMpNewsDescription,
	...sendMiniprogramNoticeDescription,
	...sendTaskCardDescription,
	...sendTemplateCardDescription,
];

