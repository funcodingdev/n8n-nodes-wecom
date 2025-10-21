import type { INodeProperties } from 'n8n-workflow';

export const createFolderDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'CreateFolder操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['createFolder'],
			},
		},
	},
];
