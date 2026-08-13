import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['mail'],
	operation: ['getPublicMailbox'],
};

export const getPublicMailboxDescription: INodeProperties[] = [
	{
		displayName: '公共邮箱ID列表',
		name: 'id_list',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '1,2',
		description:
			'公共邮箱 ID 列表，可用逗号、中文逗号、竖线或换行分隔；与下方 JSON 合并去重。<a href="https://developer.work.weixin.qq.com/document/path/98002" target="_blank">官方文档</a>',
	},
	{
		displayName: '公共邮箱ID列表 JSON',
		name: 'idListJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '[]',
		description:
			'可选。非空数组时与上方列表合并去重。支持 [1,2] 或 [{"id":1}]',
	},
];
