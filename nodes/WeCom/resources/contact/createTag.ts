import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreateTag = {
	resource: ['contact'],
	operation: ['createTag'],
};

export const createTagDescription: INodeProperties[] = [
	{
		displayName: '标签名称',
		name: 'tagname',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreateTag,
		},
		default: '',
		description: '标签名称，长度限制为32个字以内（汉字或英文字母）。',
		hint: '标签名称',
	},
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreateTag,
		},
		default: '',
		description: '标签id，非负整型，指定此参数时新增的标签会生成对应的标签id，不指定时则以目前最大的id自增。',
		hint: '标签ID（可选）',
	},
];

