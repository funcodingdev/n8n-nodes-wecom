import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 文档有、此前节点未封装的 system 相关 HTTP 接口（一等操作） */
export const systemExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'authGetTfaInfo', name: '[身份验证] 获取二次验证信息', action: '获取二次验证信息', description: 'GET /cgi-bin/auth/get_tfa_info', path: '/cgi-bin/auth/get_tfa_info', method: 'GET' },
	{ id: 'authGetuserdetail', name: '[身份验证] 网页授权-获取访问用户敏感信息', action: '网页授权-获取访问用户敏感信息', description: 'GET /cgi-bin/auth/getuserdetail', path: '/cgi-bin/auth/getuserdetail', method: 'GET' },
	{ id: 'authGetuserinfo', name: '[身份验证] 网页授权-获取访问用户身份', action: '网页授权-获取访问用户身份', description: 'GET /cgi-bin/auth/getuserinfo', path: '/cgi-bin/auth/getuserinfo', method: 'GET' },
	{ id: 'userGetuserinfo', name: '[身份验证] user/getuserinfo', action: 'user/getuserinfo', description: 'GET /cgi-bin/user/getuserinfo', path: '/cgi-bin/user/getuserinfo', method: 'GET' },
	{ id: 'userTfaSucc', name: '[身份验证] user/tfa_succ', action: 'user/tfa_succ', description: 'POST /cgi-bin/user/tfa_succ', path: '/cgi-bin/user/tfa_succ', method: 'POST' },
	{ id: 'ticketGet', name: '[JS-SDK] 获取企业 jsapi_ticket', action: '获取企业 jsapi_ticket', description: 'GET /cgi-bin/ticket/get', path: '/cgi-bin/ticket/get', method: 'GET' },
	{ id: 'getJsapiTicket', name: '[JS-SDK] 获取应用 jsapi_ticket', action: '获取应用 jsapi_ticket', description: 'GET /cgi-bin/get_jsapi_ticket', path: '/cgi-bin/get_jsapi_ticket', method: 'GET' },
	{ id: 'getLaunchCode', name: '[启动] get_launch_code', action: 'get_launch_code', description: 'POST /cgi-bin/get_launch_code', path: '/cgi-bin/get_launch_code', method: 'POST' },
	{ id: 'miniprogramJscode2session', name: '[小程序] 小程序登录凭证校验', action: '小程序登录凭证校验', description: 'GET /cgi-bin/miniprogram/jscode2session', path: '/cgi-bin/miniprogram/jscode2session', method: 'GET' },
];

export const systemExtraHttpOpsById: Record<string, ExtraHttpOp> = Object.fromEntries(
	systemExtraHttpOps.map((o) => [o.id, o]),
);

export const systemExtraHttpOpsOptionValues = systemExtraHttpOps.map((o) => o.id);

export function getSystemExtraHttpOpOptions() {
	return extraHttpOpOptions(systemExtraHttpOps);
}

export const systemExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['system'], operation: systemExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '请求体 JSON，字段名与企业微信接口文档保持一致；GET 请求可留空',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['system'], operation: systemExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'URL 查询参数（访问凭证会自动附加，无需填写）',
	},
];
