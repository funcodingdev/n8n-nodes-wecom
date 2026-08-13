import type { INodeProperties } from 'n8n-workflow';

export const getMemberOperLogDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getMemberOperLog'],
			},
		},
		default: '',
		description: '开始时间（Unix时间戳，秒），不早于180天前',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getMemberOperLog'],
			},
		},
		default: '',
		description: '结束时间（Unix时间戳，秒），大于start_time，小于当前时间，跨度不能超过7天',
	},
	{
		displayName: '操作类型',
		name: 'oper_type',
		type: 'options',

		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getMemberOperLog'],
			},
		},
		description: '操作类型，不填表示全部',
		options: [
			{ name: '全部', value: 0 },
			{ name: '添加外部联系人', value: 1 },
			{ name: '删除外部联系人', value: 2 },
			{ name: '标记企业客户', value: 3 },
			{ name: '新设备登录', value: 4 },
			{ name: '更换手机号', value: 5 },
			{ name: '绑定微信号', value: 6 },
			{ name: '换绑微信号', value: 7 },
			{ name: '邀请成员', value: 8 },
			{ name: '封禁登录', value: 9 },
			{ name: '修改昵称', value: 11 },
			{ name: '修改姓名', value: 12 },
			{ name: '副设备登录', value: 13 },
			{ name: '确认高级功能订单', value: 15 },
			{ name: '应用变更', value: 16 },
			{ name: '确认会话内容存档订单', value: 17 },
			{ name: '封禁互通', value: 20 },
			{ name: '锁定设备', value: 21 },
		],
		default: 0,
	},
	{
		displayName: '操作者UserID',
		name: 'userid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getMemberOperLog'],
			},
		},
		default: '',
		placeholder: 'zhangsan',
		description: '操作者过滤，需在应用可见范围内；留空表示不过滤',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',

		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getMemberOperLog'],
			},
		},
		default: '',
		description: '分页游标，不填表示首页',
	},
	{
		displayName: '限制条数',
		name: 'limit',
		type: 'number',

		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getMemberOperLog'],
			},
		},
		default: 400,
		description: '最大记录数，默认最多获取400个记录',
		typeOptions: {
			minValue: 1,
			maxValue: 400,
		},
	},
];
