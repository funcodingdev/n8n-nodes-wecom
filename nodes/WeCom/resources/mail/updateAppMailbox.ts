import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateAppMailbox = {
	resource: ['mail'],
	operation: ['updateAppMailbox'],
};

export const updateAppMailboxDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateAppMailbox,
		},
		default: '',
		description: '要更新的应用邮箱地址',
		hint: '邮箱地址',
	},
	{
		displayName: '邮箱名称',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateAppMailbox,
		},
		default: '',
		hint: '邮箱名称（可选）',
	},
	{
		displayName: '邮箱描述',
		name: 'remark',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateAppMailbox,
		},
		default: '',
		hint: '邮箱描述（可选）',
	},
];

