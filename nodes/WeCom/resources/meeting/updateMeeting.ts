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
		displayOptions: { show: showOnlyForUpdate },
		default: '',
		description:
			'meetingid，仅允许修改预约中的会议。<a href="https://developer.work.weixin.qq.com/document/path/98154" target="_blank">官方文档</a>',
	},
	{
		displayName: '会议标题',
		name: 'title',
		type: 'string',
		displayOptions: { show: showOnlyForUpdate },
		default: '',
		description: 'title',
	},
	{
		displayName: '会议开始时间',
		name: 'meeting_start',
		type: 'dateTime',
		displayOptions: { show: showOnlyForUpdate },
		default: '',
		description: 'meeting_start；修改时需同时传 duration',
	},
	{
		displayName: '会议时长(秒)',
		name: 'meeting_duration',
		type: 'number',
		displayOptions: { show: showOnlyForUpdate },
		default: 0,
		description: 'meeting_duration，300～86399；0 表示不修改',
	},
	{
		displayName: '会议描述',
		name: 'description',
		type: 'string',
		displayOptions: { show: showOnlyForUpdate },
		default: '',
	},
	{
		displayName: '会议地点',
		name: 'location',
		type: 'string',
		displayOptions: { show: showOnlyForUpdate },
		default: '',
	},
];
