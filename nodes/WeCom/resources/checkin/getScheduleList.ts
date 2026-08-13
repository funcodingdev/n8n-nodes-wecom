import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetScheduleList = {
	resource: ['checkin'],
	operation: ['getScheduleList'],
};

export const getScheduleListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetScheduleList,
		},
		default: '',
		description:
			'查询排班的起始时间，使用Unix时间戳格式（秒级）。<a href="https://developer.work.weixin.qq.com/document/path/93380" target="_blank">官方文档</a>',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetScheduleList,
		},
		default: '',
		description: '查询排班的结束时间，使用Unix时间戳格式（秒级）',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetScheduleList,
		},
		default: '',
		description:
			'需要获取排班信息的成员 UserID 列表，支持逗号、中文逗号、竖线或换行分隔，最多 100 个',
	},
];
