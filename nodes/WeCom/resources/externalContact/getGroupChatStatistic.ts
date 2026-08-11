import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['getGroupChatStatistic'] };

export const getGroupChatStatisticDescription: INodeProperties[] = [
	{
		displayName: '统计方式',
		name: 'statistic_type',
		type: 'options',
		options: [
			{ name: '按群主聚合', value: 'by_owner', description: '按群主维度聚合统计数据' },
			{ name: '按自然日聚合', value: 'by_day', description: '按自然日维度聚合统计数据' },
		],
		default: 'by_owner',
		displayOptions: { show: showOnly },
		description: '选择统计数据的聚合方式',
	},
	{
		displayName: '起始日期（必填）',
		name: 'day_begin_time',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description:
			'起始日期 day_begin_time，建议当天 0 点；取值范围：昨天至前 180 天',
	},
	{
		displayName: '结束日期',
		name: 'day_end_time',
		type: 'dateTime',
		default: '',
		displayOptions: { show: showOnly },
		description: '结束日期 day_end_time；空则默认同起始日期；最大跨度 30 天',
	},
	{
		displayName: '群主UserID列表（必填）',
		name: 'owner_userid_list',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '群主ID列表，用逗号分隔，最多100个。如果不指定，超过1000人会报错81017',
		placeholder: 'zhangsan,lisi',
	},
	// 以下参数仅在"按群主聚合"时显示
	{
		displayName: '排序方式',
		name: 'order_by',
		type: 'options',
		options: [
			{ name: '新增群的数量', value: 1 },
			{ name: '群总数', value: 2 },
			{ name: '新增群人数', value: 3 },
			{ name: '群总人数', value: 4 },
		],
		default: 1,
		displayOptions: { show: { ...showOnly, statistic_type: ['by_owner'] } },
		description: '排序方式，默认为1（新增群的数量）',
	},
	{
		displayName: '升序排列',
		name: 'order_asc',
		type: 'boolean',
		default: false,
		displayOptions: { show: { ...showOnly, statistic_type: ['by_owner'] } },
		description: '是否升序排列。false-降序（默认），true-升序',
	},
	{
		displayName: '偏移量',
		name: 'offset',
		type: 'number',
		default: 0,
		displayOptions: { show: { ...showOnly, statistic_type: ['by_owner'] } },
		description: '分页，偏移量，默认为0',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 500,
		displayOptions: { show: { ...showOnly, statistic_type: ['by_owner'] } },
		description: '分页，预期请求的数据量，默认为500，取值范围1~1000',
	},
];
