import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAllocate = {
	resource: ['meeting'],
	operation: ['allocateMeetingAdvancedAccount'],
};

export const allocateMeetingAdvancedAccountDescription: INodeProperties[] = [
	{
		displayName: '用户ID列表',
		name: 'userids',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAllocate,
		},
		default: '',
		description: 'User ID list, separated by commas',
		hint: '用户ID列表，用逗号分隔',
	},
];

