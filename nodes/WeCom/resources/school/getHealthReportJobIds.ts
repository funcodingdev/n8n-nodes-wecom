import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetHealthReportJobIds = {
	resource: ['school'],
	operation: ['getHealthReportJobIds'],
};

export const getHealthReportJobIdsDescription: INodeProperties[] = [
	{
		displayName: '分页起始位置',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: showOnlyForGetHealthReportJobIds,
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
			show: showOnlyForGetHealthReportJobIds,
		},
		default: 100,
		description: '每次拉取数量，默认及最大均为 100；根据响应 ending 判断是否继续分页。<a href="https://developer.work.weixin.qq.com/document/path/93677" target="_blank">官方文档</a>',
	},
];
