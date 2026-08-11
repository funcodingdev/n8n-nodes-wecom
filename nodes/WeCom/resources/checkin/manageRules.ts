import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['checkin'], operation: ['manageRules'] };

export const manageRulesDescription: INodeProperties[] = [
	{
		displayName: '操作类型',
		name: 'action',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '创建规则', value: 'create' },
			{ name: '更新规则', value: 'update' },
			{ name: '删除规则', value: 'delete' },
		],
		default: 'create',
		description: '管理打卡规则的操作类型。<a href="https://developer.work.weixin.qq.com/document/path/98041" target="_blank">官方文档</a>',
	},
	{
		displayName: '规则ID',
		name: 'groupid',
		type: 'number',
		displayOptions: { show: { ...showOnly, action: ['update', 'delete'] } },
		default: 0,
		required: true,
		description: '打卡规则的ID（更新/删除时必填）',
	},
	{
		displayName: '规则名称',
		name: 'groupname',
		type: 'string',
		displayOptions: { show: { ...showOnly, action: ['create', 'update'] } },
		default: '',
		description: '打卡规则名称',
	},
	{
		displayName: '规则类型',
		name: 'grouptype',
		type: 'options',
		displayOptions: { show: { ...showOnly, action: ['create'] } },
		options: [
			{ name: '固定时间上下班', value: 1 },
			{ name: '按班次上下班', value: 2 },
			{ name: '自由上下班', value: 3 },
		],
		default: 1,
		description: '打卡规则类型',
	},
	{
		displayName: '成员列表',
		name: 'memberCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, action: ['create', 'update'] } },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description: '打卡规则应用的成员列表',
		options: [
			{
				displayName: '成员',
				name: 'members',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '成员的UserID',
					},
				],
			},
		],
	},
	{
		displayName: '使用高级配置(JSON)',
		name: 'useAdvancedConfig',
		type: 'boolean',
		displayOptions: { show: { ...showOnly, action: ['create', 'update'] } },
		default: false,
		description: '打卡规则有很多高级配置项，启用此选项可以通过JSON配置',
	},
	{
		displayName: '高级配置JSON',
		name: 'advancedConfig',
		type: 'json',
		displayOptions: { show: { ...showOnly, action: ['create', 'update'], useAdvancedConfig: [true] } },
		default: '{}',
		description: '打卡规则的高级配置，包括打卡时间、地点等',
	},
];
