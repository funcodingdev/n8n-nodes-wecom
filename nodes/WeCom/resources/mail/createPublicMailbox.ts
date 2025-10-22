import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreatePublicMailbox = {
	resource: ['mail'],
	operation: ['createPublicMailbox'],
};

export const createPublicMailboxDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreatePublicMailbox,
		},
		default: '',
		description: '公共邮箱地址',
		hint: '邮箱地址',
	},
	{
		displayName: '邮箱名称',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreatePublicMailbox,
		},
		default: '',
		hint: '邮箱名称',
	},
	{
		displayName: '管理员列表',
		name: 'admin_list',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreatePublicMailbox,
		},
		default: '',
		description: '管理员邮箱列表，用逗号分隔',
		hint: '管理员邮箱列表（可选）',
	},
	{
		displayName: '成员列表',
		name: 'member_list',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreatePublicMailbox,
		},
		default: '',
		description: '成员邮箱列表，用逗号分隔',
		hint: '成员邮箱列表（可选）',
	},
];

