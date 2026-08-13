import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['cancelMomentTask'],
};

export const cancelMomentTaskDescription: INodeProperties[] = [
	{
		displayName: '停止任务只能阻止尚未发表的内容，无法撤回已经发表到客户朋友圈的信息',
		name: 'cancelMomentNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '任务ID',
		name: 'moment_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '朋友圈的任务ID',
	},
];
