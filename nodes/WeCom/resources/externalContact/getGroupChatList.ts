import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getGroupChatList'],
};

export const getGroupChatListDescription: INodeProperties[] = [
	{
		displayName: '状态过滤',
		name: 'status_filter',
		type: 'options',
		options: [
			{
				name: '所有群',
				value: 0,
			},
			{
				name: '正常群',
				value: 1,
			},
			{
				name: '离职成员群',
				value: 2,
			},
			{
				name: '离职成员和离职继承的群',
				value: 3,
			},
		],
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '客户群跟进状态过滤',
		description: '客户群跟进状态过滤',
	},
	{
		displayName: '群主UserID列表',
		name: 'owner_filter',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '群主的userid列表，用逗号分隔',
		description: '群主过滤。如果不填，表示不限',
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '分页查询游标',
		description: '用于分页查询的游标，字符串类型，由上一次调用返回',
	},
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
		hint: '分页，预期请求的数据量，取值范围 1 ~ 1000',
		description: 'Max number of results to return',
	},
];

