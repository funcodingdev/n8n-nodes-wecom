import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['getProInfo'] };

export const getProInfoDescription: INodeProperties[] = [
	{
		displayName: '获取专业版信息',
		name: 'getProInfo',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '参数',
		typeOptions: { multipleValues: false },
		description: '该接口用于获取微盘专业版信息<a href="https://developer.work.weixin.qq.com/document/path/95856" target="_blank">更多信息</a>',
		options: [
			{
				displayName: '参数',
				name: 'params',
				values: [],
			},
		],
	},
];
