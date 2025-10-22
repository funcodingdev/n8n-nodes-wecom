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
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showOnlyForGet,
		},
		default: 50,
		description: 'Max number of results to return',
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

