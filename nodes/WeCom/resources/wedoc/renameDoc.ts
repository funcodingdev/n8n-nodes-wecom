import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRename = {
	resource: ['wedoc'],
	operation: ['renameDoc'],
};

export const renameDocDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForRename,
		},
		default: '',
		description: '文档的docid。',
		hint: '文档ID',
	},
	{
		displayName: '新文档名称',
		name: 'new_name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForRename,
		},
		default: '',
		description: '新的文档名称，最多255个字符。',
		hint: '新文档名称',
	},
];
