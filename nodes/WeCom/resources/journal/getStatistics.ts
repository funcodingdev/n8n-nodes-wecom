import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetStatistics = {
	resource: ['journal'],
	operation: ['getStatistics'],
};

export const getStatisticsDescription: INodeProperties[] = [
	{
		displayName: '模板类型',
		name: 'template_type',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForGetStatistics,
		},
		options: [
			{ name: '日报', value: 0 },
			{ name: '周报', value: 1 },
			{ name: '月报', value: 2 },
		],
		default: 0,
		description: 'Template type',
		hint: '汇报模板类型：0-日报，1-周报，2-月报',
	},
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetStatistics,
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
			show: showOnlyForGetStatistics,
		},
		default: 0,
		description: 'End time in Unix timestamp format',
		hint: '查询的结束时间（Unix时间戳）',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetStatistics,
		},
		default: '',
		description: 'User ID list separated by commas',
		hint: '成员UserID列表，用逗号分隔，不传则获取全部成员',
	},
];

