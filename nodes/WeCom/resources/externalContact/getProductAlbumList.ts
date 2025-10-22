import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getProductAlbumList'],
};

export const getProductAlbumListDescription: INodeProperties[] = [
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: showOnly,
		},
		hint: '返回的最大记录数，整型，最大值50',
		description: 'Max number of results to return',
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '用于分页查询的游标',
		description: '用于分页查询的游标，字符串类型，由上一次调用返回',
	},
];

