import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetRuleDetail = {
	resource: ['linkedcorp'],
	operation: ['getChainRuleDetail'],
};

export const getChainRuleDetailDescription: INodeProperties[] = [
	{
		displayName: '上下游ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetRuleDetail,
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
			show: showOnlyForGetRuleDetail,
		},
		default: '',
		description: '对接规则的唯一ID。',
		hint: '规则ID',
	},
];

