import type { INodeProperties } from 'n8n-workflow';

export const getFileShareLinkDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'GetFileShareLink操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['getFileShareLink'],
			},
		},
	},
];
