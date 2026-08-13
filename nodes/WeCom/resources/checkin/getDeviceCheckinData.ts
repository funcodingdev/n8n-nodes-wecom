import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetDeviceCheckinData = {
	resource: ['checkin'],
	operation: ['getDeviceCheckinData'],
};

export const getDeviceCheckinDataDescription: INodeProperties[] = [
	{
		displayName: '过滤时间类型',
		name: 'filter_type',
		type: 'options',
		displayOptions: { show: showOnlyForGetDeviceCheckinData },
		options: [
			{ name: '按打卡时间', value: 1 },
			{ name: '按设备上传记录时间', value: 2 },
		],
		default: 1,
		description: '开始和结束时间所代表的时间类型',
	},
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetDeviceCheckinData,
		},
		default: '',
		description:
			'查询的起始时间，使用Unix时间戳格式（秒级）。<a href="https://developer.work.weixin.qq.com/document/path/94126" target="_blank">官方文档</a>',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetDeviceCheckinData,
		},
		default: '',
		description: '查询的结束时间，使用Unix时间戳格式（秒级）',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetDeviceCheckinData,
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description:
			'需要获取设备打卡数据的成员 UserID，支持逗号/竖线/换行分隔，最多 100 个；与下方选择合并',
	},
	{
		displayName: '成员(选择)',
		name: 'useridlist_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnlyForGetDeviceCheckinData },
		default: [],
		description: '与上方列表合并去重，合计最多 100 个',
	},
];

