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
		hint: '需要转群主的客户群ID列表，用逗号分隔，最多100个',
		description: '需要转群主的客户群ID列表',
	},
	{
		displayName: '新群主 Name or ID',
		name: 'new_owner',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '新群主的userid',
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

