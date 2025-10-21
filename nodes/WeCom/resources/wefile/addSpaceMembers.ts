import type { INodeProperties } from 'n8n-workflow';

export const addSpaceMembersDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'AddSpaceMembers操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['addSpaceMembers'],
			},
		},
	},
];
