import type { INodeProperties } from 'n8n-workflow';
import {
	getSystemExtraHttpOpOptions,
	systemExtraHttpOpsDescription,
} from './extraHttpOps';

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
				name: '[基础] 获取接口IP段',
				value: 'getApiDomainIp',
				description: '获取企业微信接口服务器的IP段',
				action: '获取接口IP段',
			},
			{
				name: '[基础] 获取回调IP段',
				value: 'getCallbackIp',
				description: '获取企业微信回调服务器的IP段',
				action: '获取回调IP段',
			},
			{
				name: '[基础] 获取AccessToken',
				value: 'getAccessToken',
				description: '获取企业微信 Access Token',
				action: '获取AccessToken',
			},
					...getSystemExtraHttpOpOptions(),
		],
		default: 'getApiDomainIp',
	},
	{
		displayName: '说明',
		name: 'systemBasicNotice',
		type: 'notice',
		displayOptions: {
			show: {
				resource: ['system'],
				operation: ['getAccessToken', 'getCallbackIp', 'getApiDomainIp'],
			},
		},
		default: '',
		description:
			'获取 AccessToken / IP 段无需额外业务参数，使用当前凭证配置即可。',
	},
	...systemExtraHttpOpsDescription,
];
