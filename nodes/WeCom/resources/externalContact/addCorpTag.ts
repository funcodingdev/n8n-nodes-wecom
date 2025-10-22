import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['addCorpTag'],
};

export const addCorpTagDescription: INodeProperties[] = [
	{
		displayName: '标签组ID',
		name: 'group_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '标签组id，不填则自动创建新的标签组',
	},
	{
		displayName: '标签组名称',
		name: 'group_name',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '标签组名称，最长为30个字符',
	},
	{
		displayName: '标签列表',
		name: 'tag',
		type: 'json',
		default: '[]',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON数组，如：[{"name":"标签1"},{"name":"标签2"}]',
		description: '标签列表，每个标签包含name字段',
	},
	{
		displayName: '标签组排序',
		name: 'order',
		type: 'number',
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '标签组次序值，order值大的排序靠前',
		description: '标签组次序值',
	},
];

