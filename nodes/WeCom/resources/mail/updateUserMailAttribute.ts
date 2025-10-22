import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateUserMailAttribute = {
	resource: ['mail'],
	operation: ['updateUserMailAttribute'],
};

export const updateUserMailAttributeDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateUserMailAttribute,
		},
		default: '',
		hint: '邮箱地址',
	},
	{
		displayName: '功能属性',
		name: 'attribute',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateUserMailAttribute,
		},
		default: '{}',
		description: '功能属性设置JSON',
		hint: '功能属性JSON',
	},
];

