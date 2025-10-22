import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRemove = {
	resource: ['meeting'],
	operation: ['removeMember'],
};

export const removeMemberDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForRemove,
		},
		default: '',
		description: 'Meeting ID',
		hint: '会议ID',
	},
	{
		displayName: '用户ID列表',
		name: 'userids',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForRemove,
		},
		default: '',
		description: 'User ID list to remove, separated by commas',
		hint: '要移出的用户ID列表，用逗号分隔',
	},
];

