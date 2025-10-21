import type { INodeProperties } from 'n8n-workflow';

export const renameSpaceDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'RenameSpace操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['renameSpace'],
			},
		},
	},
];
