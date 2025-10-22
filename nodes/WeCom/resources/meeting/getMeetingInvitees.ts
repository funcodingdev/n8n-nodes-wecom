import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['meeting'],
	operation: ['getMeetingInvitees'],
};

export const getMeetingInviteesDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: 'Meeting ID',
		hint: '会议ID',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: 'Pagination cursor',
		hint: '分页游标',
	},
	{
		displayName: '限制数量',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: showOnlyForGet,
		},
		default: 20,
		description: 'Number of invitees to return',
		hint: '返回的受邀成员数量',
	},
];

