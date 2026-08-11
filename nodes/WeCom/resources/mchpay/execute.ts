import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import * as https from 'https';
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

function parseExtra(raw: string): Record<string, string | number> {
	if (!raw || !String(raw).trim()) return {};
	try {
		const v = JSON.parse(raw) as unknown;
		if (v && typeof v === 'object' && !Array.isArray(v)) {
			return v as Record<string, string | number>;
		}
	} catch {
		// ignore
	}
	return {};
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

	return parsed;
}

export async function executeMchpay(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const creds = (await this.getCredentials('weComMchPayApi')) as MchCreds;

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject = {};
			const extra = parseExtra(
				String(this.getNodeParameter('extraXmlFields', i, '{}') ?? '{}'),
			);

			if (operation === 'sendRedpack') {
				const mch_billno = this.getNodeParameter('mch_billno', i) as string;
				const re_openid = this.getNodeParameter('re_openid', i) as string;
				const total_amount = this.getNodeParameter('total_amount', i) as number;
				const wishing = this.getNodeParameter('wishing', i) as string;
				const act_name = this.getNodeParameter('act_name', i) as string;
				const remark = this.getNodeParameter('remark', i) as string;
				const agentid =
					(this.getNodeParameter('agentid', i, '') as string) || creds.agentId || '';
				const sender_name = this.getNodeParameter('sender_name', i, '') as string;
				const scene_id = this.getNodeParameter('scene_id', i, '') as string;

				const params: Record<string, string | number> = {
					nonce_str: nonceStr(),
					mch_billno,
					mch_id: creds.mchId,
					wxappid: creds.wxAppId,
					re_openid,
					total_amount,
					wishing,
					act_name,
					remark,
					...extra,
				};
				if (agentid) params.agentid = agentid;
				if (sender_name) params.sender_name = sender_name;
				if (scene_id) params.scene_id = scene_id;

				params.workwx_sign = workwxMd5Sign(params, creds.agentSecret, REDPACK_WORKWX_FIELDS);
				params.sign = mchMd5Sign(params, creds.apiKey);

				response = await mchXmlRequest.call(this, creds, URL_SEND_REDPACK, params, i);
			} else if (operation === 'queryRedpack') {
				const mch_billno = this.getNodeParameter('mch_billno', i) as string;
				const params: Record<string, string | number> = {
					nonce_str: nonceStr(),
					mch_billno,
					mch_id: creds.mchId,
					appid: creds.wxAppId,
					...extra,
				};
				params.sign = mchMd5Sign(params, creds.apiKey);
				response = await mchXmlRequest.call(this, creds, URL_QUERY_REDPACK, params, i);
			} else if (operation === 'payToEmployee') {
				const partner_trade_no = this.getNodeParameter('partner_trade_no', i) as string;
				const openid = this.getNodeParameter('openid', i) as string;
				const amount = this.getNodeParameter('amount', i) as number;
				const desc = this.getNodeParameter('desc', i) as string;
				const spbill_create_ip = this.getNodeParameter('spbill_create_ip', i) as string;
				const check_name = this.getNodeParameter('check_name', i, 'NO_CHECK') as string;
				const re_user_name = this.getNodeParameter('re_user_name', i, '') as string;
				const ww_msg_type = this.getNodeParameter('ww_msg_type', i, 'NORMAL_MSG') as string;
				const approval_number = this.getNodeParameter('approval_number', i, '') as string;
				const act_name = this.getNodeParameter('act_name', i) as string;
				const agentid =
					(this.getNodeParameter('agentid', i, '') as string) || creds.agentId || '';

				const params: Record<string, string | number> = {
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
					...extra,
				};
				if (re_user_name) params.re_user_name = re_user_name;
				if (approval_number) {
					params.approval_number = approval_number;
					params.approval_type = 1;
				}
				if (agentid) params.agentid = agentid;

				params.workwx_sign = workwxMd5Sign(params, creds.agentSecret, PAY_WORKWX_FIELDS);
				params.sign = mchMd5Sign(params, creds.apiKey);

				response = await mchXmlRequest.call(this, creds, URL_PAY_TO_EMPLOYEE, params, i);
			} else if (operation === 'queryPayToEmployee') {
				const partner_trade_no = this.getNodeParameter('partner_trade_no', i) as string;
				const params: Record<string, string | number> = {
					nonce_str: nonceStr(),
					partner_trade_no,
					mch_id: creds.mchId,
					appid: creds.wxAppId,
					...extra,
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
