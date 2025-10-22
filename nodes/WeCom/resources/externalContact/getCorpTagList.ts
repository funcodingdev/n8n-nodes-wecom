import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getCorpTagList'],
};

export const getCorpTagListDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tag_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '要查询的标签id，用逗号分隔',
		description: '要查询的标签ID，用逗号分隔，为空则返回所有标签',
	},
	{
		displayName: '标签组ID',
		name: 'group_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '要查询的标签组id，用逗号分隔',
		description: '要查询的标签组ID，用逗号分隔',
	},
];

