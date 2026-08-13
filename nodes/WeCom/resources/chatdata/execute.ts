import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { createPublicKey } from 'node:crypto';
import { weComApiRequest } from '../../shared/transport';
import { weComMultipartUpload } from '../../shared/multipartUpload';

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function requireText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumBytes = 1024,
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	if (Buffer.byteLength(text, 'utf8') > maximumBytes) {
		fail(context, `${label}不能超过 ${maximumBytes} 个 UTF-8 字节`, itemIndex);
	}
	return text;
}

function optionalText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumBytes = 1024,
): string {
	const text = String(value ?? '').trim();
	if (Buffer.byteLength(text, 'utf8') > maximumBytes) {
		fail(context, `${label}不能超过 ${maximumBytes} 个 UTF-8 字节`, itemIndex);
	}
	return text;
}

function requireInteger(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	minimum: number,
	maximum: number,
): number {
	const number = typeof value === 'number' ? value : Number(value);
	if (!Number.isInteger(number) || number < minimum || number > maximum) {
		fail(context, `${label}必须是 ${minimum}–${maximum} 之间的整数`, itemIndex);
	}
	return number;
}

function serializeRequestData(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): string {
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch (error) {
			fail(context, `请求数据 JSON 解析失败: ${(error as Error).message}`, itemIndex);
		}
	}
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		fail(context, '请求数据必须是 JSON 对象', itemIndex);
	}
	const serialized = JSON.stringify(parsed);
	if (Buffer.byteLength(serialized, 'utf8') > 1024 * 1024) {
		fail(context, '请求数据不能超过 1MB', itemIndex);
	}
	return serialized;
}

function requireProgramId(context: IExecuteFunctions, value: unknown, itemIndex: number): string {
	return requireText(context, value, '程序 ID', itemIndex, 256);
}

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
				const public_key = requireText(this, this.getNodeParameter('public_key', i), '公钥 PEM', i, 10000);
				if (!public_key.includes('-----BEGIN PUBLIC KEY-----')) {
					fail(this, '公钥 PEM 必须使用 PUBLIC KEY 格式，不能提交私钥', i);
				}
				let publicKeyObject;
				try {
					publicKeyObject = createPublicKey(public_key);
				} catch (error) {
					fail(this, `公钥 PEM 无效: ${(error as Error).message}`, i);
				}
				if (
					publicKeyObject.asymmetricKeyType !== 'rsa' ||
					publicKeyObject.asymmetricKeyDetails?.modulusLength !== 2048
				) {
					fail(this, '公钥必须是 RSA-2048 公钥', i);
				}
				const public_key_ver = requireInteger(
					this,
					this.getNodeParameter('public_key_ver', i),
					'公钥版本号',
					i,
					1,
					4294967295,
				);
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/chatdata/set_public_key', {
					public_key,
					public_key_ver,
				});
			} else if (operation === 'getAuthUserList') {
				// https://developer.work.weixin.qq.com/document/path/99846
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 200), '条数限制', i, 1, 1000);
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
				const program_id = requireProgramId(this, this.getNodeParameter('program_id', i), i);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/set_receive_callback',
					{ program_id },
				);
			} else if (operation === 'setHideSensitiveInfoConfig') {
				// https://developer.work.weixin.qq.com/document/path/100055
				const userid = requireText(this, this.getNodeParameter('userid', i), '成员 UserID', i, 64);
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
				const userid = requireText(this, this.getNodeParameter('userid', i), '成员 UserID', i, 64);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/get_hide_sensitiveinfo_config',
					{ userid },
				);
			} else if (operation === 'setLogLevel') {
				// https://developer.work.weixin.qq.com/document/path/100106
				const program_id = requireProgramId(this, this.getNodeParameter('program_id', i), i);
				const log_level = requireInteger(this, this.getNodeParameter('log_level', i), '日志级别', i, 1, 3);
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/chatdata/set_log_level', {
					program_id,
					log_level,
				});
			} else if (operation === 'getLogLevel') {
				const program_id = requireProgramId(this, this.getNodeParameter('program_id', i), i);
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/chatdata/get_log_level', {
					program_id,
				});
			} else if (operation === 'syncCallProgram') {
				// https://developer.work.weixin.qq.com/document/path/99811
				const program_id = requireProgramId(this, this.getNodeParameter('program_id', i), i);
				const ability_id = requireText(this, this.getNodeParameter('ability_id', i), '能力 ID', i, 256);
				const request_data_raw = this.getNodeParameter('request_data', i, '{}');
				const request_data = serializeRequestData(this, request_data_raw, i);
				const notify_id = optionalText(this, this.getNodeParameter('notify_id', i, ''), '通知 ID', i, 256);
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
				const program_id = requireProgramId(this, this.getNodeParameter('program_id', i), i);
				const ability_id = requireText(this, this.getNodeParameter('ability_id', i), '能力 ID', i, 256);
				const request_data_raw = this.getNodeParameter('request_data', i, '{}');
				const request_data = serializeRequestData(this, request_data_raw, i);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/async_program_task',
					{ program_id, ability_id, request_data },
				);
			} else if (operation === 'asyncProgramResult') {
				const jobid = requireText(this, this.getNodeParameter('jobid', i), '任务 ID', i, 256);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/async_program_result',
					{ jobid },
				);
			} else if (operation === 'openDebugMode') {
				// https://developer.work.weixin.qq.com/document/path/100083
				const program_id = requireProgramId(this, this.getNodeParameter('program_id', i), i);
				const debug_token = requireText(this, this.getNodeParameter('debug_token', i), '调试 Token', i, 2048);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/open_debug_mode',
					{ program_id, debug_token },
				);
			} else if (operation === 'closeDebugMode') {
				// https://developer.work.weixin.qq.com/document/path/100084
				const program_id = requireProgramId(this, this.getNodeParameter('program_id', i), i);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/close_debug_mode',
					{ program_id },
				);
			} else if (operation === 'checkDebugMode') {
				const program_id = requireProgramId(this, this.getNodeParameter('program_id', i), i);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/chatdata/check_debug_mode',
					{ program_id },
				);
			} else if (operation === 'uploadMedia') {
				// https://developer.work.weixin.qq.com/document/path/100174
				const binaryProperty = requireText(
					this,
					this.getNodeParameter('binaryProperty', i, 'data'),
					'二进制字段名',
					i,
					256,
				);
				const mediaType = String(this.getNodeParameter('mediaType', i, 'file')).trim();
				if (mediaType !== 'file') fail(this, '文件类型仅支持 file', i);
				responseData = await weComMultipartUpload.call(this, {
					itemIndex: i,
					path: '/cgi-bin/chatdata/upload_media',
					qs: { type: mediaType },
					binaryPropertyName: binaryProperty,
					minBytes: 6,
					maxBytes: 60 * 1024 * 1024,
				});
			} else {
				fail(this, `不支持的数据与智能专区操作: ${operation}`, i);
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
