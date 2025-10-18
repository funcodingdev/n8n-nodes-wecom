import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetTag = {
	resource: ['contact'],
	operation: ['getTag'],
};

export const getTagDescription: INodeProperties[] = [
	{
		displayName: '标签 Name or ID',
		name: 'tagid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyGetTag,
		},
		description: '标签 ID。从列表中选择，或使用<a href="https://docs.n8n.io/code/expressions/">表达式</a>指定ID',
	},
];

