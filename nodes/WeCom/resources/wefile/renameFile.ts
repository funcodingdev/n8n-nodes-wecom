import type { INodeProperties } from 'n8n-workflow';

export const renameFileDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'RenameFile操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['renameFile'],
			},
		},
	},
];
