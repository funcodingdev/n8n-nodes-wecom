import type { INodeProperties } from 'n8n-workflow';
import { OPEN_API_CATALOG } from './catalog';

const showOnly = { resource: ['openApi'] };

export const openApiDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnly },
		options: [
			{
				name: '[通用] 自定义调用任意 cgi-bin',
				value: 'callCgiBin',
				action: '自定义调用 cgi-bin',
				description: 'method + path + body/query，覆盖全部 OpenAPI',
			},
			...OPEN_API_CATALOG.map((e) => ({
				name: e.name,
				value: e.id,
				action: e.name,
				description: `${e.method} ${e.path}`,
			})),
		],
		default: 'callCgiBin',
	},
	{
		displayName: '说明',
		name: 'notice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
		description:
			`收录 docs 差分中尚未做成独立业务操作的 HTTP 接口（当前 ${OPEN_API_CATALOG.length} 条，含会议/家校/客户策略等）。选目录项自动带 method+path；或用「自定义调用」填任意 /cgi-bin/*。请求体用 JSON，Query 用 JSON（access_token 自动附加）。不含商户 XML（企业红包等）与会话存档 SDK 拉消息。`,
	},
	// 通用调用
	{
		displayName: 'HTTP方法',
		name: 'httpMethod',
		type: 'options',
		required: true,
		displayOptions: { show: { ...showOnly, operation: ['callCgiBin'] } },
		options: [
			{ name: 'POST', value: 'POST' },
			{ name: 'GET', value: 'GET' },
		],
		default: 'POST',
	},
	{
		displayName: 'API路径',
		name: 'apiPath',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, operation: ['callCgiBin'] } },
		default: '/cgi-bin/',
		placeholder: '/cgi-bin/user/get',
		description: '以 /cgi-bin/ 开头的路径（不要带 access_token）',
	},
	// 共用 body/query
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description: 'POST JSON body；GET 时可留空。字段名与官方文档一致',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description: '查询字符串参数（access_token 自动附加，无需填写；群机器人 webhook 可填 key）',
	},
];
