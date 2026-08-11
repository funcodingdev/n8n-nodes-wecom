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
		displayOptions: { show: showOnlyForGet },
		default: '',
		description:
			'meetingid。<a href="https://developer.work.weixin.qq.com/document/path/98160" target="_blank">官方文档</a>',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: showOnlyForGet },
		default: '',
		description: 'cursor，首次可不传；分页用上次 next_cursor',
	},
];
