import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['cancelMomentTask'],
};

export const cancelMomentTaskDescription: INodeProperties[] = [
	{
		displayName: '任务ID',
		name: 'moment_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '朋友圈的任务ID',
		description: '朋友圈的任务ID',
	},
];

