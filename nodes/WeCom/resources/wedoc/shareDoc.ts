import type { INodeProperties } from 'n8n-workflow';

const showOnlyForShare = {
	resource: ['wedoc'],
	operation: ['shareDoc'],
};

export const shareDocDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForShare,
		},
		default: '',
		description: '文档的docid。',
		hint: '文档ID',
	},
];
