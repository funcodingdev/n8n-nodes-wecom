import type { INodeProperties } from 'n8n-workflow';
import { templateCardFormProperties } from './templateCardForm';

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
	...templateCardFormProperties(showOnlyForUpdateTemplateCard),
	{
		displayName: '反馈ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: { show: showOnlyForUpdateTemplateCard },
		default: '',
		description: '非空时覆盖原消息反馈信息，最长 256 字节',
	},
];
