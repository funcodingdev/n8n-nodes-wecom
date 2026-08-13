import type { INodeProperties } from 'n8n-workflow';

export const batchAddVipJobResultDescription: INodeProperties[] = [
	{
		displayName: '任务ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['batchAddVipJobResult'],
			},
		},
		default: '',
		typeOptions: { maxLength: 256 },
		description: '批量分配高级功能的任务ID',
	},
];
