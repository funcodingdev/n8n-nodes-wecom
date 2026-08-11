import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['listContactWay'],
};

export const listContactWayDescription: INodeProperties[] = [
	{
		displayName: '创建起始时间',
		name: 'start_time',
		type: 'dateTime',
		default: '',
		displayOptions: { show: showOnly },
		description:
			'「联系我」创建起始时间；空默认 90 天前。仅可获取 2021-07-10 以后创建的「联系我」',
	},
	{
		displayName: '创建结束时间',
		name: 'end_time',
		type: 'dateTime',
		default: '',
		displayOptions: { show: showOnly },
		description: '「联系我」创建结束时间；空默认当前时间',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '分页查询使用的游标，为上次请求返回的next_cursor',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 100,
		displayOptions: { show: showOnly },
		description: '每次查询的分页大小，默认为100条，最多支持1000条',
	},
];
