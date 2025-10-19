import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelete = {
	resource: ['wedoc'],
	operation: ['deleteDoc'],
};

export const deleteDocDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDelete,
		},
		default: '',
		description: '文档的docid。',
		hint: '文档ID',
	},
];
