import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateRule = {
	resource: ['linkedcorp'],
	operation: ['updateChainRule'],
};

export const updateChainRuleDescription: INodeProperties[] = [
	{
		displayName: '上下游ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateRule,
		},
		default: '',
		description: '上下游的唯一ID。',
		hint: '上下游ID',
	},
	{
		displayName: '规则ID',
		name: 'rule_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateRule,
		},
		default: '',
		description: '对接规则的唯一ID。',
		hint: '规则ID',
	},
	{
		displayName: '规则名称',
		name: 'rule_name',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateRule,
		},
		default: '',
		description: '对接规则名称。',
		hint: '规则名称（可选）',
	},
	{
		displayName: '规则配置',
		name: 'rule_config',
		type: 'json',
		displayOptions: {
			show: showOnlyForUpdateRule,
		},
		default: '{}',
		description: '对接规则配置，JSON格式。包含match_type（匹配类型）、range（匹配范围）等。',
		hint: '规则配置JSON（可选）',
	},
];

