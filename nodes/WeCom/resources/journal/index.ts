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
				name: '批量获取汇报记录单号',
				value: 'getRecordList',
				action: '批量获取汇报记录单号',
				description: 'Batch get journal record IDs',
			},
			{
				name: '获取汇报记录详情',
				value: 'getRecordDetail',
				action: '获取汇报记录详情',
				description: 'Get journal record details',
			},
			{
				name: '获取汇报统计数据',
				value: 'getStatistics',
				action: '获取汇报统计数据',
				description: 'Get journal statistics',
			},
			{
				name: '下载微盘文件',
				value: 'downloadFile',
				action: '下载微盘文件',
				description: 'Download file from WeDrive',
			},
		],
		default: 'getRecordList',
	},
	...getRecordListDescription,
	...getRecordDetailDescription,
	...getStatisticsDescription,
	...downloadFileDescription,
];

