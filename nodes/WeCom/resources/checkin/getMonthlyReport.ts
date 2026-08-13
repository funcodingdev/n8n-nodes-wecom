import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMonthlyReport = {
	resource: ['checkin'],
	operation: ['getMonthlyReport'],
};

export const getMonthlyReportDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetMonthlyReport,
		},
		default: '',
		description:
			'获取月报的开始时间（月首0点），秒级Unix时间戳。<a href="https://developer.work.weixin.qq.com/document/path/94207" target="_blank">官方文档</a>',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetMonthlyReport,
		},
		default: '',
		description:
			'获取月报的结束时间（月末），秒级Unix时间戳。<a href="https://developer.work.weixin.qq.com/document/path/94207" target="_blank">官方文档</a>',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetMonthlyReport,
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description:
			'需要获取月报的成员 UserID，逗号分隔，最多 100 个；与下方选择合并。<a href="https://developer.work.weixin.qq.com/document/path/94207" target="_blank">官方文档</a>',
	},
	{
		displayName: '成员(选择)',
		name: 'useridlist_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnlyForGetMonthlyReport },
		default: [],
		description: '与上方列表合并去重，合计最多 100 个',
	},
];

