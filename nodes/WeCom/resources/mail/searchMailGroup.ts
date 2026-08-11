import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['mail'],
	operation: ['searchMailGroup'],
};

export const searchMailGroupDescription: INodeProperties[] = [
	{
		displayName: '模糊搜索',
		name: 'fuzzy',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '开启模糊搜索', value: 1 },
			{ name: '获取全部邮件群组', value: 0 },
		],
		default: 1,
		description:
			'fuzzy=1 模糊搜索，0 获取全部。<a href="https://developer.work.weixin.qq.com/document/path/97998" target="_blank">官方文档</a>',
	},
	{
		displayName: '邮件群组ID',
		name: 'fuzzy_groupid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsangroup@gzdev.com',
		description: '邮件群组 ID（邮箱格式），可选',
	},
];
