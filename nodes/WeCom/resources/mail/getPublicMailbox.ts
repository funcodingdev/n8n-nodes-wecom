import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetPublicMailbox = {
	resource: ['mail'],
	operation: ['getPublicMailbox'],
};

export const getPublicMailboxDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetPublicMailbox,
		},
		default: '',
		description: '公共邮箱地址',
		hint: '邮箱地址',
	},
];

