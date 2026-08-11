import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getUserBehaviorData'],
};

export const getUserBehaviorDataDescription: INodeProperties[] = [
	{
		displayName: '筛选类型',
		name: 'filterType',
		type: 'options',
		options: [
			{ name: '按成员', value: 'user' },
			{ name: '按部门', value: 'party' },
		],
		default: 'user',
		displayOptions: { show: showOnly },
		description: 'Userid和partyid不可同时为空',
	},
	{
		displayName: '成员UserID列表',
		name: 'userid',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, filterType: ['user'] } },
		description: '成员ID列表，用逗号分隔，最多100个。如传入多个userid，则表示获取这些成员总体的联系客户数据',
		placeholder: 'zhangsan,lisi',
	},
	{
		displayName: '部门ID列表',
		name: 'partyid',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, filterType: ['party'] } },
		description: '部门ID列表，用逗号分隔，最多100个',
		placeholder: '1001,1002',
	},
	{
		displayName: '起始时间（必填）',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description:
			'数据起始时间；范围 [start_time,end_time]，跨度≤30 天，最多最近 180 天',
	},
	{
		displayName: '结束时间（必填）',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '数据结束时间；非 0 点时间戳时会向下取整到当天 0 点',
	},
];
