import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMailUnreadCount = {
	resource: ['mail'],
	operation: ['getMailUnreadCount'],
};

export const getMailUnreadCountDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetMailUnreadCount,
		},
		default: '',
		description: '要查询的邮箱地址',
		hint: '邮箱地址',
	},
];

