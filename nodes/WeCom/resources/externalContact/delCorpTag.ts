import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['delCorpTag'],
};

export const delCorpTagDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tag_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '标签的id列表，用逗号分隔',
		description: '标签的ID列表',
	},
	{
		displayName: '标签组ID',
		name: 'group_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '标签组的id列表，用逗号分隔',
		description: '标签组的ID列表',
	},
];

