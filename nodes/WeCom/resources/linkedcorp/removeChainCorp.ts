import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRemove = {
	resource: ['linkedcorp'],
	operation: ['removeChainCorp'],
};

export const removeChainCorpDescription: INodeProperties[] = [
	{
		displayName: '上下游ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForRemove,
		},
		default: '',
		description: '上下游的唯一ID。',
		hint: '上下游ID',
	},
	{
		displayName: '企业CorpID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForRemove,
		},
		default: '',
		description: '要移除的企业corpid。',
		hint: '企业CorpID',
	},
];

