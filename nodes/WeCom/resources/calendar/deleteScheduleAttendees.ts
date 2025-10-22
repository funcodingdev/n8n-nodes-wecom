import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelete = {
	resource: ['calendar'],
	operation: ['deleteScheduleAttendees'],
};

export const deleteScheduleAttendeesDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDelete,
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
			show: showOnlyForDelete,
		},
		default: '[{"userid": "userid1"}]',
		description: 'Attendees to delete, JSON format array. Example: [{"userid": "userid1"}]',
		hint: '要删除的参与者，JSON格式数组',
	},
];

