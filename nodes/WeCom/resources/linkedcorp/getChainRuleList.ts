import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetRuleList = {
	resource: ['linkedcorp'],
	operation: ['getChainRuleList'],
};

export const getChainRuleListDescription: INodeProperties[] = [
	{
		displayName: '上下游ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetRuleList,
		},
		default: '',
		description: '上下游的唯一ID。',
		hint: '上下游ID',
	},
];

