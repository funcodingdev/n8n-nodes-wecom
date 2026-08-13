import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeleteRule = {
	resource: ['linkedcorp'],
	operation: ['deleteChainRule'],
};

export const deleteChainRuleDescription: INodeProperties[] = [
	{
		displayName: '上下游 ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeleteRule,
		},
		default: '',
		description: '上下游的唯一ID。',
	},
	{
		displayName: '规则 ID',
		name: 'rule_id',
		type: 'number',
		typeOptions: { minValue: 1 },
		required: true,
		displayOptions: {
			show: showOnlyForDeleteRule,
		},
		default: 1,
		description: '对接规则的唯一ID。',
	},
];
