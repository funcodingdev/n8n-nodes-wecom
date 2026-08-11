import type { INodeProperties } from 'n8n-workflow';
import { templateCardFormProperties } from './templateCardForm';

const showOnlyForReplyWelcomeTemplateCard = {
	resource: ['aibotPassiveReply'],
	operation: ['replyWelcome'],
	replyType: ['template_card'],
};

export const replyWelcomeTemplateCardDescription: INodeProperties[] = [
	...templateCardFormProperties(showOnlyForReplyWelcomeTemplateCard),
];
