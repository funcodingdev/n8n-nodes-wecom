import type { INodeProperties } from 'n8n-workflow';

export const spaceSecuritySettingsDescription: INodeProperties[] = [
	{
		displayName: '参数',
		name: 'params',
		type: 'string',
		default: '',
		description: 'SpaceSecuritySettings操作的参数',
		displayOptions: {
			show: {
				resource: ['wefile'],
				operation: ['spaceSecuritySettings'],
			},
		},
	},
];
