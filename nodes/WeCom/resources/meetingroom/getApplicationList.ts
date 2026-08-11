import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetApplicationList = {
	resource: ['meetingroom'],
	operation: ['getApplicationList'],
};

export const getApplicationListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetApplicationList,
		},
		default: '',
		description:
			'查询起始时间 starttime（Unix 秒）。<a href="https://developer.work.weixin.qq.com/document/path/99883" target="_blank">官方文档</a>',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetApplicationList,
		},
		default: '',
		description: '查询结束时间 endtime（Unix 秒）',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetApplicationList,
		},
		default: '',
		placeholder: 'CURSOR_STRING',
		description: '可选。用于分页查询的游标，从上次响应中获取。<a href="https://developer.work.weixin.qq.com/document/path/93618" target="_blank">更多信息</a>',
	},
	{
		displayName: '每次拉取数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			maxValue: 100,
		},
		displayOptions: {
			show: showOnlyForGetApplicationList,
		},
		default: 50,
		description: '每次拉取的会议室申请单数量，最大值为100。<a href="https://developer.work.weixin.qq.com/document/path/93618" target="_blank">更多信息</a>',
	},
];

