import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getGroupMsgListV2'],
};

export const getGroupMsgListV2Description: INodeProperties[] = [
	{
		displayName: '群发任务类型',
		name: 'chat_type',
		type: 'options',
		options: [
			{
				name: '单聊',
				value: 'single',
			},
			{
				name: '群聊',
				value: 'group',
			},
		],
		required: true,
		default: 'single',
		displayOptions: {
			show: showOnly,
		},
		hint: '群发任务的类型，single-单聊，group-群聊',
		description: '群发任务的类型',
	},
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '群发任务记录开始时间。Unix时间戳',
		description: '群发任务记录开始时间',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '群发任务记录结束时间。Unix时间戳',
		description: '群发任务记录结束时间',
	},
	{
		displayName: '创建人',
		name: 'creator',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '群发任务创建人的userid',
		description: '群发任务创建人的userid',
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
		description: '用于分页查询的游标',
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
		hint: '返回的最大记录数，整型，最大值100',
		description: 'Max number of results to return',
	},
];

