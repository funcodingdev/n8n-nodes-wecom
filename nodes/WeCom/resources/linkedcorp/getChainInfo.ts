import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetChain = {
	resource: ['linkedcorp'],
	operation: ['getChainInfo'],
};

export const getChainInfoDescription: INodeProperties[] = [
	{
		displayName: '上下游ID',
		name: 'chain_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetChain,
		},
		default: '',
		description: '上下游的唯一ID。不填则返回该企业作为上游企业的所有上下游列表。',
		hint: '上下游ID（可选）',
	},
];

