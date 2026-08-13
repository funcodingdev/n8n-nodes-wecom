import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import * as https from 'https';
import { isIP } from 'node:net';
import {
	URL_PAY_TO_EMPLOYEE,
	URL_QUERY_PAY,
	URL_QUERY_REDPACK,
	URL_SEND_REDPACK,
	PAY_WORKWX_FIELDS,
	REDPACK_WORKWX_FIELDS,
	buildXml,
	mchMd5Sign,
	nonceStr,
	parseXml,
	workwxMd5Sign,
} from '../../shared/mchPayXml';

type MchCreds = {
	mchId: string;
	apiKey: string;
	wxAppId: string;
	agentSecret: string;
	agentId?: string;
	certPem: string;
	keyPem: string;
	keyPassphrase?: string;
};

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function requireText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumLength: number,
	minimumLength = 1,
): string {
	const text = String(value ?? '').trim();
	const length = Array.from(text).length;
	if (length < minimumLength) fail(context, `${label}至少需要 ${minimumLength} 个字符`, itemIndex);
	if (length > maximumLength) fail(context, `${label}不能超过 ${maximumLength} 个字符`, itemIndex);
	return text;
}

function optionalText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumLength: number,
): string {
	const text = String(value ?? '').trim();
	if (Array.from(text).length > maximumLength) fail(context, `${label}不能超过 ${maximumLength} 个字符`, itemIndex);
	return text;
}

function requireInteger(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	minimum = 1,
): number {
	const number = typeof value === 'number' ? value : Number(value);
	if (!Number.isSafeInteger(number) || number < minimum) {
		fail(context, `${label}必须是大于等于 ${minimum} 的安全整数`, itemIndex);
	}
	return number;
}

function requireOrderNumber(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumLength: number,
): string {
	const orderNumber = requireText(context, value, label, itemIndex, maximumLength);
	if (!/^[A-Za-z0-9]+$/.test(orderNumber)) {
		fail(context, `${label}只能包含大小写字母和数字`, itemIndex);
	}
	return orderNumber;
}

function parseExtra(
	context: IExecuteFunctions,
	raw: string,
	itemIndex: number,
): Record<string, string | number> {
	if (!raw || !String(raw).trim()) return {};
	let parsed: unknown;
	try {
		parsed = JSON.parse(raw);
	} catch (error) {
		fail(context, `扩展字段 JSON 解析失败: ${(error as Error).message}`, itemIndex);
	}
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		fail(context, '扩展字段必须是 JSON 对象', itemIndex);
	}
	const entries = Object.entries(parsed as Record<string, unknown>);
	if (entries.length > 50) fail(context, '扩展字段不能超过 50 项', itemIndex);
	const result: Record<string, string | number> = {};
	for (const [key, value] of entries) {
		if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key)) {
			fail(context, `扩展字段名 ${key} 不是安全的 XML 字段名`, itemIndex);
		}
		if (typeof value === 'number') {
			if (!Number.isFinite(value)) fail(context, `扩展字段 ${key} 必须是有限数字`, itemIndex);
			result[key] = value;
		} else if (typeof value === 'string') {
			result[key] = value.trim();
		} else {
			fail(context, `扩展字段 ${key} 只能是字符串或数字`, itemIndex);
		}
	}
	return result;
}

function omitCoreFields(
	extra: Record<string, string | number>,
	coreFields: string[],
): Record<string, string | number> {
	const result = { ...extra };
	for (const field of coreFields) delete result[field];
	return result;
}

function normalizeCredentials(
	context: IExecuteFunctions,
	credentials: MchCreds,
	itemIndex: number,
): MchCreds {
	return {
		...credentials,
		mchId: requireText(context, credentials.mchId, '凭证中的商户号', itemIndex, 32),
		apiKey: requireText(context, credentials.apiKey, '凭证中的商户 API 密钥', itemIndex, 128),
		wxAppId: requireText(context, credentials.wxAppId, '凭证中的 AppID/CorpID', itemIndex, 128),
		agentSecret: requireText(context, credentials.agentSecret, '凭证中的应用 Secret', itemIndex, 256),
		certPem: requireText(context, credentials.certPem, '凭证中的商户 API 证书', itemIndex, 20000),
		keyPem: requireText(context, credentials.keyPem, '凭证中的商户 API 私钥', itemIndex, 20000),
		agentId: optionalText(context, credentials.agentId, '凭证中的默认 AgentID', itemIndex, 20),
		keyPassphrase: String(credentials.keyPassphrase ?? ''),
	};
}

async function mchXmlRequest(
	this: IExecuteFunctions,
	creds: MchCreds,
	url: string,
	params: Record<string, string | number>,
	itemIndex: number,
): Promise<IDataObject> {
	const xml = buildXml(params);
	const agent = new https.Agent({
		cert: creds.certPem,
		key: creds.keyPem,
		passphrase: creds.keyPassphrase || undefined,
		rejectUnauthorized: true,
	});
	let raw: string;
	try {
		raw = (await this.helpers.httpRequest({
			method: 'POST',
			url,
			body: xml,
			headers: {
				'Content-Type': 'text/xml; charset=utf-8',
			},
			// n8n 透传 https.Agent 用于商户双向证书
			agent,
			returnFullResponse: false,
			encoding: 'text',
			json: false,
		} as Parameters<IExecuteFunctions['helpers']['httpRequest']>[0])) as string;
	} catch (e) {
		throw new NodeOperationError(
			this.getNode(),
			`商户支付请求失败: ${(e as Error).message} url=${url}`,
			{ itemIndex },
		);
	}

	const text = typeof raw === 'string' ? raw : String(raw ?? '');
	const parsed = parseXml(text);
	if (!parsed.return_code) {
		throw new NodeOperationError(this.getNode(), '商户支付响应不是有效的微信支付 XML', {
			itemIndex,
		});
	}

	if (parsed.return_code && parsed.return_code !== 'SUCCESS') {
		throw new NodeOperationError(
			this.getNode(),
			`商户通信失败: ${parsed.return_msg || parsed.return_code}`,
			{ itemIndex },
		);
	}
	if (parsed.result_code && parsed.result_code !== 'SUCCESS') {
		throw new NodeOperationError(
			this.getNode(),
			`商户业务失败: ${parsed.err_code || ''} ${parsed.err_code_des || parsed.result_code}`,
			{ itemIndex },
		);
	}
	if (parsed.sign) {
		const signParams: Record<string, string | number> = {};
		for (const [key, value] of Object.entries(parsed)) {
			if (typeof value === 'string' || typeof value === 'number') signParams[key] = value;
		}
		const expectedSign = mchMd5Sign(signParams, creds.apiKey);
		if (String(parsed.sign).toUpperCase() !== expectedSign) {
			throw new NodeOperationError(this.getNode(), '商户支付响应签名校验失败', { itemIndex });
		}
	}

	return parsed;
}

export async function executeMchpay(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const rawCredentials = (await this.getCredentials('weComMchPayApi')) as MchCreds;

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject = {};
			const creds = normalizeCredentials(this, rawCredentials, i);
			const extra = parseExtra(
				this,
				String(this.getNodeParameter('extraXmlFields', i, '{}') ?? '{}'),
				i,
			);

			if (operation === 'sendRedpack') {
				const mch_billno = requireOrderNumber(
					this,
					this.getNodeParameter('mch_billno', i),
					'商户订单号',
					i,
					28,
				);
				const re_openid = requireText(this, this.getNodeParameter('re_openid', i), '接收人 OpenID', i, 32);
				const total_amount = requireInteger(this, this.getNodeParameter('total_amount', i), '红包金额', i);
				const wishing = requireText(this, this.getNodeParameter('wishing', i), '祝福语', i, 128);
				const act_name = requireText(this, this.getNodeParameter('act_name', i), '项目名称', i, 32);
				const remark = requireText(this, this.getNodeParameter('remark', i), '备注', i, 256);
				const sender_name = optionalText(
					this,
					this.getNodeParameter('sender_name', i, ''),
					'发送者名称',
					i,
					128,
				);
				const formAgentId = optionalText(
					this,
					this.getNodeParameter('agentid', i, ''),
					'应用 AgentID',
					i,
					20,
				);
				const rawAgentId = formAgentId || (!sender_name ? creds.agentId : '') || '';
				const agentid = rawAgentId ? String(requireInteger(this, rawAgentId, '应用 AgentID', i)) : '';
				if (agentid && sender_name) fail(this, '应用 AgentID 与发送者名称互斥，只能填写一项', i);
				const scene_id = optionalText(this, this.getNodeParameter('scene_id', i, ''), '场景 ID', i, 32);
				if (scene_id && !/^PRODUCT_[1-8]$/.test(scene_id)) fail(this, '场景 ID 不受支持', i);
				if ((total_amount < 100 || total_amount > 20000) && !scene_id) {
					fail(this, '红包金额小于 1 元或大于 200 元时必须选择场景 ID', i);
				}
				const sender_header_media_id = optionalText(this, this.getNodeParameter(
					'sender_header_media_id',
					i,
					'',
				), '发送者头像素材 ID', i, 128);
				if (sender_header_media_id && !sender_name) {
					fail(this, '发送者头像素材 ID 仅能与发送者名称一起使用', i);
				}

				const extraFields = omitCoreFields(extra, [
					'nonce_str', 'sign', 'workwx_sign', 'mch_billno', 'mch_id', 'wxappid', 're_openid',
					'total_amount', 'wishing', 'act_name', 'remark', 'agentid', 'sender_name', 'scene_id',
					'sender_header_media_id',
				]);
				const params: Record<string, string | number> = {
					...extraFields,
					nonce_str: nonceStr(),
					mch_billno,
					mch_id: creds.mchId,
					wxappid: creds.wxAppId,
					re_openid,
					total_amount,
					wishing,
					act_name,
					remark,
				};
				if (agentid) params.agentid = agentid;
				if (sender_name) params.sender_name = sender_name;
				if (scene_id) params.scene_id = scene_id;
				if (sender_header_media_id) params.sender_header_media_id = sender_header_media_id;

				params.workwx_sign = workwxMd5Sign(params, creds.agentSecret, REDPACK_WORKWX_FIELDS);
				params.sign = mchMd5Sign(params, creds.apiKey);

				response = await mchXmlRequest.call(this, creds, URL_SEND_REDPACK, params, i);
			} else if (operation === 'queryRedpack') {
				const mch_billno = requireOrderNumber(
					this,
					this.getNodeParameter('mch_billno', i),
					'商户订单号',
					i,
					28,
				);
				const extraFields = omitCoreFields(extra, [
					'nonce_str', 'sign', 'mch_billno', 'mch_id', 'appid',
				]);
				const params: Record<string, string | number> = {
					...extraFields,
					nonce_str: nonceStr(),
					mch_billno,
					mch_id: creds.mchId,
					appid: creds.wxAppId,
				};
				params.sign = mchMd5Sign(params, creds.apiKey);
				response = await mchXmlRequest.call(this, creds, URL_QUERY_REDPACK, params, i);
			} else if (operation === 'payToEmployee') {
				const partner_trade_no = requireOrderNumber(
					this,
					this.getNodeParameter('partner_trade_no', i),
					'商户订单号',
					i,
					32,
				);
				const openid = requireText(this, this.getNodeParameter('openid', i), '员工 OpenID', i, 64);
				const amount = requireInteger(this, this.getNodeParameter('amount', i), '付款金额', i);
				const desc = requireText(this, this.getNodeParameter('desc', i), '付款说明', i, 81);
				const spbill_create_ip = requireText(
					this,
					this.getNodeParameter('spbill_create_ip', i),
					'调用方 IP',
					i,
					45,
				);
				if (isIP(spbill_create_ip) === 0) fail(this, '调用方 IP 必须是有效的 IPv4 或 IPv6 地址', i);
				const check_name = String(this.getNodeParameter('check_name', i, 'NO_CHECK')).trim();
				if (!['NO_CHECK', 'FORCE_CHECK'].includes(check_name)) fail(this, '校验姓名选项不受支持', i);
				const re_user_name = optionalText(
					this,
					this.getNodeParameter('re_user_name', i, ''),
					'收款人姓名',
					i,
					64,
				);
				if (check_name === 'FORCE_CHECK' && !re_user_name) fail(this, '强校验姓名时必须填写收款人姓名', i);
				const ww_msg_type = String(this.getNodeParameter('ww_msg_type', i, 'NORMAL_MSG')).trim();
				if (!['NORMAL_MSG', 'APPROVAL_MSG'].includes(ww_msg_type)) fail(this, '付款消息类型不受支持', i);
				const approval_number = optionalText(
					this,
					this.getNodeParameter('approval_number', i, ''),
					'审批单号',
					i,
					128,
				);
				if (ww_msg_type === 'APPROVAL_MSG' && !approval_number) fail(this, '审批付款必须填写审批单号', i);
				const act_name = requireText(this, this.getNodeParameter('act_name', i), '项目名称', i, 50);
				const rawAgentId =
					optionalText(this, this.getNodeParameter('agentid', i, ''), '应用 AgentID', i, 20) ||
					creds.agentId ||
					'';
				const agentid = rawAgentId ? String(requireInteger(this, rawAgentId, '应用 AgentID', i)) : '';

				const extraFields = omitCoreFields(extra, [
					'appid', 'mch_id', 'nonce_str', 'sign', 'workwx_sign', 'partner_trade_no', 'openid',
					'check_name', 're_user_name', 'amount', 'desc', 'spbill_create_ip', 'ww_msg_type',
					'approval_number', 'approval_type', 'act_name', 'agentid',
				]);
				const params: Record<string, string | number> = {
					...extraFields,
					appid: creds.wxAppId,
					mch_id: creds.mchId,
					nonce_str: nonceStr(),
					partner_trade_no,
					openid,
					check_name,
					amount,
					desc,
					spbill_create_ip,
					ww_msg_type,
					act_name,
				};
				if (re_user_name) params.re_user_name = re_user_name;
				if (ww_msg_type === 'APPROVAL_MSG') {
					params.approval_number = approval_number;
					params.approval_type = 1;
				}
				if (agentid) params.agentid = agentid;

				params.workwx_sign = workwxMd5Sign(params, creds.agentSecret, PAY_WORKWX_FIELDS);
				params.sign = mchMd5Sign(params, creds.apiKey);

				response = await mchXmlRequest.call(this, creds, URL_PAY_TO_EMPLOYEE, params, i);
			} else if (operation === 'queryPayToEmployee') {
				const partner_trade_no = requireOrderNumber(
					this,
					this.getNodeParameter('partner_trade_no', i),
					'商户订单号',
					i,
					32,
				);
				const extraFields = omitCoreFields(extra, [
					'nonce_str', 'sign', 'partner_trade_no', 'mch_id', 'appid',
				]);
				const params: Record<string, string | number> = {
					...extraFields,
					nonce_str: nonceStr(),
					partner_trade_no,
					mch_id: creds.mchId,
					appid: creds.wxAppId,
				};
				params.sign = mchMd5Sign(params, creds.apiKey);
				response = await mchXmlRequest.call(this, creds, URL_QUERY_PAY, params, i);
			} else {
				throw new NodeOperationError(this.getNode(), `未知 mchpay 操作: ${operation}`, {
					itemIndex: i,
				});
			}

			returnData.push({ json: response, pairedItem: { item: i } });
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
