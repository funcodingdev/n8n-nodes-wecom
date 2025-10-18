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
		description: '标签 ID. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];

