import type { INodeProperties } from 'n8n-workflow';

const showOnlyForEnd = {
	resource: ['meeting'],
	operation: ['endMeeting'],
};

export const endMeetingDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForEnd,
		},
		default: '',
		description: 'Meeting ID to end',
		hint: '要结束的会议ID',
	},
];

