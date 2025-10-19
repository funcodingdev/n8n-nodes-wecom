import type { INodeProperties } from 'n8n-workflow';

const showOnlyForModContent = {
	resource: ['wedoc'],
	operation: ['modDocContent'],
};

export const modDocContentDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForModContent,
		},
		default: '',
		description: '文档的docid。',
		hint: '文档ID',
	},
	{
		displayName: '文档内容',
		name: 'content',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForModContent,
		},
		default: '{}',
		description: '文档内容，JSON格式。详见API文档。',
		hint: '文档内容JSON',
	},
];
