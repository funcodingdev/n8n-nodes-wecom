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
import { updateTemplateCardDescription } from './updateTemplateCard';
import { recallMessageDescription } from './recallMessage';
import { sendSchoolNoticeDescription } from './sendSchoolNotice';

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
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{ name: '发送文本消息', value: 'sendText', action: '发送文本消息' },
			{ name: '发送 Markdown 消息', value: 'sendMarkdown', action: '发送 Markdown 消息' },
			{ name: '发送图片消息', value: 'sendImage', action: '发送图片消息' },
			{ name: '发送语音消息', value: 'sendVoice', action: '发送语音消息' },
			{ name: '发送视频消息', value: 'sendVideo', action: '发送视频消息' },
			{ name: '发送文件消息', value: 'sendFile', action: '发送文件消息' },
			{ name: '发送文本卡片消息', value: 'sendTextCard', action: '发送文本卡片消息' },
			{ name: '发送图文消息（News）', value: 'sendNews', action: '发送 News 图文消息' },
			{ name: '发送图文消息（Mpnews）', value: 'sendMpNews', action: '发送 Mpnews 图文消息' },
			{ name: '发送小程序通知消息', value: 'sendMiniprogramNotice', action: '发送小程序通知消息' },
			{ name: '发送任务卡片消息', value: 'sendTaskCard', action: '发送任务卡片消息' },
			{ name: '发送模板卡片消息', value: 'sendTemplateCard', action: '发送模板卡片消息' },
			{ name: '发送学校通知', value: 'sendSchoolNotice', action: '发送学校通知' },
			{ name: '撤回应用消息', value: 'recallMessage', action: '撤回应用消息' },
			{ name: '更新模板卡片消息', value: 'updateTemplateCard', action: '更新模板卡片消息' },
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
	...recallMessageDescription,
	...updateTemplateCardDescription,
	...sendSchoolNoticeDescription,
];
