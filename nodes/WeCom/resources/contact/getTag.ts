import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetTag = {
	resource: ['contact'],
	operation: ['getTag'],
};

export const getTagDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		displayOptions: {
			show: showOnlyGetTag,
		},
		default: '',
		placeholder: '12',
		description:
			'标签 ID；可与下方选择二选一。无限制，但返回列表仅包含应用可见范围的成员。<a href="https://developer.work.weixin.qq.com/document/path/90213" target="_blank">官方文档</a>',
	},
	{
		displayName: '标签(选择)',
		name: 'tagid_selected',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getTags',
		},
		default: '',
		displayOptions: {
			show: showOnlyGetTag,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];
