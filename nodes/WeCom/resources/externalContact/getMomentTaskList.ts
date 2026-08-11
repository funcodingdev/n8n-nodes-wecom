import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getMomentTaskList'],
};

export const getMomentTaskListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '朋友圈记录开始时间；起止间隔不能超过 30 天',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '朋友圈记录结束时间',
	},
	{
		displayName: '创建人',
		name: 'creator',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '朋友圈创建人的userid',
	},
	{
		displayName: '朋友圈类型',
		name: 'filter_type',
		type: 'options',
		options: [
			{ name: '所有（企业+个人）', value: 2 },
			{ name: '企业发表', value: 0 },
			{ name: '个人发表', value: 1 },
		],
		default: 2,
		displayOptions: { show: showOnly },
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 20 },
		default: 20,
		displayOptions: { show: showOnly },
		description: '返回的最大记录数，整型，最大值20，默认值20',
	},
];

