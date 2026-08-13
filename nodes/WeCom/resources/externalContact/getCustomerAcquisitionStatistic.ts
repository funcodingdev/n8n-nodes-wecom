import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getCustomerAcquisitionStatistic'],
};

export const getCustomerAcquisitionStatisticDescription: INodeProperties[] = [
	{
		displayName: '获客链接 ID',
		name: 'link_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '获客链接的 ID',
		placeholder: 'caxxxxxxx',
	},
	{
		displayName: '统计起始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '按自然日统计，查询区间为闭区间；仅可查询最近 180 天',
	},
	{
		displayName: '统计结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '按自然日统计；不得早于起始时间，与起始时间相差不可超过 30 天',
	},
];
