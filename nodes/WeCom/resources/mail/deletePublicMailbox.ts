import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeletePublicMailbox = {
	resource: ['mail'],
	operation: ['deletePublicMailbox'],
};

export const deletePublicMailboxDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeletePublicMailbox,
		},
		default: '',
		description: '要删除的公共邮箱地址',
		hint: '邮箱地址',
	},
];

