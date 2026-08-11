import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetDeviceCheckinData = {
	resource: ['checkin'],
	operation: ['getDeviceCheckinData'],
};

export const getDeviceCheckinDataDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetDeviceCheckinData,
		},
		default: '',
		description: '查询的起始时间，使用Unix时间戳格式（秒级）。<a href="https://developer.work.weixin.qq.com/document/path/94126" target="_blank">官方文档</a>',
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
		required: true,
		displayOptions: {
			show: showOnlyForGetDeviceCheckinData,
		},
		default: '',
		description: '需要获取设备打卡数据的成员UserID列表，多个UserID用逗号分隔',
	},
];

