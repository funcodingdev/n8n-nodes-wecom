import type { INodeProperties } from 'n8n-workflow';
import { templateCardFormProperties } from './templateCardForm';

const showOnlyForReplyStreamWithTemplateCard = {
	resource: ['aibotPassiveReply'],
	operation: ['replyMessage'],
	replyType: ['stream_with_template_card'],
};

export const replyStreamWithTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '流式消息ID',
		name: 'stream_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: '',
		placeholder: 'STREAMID',
		required: true,
		description: '自定义唯一 ID，首次回复必填；后续回调据此获取最新流式消息',
	},
	{
		displayName: '是否结束',
		name: 'finish',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: false,
		description: '流式消息是否结束：false 继续，true 结束',
	},
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: '',
		placeholder: '**广州**今日天气：29度，大部分多云',
		description: '流式消息内容，最长 20480 字节，utf-8，支持 markdown',
	},
	{
		displayName: '图片列表',
		name: 'msg_item',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				...showOnlyForReplyStreamWithTemplateCard,
				finish: [true],
			},
		},
		default: {},
		placeholder: '添加图片',
		description: '图文混排图片列表，仅 finish=true 时支持',
		options: [
			{
				name: 'image',
				displayName: '图片',
				values: [
					{
						displayName: 'Base64编码',
						name: 'base64',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						placeholder: 'BASE64',
						required: true,
						description: '图片 base64（编码前最大 10M，JPG/PNG）',
					},
					{
						displayName: 'MD5值',
						name: 'md5',
						type: 'string',
						default: '',
						placeholder: 'MD5',
						required: true,
						description: '图片内容（base64 编码前）的 md5',
					},
				],
			},
		],
	},
	{
		displayName: '流式消息反馈ID',
		name: 'stream_feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: '',
		placeholder: 'FEEDBACKID',
		description: '可选。首次回复非空时，用户反馈会触发回调；最长 256 字节 utf-8',
	},
	{
		displayName: '附带模板卡片',
		name: 'attach_template_card',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: true,
		description: '关闭则仅发送流式消息，不附带模板卡片',
	},
	...templateCardFormProperties({
		...showOnlyForReplyStreamWithTemplateCard,
		attach_template_card: [true],
	}),
	{
		displayName: '模板卡片反馈ID',
		name: 'template_card_feedback_id',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForReplyStreamWithTemplateCard,
				attach_template_card: [true],
			},
		},
		default: '',
		description: '模板卡片 feedback.id',
	},
];
