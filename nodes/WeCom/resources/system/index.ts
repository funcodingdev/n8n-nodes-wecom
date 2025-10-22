import type { INodeProperties } from 'n8n-workflow';

export const systemDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['system'],
			},
		},
		options: [
			{
				name: '获取接口IP段',
				value: 'getApiDomainIp',
				description: '获取企业微信接口服务器的IP段',
				action: '获取接口IP段',
			},
			{
				name: '获取回调IP段',
				value: 'getCallbackIp',
				description: '获取企业微信回调服务器的IP段',
				action: '获取回调IP段',
			},
		],
		default: 'getApiDomainIp',
	},
];

