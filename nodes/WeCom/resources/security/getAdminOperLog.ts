import type { INodeProperties } from 'n8n-workflow';

export const getAdminOperLogDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getAdminOperLog'],
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
				operation: ['getAdminOperLog'],
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
				operation: ['getAdminOperLog'],
			},
		},
		description: '操作类型，不填表示全部',
		options: [
			{
				name: '全部',
				value: 0,
			},
			{
				name: '权限管理变更',
				value: 2,
				description: '绑定/解绑手机、修改密保邮箱、修改登录密码、分级管理员管理等',
			},
			{
				name: '成员与部门变更',
				value: 3,
				description: '新增/删除/移动部门、新增/删除/移动成员、更改成员信息等',
			},
			{
				name: '其它',
				value: 7,
				description: '其他操作类型',
			},
			{
				name: '应用变更',
				value: 8,
				description: '新增/删除/修改应用、启用/停用应用等',
			},
			{
				name: '通讯录与聊天管理',
				value: 11,
				description: '导出通讯录、设置通讯录水印、群聊设置等',
			},
			{
				name: '企业信息管理',
				value: 12,
				description: '更改企业名称、logo、信息、认证等',
			},
			{
				name: '外部联系人管理',
				value: 13,
				description: '修改外部联系人权限设置等',
			},
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
				operation: ['getAdminOperLog'],
			},
		},
		default: '',
		placeholder: 'zhangsan',
		description: '操作者过滤，留空表示不过滤',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',

		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getAdminOperLog'],
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
				operation: ['getAdminOperLog'],
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
