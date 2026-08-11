import { executeExtraHttpOp } from '../../shared/extraHttpOp';
import { systemExtraHttpOpsById } from './extraHttpOps';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getApiDomainIp } from './getApiDomainIp';
import { getCallbackIp } from './getCallbackIp';
import { getAccessToken } from './getAccessToken';

/**
 * 执行系统相关操作
 */
export async function executeSystem(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	let responseData: IDataObject = {};

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
		default: {
			if (systemExtraHttpOpsById[operation]) {
				const bodyDefaults: IDataObject = {};
				const qsDefaults: IDataObject = {};
				const sys_code = this.getNodeParameter('sys_code', index, '') as string;
				const sys_userid = this.getNodeParameter('sys_userid', index, '') as string;
				const sys_user_ticket = this.getNodeParameter('sys_user_ticket', index, '') as string;
				const ticket_type = this.getNodeParameter('ticket_type', index, '') as string;
				const launch_operator_userid = this.getNodeParameter('launch_operator_userid', index, '') as string;
				const launch_chat_userid = this.getNodeParameter('launch_chat_userid', index, '') as string;
				if (sys_code) qsDefaults.code = sys_code;
				if (sys_code && operation === 'miniprogramJscode2session') {
					qsDefaults.js_code = sys_code;
					// 小程序登录凭证校验常用 grant_type
					if (!qsDefaults.grant_type) qsDefaults.grant_type = 'authorization_code';
				}
				if (sys_userid) bodyDefaults.userid = sys_userid;
				if (sys_user_ticket) {
					// 官方：POST /auth/getuserdetail 请求体 user_ticket
					bodyDefaults.user_ticket = sys_user_ticket;
				}
				if (ticket_type) qsDefaults.type = ticket_type;
				if (operation === 'getLaunchCode') {
					if (launch_operator_userid) bodyDefaults.operator_userid = launch_operator_userid;
					if (launch_chat_userid) {
						bodyDefaults.single_chat = { userid: launch_chat_userid };
					}
				}
				responseData = await executeExtraHttpOp.call(
					this,
					systemExtraHttpOpsById[operation],
					index,
					bodyDefaults,
					qsDefaults,
				);
				break;
			}
			throw new Error(`未知操作: ${operation}`);
		}
	}

	return [responseData];
}

