import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSearchMailGroup = {
	resource: ['mail'],
	operation: ['searchMailGroup'],
};

export const searchMailGroupDescription: INodeProperties[] = [
	{
		displayName: '搜索关键词',
		name: 'fuzzy_groupid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSearchMailGroup,
		},
		default: '',
		description: '模糊搜索的关键词',
		hint: '搜索关键词',
	},
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: showOnlyForSearchMailGroup,
		},
		default: 100,
		description: '返回的群组数量，默认100',
		hint: '返回数量',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForSearchMailGroup,
		},
		default: '',
		description: '分页游标',
		hint: '分页游标（可选）',
	},
];

