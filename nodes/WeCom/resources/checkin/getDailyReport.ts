import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetDailyReport = {
	resource: ['checkin'],
	operation: ['getDailyReport'],
};

export const getDailyReportDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetDailyReport,
		},
		default: '',
		description:
			'查询的起始日期，使用Unix时间戳格式（秒级）。<a href="https://developer.work.weixin.qq.com/document/path/93374" target="_blank">官方文档</a>',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetDailyReport,
		},
		default: '',
		description: '查询的结束日期，使用Unix时间戳格式（秒级）',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetDailyReport,
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description: '需要获取日报的成员 UserID，支持逗号/竖线/换行分隔，最多 100 个；与下方选择合并',
	},
	{
		displayName: '成员(选择)',
		name: 'useridlist_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnlyForGetDailyReport },
		default: [],
		description: '与上方列表合并去重，合计最多 100 个',
	},
];

