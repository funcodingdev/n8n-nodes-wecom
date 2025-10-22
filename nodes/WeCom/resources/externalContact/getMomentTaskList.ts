import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getMomentTaskList'],
};

export const getMomentTaskListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '朋友圈记录开始时间。Unix时间戳',
		description: '朋友圈记录开始时间',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '朋友圈记录结束时间。Unix时间戳',
		description: '朋友圈记录结束时间',
	},
	{
		displayName: '创建人',
		name: 'creator',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '朋友圈创建人的userid',
		description: '朋友圈创建人的userid',
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '用于分页查询的游标',
		description: '用于分页查询的游标，字符串类型，由上一次调用返回',
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
		hint: '返回的最大记录数，整型，最大值100',
		description: 'Max number of results to return',
	},
];

