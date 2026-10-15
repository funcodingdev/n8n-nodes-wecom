import { WECOM_ERROR_CODES } from './errorCodes';

/** 错误码的中文说明，未收录时返回空字符串 */
export function weComErrorMeaning(errcode: unknown): string {
	return WECOM_ERROR_CODES[String(errcode)]?.[0] ?? '';
}

/**
 * 生成错误详情：中文说明、排查方法和官方错误码查询链接，
 * 用作 NodeOperationError 的 description，在 n8n 错误面板中展示。
 */
export function weComErrorDescription(errcode: unknown): string {
	const code = String(errcode);
	const [meaning, fix] = WECOM_ERROR_CODES[code] ?? [];
	const lines: string[] = [];
	if (meaning) lines.push(`说明：${meaning}`);
	if (fix) lines.push(`排查：${fix}`);
	lines.push(`错误码查询：https://open.work.weixin.qq.com/devtool/query?e=${encodeURIComponent(code)}`);
	return lines.join('\n');
}

/** 用于拼接在错误消息末尾的中文说明，例如“，不合法的secret参数” */
export function weComErrorSuffix(errcode: unknown): string {
	const meaning = weComErrorMeaning(errcode);
	return meaning ? `，${meaning}` : '';
}
