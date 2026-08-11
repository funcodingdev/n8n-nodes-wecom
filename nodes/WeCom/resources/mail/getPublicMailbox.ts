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
			'公共邮箱 ID 列表，逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/98002" target="_blank">官方文档</a>',
	},
];
