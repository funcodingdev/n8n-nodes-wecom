import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreate = {
	resource: ['calendar'],
	operation: ['createSchedule'],
};

export const createScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程详情',
		name: 'schedule',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '{\n  "organizer": "userid1",\n  "start_time": 1577836800,\n  "end_time": 1577840400,\n  "summary": "会议主题",\n  "attendees": [{"userid": "userid2"}]\n}',
		description: 'Schedule details in JSON format. Required fields: organizer, start_time, end_time, summary, attendees',
		hint: '日程详情，JSON格式',
	},
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: 0,
		description: 'Agent ID, optional, defaults to the current app',
		hint: '应用ID，可选，默认为当前应用',
	},
];

