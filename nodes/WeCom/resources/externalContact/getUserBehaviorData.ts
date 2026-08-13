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
		displayName: '成员 UserID 列表',
		name: 'userid',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, filterType: ['user'] } },
		description: '成员 ID 列表，支持逗号、竖线或换行分隔，自动去重，最多 100 个；与下方选择合并',
		placeholder: 'zhangsan,lisi',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: [],
		displayOptions: { show: { ...showOnly, filterType: ['user'] } },
		description: '与上方列表合并去重，合计最多 100 个',
	},
	{
		displayName: '部门 ID 列表',
		name: 'partyid',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, filterType: ['party'] } },
		description: '正整数部门 ID 列表，支持逗号、竖线或换行分隔；与下方选择合并，自动去重，最多 100 个',
		placeholder: '1001,1002',
	},
	{
		displayName: '部门(选择)',
		name: 'partyid_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		default: [],
		displayOptions: { show: { ...showOnly, filterType: ['party'] } },
		description: '与上方部门列表合并去重，合计最多 100 个',
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
