import type { INodeProperties } from 'n8n-workflow';

const showOnlyListUserIds = {
	resource: ['contact'],
	operation: ['listUserIds'],
};

export const listUserIdsDescription: INodeProperties[] = [
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyListUserIds,
		},
		description: '分页查询的游标，首次调用不填，后续调用填上次调用返回的 next_cursor 值',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		default: 50,
		displayOptions: {
			show: showOnlyListUserIds,
		},
		hint: '每次拉取的数据量，默认值50，最大值1000',
		description: 'Max number of results to return',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
	},
];

