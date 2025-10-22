import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAllocateMailAdvancedAccount = {
	resource: ['mail'],
	operation: ['allocateMailAdvancedAccount'],
};

export const allocateMailAdvancedAccountDescription: INodeProperties[] = [
	{
		displayName: '邮箱列表',
		name: 'mailbox_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAllocateMailAdvancedAccount,
		},
		default: '',
		description: '要分配高级功能的邮箱地址列表，用逗号分隔',
		hint: '邮箱地址列表，用逗号分隔',
	},
];

