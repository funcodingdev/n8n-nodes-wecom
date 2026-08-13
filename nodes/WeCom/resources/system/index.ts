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
				name: '[基础] 获取接口 IP 段',
				value: 'getApiDomainIp',
				description: '获取企业微信接口服务器的 IP 段',
				action: '获取接口 IP 段',
			},
			{
				name: '[基础] 获取回调 IP 段',
				value: 'getCallbackIp',
				description: '获取企业微信回调服务器的 IP 段',
				action: '获取回调 IP 段',
			},
			{
				name: '[基础] 获取 Access Token',
				value: 'getAccessToken',
				description: '获取当前应用的企业微信 Access Token 与有效期',
				action: '获取 Access Token',
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
		description: '这些操作无需额外业务参数，使用当前企业微信应用凭证即可。',
	},
	{
		displayName: 'Access Token 安全提示',
		name: 'accessTokenSecurityNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['system'],
				operation: ['getAccessToken'],
			},
		},
		description: '此操作会把 Access Token 写入工作流执行数据。请勿返回给前端、写入日志或发送到不可信服务；普通企业微信操作会自动鉴权，无需手动获取。',
	},
	...systemExtraHttpOpsDescription,
];
