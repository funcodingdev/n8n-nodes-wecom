import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSearchPublicMailbox = {
	resource: ['mail'],
	operation: ['searchPublicMailbox'],
};

export const searchPublicMailboxDescription: INodeProperties[] = [
	{
		displayName: '搜索关键词',
		name: 'fuzzy_mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSearchPublicMailbox,
		},
		default: '',
		description: '模糊搜索的关键词',
		hint: '搜索关键词',
	},
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showOnlyForSearchPublicMailbox,
		},
		default: 50,
		description: 'Max number of results to return',
		hint: '返回数量',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForSearchPublicMailbox,
		},
		default: '',
		description: '分页游标',
		hint: '分页游标（可选）',
	},
];

