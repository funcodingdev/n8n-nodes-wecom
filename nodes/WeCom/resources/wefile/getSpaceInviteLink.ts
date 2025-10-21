import type { INodeProperties } from 'n8n-workflow';

export const getSpaceInviteLinkDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'GetSpaceInviteLink操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['getSpaceInviteLink'],
			},
		},
	},
];
