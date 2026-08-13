import type { INodeProperties } from 'n8n-workflow';
import { SEND_AND_WAIT_OPERATION } from 'n8n-workflow';
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
import { sendAndWaitDescription } from './sendAndWait';

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
			// 基础消息
			{ name: '[基础消息] 发送文本消息', value: 'sendText', action: '发送文本消息', description: '发送纯文本应用消息' },
			{ name: '[基础消息] 发送图片消息', value: 'sendImage', action: '发送图片消息', description: '发送图片应用消息' },
			{ name: '[基础消息] 发送语音消息', value: 'sendVoice', action: '发送语音消息', description: '发送语音应用消息' },
			{ name: '[基础消息] 发送视频消息', value: 'sendVideo', action: '发送视频消息', description: '发送视频应用消息' },
			{ name: '[基础消息] 发送文件消息', value: 'sendFile', action: '发送文件消息', description: '发送文件应用消息' },
			// 卡片消息
			{ name: '[卡片消息] 发送文本卡片消息', value: 'sendTextCard', action: '发送文本卡片消息', description: '发送文本卡片应用消息' },
			{ name: '[卡片消息] 发送图文消息（News）', value: 'sendNews', action: '发送 News 图文消息', description: '发送图文消息（普通样式）' },
			{ name: '[卡片消息] 发送图文消息（Mpnews）', value: 'sendMpNews', action: '发送 Mpnews 图文消息', description: '发送图文消息（公众号样式）' },
			{ name: '[卡片消息] 发送 Markdown 消息', value: 'sendMarkdown', action: '发送 Markdown 消息', description: '发送 Markdown 格式的应用消息' },
			{ name: '[卡片消息] 发送小程序通知消息', value: 'sendMiniprogramNotice', action: '发送小程序通知消息', description: '发送小程序通知应用消息' },
			{ name: '[卡片消息] 发送任务卡片消息', value: 'sendTaskCard', action: '发送任务卡片消息', description: '发送任务卡片应用消息' },
			{ name: '[卡片消息] 发送模板卡片消息', value: 'sendTemplateCard', action: '发送模板卡片消息', description: '发送模板卡片应用消息' },
			{ name: '[卡片消息] 发送并等待审批', value: SEND_AND_WAIT_OPERATION, action: '发送消息并等待审批', description: '向审批人发送企业微信卡片，等待其选择后再继续工作流' },
			{ name: '[家校消息] 发送学校通知', value: 'sendSchoolNotice', action: '发送学校通知', description: '向家长或学生发送学校通知' },
			// 消息操作
			{ name: '[消息操作] 撤回应用消息', value: 'recallMessage', action: '撤回应用消息', description: '撤回已发送的应用消息' },
			{ name: '[消息操作] 更新模板卡片消息', value: 'updateTemplateCard', action: '更新模板卡片消息', description: '更新已发送的模板卡片消息' },
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
	...sendAndWaitDescription,
	...recallMessageDescription,
	...updateTemplateCardDescription,
	...sendSchoolNoticeDescription,
];
