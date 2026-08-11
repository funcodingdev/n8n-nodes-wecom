import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeChatdata(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			if (operation === 'setPublicKey') {
				// https://developer.work.weixin.qq.com/document/path/99845
				const public_key = this.getNodeParameter('public_key', i) as string;
				const public_key_ver = this.getNodeParameter('public_key_ver', i) as number;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/chatdata/set_public_key', {
					public_key,
					public_key_ver,
				});
			} else if (operation === 'getAuthUserList') {
				// https://developer.work.weixin.qq.com/document/path/99846
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 200) as number;
				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/get_auth_user_list',
					body,
				);
			} else if (operation === 'setReceiveCallback') {
				// https://developer.work.weixin.qq.com/document/path/99850
				const program_id = this.getNodeParameter('program_id', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/set_receive_callback',
					{ program_id },
				);
			} else if (operation === 'setHideSensitiveInfoConfig') {
				// https://developer.work.weixin.qq.com/document/path/100055
				const userid = this.getNodeParameter('userid', i) as string;
				const hide_mobile = this.getNodeParameter('hide_mobile', i, false) as boolean;
				const hide_idcard = this.getNodeParameter('hide_idcard', i, false) as boolean;
				const hide_bankno = this.getNodeParameter('hide_bankno', i, false) as boolean;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/set_hide_sensitiveinfo_config',
					{
						userid,
						config: { hide_mobile, hide_idcard, hide_bankno },
					},
				);
			} else if (operation === 'getHideSensitiveInfoConfig') {
				const userid = this.getNodeParameter('userid', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/get_hide_sensitiveinfo_config',
					{ userid },
				);
			} else if (operation === 'setLogLevel') {
				// https://developer.work.weixin.qq.com/document/path/100106
				const program_id = this.getNodeParameter('program_id', i) as string;
				const log_level = this.getNodeParameter('log_level', i) as number;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/chatdata/set_log_level', {
					program_id,
					log_level,
				});
			} else if (operation === 'getLogLevel') {
				const program_id = this.getNodeParameter('program_id', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/chatdata/get_log_level', {
					program_id,
				});
			} else if (operation === 'syncCallProgram') {
				// https://developer.work.weixin.qq.com/document/path/99811
				const program_id = this.getNodeParameter('program_id', i) as string;
				const ability_id = this.getNodeParameter('ability_id', i) as string;
				const request_data = this.getNodeParameter('request_data', i) as string;
				const notify_id = this.getNodeParameter('notify_id', i, '') as string;
				const body: IDataObject = { program_id, ability_id, request_data };
				if (notify_id) body.notify_id = notify_id;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/sync_call_program',
					body,
				);
			} else if (operation === 'asyncProgramTask') {
				// https://developer.work.weixin.qq.com/document/path/99812
				const program_id = this.getNodeParameter('program_id', i) as string;
				const ability_id = this.getNodeParameter('ability_id', i) as string;
				const request_data = this.getNodeParameter('request_data', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/async_program_task',
					{ program_id, ability_id, request_data },
				);
			} else if (operation === 'asyncProgramResult') {
				const jobid = this.getNodeParameter('jobid', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/async_program_result',
					{ jobid },
				);
			} else if (operation === 'openDebugMode') {
				// https://developer.work.weixin.qq.com/document/path/100083
				const program_id = this.getNodeParameter('program_id', i) as string;
				const debug_token = this.getNodeParameter('debug_token', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/open_debug_mode',
					{ program_id, debug_token },
				);
			} else if (operation === 'closeDebugMode') {
				// https://developer.work.weixin.qq.com/document/path/100084
				const program_id = this.getNodeParameter('program_id', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/close_debug_mode',
					{ program_id },
				);
			} else if (operation === 'checkDebugMode') {
				const program_id = this.getNodeParameter('program_id', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/check_debug_mode',
					{ program_id },
				);
			}

			returnData.push({
				json: responseData,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
