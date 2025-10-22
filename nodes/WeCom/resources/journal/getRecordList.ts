import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetRecordList = {
	resource: ['journal'],
	operation: ['getRecordList'],
};

export const getRecordListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetRecordList,
		},
		default: 0,
		description: 'Start time in Unix timestamp format',
		hint: '查询的起始时间（Unix时间戳）',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetRecordList,
		},
		default: 0,
		description: 'End time in Unix timestamp format',
		hint: '查询的结束时间（Unix时间戳）',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'number',
		displayOptions: {
			show: showOnlyForGetRecordList,
		},
		default: 0,
		description: 'Cursor for pagination',
		hint: '分页游标，从0开始',
	},
	{
		displayName: '每次拉取数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			maxValue: 100,
		},
		displayOptions: {
			show: showOnlyForGetRecordList,
		},
		default: 50,
		description: 'Max number of results to return',
		hint: '每次拉取的数量，最大100',
	},
	{
		displayName: '筛选条件',
		name: 'filters',
		type: 'json',
		displayOptions: {
			show: showOnlyForGetRecordList,
		},
		default: '[]',
		description: 'Filter conditions in JSON format',
		hint: '筛选条件，JSON格式数组',
	},
];

