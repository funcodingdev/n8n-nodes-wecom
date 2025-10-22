import type { INodeProperties } from 'n8n-workflow';

const showOnlyForToggleMailboxStatus = {
	resource: ['mail'],
	operation: ['toggleMailboxStatus'],
};

export const toggleMailboxStatusDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForToggleMailboxStatus,
		},
		default: '',
		description: '要禁用/启用的邮箱地址',
		hint: '邮箱地址',
	},
	{
		displayName: '操作',
		name: 'operation_type',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForToggleMailboxStatus,
		},
		options: [
			{
				name: '启用',
				value: 1,
			},
			{
				name: '禁用',
				value: 2,
			},
		],
		default: 1,
		description: '1-启用 2-禁用',
		hint: '启用或禁用邮箱',
	},
];

