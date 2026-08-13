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
		placeholder: 'UI',
		description: '标签名称，长度限制为32个字以内（汉字或英文字母），标签名不可与其他标签重名。创建的标签属于该应用，只有该应用的secret才可以增删成员。注意，标签总数不能超过3000个。<a href="https://developer.work.weixin.qq.com/document/path/90210" target="_blank">官方文档</a>',
	},
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreateTag,
		},
		default: '',
		placeholder: '12',
		description:
			'可选。标签ID，非负整型，指定此参数时新增的标签会生成对应的标签ID，不指定时则以目前最大的ID自增；可与下方选择二选一。<a href="https://developer.work.weixin.qq.com/document/path/90210" target="_blank">官方文档</a>',
	},
	{
		displayName: '标签(选择)',
		name: 'tagid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getTags' },
		displayOptions: {
			show: showOnlyForCreateTag,
		},
		default: '',
		description: '与上方字符串二选一；创建时通常手填新 ID，若需复用已有 ID 可从此选择；均填写时以字符串为准',
	},
];

