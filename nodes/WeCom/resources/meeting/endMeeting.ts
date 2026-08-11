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
		description: '要结束的会议唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/98180" target="_blank">官方文档</a>',
	},
];

