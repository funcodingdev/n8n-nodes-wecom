import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetUserMailAttribute = {
	resource: ['mail'],
	operation: ['getUserMailAttribute'],
};

export const getUserMailAttributeDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetUserMailAttribute,
		},
		default: '',
		description: '要查询的邮箱地址',
		hint: '邮箱地址',
	},
];

