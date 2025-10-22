import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAdd = {
	resource: ['calendar'],
	operation: ['addScheduleAttendees'],
};

export const addScheduleAttendeesDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAdd,
		},
		default: '',
		description: 'Schedule ID',
		hint: '日程ID',
	},
	{
		displayName: '参与者',
		name: 'attendees',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForAdd,
		},
		default: '[{"userid": "userid1"}]',
		description: 'Attendees to add, JSON format array. Example: [{"userid": "userid1"}].',
		hint: '要添加的参与者，JSON格式数组',
	},
];

