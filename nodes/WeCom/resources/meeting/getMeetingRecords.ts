import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['getMeetingRecords'] };

export const getMeetingRecordsDescription: INodeProperties[] = [
	{
		displayName: '查询类型',
		name: 'record_type',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '发起成功的会议记录', value: 1 },
			{ name: '发起失败的会议', value: 2 },
		],
		default: 1,
		description:
			'type。<a href="https://developer.work.weixin.qq.com/document/path/99651" target="_blank">官方文档</a>',
	},
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: 'begin_time，查询范围起始时间',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: 'end_time，查询范围结束时间',
	},
	{
		displayName: '条数限制',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		displayOptions: { show: showOnly },
		default: 200,
		description: '默认 200，最大 1000',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
	},
];
