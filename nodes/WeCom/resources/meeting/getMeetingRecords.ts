import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['meeting'],
	operation: ['getMeetingRecords'],
};

export const getMeetingRecordsDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGet,
		},
		default: 0,
		description: 'Start time (Unix timestamp)',
		hint: '开始时间（Unix时间戳）',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGet,
		},
		default: 0,
		description: 'End time (Unix timestamp)',
		hint: '结束时间（Unix时间戳）',
	},
	{
		displayName: '用户ID',
		name: 'userid',
		type: 'string',
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: 'User ID, optional',
		hint: '用户ID，可选',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: 'Pagination cursor',
		hint: '分页游标',
	},
	{
		displayName: '限制数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showOnlyForGet,
		},
		default: 50,
		description: 'Max number of results to return',
		hint: '返回的记录数量',
	},
];

