import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetServicerStatistic = {
	resource: ['kf'],
	operation: ['getServicerStatistic'],
};

export const getServicerStatisticDescription: INodeProperties[] = [
	{
		displayName: '统计日期限制',
		name: 'servicerStatisticNotice',
		type: 'notice',
		displayOptions: { show: showOnlyForGetServicerStatistic },
		default: '',
		description: '仅可查询昨天至前 180 天的数据，闭区间跨度最多 31 天；不选择接待人员时返回客服账号维度汇总数据。',
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
			show: showOnlyForGetServicerStatistic,
		},
		default: '',
		description: '要查询接待统计的客服账号。<a href="https://developer.work.weixin.qq.com/document/path/95490" target="_blank">官方文档</a>',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '接待人员',
		name: 'servicer_userid',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: showOnlyForGetServicerStatistic,
		},
		default: '',
		description: '可选。选择后返回该接待人员在此客服账号下的数据；留空返回客服账号维度汇总数据。第三方应用使用密文 UserID。<a href="https://developer.work.weixin.qq.com/document/path/95490" target="_blank">官方文档</a>',
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
		description: '查询闭区间的起始日期',
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
		description: '查询闭区间的结束日期',
	},
];
