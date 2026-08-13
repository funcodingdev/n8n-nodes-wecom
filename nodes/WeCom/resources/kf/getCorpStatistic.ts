import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCorpStatistic = {
	resource: ['kf'],
	operation: ['getCorpStatistic'],
};

export const getCorpStatisticDescription: INodeProperties[] = [
	{
		displayName: '仅可查询昨天至前 180 天的数据，闭区间跨度最多 31 天；当天数据需次日生成，建议早上 6 点后查询。非零点时间会由企业微信向下取整到当天零点。',
		name: 'corpStatisticNotice',
		type: 'notice',
		displayOptions: { show: showOnlyForGetCorpStatistic },
		default: '',
	},
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForGetCorpStatistic,
		},
		default: '',
		description: '要查询企业汇总统计的客服账号。<a href="https://developer.work.weixin.qq.com/document/path/95489" target="_blank">官方文档</a>',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '起始日期',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetCorpStatistic,
		},
		default: '',
		description: '查询闭区间的起始日期',
	},
	{
		displayName: '结束日期',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetCorpStatistic,
		},
		default: '',
		description: '查询闭区间的结束日期',
	},
];
