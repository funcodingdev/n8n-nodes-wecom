import type { INodeProperties } from 'n8n-workflow';

export const deleteFileDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'DeleteFile操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['deleteFile'],
			},
		},
	},
];
