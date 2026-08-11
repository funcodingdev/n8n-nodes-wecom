import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['getLiveParticipants'] };

export const getLiveParticipantsDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description:
			'meetingid。<a href="https://developer.work.weixin.qq.com/document/path/98157" target="_blank">官方文档</a>',
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
		default: 50,
		description: 'limit，最大 50',
		typeOptions: { minValue: 1, maxValue: 50 },
	},
];
