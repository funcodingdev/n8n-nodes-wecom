import type { INodeProperties } from 'n8n-workflow';

const showOnlyForListKfAccount = {
	resource: ['kf'],
	operation: ['listKfAccount'],
};

export const listKfAccountDescription: INodeProperties[] = [
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showOnlyForListKfAccount,
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
			show: showOnlyForListKfAccount,
		},
		default: '',
		hint: '分页游标（可选）',
	},
];

