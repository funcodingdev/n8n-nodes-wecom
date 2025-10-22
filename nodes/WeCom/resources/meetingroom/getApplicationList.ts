import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetApplicationList = {
	resource: ['meetingroom'],
	operation: ['getApplicationList'],
};

export const getApplicationListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetApplicationList,
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
			show: showOnlyForGetApplicationList,
		},
		default: 0,
		description: 'End time in Unix timestamp format',
		hint: '查询的结束时间（Unix时间戳）',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetApplicationList,
		},
		default: '',
		description: 'Cursor for pagination',
		hint: '分页游标',
	},
	{
		displayName: '每次拉取数量',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: showOnlyForGetApplicationList,
		},
		default: 100,
		description: 'Number of records to fetch',
		hint: '每次拉取的数量',
	},
];

