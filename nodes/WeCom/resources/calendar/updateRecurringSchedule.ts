import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
	resource: ['calendar'],
	operation: ['updateRecurringSchedule'],
};

export const updateRecurringScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: 'Recurring schedule ID',
		hint: '重复日程ID',
	},
	{
		displayName: '日程详情',
		name: 'schedule',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '{\n  "start_time": 1577836800,\n  "end_time": 1577840400,\n  "summary": "会议主题"\n}',
		description: 'Schedule details to update for recurring schedule, JSON format',
		hint: '要更新的重复日程详情，JSON格式',
	},
];

