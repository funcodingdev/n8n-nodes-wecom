import type { INodeProperties } from 'n8n-workflow';

export const moveFileDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'MoveFile操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['moveFile'],
			},
		},
	},
];
