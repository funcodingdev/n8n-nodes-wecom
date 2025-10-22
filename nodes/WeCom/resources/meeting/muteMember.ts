import type { INodeProperties } from 'n8n-workflow';

const showOnlyForMute = {
	resource: ['meeting'],
	operation: ['muteMember'],
};

export const muteMemberDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForMute,
		},
		default: '',
		description: 'Meeting ID',
		hint: '会议ID',
	},
	{
		displayName: '操作类型',
		name: 'action',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForMute,
		},
		options: [
			{ name: '静音', value: 'mute' },
			{ name: '取消静音', value: 'unmute' },
		],
		default: 'mute',
		description: 'Mute action',
		hint: '静音操作类型',
	},
	{
		displayName: '用户ID列表',
		name: 'userids',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForMute,
		},
		default: '',
		description: 'User ID list to mute/unmute, separated by commas',
		hint: '要静音/取消静音的用户ID列表，用逗号分隔',
	},
];

