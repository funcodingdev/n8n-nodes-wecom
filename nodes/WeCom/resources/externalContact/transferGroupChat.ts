import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['transferGroupChat'],
};

export const transferGroupChatDescription: INodeProperties[] = [
	{
		displayName: '客户群ID列表',
		name: 'chat_id_list',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '需要转群主的客户群 ID，逗号分隔，最多 100 个',
		placeholder: 'wrxxxxxxxx,wryyyyyyyy',
	},
	{
		displayName: '新群主UserID',
		name: 'new_owner',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'zhangsan',
		displayOptions: {
			show: showOnly,
		},
		description: '新群主的成员 UserID',
	},
];
