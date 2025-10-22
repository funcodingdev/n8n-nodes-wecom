import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetClientPasswordList = {
	resource: ['mail'],
	operation: ['getClientPasswordList'],
};

export const getClientPasswordListDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetClientPasswordList,
		},
		default: '',
		description: '要查询的邮箱地址',
		hint: '邮箱地址',
	},
];

