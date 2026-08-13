import type { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

export function requireText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumBytes: number,
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	if (Buffer.byteLength(text, 'utf8') > maximumBytes) {
		fail(context, `${label}不能超过 ${maximumBytes} 个 UTF-8 字节`, itemIndex);
	}
	return text;
}

export function optionalText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumBytes: number,
): string {
	const text = String(value ?? '').trim();
	if (Buffer.byteLength(text, 'utf8') > maximumBytes) {
		fail(context, `${label}不能超过 ${maximumBytes} 个 UTF-8 字节`, itemIndex);
	}
	return text;
}

export function requirePositiveInteger(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	const number = typeof value === 'number' ? value : Number(value);
	if (!Number.isInteger(number) || number < 1 || number > 4294967295) {
		fail(context, `${label}必须是 1–4294967295 之间的整数`, itemIndex);
	}
	return number;
}

function splitList(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.flatMap((entry) => splitList(entry));
	}
	return String(value ?? '')
		.split(/[,，|\n\r]+/)
		.map((entry) => entry.trim())
		.filter(Boolean);
}

export function parseTextList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumItems = 1000,
): string[] {
	const result: string[] = [];
	const seen = new Set<string>();
	for (const [index, entry] of splitList(value).entries()) {
		if (Buffer.byteLength(entry, 'utf8') > 64) {
			fail(context, `${label}第 ${index + 1} 项不能超过 64 个 UTF-8 字节`, itemIndex);
		}
		const key = entry.toLowerCase();
		if (!seen.has(key)) {
			seen.add(key);
			result.push(entry);
		}
	}
	if (result.length > maximumItems) fail(context, `${label}不能超过 ${maximumItems} 项`, itemIndex);
	return result;
}

export function parseUserIdJsonList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string[] {
	if (value === undefined || value === null || String(value).trim() === '') return [];
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch {
			fail(context, `${label}不是有效的 JSON`, itemIndex);
		}
	}
	if (!Array.isArray(parsed)) fail(context, `${label}必须是 JSON 数组`, itemIndex);
	if (parsed.length === 0) return [];
	return splitList(
		parsed.map((entry) => {
			if (typeof entry === 'string' || typeof entry === 'number') return entry;
			if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
				const row = entry as Record<string, unknown>;
				return row.userid ?? row.userid_selected ?? row.user_id ?? '';
			}
			return '';
		}),
	);
}

export function parseIdList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumItems = 1000,
): number[] {
	const result: number[] = [];
	const seen = new Set<number>();
	for (const [index, entry] of splitList(value).entries()) {
		const number = Number(entry);
		if (!Number.isInteger(number) || number < 1 || number > 4294967295) {
			fail(context, `${label}第 ${index + 1} 项必须是正整数`, itemIndex);
		}
		if (!seen.has(number)) {
			seen.add(number);
			result.push(number);
		}
	}
	if (result.length > maximumItems) fail(context, `${label}不能超过 ${maximumItems} 项`, itemIndex);
	return result;
}
