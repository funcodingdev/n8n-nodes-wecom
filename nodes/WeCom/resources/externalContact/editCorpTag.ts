import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['editCorpTag'],
};

export const editCorpTagDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '标签或标签组的id',
		description: '标签或标签组的ID',
	},
	{
		displayName: '新名称',
		name: 'name',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '新的标签或标签组名称',
		description: '新的标签或标签组名称，最长为30个字符',
	},
	{
		displayName: '新排序',
		name: 'order',
		type: 'number',
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		hint: '标签/标签组的次序值',
		description: '标签/标签组的次序值。order值大的排序靠前',
	},
];

