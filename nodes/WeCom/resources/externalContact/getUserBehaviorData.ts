import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getUserBehaviorData'],
};

export const getUserBehaviorDataDescription: INodeProperties[] = [
	{
		displayName: '成员UserID列表',
		name: 'userid',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '成员ID列表，用逗号分隔，最多100个',
		description: '成员ID列表',
	},
	{
		displayName: '起始日期',
		name: 'start_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '数据起始时间，Unix时间戳',
		description: '数据起始时间',
	},
	{
		displayName: '结束日期',
		name: 'end_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '数据结束时间，Unix时间戳',
		description: '数据结束时间',
	},
];

