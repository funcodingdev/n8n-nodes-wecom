import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetServicerStatistic = {
	resource: ['kf'],
	operation: ['getServicerStatistic'],
};

export const getServicerStatisticDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForGetServicerStatistic,
		},
		default: '',
		description: '客服账号的唯一标识ID，格式为wkxxxx开头的字符串。<a href="https://developer.work.weixin.qq.com/document/path/95490" target="_blank">官方文档</a>.',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
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
		description: '要查询统计数据的接待人员UserID，必须是该客服账号下已添加的接待人员。<a href="https://developer.work.weixin.qq.com/document/path/95490" target="_blank">官方文档</a>',
		placeholder: 'zhangsan',
	},
	{
		displayName: '起始日期',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetServicerStatistic,
		},
		default: '',
		description: '查询统计数据的起始日期，Unix时间戳格式（秒级），必须为当天0点的时间戳。<a href="https://developer.work.weixin.qq.com/document/path/95490" target="_blank">官方文档</a>',
	},
	{
		displayName: '结束日期',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetServicerStatistic,
		},
		default: '',
		description: '查询统计数据的结束日期，Unix时间戳格式（秒级），必须为当天0点的时间戳，最多支持查询最近180天的数据。<a href="https://developer.work.weixin.qq.com/document/path/95490" target="_blank">官方文档</a>',
	},
];

