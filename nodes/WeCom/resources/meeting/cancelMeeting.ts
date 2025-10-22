import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCancel = {
	resource: ['meeting'],
	operation: ['cancelMeeting'],
};

export const cancelMeetingDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCancel,
		},
		default: '',
		description: 'Meeting ID to cancel',
		hint: '要取消的会议ID',
	},
];

