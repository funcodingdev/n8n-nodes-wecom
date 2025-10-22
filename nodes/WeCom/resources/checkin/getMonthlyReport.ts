import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMonthlyReport = {
	resource: ['checkin'],
	operation: ['getMonthlyReport'],
};

export const getMonthlyReportDescription: INodeProperties[] = [
	{
		displayName: '月份',
		name: 'month',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetMonthlyReport,
		},
		default: 0,
		description: 'Month in Unix timestamp format (e.g., the first day of the month)',
		hint: '查询的月份，Unix时间戳（如月份第一天）',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetMonthlyReport,
		},
		default: '',
		description: 'User ID list separated by commas',
		hint: '需要获取月报的成员UserID列表，用逗号分隔',
	},
];

