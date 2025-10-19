import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeleteTag = {
	resource: ['contact'],
	operation: ['deleteTag'],
};

export const deleteTagDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeleteTag,
		},
		default: '',
		description: '标签ID。',
		hint: '要删除的标签ID',
	},
];

