import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['markTag'],
};

export const markTagDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'添加外部联系人的成员 UserID。<a href="https://developer.work.weixin.qq.com/document/path/92118" target="_blank">官方文档</a>；可与下方选择二选一',
		placeholder: 'zhangsan',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '外部联系人UserID',
		name: 'external_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '外部联系人的UserID，以"wm"开头。<a href="https://developer.work.weixin.qq.com/document/path/92118" target="_blank">官方文档</a>。外部联系人的userid',
		placeholder: 'wmxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '添加标签',
		name: 'add_tag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'要添加的标签ID列表，多个ID用英文逗号分隔；与下方 JSON 合并。<a href="https://developer.work.weixin.qq.com/document/path/92118" target="_blank">官方文档</a>',
		placeholder: 'etXXXXXXXXXX,etYYYYYYYYYY',
	},
	{
		displayName: '添加标签 JSON',
		name: 'addTagJson',
		type: 'json',
		default: '[]',
		displayOptions: { show: showOnly },
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["etxxx"] 或 [{"tag_id":"etxxx"}]',
	},
	{
		displayName: '移除标签',
		name: 'remove_tag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'要移除的标签ID列表，多个ID用英文逗号分隔；与下方 JSON 合并。<a href="https://developer.work.weixin.qq.com/document/path/92118" target="_blank">官方文档</a>',
		placeholder: 'etXXXXXXXXXX,etYYYYYYYYYY',
	},
	{
		displayName: '移除标签 JSON',
		name: 'removeTagJson',
		type: 'json',
		default: '[]',
		displayOptions: { show: showOnly },
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["etxxx"] 或 [{"tag_id":"etxxx"}]',
	},
];

