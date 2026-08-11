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
				name: '发送给客户（单聊）',
				value: 'single',
			},
			{
				name: '发送给客户群（群聊）',
				value: 'group',
			},
		],
		required: true,
		default: 'single',
		displayOptions: {
			show: showOnly,
		},
		description: '群发任务的类型，默认为single表示发送给客户，group表示发送给客户群',
	},
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '群发任务记录开始时间；起止间隔不能超过 1 个月',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '群发任务记录结束时间；起止间隔不能超过 1 个月',
	},
	{
		displayName: '创建人',
		name: 'creator',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '群发任务创建人企业账号ID',
	},
	{
		displayName: '创建人类型',
		name: 'filter_type',
		type: 'options',
		options: [
			{
				name: '企业发表',
				value: 0,
				description: '管理员或业务负责人创建的内容',
			},
			{
				name: '个人发表',
				value: 1,
				description: '成员自己创建的内容',
			},
			{
				name: '所有',
				value: 2,
				description: '包括个人创建以及企业创建',
			},
		],
		default: 2,
		displayOptions: {
			show: showOnly,
		},
		description: '创建人类型筛选，默认为所有类型',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		displayOptions: {
			show: showOnly,
		},
		description: '返回的最大记录数，整型，最大值100，默认值50',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '用于分页查询的游标，由上一次调用返回，首次调用可不填',
	},
];

