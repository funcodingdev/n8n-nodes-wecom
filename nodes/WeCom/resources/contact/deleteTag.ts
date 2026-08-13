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
		displayOptions: {
			show: showOnlyForDeleteTag,
		},
		default: '',
		placeholder: '12',
		description: '标签ID。调用的应用必须是指定标签的创建者。删除后不可恢复。<a href="https://developer.work.weixin.qq.com/document/path/90212" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '标签(选择)',
		name: 'tagid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getTags' },
		default: '',
		displayOptions: {
			show: showOnlyForDeleteTag,
		},
		description: '与上方标签 ID 二选一；均填写时以字符串为准',
	},
];

