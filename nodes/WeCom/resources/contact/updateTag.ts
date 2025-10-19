import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateTag = {
	resource: ['contact'],
	operation: ['updateTag'],
};

export const updateTagDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateTag,
		},
		default: '',
		description: '标签ID。',
		hint: '标签ID',
	},
	{
		displayName: '标签名称',
		name: 'tagname',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateTag,
		},
		default: '',
		description: '标签名称，长度限制为32个字以内（汉字或英文字母）。',
		hint: '标签名称',
	},
];

