import type { INodeProperties } from 'n8n-workflow';
import { templateCardFormProperties } from './templateCardForm';

const showOnlyForUpdateTemplateCard = {
	resource: ['aibotPassiveReply'],
	operation: ['updateTemplateCard'],
};

export const updateTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '用户 ID 列表',
		name: 'userids',
		type: 'string',
		displayOptions: { show: showOnlyForUpdateTemplateCard },
		default: '',
		placeholder: 'USERID1,USERID2',
		description: '要替换的 userid 列表；与下方选择合并；支持逗号、竖线或换行分隔；不填表示当前消息涉及的全部用户',
	},
	{
		displayName: '用户(选择)',
		name: 'userids_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnlyForUpdateTemplateCard },
		default: [],
		description: '与上方列表合并去重',
	},
	...templateCardFormProperties(showOnlyForUpdateTemplateCard),
	{
		displayName: '反馈 ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: { show: showOnlyForUpdateTemplateCard },
		default: '',
		description: '非空时覆盖原消息反馈信息，最长 256 字节',
	},
];
