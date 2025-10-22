import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeallocate = {
	resource: ['meeting'],
	operation: ['deallocateMeetingAdvancedAccount'],
};

export const deallocateMeetingAdvancedAccountDescription: INodeProperties[] = [
	{
		displayName: '用户ID列表',
		name: 'userids',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeallocate,
		},
		default: '',
		description: 'User ID list, separated by commas',
		hint: '用户ID列表，用逗号分隔',
	},
];

