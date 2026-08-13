import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetHealthReportStat = {
	resource: ['school'],
	operation: ['getHealthReportStat'],
};

export const getHealthReportStatDescription: INodeProperties[] = [
	{
		displayName: '权限与日期限制',
		name: 'healthReportStatNotice',
		type: 'notice',
		displayOptions: { show: showOnlyForGetHealthReportStat },
		default: '',
		description: '仅配置为“健康上报 - 可调用接口的应用”的自建应用可调用；第三方及代开发应用暂不支持。仅可获取最近 30 天内的数据。',
	},
	{
		displayName: '日期',
		name: 'date',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetHealthReportStat,
		},
		default: '',
		placeholder: '2020-03-27',
		description: '具体某天的使用统计，节点会按 YYYY-MM-DD 发送。<a href="https://developer.work.weixin.qq.com/document/path/93676" target="_blank">官方文档</a>',
	},
];
