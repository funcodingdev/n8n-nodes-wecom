import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['journal'], operation: ['getStatistics'] };

export const getStatisticsDescription: INodeProperties[] = [
	{
		displayName: '汇报模板ID',
		name: 'template_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '需要查询统计数据的汇报表单 ID，不超过 256 字节',
	},
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '统计起始时间',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '统计结束时间，必须晚于开始时间，时间区间最长一年',
	},
];
