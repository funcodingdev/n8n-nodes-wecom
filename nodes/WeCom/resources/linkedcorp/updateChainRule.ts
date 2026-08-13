import type { INodeProperties } from 'n8n-workflow';
import { ruleInfoFields } from './ruleInfoFields';

const showOnly = { resource: ['linkedcorp'], operation: ['updateChainRule'] };

export const updateChainRuleDescription: INodeProperties[] = [
	{
		displayName: '上下游 ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
	},
	{
		displayName: '规则 ID',
		name: 'rule_id',
		type: 'number',
		typeOptions: { minValue: 1 },
		required: true,
		displayOptions: { show: showOnly },
		default: 1,
	},
	...ruleInfoFields('updateChainRule'),
];
