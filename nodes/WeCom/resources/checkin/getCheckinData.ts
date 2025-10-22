import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCheckinData = {
	resource: ['checkin'],
	operation: ['getCheckinData'],
};

export const getCheckinDataDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetCheckinData,
		},
		default: 0,
		description: 'Start time in Unix timestamp format',
		hint: '获取打卡数据的起始时间（Unix时间戳）',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetCheckinData,
		},
		default: 0,
		description: 'End time in Unix timestamp format',
		hint: '获取打卡数据的结束时间（Unix时间戳）',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetCheckinData,
		},
		default: '',
		description: 'User ID list separated by commas, up to 100 users',
		hint: '需要获取打卡数据的成员UserID列表，用逗号分隔，最多100个',
	},
	{
		displayName: '打卡类型',
		name: 'opencheckindatatype',
		type: 'options',
		displayOptions: {
			show: showOnlyForGetCheckinData,
		},
		options: [
			{ name: '全部打卡', value: 3 },
			{ name: '上下班打卡', value: 1 },
			{ name: '外出打卡', value: 2 },
		],
		default: 3,
		description: 'Check-in data type',
		hint: '打卡类型：1-上下班打卡，2-外出打卡，3-全部',
	},
];

