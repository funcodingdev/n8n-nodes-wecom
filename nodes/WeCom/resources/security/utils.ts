import type { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const LIST_SEPARATORS = /[,，|\n\r]+/;

export function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

export function requiredText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxLength = 128,
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	if (text.length > maxLength) fail(context, `${label}不能超过 ${maxLength} 个字符`, itemIndex);
	return text;
}

export function optionalText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxLength = 1024,
): string {
	const text = String(value ?? '').trim();
	if (text.length > maxLength) fail(context, `${label}不能超过 ${maxLength} 个字符`, itemIndex);
	return text;
}

export function integerInRange(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min: number,
	max: number,
): number {
	const number = Number(value);
	if (!Number.isSafeInteger(number) || number < min || number > max) {
		fail(context, `${label}必须是 ${min}–${max} 之间的整数`, itemIndex);
	}
	return number;
}

export function enumNumber(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	allowed: readonly number[],
): number {
	const number = Number(value);
	if (!Number.isSafeInteger(number) || !allowed.includes(number)) {
		fail(context, `${label}只能是 ${allowed.join('、')}`, itemIndex);
	}
	return number;
}

export function stringList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min: number,
	max: number,
	maxItemLength = 128,
): string[] {
	const source = Array.isArray(value) ? value : [value];
	const normalized = source
		.flatMap((entry) => String(entry ?? '').split(LIST_SEPARATORS))
		.map((entry) => entry.trim())
		.filter(Boolean);
	const unique = [...new Set(normalized)];
	if (unique.length < min || unique.length > max) {
		fail(context, `${label}数量必须为 ${min}–${max} 个`, itemIndex);
	}
	const tooLong = unique.find((entry) => entry.length > maxItemLength);
	if (tooLong) fail(context, `${label}中的单项不能超过 ${maxItemLength} 个字符`, itemIndex);
	return unique;
}

function timestamp(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	let seconds: number;
	if (typeof value === 'number' || /^\d+$/.test(String(value ?? '').trim())) {
		seconds = Number(value);
	} else {
		seconds = Math.floor(Date.parse(String(value ?? '')) / 1000);
	}
	if (!Number.isSafeInteger(seconds) || seconds <= 0) {
		fail(context, `${label}必须是有效的日期时间`, itemIndex);
	}
	return seconds;
}

export function dateRange(
	context: IExecuteFunctions,
	startValue: unknown,
	endValue: unknown,
	itemIndex: number,
	maxDays: number,
	logRetention = false,
): { startTime: number; endTime: number } {
	const startTime = timestamp(context, startValue, '开始时间', itemIndex);
	const endTime = timestamp(context, endValue, '结束时间', itemIndex);
	if (endTime <= startTime) fail(context, '结束时间必须晚于开始时间', itemIndex);
	if (endTime - startTime > maxDays * 86400) {
		fail(context, `时间范围不能超过 ${maxDays} 天`, itemIndex);
	}
	if (logRetention) {
		const now = Math.floor(Date.now() / 1000);
		if (endTime >= now) fail(context, '结束时间必须早于当前时间', itemIndex);
		if (startTime < now - 180 * 86400) fail(context, '开始时间不能早于 180 天前', itemIndex);
	}
	return { startTime, endTime };
}

export function asObject(value: unknown): IDataObject {
	return value && typeof value === 'object' && !Array.isArray(value) ? (value as IDataObject) : {};
}
