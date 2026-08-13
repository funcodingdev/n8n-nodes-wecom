import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function characterLength(value: string): number {
	return Array.from(value).length;
}

export function requireText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumCharacters?: number,
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	if (maximumCharacters !== undefined && characterLength(text) > maximumCharacters) {
		fail(context, `${label}不能超过 ${maximumCharacters} 个字符`, itemIndex);
	}
	return text;
}

export function optionalText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumCharacters?: number,
): string | undefined {
	const text = String(value ?? '').trim();
	if (!text) return undefined;
	if (maximumCharacters !== undefined && characterLength(text) > maximumCharacters) {
		fail(context, `${label}不能超过 ${maximumCharacters} 个字符`, itemIndex);
	}
	return text;
}

export function requireByteText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumBytes: number,
): string {
	const text = requireText(context, value, label, itemIndex);
	if (Buffer.byteLength(text, 'utf8') > maximumBytes) {
		fail(context, `${label}不能超过 ${maximumBytes} 个 UTF-8 字节`, itemIndex);
	}
	return text;
}

export function optionalByteText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumBytes: number,
): string | undefined {
	const text = optionalText(context, value, label, itemIndex);
	if (text !== undefined && Buffer.byteLength(text, 'utf8') > maximumBytes) {
		fail(context, `${label}不能超过 ${maximumBytes} 个 UTF-8 字节`, itemIndex);
	}
	return text;
}

export function requireInteger(
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

export function requireNumber(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	minimum: number,
	maximum: number,
): number {
	const number = typeof value === 'number' ? value : Number(value);
	if (!Number.isFinite(number) || number < minimum || number > maximum) {
		fail(context, `${label}必须是 ${minimum}–${maximum} 之间的数值`, itemIndex);
	}
	return number;
}

export function requireHttpUrl(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumBytes = 2048,
): string {
	const text = requireByteText(context, value, label, itemIndex, maximumBytes);
	try {
		const url = new URL(text);
		if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('unsupported');
	} catch {
		fail(context, `${label}必须是包含 http:// 或 https:// 协议头的有效 URL`, itemIndex);
	}
	return text;
}

export function dateTimeToUnixTimestamp(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	let milliseconds: number;
	if (typeof value === 'number') {
		milliseconds = value > 100000000000 ? value : value * 1000;
	} else {
		const text = String(value ?? '').trim();
		if (!text) fail(context, `${label}不能为空`, itemIndex);
		if (/^\d+$/.test(text)) {
			const numericValue = Number(text);
			milliseconds = numericValue > 100000000000 ? numericValue : numericValue * 1000;
		} else {
			milliseconds = Date.parse(text);
		}
	}
	const timestamp = Math.floor(milliseconds / 1000);
	if (!Number.isFinite(timestamp) || timestamp < 1 || timestamp > 4294967295) {
		fail(context, `${label}必须是有效的日期时间`, itemIndex);
	}
	return timestamp;
}

export function validateStatisticWindow(
	context: IExecuteFunctions,
	startTime: number,
	endTime: number,
	itemIndex: number,
): void {
	if (endTime < startTime) fail(context, '结束日期不能早于起始日期', itemIndex);
	if (endTime - startTime > 31 * 86400) {
		fail(context, '统计查询跨度不能超过 31 天', itemIndex);
	}

	const now = new Date();
	const todayStart = Math.floor(
		new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000,
	);
	const oldestStart = todayStart - 180 * 86400;
	if (startTime < oldestStart || startTime >= todayStart || endTime >= todayStart) {
		fail(context, '统计日期必须在昨天至前 180 天范围内，不能查询当天数据', itemIndex);
	}
}

function listValues(value: unknown): unknown[] {
	if (Array.isArray(value)) {
		return value.flatMap((entry) => listValues(entry));
	}
	return String(value ?? '')
		.split(/[\s,，|]+/)
		.filter(Boolean);
}

export function stringList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumItems: number,
): string[] {
	const result: string[] = [];
	const seen = new Set<string>();
	for (const rawValue of listValues(value)) {
		const text = String(rawValue ?? '').trim();
		if (text && !seen.has(text)) {
			seen.add(text);
			result.push(text);
		}
	}
	if (result.length > maximumItems) {
		fail(context, `${label}不能超过 ${maximumItems} 个`, itemIndex);
	}
	return result;
}

export function integerList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumItems: number,
): number[] {
	const result: number[] = [];
	const seen = new Set<number>();
	for (const rawValue of listValues(value)) {
		const number = Number(rawValue);
		if (!Number.isInteger(number) || number < 1 || number > 4294967295) {
			fail(context, `${label}中的部门 ID 必须是 1–4294967295 之间的整数`, itemIndex);
		}
		if (!seen.has(number)) {
			seen.add(number);
			result.push(number);
		}
	}
	if (result.length > maximumItems) {
		fail(context, `${label}不能超过 ${maximumItems} 个`, itemIndex);
	}
	return result;
}
