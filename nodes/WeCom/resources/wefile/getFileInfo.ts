import type { INodeProperties } from 'n8n-workflow';

export const getFileInfoDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'GetFileInfo操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['getFileInfo'],
			},
		},
	},
];
