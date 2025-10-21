import type { INodeProperties } from 'n8n-workflow';

export const fileShareSettingsDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'FileShareSettings操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['fileShareSettings'],
			},
		},
	},
];
