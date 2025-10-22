import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
	resource: ['meeting'],
	operation: ['updateMeeting'],
};

export const updateMeetingDescription: INodeProperties[] = [
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
		displayName: '会议主题',
		name: 'subject',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: 'Meeting subject',
		hint: '会议主题',
	},
	{
		displayName: '会议开始时间',
		name: 'start_time',
		type: 'number',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: 0,
		description: 'Meeting start time (Unix timestamp)',
		hint: '会议开始时间（Unix时间戳）',
	},
	{
		displayName: '会议结束时间',
		name: 'end_time',
		type: 'number',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: 0,
		description: 'Meeting end time (Unix timestamp)',
		hint: '会议结束时间（Unix时间戳）',
	},
];

