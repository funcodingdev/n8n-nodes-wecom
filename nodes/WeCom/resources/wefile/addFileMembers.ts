import type { INodeProperties } from 'n8n-workflow';

export const addFileMembersDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'AddFileMembers操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['addFileMembers'],
			},
		},
	},
];
