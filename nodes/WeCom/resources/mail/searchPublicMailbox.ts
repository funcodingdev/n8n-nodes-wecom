import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['mail'],
	operation: ['searchPublicMailbox'],
};

export const searchPublicMailboxDescription: INodeProperties[] = [
	{
		displayName: '模糊搜索',
		name: 'fuzzy',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '开启模糊搜索', value: 1 },
			{ name: '获取全部公共邮箱', value: 0 },
		],
		default: 1,
		description:
			'fuzzy=1 模糊搜索，0 获取全部。<a href="https://developer.work.weixin.qq.com/document/path/98003" target="_blank">官方文档</a>',
	},
	{
		displayName: '邮箱名称或地址',
		name: 'email',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'apitest',
		description: '公共邮箱名称或邮箱地址（可选）',
	},
];
