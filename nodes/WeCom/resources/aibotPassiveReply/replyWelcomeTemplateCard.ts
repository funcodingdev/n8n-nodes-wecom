import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReplyWelcomeTemplateCard = {
	resource: ['aibotPassiveReply'],
	operation: ['replyWelcome'],
	replyType: ['template_card'],
};

export const replyWelcomeTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '模板卡片',
		name: 'template_card',
		type: 'json',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: showOnlyForReplyWelcomeTemplateCard,
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
];
