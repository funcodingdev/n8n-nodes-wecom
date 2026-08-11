import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['getParticipants'] };

export const getParticipantsDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description:
			'meetingid。<a href="https://developer.work.weixin.qq.com/document/path/98156" target="_blank">官方文档</a>',
	},
	{
		displayName: '周期性子会议ID',
		name: 'sub_meetingid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: 'sub_meetingid，周期会议必传',
	},
	{
		displayName: '参会开始时间',
		name: 'attendee_start_time',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 0,
		description: 'start_time，秒；区间不超过 31 天；0 表示默认',
	},
	{
		displayName: '参会结束时间',
		name: 'attendee_end_time',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 0,
		description: 'end_time，秒；0 表示默认当前时间',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
	},
	{
		displayName: '每页数量',
		name: 'size',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 100,
		description: 'limit，最大 100',
		typeOptions: { minValue: 1, maxValue: 100 },
	},
];
