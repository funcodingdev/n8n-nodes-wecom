import type { INodeProperties } from 'n8n-workflow';

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
		description: '自定义的唯一ID，首次回复时必须设置。必填。自定义的唯一ID，首次回复时必须设置。后续回调会根据这个ID来获取最新的流式消息',
	},
	{
		displayName: '是否结束',
		name: 'finish',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: false,
		description: '流式消息是否结束。可选。流式消息是否结束，false表示继续，true表示结束',
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
		description: '流式消息内容。可选。流式消息内容，最长不超过20480个字节，必须是utf8编码。支持markdown格式',
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
		description: '图文混排消息列表。可选。图文混排消息列表，目前仅支持图片类型。仅当finish=true时支持',
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
						description: '图片内容的base64编码。必填。图片内容的base64编码。图片（base64编码前）最大不能超过10M，支持JPG、PNG格式',
					},
					{
						displayName: 'MD5值',
						name: 'md5',
						type: 'string',
						default: '',
						placeholder: 'MD5',
						required: true,
						description: '图片内容的md5值。必填。图片内容（base64编码前）的md5值',
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
		description: '可选。流式消息首次回复时候若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
	{
		displayName: '模板卡片',
		name: 'template_card',
		type: 'json',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: `{
  "card_type": "text_notice",
  "main_title": {
    "title": "标题",
    "desc": "说明"
  },
  "card_action": {
    "type": 1,
    "url": "https://work.weixin.qq.com"
  }
}`,
		description: '完整 template_card 结构体',
	},
	{
		displayName: '模板卡片反馈ID',
		name: 'template_card_feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: '',
		placeholder: 'FEEDBACKID',
		description: '可选。若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
];
