import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeallocateMailAdvancedAccount = {
	resource: ['mail'],
	operation: ['deallocateMailAdvancedAccount'],
};

export const deallocateMailAdvancedAccountDescription: INodeProperties[] = [
	{
		displayName: '邮箱列表',
		name: 'mailbox_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeallocateMailAdvancedAccount,
		},
		default: '',
		description: '要取消高级功能的邮箱地址列表，用逗号分隔',
		hint: '邮箱地址列表，用逗号分隔',
	},
];

