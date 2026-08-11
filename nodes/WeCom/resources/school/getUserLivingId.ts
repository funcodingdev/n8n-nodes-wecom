import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetUserLivingId = {
	resource: ['school'],
	operation: ['getUserLivingId'],
};

export const getUserLivingIdDescription: INodeProperties[] = [
	{
		displayName: '老师UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetUserLivingId,
		},
		default: '',
		placeholder: 'teacher_001',
		description: '老师的用户ID',
	},
	{
		displayName: '开始时间',
		name: 'begin_time',
		type: 'dateTime',
		displayOptions: {
			show: showOnlyForGetUserLivingId,
		},
		default: '',
		description: '起始时间 begin_time（Unix 秒）',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		displayOptions: {
			show: showOnlyForGetUserLivingId,
		},
		default: '',
		description: '结束时间 end_time（Unix 秒）',
	},
	{
		displayName: '分页游标',
		name: 'next_key',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetUserLivingId,
		},
		default: '',
		description: '上次请求返回的 next_key',
	},
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: showOnlyForGetUserLivingId,
		},
		default: 50,
		description: '每次拉取数量，默认 50，最大 100',
	},
];
