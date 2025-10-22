import type { INodeProperties } from 'n8n-workflow';

const showOnlyForManageRules = {
	resource: ['checkin'],
	operation: ['manageRules'],
};

export const manageRulesDescription: INodeProperties[] = [
	{
		displayName: '操作类型',
		name: 'action',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForManageRules,
		},
		options: [
			{ name: '创建规则', value: 'create' },
			{ name: '更新规则', value: 'update' },
			{ name: '删除规则', value: 'delete' },
		],
		default: 'create',
		description: 'Action type for managing check-in rules',
		hint: '管理打卡规则的操作类型',
	},
	{
		displayName: '规则信息',
		name: 'ruleInfo',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForManageRules,
		},
		default: '{}',
		description: 'Rule information in JSON format',
		hint: '打卡规则信息，JSON格式',
	},
];

