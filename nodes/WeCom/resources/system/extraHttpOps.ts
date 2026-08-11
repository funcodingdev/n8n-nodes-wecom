import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 系统 / 身份验证 / JS-SDK / 小程序登录 */
export const systemExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'authGetTfaInfo', name: '[身份验证] 获取二次验证信息', action: '获取二次验证信息', description: '获取二次验证信息', path: '/cgi-bin/auth/get_tfa_info', method: 'GET' },
	{ id: 'authGetuserdetail', name: '[身份验证] 获取访问用户敏感信息', action: '获取访问用户敏感信息', description: '获取访问用户敏感信息', path: '/cgi-bin/auth/getuserdetail', method: 'GET' },
	{ id: 'authGetuserinfo', name: '[身份验证] 获取访问用户身份', action: '获取访问用户身份', description: '获取访问用户身份', path: '/cgi-bin/auth/getuserinfo', method: 'GET' },
	{ id: 'userGetuserinfo', name: '[身份验证] 获取成员身份', action: '获取成员身份', description: '获取成员身份', path: '/cgi-bin/user/getuserinfo', method: 'GET' },
	{ id: 'userTfaSucc', name: '[身份验证] 二次验证成功', action: '二次验证成功', description: '二次验证成功', path: '/cgi-bin/user/tfa_succ', method: 'POST' },
	{ id: 'ticketGet', name: '[JS-SDK] 获取企业 jsapi_ticket', action: '获取企业 jsapi_ticket', description: '获取企业 jsapi_ticket', path: '/cgi-bin/ticket/get', method: 'GET' },
	{ id: 'getJsapiTicket', name: '[JS-SDK] 获取应用 jsapi_ticket', action: '获取应用 jsapi_ticket', description: '获取应用 jsapi_ticket', path: '/cgi-bin/get_jsapi_ticket', method: 'GET' },
	{ id: 'getLaunchCode', name: '[系统] 获取 launch_code', action: '获取 launch_code', description: '获取 launch_code', path: '/cgi-bin/get_launch_code', method: 'POST' },
	{ id: 'miniprogramJscode2session', name: '[小程序] 登录凭证校验', action: '小程序登录凭证校验', description: '小程序登录凭证校验', path: '/cgi-bin/miniprogram/jscode2session', method: 'GET' },
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
		displayName: 'OAuth Code',
		name: 'sys_code',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['system'],
				operation: [
					'authGetuserinfo',
					'authGetuserdetail',
					'userGetuserinfo',
					'authGetTfaInfo',
					'miniprogramJscode2session',
				],
			},
		},
		default: '',
		description: '网页授权或小程序登录返回的 code',
	},
	{
		displayName: '成员UserID',
		name: 'sys_userid',
		type: 'string',
		displayOptions: {
			show: { resource: ['system'], operation: ['userTfaSucc'] },
		},
		default: '',
		description: '完成二次验证的成员 userid',
	},
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['system'], operation: systemExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'POST 接口的其余字段；GET 可留空',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['system'], operation: systemExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '其余查询参数；code 也可写在此处',
	},
];
