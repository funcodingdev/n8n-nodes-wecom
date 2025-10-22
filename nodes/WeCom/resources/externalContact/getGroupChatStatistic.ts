import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getGroupChatStatistic'],
};

export const getGroupChatStatisticDescription: INodeProperties[] = [
	{
		displayName: '数据日期',
		name: 'day_begin_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '起始日期的时间戳，填当天的0时0分0秒',
		description: '起始日期的时间戳',
	},
	{
		displayName: '数据日期（可选）',
		name: 'day_end_time',
		type: 'number',
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '结束日期的时间戳，填当天的0时0分0秒',
		description: '结束日期的时间戳（可选）',
	},
	{
		displayName: '群主ID列表',
		name: 'owner_filter',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON格式，包含userid_list字段',
		description: '群主ID过滤，可选',
	},
	{
		displayName: '排序方式',
		name: 'order_by',
		type: 'options',
		options: [
			{
				name: '新增群数',
				value: 1,
			},
			{
				name: '群总数',
				value: 2,
			},
			{
				name: '新增群人数',
				value: 3,
			},
			{
				name: '群总人数',
				value: 4,
			},
		],
		default: 1,
		displayOptions: {
			show: showOnly,
		},
		hint: '排序方式',
	},
	{
		displayName: '升序还是降序',
		name: 'order_asc',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnly,
		},
		hint: '是否升序，false为降序',
		description: 'Whether to sort in ascending order',
	},
	{
		displayName: '偏移量',
		name: 'offset',
		type: 'number',
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '分页，偏移量',
		description: '分页，偏移量',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: showOnly,
		},
		hint: '分页，每页数据量，最大1000',
		description: 'Max number of results to return',
	},
];

