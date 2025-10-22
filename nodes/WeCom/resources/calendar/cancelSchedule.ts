import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCancel = {
	resource: ['calendar'],
	operation: ['cancelSchedule'],
};

export const cancelScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCancel,
		},
		default: '',
		description: 'Schedule ID to cancel',
		hint: '要取消的日程ID',
	},
];

