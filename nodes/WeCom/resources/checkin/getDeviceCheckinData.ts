import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetDeviceCheckinData = {
	resource: ['checkin'],
	operation: ['getDeviceCheckinData'],
};

export const getDeviceCheckinDataDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetDeviceCheckinData,
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
			show: showOnlyForGetDeviceCheckinData,
		},
		default: 0,
		description: 'End time in Unix timestamp format',
		hint: '查询的结束时间（Unix时间戳）',
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
		description: 'User ID list separated by commas',
		hint: '需要获取设备打卡数据的成员UserID列表，用逗号分隔',
	},
];

