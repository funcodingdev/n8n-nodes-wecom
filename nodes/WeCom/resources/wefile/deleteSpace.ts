import type { INodeProperties } from 'n8n-workflow';

export const deleteSpaceDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'DeleteSpace操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['deleteSpace'],
			},
		},
	},
];
