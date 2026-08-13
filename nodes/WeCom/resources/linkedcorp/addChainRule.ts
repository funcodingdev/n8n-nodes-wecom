import type { INodeProperties } from 'n8n-workflow';
import { ruleInfoFields } from './ruleInfoFields';

const showOnly = { resource: ['linkedcorp'], operation: ['addChainRule'] };

export const addChainRuleDescription: INodeProperties[] = [
	{
		displayName: '上下游 ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
	},
	...ruleInfoFields('addChainRule'),
];
