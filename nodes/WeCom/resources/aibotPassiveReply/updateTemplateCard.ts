import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateTemplateCard = {
	resource: ['aibotPassiveReply'],
	operation: ['updateTemplateCard'],
};

export const updateTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '用户ID列表',
		name: 'userids',
		type: 'string',
		displayOptions: { show: showOnlyForUpdateTemplateCard },
		default: '',
		placeholder: 'USERID1,USERID2',
		description: '要替换的 userid，逗号分隔；不填表示全部相关用户',
	},
	{
		displayName: '卡片类型',
		name: 'card_type_hint',
		type: 'options',
		displayOptions: { show: showOnlyForUpdateTemplateCard },
		options: [
			{ name: '文本通知 text_notice', value: 'text_notice' },
			{ name: '图文展示 news_notice', value: 'news_notice' },
			{ name: '按钮交互 button_interaction', value: 'button_interaction' },
			{ name: '投票选择 vote_interaction', value: 'vote_interaction' },
			{ name: '多项选择 multiple_interaction', value: 'multiple_interaction' },
		],
		default: 'text_notice',
		description: '提示用，最终以模板卡片 JSON 中的 card_type 为准',
	},
	{
		displayName: '模板卡片JSON',
		name: 'template_card',
		type: 'json',
		typeOptions: { rows: 10 },
		displayOptions: { show: showOnlyForUpdateTemplateCard },
		default:
			'{\n  "card_type": "text_notice",\n  "main_title": {\n    "title": "标题",\n    "desc": "说明"\n  },\n  "card_action": {\n    "type": 1,\n    "url": "https://work.weixin.qq.com"\n  }\n}',
		required: true,
		description: '完整 template_card 结构体',
	},
	{
		displayName: '反馈ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: { show: showOnlyForUpdateTemplateCard },
		default: '',
		description: '非空时覆盖原消息反馈信息，最长 256 字节',
	},
];
