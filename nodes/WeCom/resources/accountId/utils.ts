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
	maximumLength = 256,
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	if (Array.from(text).length > maximumLength) {
		fail(context, `${label}不能超过 ${maximumLength} 个字符`, itemIndex);
	}
	return text;
}

export function optionalText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumLength = 256,
): string {
	const text = String(value ?? '').trim();
	if (Array.from(text).length > maximumLength) {
		fail(context, `${label}不能超过 ${maximumLength} 个字符`, itemIndex);
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

export function requireEnum(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	allowed: number[],
	itemIndex: number,
): number {
	const number = typeof value === 'number' ? value : Number(value);
	if (!Number.isInteger(number) || !allowed.includes(number)) {
		fail(context, `${label}只能是 ${allowed.join('、')}`, itemIndex);
	}
	return number;
}

export function requireStringList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumItems: number,
): string[] {
	const rawValues = Array.isArray(value)
		? value.flatMap((entry) =>
				Array.isArray(entry) ? entry : String(entry ?? '').split(/[,，|\n\r]+/),
			)
		: String(value ?? '').split(/[,，|\n\r]+/);
	const result: string[] = [];
	const seen = new Set<string>();
	for (const [index, rawValue] of rawValues.entries()) {
		const text = String(rawValue ?? '').trim();
		if (!text) continue;
		if (Array.from(text).length > 256) {
			fail(context, `${label}第 ${index + 1} 项不能超过 256 个字符`, itemIndex);
		}
		if (!seen.has(text)) {
			seen.add(text);
			result.push(text);
		}
	}
	if (result.length === 0 || result.length > maximumItems) {
		fail(context, `${label}数量必须为 1–${maximumItems} 项`, itemIndex);
	}
	return result;
}

/** Parse optional JSON array of string IDs: ["id"] / [{key:"id"}]. Empty → []. */
export function optionalJsonStringList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	keys: string[],
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
	return parsed.map((entry, index) => {
		if (typeof entry === 'string' || typeof entry === 'number') return String(entry).trim();
		if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
			const row = entry as Record<string, unknown>;
			for (const key of keys) {
				if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
					return String(row[key]).trim();
				}
			}
		}
		fail(context, `${label}第 ${index + 1} 项必须是字符串或含 ${keys[0]} 的对象`, itemIndex);
	}).filter(Boolean);
}

export function mergeStringListWithJson(
	context: IExecuteFunctions,
	primary: unknown,
	jsonValue: unknown,
	label: string,
	itemIndex: number,
	maximumItems: number,
	keys: string[],
): string[] {
	return requireStringList(
		context,
		[
			primary,
			...optionalJsonStringList(context, jsonValue, `${label} JSON`, itemIndex, keys),
		],
		label,
		itemIndex,
		maximumItems,
	);
}
