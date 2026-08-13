import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { getApiDomainIp } from './getApiDomainIp';
import { getCallbackIp } from './getCallbackIp';
import { getAccessToken } from './getAccessToken';

/** 执行系统信息、身份验证、JS-SDK 与小程序登录操作。 */
export async function executeSystem(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const fail = (message: string): never => {
		throw new NodeOperationError(this.getNode(), message, { itemIndex: index });
	};
	const requireText = (name: string, label: string, maxBytes?: number, altName?: string): string => {
		const primary = String(this.getNodeParameter(name, index, '') ?? '').trim();
		const fallback = altName
			? String(this.getNodeParameter(altName, index, '') ?? '').trim()
			: '';
		const value = primary || fallback;
		if (!value) fail(`${label}不能为空`);
		if (maxBytes !== undefined && Buffer.byteLength(value, 'utf8') > maxBytes) {
			fail(`${label}不能超过 ${maxBytes} 个字节`);
		}
		return value;
	};
	const ensureSuccess = (response: IDataObject): IDataObject => {
		if (response.errcode !== undefined && Number(response.errcode) !== 0) {
			fail(`${response.errmsg ?? '企业微信接口调用失败'} (错误码: ${response.errcode})`);
		}
		return response;
	};

	try {
		let responseData: IDataObject | undefined;
		switch (operation) {
			case 'getApiDomainIp':
				responseData = await getApiDomainIp.call(this);
				break;
			case 'getCallbackIp':
				responseData = await getCallbackIp.call(this);
				break;
			case 'getAccessToken':
				responseData = await getAccessToken.call(this);
				break;
			case 'authGetTfaInfo':
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/auth/get_tfa_info',
					{ code: requireText('tfa_entry_code', '二次验证页面 Code', 512) },
				);
				break;
			case 'authGetuserdetail':
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/auth/getuserdetail',
					{ user_ticket: requireText('sys_user_ticket', '成员票据', 512) },
				);
				break;
			case 'authGetuserinfo':
				responseData = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/auth/getuserinfo',
					{},
					{ code: requireText('auth_code', '网页授权 Code', 512) },
				);
				break;
			case 'userGetuserinfo':
				responseData = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/user/getuserinfo',
					{},
					{ code: requireText('sdk_code', '移动端 SDK Code', 512) },
				);
				break;
			case 'userTfaSucc':
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/user/tfa_succ',
					{
						userid: requireText('sys_userid', '成员 UserID', undefined, 'sys_userid_selected'),
						tfa_code: requireText('tfa_code', '二次验证授权码'),
					},
				);
				break;
			case 'getJsapiTicket':
				responseData = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/get_jsapi_ticket',
				);
				break;
			case 'ticketGet':
				responseData = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/ticket/get',
					{},
					{ type: 'agent_config' },
				);
				break;
			case 'getLaunchCode':
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/get_launch_code',
					{
						operator_userid: requireText(
							'launch_operator_userid',
							'操作者 UserID',
							undefined,
							'launch_operator_userid_selected',
						),
						single_chat: {
							userid: requireText(
								'launch_chat_userid',
								'单聊对象 UserID',
								undefined,
								'launch_chat_userid_selected',
							),
						},
					},
				);
				break;
			case 'miniprogramJscode2session':
				responseData = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/miniprogram/jscode2session',
					{},
					{
						js_code: requireText('mp_js_code', '小程序登录 Code'),
						grant_type: 'authorization_code',
					},
				);
				break;
			default:
				fail(`未知操作: ${operation}`);
		}

		if (!responseData) {
			throw new NodeOperationError(this.getNode(), `操作 ${operation} 未返回结果`, {
				itemIndex: index,
			});
		}
		return [ensureSuccess(responseData)];
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		throw new NodeOperationError(this.getNode(), (error as Error).message, {
			itemIndex: index,
		});
	}
}
