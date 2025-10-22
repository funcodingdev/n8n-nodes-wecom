import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMailContent = {
	resource: ['mail'],
	operation: ['getMailContent'],
};

export const getMailContentDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetMailContent,
		},
		default: '',
		description: '邮箱地址',
		hint: '邮箱地址',
	},
	{
		displayName: '邮件ID',
		name: 'mailid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetMailContent,
		},
		default: '',
		description: '邮件ID',
		hint: '邮件ID',
	},
];

