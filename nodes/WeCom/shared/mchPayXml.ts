import { createHash, randomBytes } from 'crypto';
import type { IDataObject } from 'n8n-workflow';

/** 微信支付 MD5 签名（字典序 + key，大写） */
export function mchMd5Sign(params: Record<string, string | number>, apiKey: string): string {
	const keys = Object.keys(params)
		.filter((k) => k !== 'sign' && params[k] !== '' && params[k] !== undefined && params[k] !== null)
		.sort();
	const stringA = keys.map((k) => `${k}=${params[k]}`).join('&');
	const stringSignTemp = `${stringA}&key=${apiKey}`;
	return createHash('md5').update(stringSignTemp, 'utf8').digest('hex').toUpperCase();
}

/**
 * 企业微信 workwx_sign
 * stringA + &secret=应用secret → MD5 大写
 */
export function workwxMd5Sign(
	params: Record<string, string | number>,
	agentSecret: string,
	fieldNames: string[],
): string {
	const selected: Record<string, string | number> = {};
	for (const name of fieldNames) {
		if (params[name] !== undefined && params[name] !== null && params[name] !== '') {
			selected[name] = params[name];
		}
	}
	const keys = Object.keys(selected).sort();
	const stringA = keys.map((k) => `${k}=${selected[k]}`).join('&');
	const stringSignTemp = `${stringA}&secret=${agentSecret}`;
	return createHash('md5').update(stringSignTemp, 'utf8').digest('hex').toUpperCase();
}

export function nonceStr(len = 32): string {
	return randomBytes(Math.ceil(len / 2))
		.toString('hex')
		.slice(0, len)
		.toUpperCase();
}

export function buildXml(params: Record<string, string | number>): string {
	const parts = ['<xml>'];
	for (const [k, v] of Object.entries(params)) {
		if (v === undefined || v === null || v === '') continue;
		const s = String(v);
		// 数字不套 CDATA 也可；统一 CDATA 更安全
		if (/^\d+$/.test(s) && k !== 'nonce_str' && k !== 'mch_billno' && k !== 'partner_trade_no') {
			parts.push(`<${k}>${s}</${k}>`);
		} else {
			parts.push(`<${k}><![CDATA[${s}]]></${k}>`);
		}
	}
	parts.push('</xml>');
	return parts.join('');
}

/** 简易 XML 解析（微信回包） */
export function parseXml(xml: string): IDataObject {
	const result: IDataObject = {};
	const re = /<([\w]+)>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]*))<\/\1>/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(xml))) {
		const key = m[1];
		if (key === 'xml') continue;
		result[key] = m[2] !== undefined ? m[2] : m[3];
	}
	return result;
}

/** 红包 workwx_sign 字段 */
export const REDPACK_WORKWX_FIELDS = [
	'act_name',
	'mch_billno',
	'mch_id',
	'nonce_str',
	're_openid',
	'total_amount',
	'wxappid',
];

/** 向员工付款 workwx_sign 字段 */
export const PAY_WORKWX_FIELDS = [
	'amount',
	'appid',
	'desc',
	'mch_id',
	'nonce_str',
	'openid',
	'partner_trade_no',
	'ww_msg_type',
];

export const MCH_API_HOST = 'https://api.mch.weixin.qq.com';
export const PATH_SEND_REDPACK = '/mmpaymkttransfers/sendworkwxredpack';
export const PATH_QUERY_REDPACK = '/mmpaymkttransfers/queryworkwxredpack';
export const PATH_PAY_TO_EMPLOYEE = '/mmpaymkttransfers/promotion/paywwsptrans2pocket';
export const PATH_QUERY_PAY = '/mmpaymkttransfers/promotion/querywwsptrans2pocket';

/** 完整 URL（便于文档路径覆盖校验与调用拼装） */
export const URL_SEND_REDPACK = `${MCH_API_HOST}${PATH_SEND_REDPACK}`;
export const URL_QUERY_REDPACK = `${MCH_API_HOST}${PATH_QUERY_REDPACK}`;
export const URL_PAY_TO_EMPLOYEE = `${MCH_API_HOST}${PATH_PAY_TO_EMPLOYEE}`;
export const URL_QUERY_PAY = `${MCH_API_HOST}${PATH_QUERY_PAY}`;

