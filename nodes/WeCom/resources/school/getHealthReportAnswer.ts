import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetHealthReportAnswer = {
	resource: ['school'],
	operation: ['getHealthReportAnswer'],
};

export const getHealthReportAnswerDescription: INodeProperties[] = [
	{
		displayName: '任务 ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetHealthReportAnswer,
		},
		default: '',
		placeholder: 'jobid_1',
		description: '健康上报任务 ID',
	},
	{
		displayName: '上报日期',
		name: 'date',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnlyForGetHealthReportAnswer,
		},
		default: '',
		placeholder: '2020-03-27',
		description: '具体某天的填写答案，仅支持最近 14 天数据。<a href="https://developer.work.weixin.qq.com/document/path/93679" target="_blank">官方文档</a>',
	},
	{
		displayName: '分页起始位置',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: showOnlyForGetHealthReportAnswer,
		},
		default: 0,
		description: '分页起始位置，默认 0',
		typeOptions: { minValue: 0, maxValue: 4294967295, numberStepSize: 1 },
	},
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
			numberStepSize: 1,
		},
		displayOptions: {
			show: showOnlyForGetHealthReportAnswer,
		},
		default: 100,
		description: '每次拉取数量，默认及最大均为 100',
	},
];
