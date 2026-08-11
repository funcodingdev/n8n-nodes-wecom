import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReplyTemplateCard = {
	resource: ['aibotPassiveReply'],
	operation: ['replyMessage'],
	replyType: ['template_card'],
};

export const replyTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '模板卡片',
		name: 'template_card',
		type: 'json',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: showOnlyForReplyTemplateCard,
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
		required: true,
		description: '完整 template_card 结构体',
	},
	{
		displayName: '反馈ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyTemplateCard,
		},
		default: '',
		placeholder: 'FEEDBACKID',
		description: '可选。若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
];
