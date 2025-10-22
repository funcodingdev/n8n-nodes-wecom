import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
	resource: ['meeting'],
	operation: ['updateMeetingInvitees'],
};

export const updateMeetingInviteesDescription: INodeProperties[] = [
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
		displayName: '受邀成员',
		name: 'invitees',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '[{"userid": "user1"}]',
		description: 'Invitees to add or remove, JSON format array',
		hint: '要添加或删除的受邀成员，JSON格式数组',
	},
];

