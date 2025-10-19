import type { INodeProperties } from 'n8n-workflow';

const showOnlyForModSheet = {
	resource: ['wedoc'],
	operation: ['modSheetContent'],
};

export const modSheetContentDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForModSheet,
		},
		default: '',
		description: '表格文档的docid。',
		hint: '文档ID',
	},
	{
		displayName: '表格内容',
		name: 'content',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForModSheet,
		},
		default: '{}',
		description: '表格内容，JSON格式。详见API文档。',
		hint: '表格内容JSON',
	},
];
