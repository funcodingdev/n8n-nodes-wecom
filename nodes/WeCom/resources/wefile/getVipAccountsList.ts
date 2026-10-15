import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['getVipAccountsList'] };

export const getVipAccountsListDescription: INodeProperties[] = [
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填<a href="https://developer.work.weixin.qq.com/document/path/99514" target="_blank">更多信息</a>',
	},
	{
		displayName: '限制',
		name: 'limit',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 100,
		typeOptions: {
			maxValue: 200,
			minValue: 1,
		},
		description: '每次请求返回的数据上限。默认100，最大200。注意：不保证每次返回的数据刚好为指定limit，必须用返回的has_more判断是否继续请求<a href="https://developer.work.weixin.qq.com/document/path/99514" target="_blank">更多信息</a>',
	},
];
