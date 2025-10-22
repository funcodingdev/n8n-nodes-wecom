import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetAppMailbox = {
	resource: ['mail'],
	operation: ['getAppMailbox'],
};

export const getAppMailboxDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetAppMailbox,
		},
		default: '',
		description: '要查询的应用邮箱地址',
		hint: '邮箱地址',
	},
];

