import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getCustomerAcquisitionStatistic'],
};

export const getCustomerAcquisitionStatisticDescription: INodeProperties[] = [
	{
		displayName: '获客链接ID',
		name: 'link_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '获客链接的ID',
		placeholder: 'caxxxxxxx',
	},
	{
		displayName: '统计起始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '统计起始时间 start_time（Unix 秒）；仅可查询最近 180 天',
	},
	{
		displayName: '统计结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '统计结束时间 end_time（Unix 秒）；与起始相差不可超过 30 天',
	},
];
