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
		displayOptions: { show: showOnlyForEnd },
		default: '',
		description:
			'meetingid。<a href="https://developer.work.weixin.qq.com/document/path/98187" target="_blank">官方文档</a>',
	},
	{
		displayName: '强制结束',
		name: 'force_dismiss',
		type: 'options',
		displayOptions: { show: showOnlyForEnd },
		options: [
			{ name: '不强制（有人则无法结束）', value: 0 },
			{ name: '强制结束', value: 1 },
		],
		default: 1,
		description: 'force_dismiss，默认 1',
	},
	{
		displayName: '回收会议号',
		name: 'retrieve_code',
		type: 'options',
		displayOptions: { show: showOnlyForEnd },
		options: [
			{ name: '不回收（可再入会）', value: 0 },
			{ name: '回收（不可再入会）', value: 1 },
		],
		default: 0,
		description: 'retrieve_code；周期会议若还有子会议应不回收',
	},
];
