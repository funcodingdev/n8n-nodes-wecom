import type { INodeProperties } from 'n8n-workflow';

export const removeSpaceMembersDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'RemoveSpaceMembers操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['removeSpaceMembers'],
			},
		},
	},
];
