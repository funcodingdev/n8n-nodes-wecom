import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetServicerStatistic = {
	resource: ['kf'],
	operation: ['getServicerStatistic'],
};

export const getServicerStatisticDescription: INodeProperties[] = [
	{
		displayName: '客服账号ID',
		name: 'open_kfid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetServicerStatistic,
		},
		default: '',
		hint: '客服账号ID',
	},
	{
		displayName: '接待人员UserID',
		name: 'servicer_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetServicerStatistic,
		},
		default: '',
		hint: '接待人员的userid',
	},
	{
		displayName: '起始日期',
		name: 'start_time',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetServicerStatistic,
		},
		default: 0,
		hint: '起始日期的时间戳',
	},
	{
		displayName: '结束日期',
		name: 'end_time',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetServicerStatistic,
		},
		default: 0,
		hint: '结束日期的时间戳',
	},
];

