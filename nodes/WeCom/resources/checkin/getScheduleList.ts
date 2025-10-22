import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetScheduleList = {
	resource: ['checkin'],
	operation: ['getScheduleList'],
};

export const getScheduleListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetScheduleList,
		},
		default: 0,
		description: 'Start time in Unix timestamp format',
		hint: '查询排班的起始时间（Unix时间戳）',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetScheduleList,
		},
		default: 0,
		description: 'End time in Unix timestamp format',
		hint: '查询排班的结束时间（Unix时间戳）',
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
		description: 'User ID list separated by commas',
		hint: '需要获取排班信息的成员UserID列表，用逗号分隔',
	},
];

