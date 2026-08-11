import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMailList = {
	resource: ['mail'],
	operation: ['getMailList'],
};

export const getMailListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'begin_time',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetMailList,
		},
		default: 0,
		placeholder: '1609459200',
		description:
			'查询开始时间 Unix 时间戳（秒）。应用收件箱接口，无需传邮箱地址。<a href="https://developer.work.weixin.qq.com/document/path/97369" target="_blank">官方文档</a>',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetMailList,
		},
		default: 0,
		placeholder: '1609545600',
		description: '查询结束时间 Unix 时间戳（秒）',
	},
	{
		displayName: '邮件数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		displayOptions: {
			show: showOnlyForGetMailList,
		},
		default: 100,
		description: '期望请求的数据量，默认 100，最大 1000',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetMailList,
		},
		default: '',
		placeholder: 'CURSOR_STRING',
		description: '分页游标，取上次响应 next_cursor',
	},
];
