import type { INodeProperties } from 'n8n-workflow';

export const fileSecuritySettingsDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'FileSecuritySettings操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['fileSecuritySettings'],
			},
		},
	},
];
