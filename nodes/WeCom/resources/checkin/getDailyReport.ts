import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetDailyReport = {
	resource: ['checkin'],
	operation: ['getDailyReport'],
};

export const getDailyReportDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetDailyReport,
		},
		default: 0,
		description: 'Start time in Unix timestamp format',
		hint: '查询的起始日期（Unix时间戳）',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetDailyReport,
		},
		default: 0,
		description: 'End time in Unix timestamp format',
		hint: '查询的结束日期（Unix时间戳）',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetDailyReport,
		},
		default: '',
		description: 'User ID list separated by commas',
		hint: '需要获取日报的成员UserID列表，用逗号分隔',
	},
];

