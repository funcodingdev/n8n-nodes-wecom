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
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'添加外部联系人的成员 UserID。<a href="https://developer.work.weixin.qq.com/document/path/92118" target="_blank">官方文档</a>',
		placeholder: 'zhangsan',
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
		description: '要添加的标签ID列表，多个ID用英文逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/92118" target="_blank">官方文档</a>。可选。要添加的标签ID，多个用逗号分隔',
		placeholder: 'etXXXXXXXXXX,etYYYYYYYYYY',
	},
	{
		displayName: '移除标签',
		name: 'remove_tag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '要移除的标签ID列表，多个ID用英文逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/92118" target="_blank">官方文档</a>。可选。要移除的标签ID，多个用逗号分隔',
		placeholder: 'etXXXXXXXXXX,etYYYYYYYYYY',
	},
];

