import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['getMeetingAdvancedAccountList'] };

export const getMeetingAdvancedAccountListDescription: INodeProperties[] = [
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '分页游标，首次请求留空，后续请求使用返回的cursor。<a href="https://developer.work.weixin.qq.com/document/path/99510" target="_blank">官方文档</a>',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 100,
		description: 'limit，默认 100，最大 200',
		typeOptions: { minValue: 1, maxValue: 200 },
	},
];
