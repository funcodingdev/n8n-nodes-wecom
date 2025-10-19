import type { INodeProperties } from 'n8n-workflow';

const showOnlyForBatchDelete = {
	resource: ['contact'],
	operation: ['batchDeleteUser'],
};

export const batchDeleteUserDescription: INodeProperties[] = [
	{
		displayName: 'UserID列表',
		name: 'useridlist',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForBatchDelete,
		},
		default: '',
		description: '成员UserID列表，多个UserID用逗号分隔。最多支持200个。',
		hint: 'UserID列表，用逗号分隔',
	},
];

