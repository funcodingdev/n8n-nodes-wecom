import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['linkedcorp'], operation: ['updateChainRule'] };

export const updateChainRuleDescription: INodeProperties[] = [
	{
		displayName: '上下游ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '上下游的唯一ID',
	},
	{
		displayName: '规则ID',
		name: 'rule_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '对接规则的唯一ID',
	},
	{
		displayName: '规则名称',
		name: 'rule_name',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '新的对接规则名称（可选）',
	},
	{
		displayName: '更新匹配配置',
		name: 'updateConfig',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
	},
	{
		displayName: '匹配类型',
		name: 'match_type',
		type: 'options',
		displayOptions: { show: { ...showOnly, updateConfig: [true] } },
		options: [
			{ name: '按人员', value: 1, description: '按具体人员匹配' },
			{ name: '按部门', value: 2, description: '按部门匹配' },
		],
		default: 1,
		description: '规则的匹配类型',
	},
	{
		displayName: '匹配范围',
		name: 'rangeCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, updateConfig: [true] } },
		default: {},
		placeholder: '添加匹配范围',
		typeOptions: { multipleValues: true },
		description: '匹配范围列表',
		options: [
			{
				displayName: '范围',
				name: 'ranges',
				values: [
					{
						displayName: '类型',
						name: 'type',
						type: 'options',
						default: 1,
						options: [
							{ name: '成员', value: 1 },
							{ name: '部门', value: 2 },
						],
						description: '范围类型',
					},
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						displayOptions: { show: { type: [1] } },
						description: '成员的UserID',
					},
					{
						displayName: '部门ID',
						name: 'partyid',
						type: 'number',
						default: 0,
						displayOptions: { show: { type: [2] } },

					},
				],
			},
		],
	},
];
