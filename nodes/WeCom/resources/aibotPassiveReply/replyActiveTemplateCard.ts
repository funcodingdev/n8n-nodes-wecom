import type { INodeProperties } from 'n8n-workflow';
import { templateCardFormProperties } from './templateCardForm';

const showOnlyForReplyActiveTemplateCard = {
	resource: ['aibotPassiveReply'],
	operation: ['activeReply'],
	replyType: ['template_card'],
};

export const replyActiveTemplateCardDescription: INodeProperties[] = [
	...templateCardFormProperties(showOnlyForReplyActiveTemplateCard),
	{
		displayName: '反馈ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyActiveTemplateCard,
		},
		default: '',
		placeholder: 'FEEDBACKID',
		description:
			'可选。特殊的该回复场景支持设置反馈信息。若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
];
