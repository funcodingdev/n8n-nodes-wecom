import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetSubChain = {
	resource: ['linkedcorp'],
	operation: ['getSubCorpChainList'],
};

export const getSubCorpChainListDescription: INodeProperties[] = [
	{
		displayName: '下级企业CorpID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetSubChain,
		},
		default: '',
		description: '下级企业的corpid。',
		hint: '企业CorpID',
	},
];

