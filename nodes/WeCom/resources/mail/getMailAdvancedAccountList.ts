import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMailAdvancedAccountList = {
	resource: ['mail'],
	operation: ['getMailAdvancedAccountList'],
};

export const getMailAdvancedAccountListDescription: INodeProperties[] = [
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showOnlyForGetMailAdvancedAccountList,
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
			show: showOnlyForGetMailAdvancedAccountList,
		},
		default: '',
		description: '分页游标',
		hint: '分页游标（可选）',
	},
];

