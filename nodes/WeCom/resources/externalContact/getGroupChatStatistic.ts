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
		displayName: '群主 UserID 列表',
		name: 'owner_userid_list',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '支持逗号、竖线或换行分隔，最多 100 个；与下方选择合并。留空查询应用可见范围内全部群主',
		placeholder: 'zhangsan,lisi',
	},
	{
		displayName: '群主(选择)',
		name: 'owner_userid_list_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: [],
		displayOptions: { show: showOnly },
		description: '与上方列表合并去重，合计最多 100 个',
	},
	{
		displayName: '群主列表 JSON',
		name: 'ownerUseridListJson',
		type: 'json',
		default: '[]',
		displayOptions: { show: showOnly },
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
	{
		displayName: '留空查询全部群主时，如果应用可见范围超过 1000 人，企业微信会返回错误码 81017。建议填写群主列表以控制结果范围。',
		name: 'allOwnersNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
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
		typeOptions: { minValue: 0 },
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
