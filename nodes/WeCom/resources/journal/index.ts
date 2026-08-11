import type { INodeProperties } from 'n8n-workflow';

import { getRecordListDescription } from './getRecordList';
import { getRecordDetailDescription } from './getRecordDetail';
import { getStatisticsDescription } from './getStatistics';
import { downloadFileDescription } from './downloadFile';

const showOnlyForJournal = {
	resource: ['journal'],
};

export const journalDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForJournal,
		},
		options: [
			{
				name: '[汇报记录] 批量获取汇报记录单号',
				value: 'getRecordList',
				action: '批量获取汇报记录单号',
				description: '批量获取汇报记录的单号列表',
			},
			{
				name: '[汇报记录] 获取汇报记录详情',
				value: 'getRecordDetail',
				action: '获取汇报记录详情',
				description: '获取指定汇报记录的详细信息',
			},
			{
				name: '[汇报统计] 获取汇报统计数据',
				value: 'getStatistics',
				action: '获取汇报统计数据',
				description: '获取汇报的统计分析数据',
			},
			{
				name: '[汇报附件] 下载微盘文件',
				value: 'downloadFile',
				action: '下载微盘文件',
				description: '下载汇报中的微盘附件（oa/journal/download_wedrive_file）',
			},
		],
		default: 'getRecordList',
	},
	...getRecordListDescription,
	...getRecordDetailDescription,
	...getStatisticsDescription,
	...downloadFileDescription,
];

