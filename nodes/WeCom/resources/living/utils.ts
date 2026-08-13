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
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	return text;
}

export function optionalText(value: unknown): string | undefined {
	const text = String(value ?? '').trim();
	return text || undefined;
}

export function requireCharacterText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumCharacters: number,
): string {
	const text = requireText(context, value, label, itemIndex);
	if (Array.from(text).length > maximumCharacters) {
		fail(context, `${label}不能超过 ${maximumCharacters} 个字符`, itemIndex);
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

export function normalizeUserIdList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	minimumItems: number,
	maximumItems: number,
): string[] {
	const rawEntries = Array.isArray(value)
		? value
		: String(value ?? '')
				.split(/[,，|\n\r]+/)
				.map((entry) => entry.trim())
				.filter(Boolean);
	const entries: string[] = [];
	const seen = new Set<string>();
	for (const rawEntry of rawEntries) {
		const userid = String(rawEntry ?? '').trim();
		if (!userid) continue;
		const identity = userid.toLowerCase();
		if (!seen.has(identity)) {
			seen.add(identity);
			entries.push(userid);
		}
	}
	if (entries.length < minimumItems) {
		fail(context, `${label}至少需要 ${minimumItems} 个 UserID`, itemIndex);
	}
	if (entries.length > maximumItems) {
		fail(context, `${label}不能超过 ${maximumItems} 个 UserID`, itemIndex);
	}
	return entries;
}

export function optionalUnixSeconds(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number | undefined {
	if (value === undefined || value === null || value === '') return undefined;
	if (typeof value === 'number') {
		if (!Number.isInteger(value) || value < 0 || value > 4294967295) {
			fail(context, `${label}必须是有效的 Unix 秒`, itemIndex);
		}
		return value;
	}
	const text = String(value).trim();
	if (!text) return undefined;
	const milliseconds = Date.parse(text);
	if (!Number.isFinite(milliseconds)) fail(context, `${label}必须是有效的日期时间`, itemIndex);
	const seconds = Math.floor(milliseconds / 1000);
	if (seconds < 0 || seconds > 4294967295) {
		fail(context, `${label}必须在 Unix 秒可表示的范围内`, itemIndex);
	}
	return seconds;
}
