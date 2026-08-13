import type { INodeProperties } from 'n8n-workflow';
import { replyWelcomeTextDescription } from './replyWelcomeText';
import { replyWelcomeTemplateCardDescription } from './replyWelcomeTemplateCard';
import { replyStreamDescription } from './replyStream';
import { replyTemplateCardDescription } from './replyTemplateCard';
import { replyStreamWithTemplateCardDescription } from './replyStreamWithTemplateCard';
import { updateTemplateCardDescription } from './updateTemplateCard';
import { replyMarkdownDescription } from './replyMarkdown';
import { replyActiveTemplateCardDescription } from './replyActiveTemplateCard';

const showOnlyForAIBotPassiveReply = {
	resource: ['aibotPassiveReply'],
};

export const aibotPassiveReplyDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForAIBotPassiveReply,
		},
		options: [
			{
				name: '[智能机器人被动回复] 回复欢迎语',
				value: 'replyWelcome',
				action: '回复欢迎语',
				description: '回复进入会话事件的欢迎语',
			},
			{
				name: '[智能机器人被动回复] 回复用户消息',
				value: 'replyMessage',
				action: '回复用户消息',
				description: '回复用户发送的消息',
			},
			{
				name: '[智能机器人被动回复] 更新模板卡片',
				value: 'updateTemplateCard',
				action: '更新模板卡片',
				description: '更新模板卡片消息',
			},
			{
				name: '[智能机器人被动回复] 主动回复消息',
				value: 'activeReply',
				action: '主动回复消息',
				description: '使用 response_url 主动回复消息（支持 Markdown、模板卡片）',
			},
		],
		default: 'replyWelcome',
		description: '选择回复操作类型',
	},
	{
		displayName: '被动回复要求',
		name: 'passiveReplyNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForAIBotPassiveReply,
				operation: ['replyWelcome', 'replyMessage', 'updateTemplateCard'],
			},
		},
		description: '请将智能机器人触发器的“响应方式”设为“等待工作流（被动回复）”，选择与触发器相同的“消息接收 API”凭证，并让本节点作为分支最后一个节点；回复必须在 5 秒内完成。',
	},
	{
		displayName: '主动回复要求',
		name: 'activeReplyNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForAIBotPassiveReply,
				operation: ['activeReply'],
			},
		},
		description: '请将智能机器人触发器的“响应方式”设为“立即响应（主动回复）”。每个 response_url 仅可调用一次，有效期 1 小时。',
	},
	{
		displayName: '回复类型',
		name: 'replyType',
		type: 'options',
		displayOptions: {
			show: {
				...showOnlyForAIBotPassiveReply,
				operation: ['replyWelcome'],
			},
		},
		options: [
			{
				name: '文本消息',
				value: 'text',
				description: '回复文本消息',
			},
			{
				name: '模板卡片消息',
				value: 'template_card',
				description: '回复模板卡片消息',
			},
		],
		default: 'text',
		required: true,
		description: '选择欢迎语的回复类型。进入会话事件支持回复文本消息或模板卡片消息',
	},
	{
		displayName: '回复类型',
		name: 'replyType',
		type: 'options',
		displayOptions: {
			show: {
				...showOnlyForAIBotPassiveReply,
				operation: ['replyMessage'],
			},
		},
		options: [
			{
				name: '流式消息',
				value: 'stream',
				description: '回复流式消息',
			},
			{
				name: '模板卡片消息',
				value: 'template_card',
				description: '回复模板卡片消息',
			},
			{
				name: '流式消息+模板卡片',
				value: 'stream_with_template_card',
				description: '同时回复流式消息和模板卡片',
			},
		],
		default: 'stream',
		required: true,
		description: '选择回复用户消息的类型。支持回复流式消息、模板卡片消息，或同时回复流式消息和模板卡片',
	},
	{
		displayName: '回复类型',
		name: 'replyType',
		type: 'options',
		displayOptions: {
			show: {
				...showOnlyForAIBotPassiveReply,
				operation: ['activeReply'],
			},
		},
		options: [
			{
				name: 'Markdown 消息',
				value: 'markdown',
				description: '回复 Markdown 消息',
			},
			{
				name: '模板卡片消息',
				value: 'template_card',
				description: '回复模板卡片消息',
			},
		],
		default: 'markdown',
		required: true,
		description: '选择主动回复的消息类型。群聊会引用触发回调的消息；模板卡片无法引用时会生成一条空引用消息。',
	},
	...replyWelcomeTextDescription,
	...replyWelcomeTemplateCardDescription,
	...replyStreamDescription,
	...replyTemplateCardDescription,
	...replyStreamWithTemplateCardDescription,
	...updateTemplateCardDescription,
	...replyMarkdownDescription,
	...replyActiveTemplateCardDescription,
];
