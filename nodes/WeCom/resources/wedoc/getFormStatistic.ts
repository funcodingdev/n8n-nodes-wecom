import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['getFormStatistic'] };
export const getFormStatisticDescription: INodeProperties[] = [
	{
		displayName: '收集表Repeated ID',
		name: 'repeated_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '操作的收集表的repeated_id，来源于get_form_info的返回。收集表的repeated_id',
	},
	{
		displayName: '请求类型',
		name: 'req_type',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '只获取统计结果', value: 1 },
			{ name: '获取已提交列表', value: 2 },
			{ name: '获取未提交列表', value: 3 },
		],
		default: 1,
	},
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: { ...showOnly, req_type: [2] } },
		default: '',
		description: '筛选开始时间，以当天的00:00:00开始筛选',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: { ...showOnly, req_type: [2] } },
		default: '',
		description: '筛选结束时间，以当天的23:59:59结束筛选',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 10000,
		},

		displayOptions: { show: { ...showOnly, req_type: [2, 3] } },
		default: 50,
		description: '分页拉取时批次大小，最大10000',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'number',

		displayOptions: { show: { ...showOnly, req_type: [2, 3] } },
		default: 0,
		description: '分页拉取的游标，首次传0或不传',
	},
];
