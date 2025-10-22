import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
	resource: ['calendar'],
	operation: ['updateSchedule'],
};

export const updateScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: 'Schedule ID',
		hint: '日程ID',
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
		description: 'Schedule details to update, JSON format',
		hint: '要更新的日程详情，JSON格式',
	},
];

