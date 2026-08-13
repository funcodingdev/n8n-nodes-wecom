import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 系统 / 身份验证 / JS-SDK / 小程序登录 */
export const systemExtraHttpOps: ExtraHttpOp[] = [
	{
		id: 'authGetTfaInfo',
		name: '[身份验证] 获取用户二次验证信息',
		action: '获取用户二次验证信息',
		description: '使用一次性 code 获取成员 UserID 与二次验证授权码',
		path: '/cgi-bin/auth/get_tfa_info',
		method: 'POST',
	},
	{
		id: 'authGetuserdetail',
		name: '[身份验证] 获取访问用户敏感信息',
		action: '获取访问用户敏感信息',
		description: '使用 user_ticket 获取已授权的成员敏感信息',
		path: '/cgi-bin/auth/getuserdetail',
		method: 'POST',
	},
	{
		id: 'authGetuserinfo',
		name: '[身份验证] 获取访问用户身份',
		action: '获取访问用户身份',
		description: '使用网页授权或企业微信 Web 登录 code 获取用户身份',
		path: '/cgi-bin/auth/getuserinfo',
		method: 'GET',
	},
	{
		id: 'userGetuserinfo',
		name: '[身份验证] 获取移动端 SDK 成员身份',
		action: '获取移动端 SDK 成员身份',
		description: '使用企业微信移动端 SDK 登录 code 获取成员身份',
		path: '/cgi-bin/user/getuserinfo',
		method: 'GET',
	},
	{
		id: 'userTfaSucc',
		name: '[身份验证] 使用二次验证',
		action: '使用二次验证',
		description: '提交成员 UserID 与 tfa_code，完成企业微信终端二次验证',
		path: '/cgi-bin/user/tfa_succ',
		method: 'POST',
	},
	{
		id: 'getJsapiTicket',
		name: '[JS-SDK] 获取企业 jsapi_ticket',
		action: '获取企业 jsapi_ticket',
		description: '获取 getConfigSignature 使用的企业 jsapi_ticket',
		path: '/cgi-bin/get_jsapi_ticket',
		method: 'GET',
	},
	{
		id: 'ticketGet',
		name: '[JS-SDK] 获取应用 jsapi_ticket',
		action: '获取应用 jsapi_ticket',
		description: '获取 getAgentConfigSignature 使用的应用 jsapi_ticket',
		path: '/cgi-bin/ticket/get',
		method: 'GET',
	},
	{
		id: 'getLaunchCode',
		name: '[系统] 获取个人聊天 launch_code',
		action: '获取个人聊天 launch_code',
		description: '获取通过 wxwork://launch 唤起个人聊天窗口所需的 launch_code',
		path: '/cgi-bin/get_launch_code',
		method: 'POST',
	},
	{
		id: 'miniprogramJscode2session',
		name: '[小程序] 登录凭证校验',
		action: '校验小程序登录凭证',
		description: '使用小程序登录 code 换取成员身份与 session_key',
		path: '/cgi-bin/miniprogram/jscode2session',
		method: 'GET',
	},
];

export const systemExtraHttpOpsById: Record<string, ExtraHttpOp> = Object.fromEntries(
	systemExtraHttpOps.map((operation) => [operation.id, operation]),
);

export function getSystemExtraHttpOpOptions() {
	return extraHttpOpOptions(systemExtraHttpOps);
}

export const systemExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '二次验证页面 Code',
		name: 'tfa_entry_code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['system'], operation: ['authGetTfaInfo'] },
		},
		description: '用户进入二次验证页面时企业微信颁发的一次性 code，5 分钟内有效',
	},
	{
		displayName: '成员票据',
		name: 'sys_user_ticket',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['system'], operation: ['authGetuserdetail'] },
		},
		description: '获取访问用户身份接口返回的 user_ticket，最长 512 字节且 30 分钟内有效',
	},
	{
		displayName: '网页授权 Code',
		name: 'auth_code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['system'], operation: ['authGetuserinfo'] },
		},
		description: '网页授权或企业微信 Web 登录返回的一次性 code，最长 512 字节且 5 分钟内有效',
	},
	{
		displayName: '移动端 SDK Code',
		name: 'sdk_code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['system'], operation: ['userGetuserinfo'] },
		},
		description: '企业微信移动端 SDK 授权回调返回的一次性 code',
	},
	{
		displayName: '成员',
		name: 'sys_userid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['system'], operation: ['userTfaSucc'] },
		},
		description: '选择完成二次验证的企业成员，或使用表达式指定 UserID',
	},
	{
		displayName: '二次验证授权码',
		name: 'tfa_code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['system'], operation: ['userTfaSucc'] },
		},
		description: '获取用户二次验证信息接口返回的 tfa_code，5 分钟内有效且只能使用一次',
	},
	{
		displayName: '操作者',
		name: 'launch_operator_userid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['system'], operation: ['getLaunchCode'] },
		},
		description: '当前操作者；必须在应用可见范围内',
	},
	{
		displayName: '单聊对象',
		name: 'launch_chat_userid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['system'], operation: ['getLaunchCode'] },
		},
		description: '需要发起单聊的企业内部成员；必须在应用可见范围内',
	},
	{
		displayName: '小程序登录 Code',
		name: 'mp_js_code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { resource: ['system'], operation: ['miniprogramJscode2session'] },
		},
		description: '与当前凭证对应的小程序通过 wx.login 获取的临时登录 code',
	},
	{
		displayName: '票据缓存提示',
		name: 'jsapiTicketNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				resource: ['system'],
				operation: ['getJsapiTicket', 'ticketGet'],
			},
		},
		description: 'jsapi_ticket 通常有效 7200 秒且接口有严格频率限制。请在工作流中缓存结果，避免每次页面请求都重新获取。',
	},
];
