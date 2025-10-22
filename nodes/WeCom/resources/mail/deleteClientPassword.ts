import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeleteClientPassword = {
	resource: ['mail'],
	operation: ['deleteClientPassword'],
};

export const deleteClientPasswordDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeleteClientPassword,
		},
		default: '',
		description: '邮箱地址',
		hint: '邮箱地址',
	},
	{
		displayName: '密码ID',
		name: 'password_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeleteClientPassword,
		},
		default: '',
		description: '要删除的客户端专用密码ID',
		hint: '密码ID',
	},
];

