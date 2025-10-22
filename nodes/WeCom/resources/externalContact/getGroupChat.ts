import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getGroupChat'],
};

export const getGroupChatDescription: INodeProperties[] = [
	{
		displayName: '客户群ID',
		name: 'chat_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '客户群ID',
	},
	{
		displayName: '是否需要返回群成员的名字',
		name: 'need_name',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: showOnly,
		},
		hint: '是否需要返回群成员的名字',
	},
];

