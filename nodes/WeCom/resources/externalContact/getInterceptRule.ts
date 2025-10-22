import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getInterceptRule'],
};

export const getInterceptRuleDescription: INodeProperties[] = [
	{
		displayName: '规则ID',
		name: 'rule_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '规则id',
	},
];

