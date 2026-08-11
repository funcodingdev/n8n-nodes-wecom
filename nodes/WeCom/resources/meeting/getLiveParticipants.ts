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
		description: '会议唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/98153" target="_blank">官方文档</a>',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '分页游标，首次请求留空，后续请求使用返回的cursor',
	},
	{
		displayName: '每页数量',
		name: 'size',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 100,
		description: '每页返回的参会者数量',
		typeOptions: { minValue: 1, maxValue: 1000 },
	},
];
