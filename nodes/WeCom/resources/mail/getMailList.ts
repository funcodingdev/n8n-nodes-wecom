import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMailList = {
	resource: ['mail'],
	operation: ['getMailList'],
};

export const getMailListDescription: INodeProperties[] = [
	{
		displayName: '邮箱地址',
		name: 'mailbox',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetMailList,
		},
		default: '',
		description: '要查询的邮箱地址',
		hint: '邮箱地址',
	},
	{
		displayName: '开始时间',
		name: 'begin_time',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetMailList,
		},
		default: 0,
		description: '开始时间戳',
		hint: '开始时间戳',
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
		description: '结束时间戳',
		hint: '结束时间戳',
	},
	{
		displayName: '邮件数量',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: showOnlyForGetMailList,
		},
		default: 100,
		description: '返回的邮件数量，默认100，最大1000',
		hint: '邮件数量',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetMailList,
		},
		default: '',
		description: '分页游标',
		hint: '分页游标（可选）',
	},
];

