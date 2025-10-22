import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['meeting'],
	operation: ['getMeetingAdvancedAccountList'],
};

export const getMeetingAdvancedAccountListDescription: INodeProperties[] = [
	{
		displayName: '限制数量',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: showOnlyForGet,
		},
		default: 100,
		description: 'Number of accounts to return',
		hint: '返回的账号数量',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: 'Pagination cursor',
		hint: '分页游标',
	},
];

