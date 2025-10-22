import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
	resource: ['meeting'],
	operation: ['updateAdvancedMeeting'],
};

export const updateAdvancedMeetingDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: 'Meeting ID',
		hint: '会议ID',
	},
	{
		displayName: '会议详情',
		name: 'meeting_info',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '{\n  "subject": "会议主题",\n  "start_time": 1577836800,\n  "end_time": 1577840400\n}',
		description: 'Meeting information to update, JSON format',
		hint: '要更新的会议信息，JSON格式',
	},
];

