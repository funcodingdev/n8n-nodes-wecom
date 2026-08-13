import type { INodeProperties } from 'n8n-workflow';

export const batchDelVipJobResultDescription: INodeProperties[] = [
	{
		displayName: '任务ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['batchDelVipJobResult'],
			},
		},
		default: '',
		typeOptions: { maxLength: 256 },
		description: '批量取消高级功能的任务ID',
	},
];
