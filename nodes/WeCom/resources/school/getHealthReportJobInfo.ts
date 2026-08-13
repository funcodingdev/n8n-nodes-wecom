import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetHealthReportJobInfo = {
	resource: ['school'],
	operation: ['getHealthReportJobInfo'],
};

export const getHealthReportJobInfoDescription: INodeProperties[] = [
	{
		displayName: '任务 ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetHealthReportJobInfo,
		},
		default: '',
		placeholder: 'jobid_1',
		description: '健康上报任务 ID',
	},
	{
		displayName: '任务日期',
		name: 'date',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetHealthReportJobInfo,
		},
		default: '',
		description: '具体某天的任务详情，仅支持最近 14 天数据。<a href="https://developer.work.weixin.qq.com/document/path/93678" target="_blank">官方文档</a>',
	},
];
