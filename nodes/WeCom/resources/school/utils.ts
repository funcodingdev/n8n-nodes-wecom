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
	const text = String(value ?? '').trim();
	if (!text) return undefined;
	if (Buffer.byteLength(text, 'utf8') > maximumBytes) {
		fail(context, `${label}不能超过 ${maximumBytes} 个 UTF-8 字节`, itemIndex);
	}
	return text;
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

export function requireSchoolUserId(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string {
	const userid = requireByteText(context, value, label, itemIndex, 64);
	if (!/^[A-Za-z0-9][A-Za-z0-9_@.-]*$/.test(userid)) {
		fail(
			context,
			`${label}必须以数字或字母开头，且只能包含数字、字母、下划线、连字符、@ 和点`,
			itemIndex,
		);
	}
	return userid;
}

export function requireSchoolContactId(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string {
	return requireByteText(context, value, label, itemIndex, 64);
}

export function requireDepartmentIds(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number[] {
	const rawValues = Array.isArray(value)
		? value
		: String(value ?? '')
				.split(/[,，|\n\r]+/)
				.map((entry) => entry.trim())
				.filter(Boolean);
	if (rawValues.length === 0) fail(context, `${label}不能为空`, itemIndex);

	const departmentIds: number[] = [];
	const seen = new Set<number>();
	for (const [index, rawValue] of rawValues.entries()) {
		const departmentId = Number(rawValue);
		if (!Number.isInteger(departmentId) || departmentId < 1 || departmentId > 4294967295) {
			fail(context, `${label}第 ${index + 1} 项必须是正整数`, itemIndex);
		}
		if (!seen.has(departmentId)) {
			seen.add(departmentId);
			departmentIds.push(departmentId);
		}
	}
	if (departmentIds.length > 20) fail(context, `${label}不能超过 20 个`, itemIndex);
	return departmentIds;
}

export function requireSchoolUserIdList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumItems = 100,
): string[] {
	const rawValues = Array.isArray(value)
		? value
		: String(value ?? '')
				.split(/[,，|\n\r]+/)
				.map((entry) => entry.trim())
				.filter(Boolean);
	if (rawValues.length === 0) fail(context, `${label}不能为空`, itemIndex);

	const userids: string[] = [];
	const seen = new Set<string>();
	for (const [index, rawValue] of rawValues.entries()) {
		const userid = requireSchoolContactId(
			context,
			rawValue,
			`${label}第 ${index + 1} 项`,
			itemIndex,
		);
		const identity = userid.toLowerCase();
		if (!seen.has(identity)) {
			seen.add(identity);
			userids.push(userid);
		}
	}
	if (userids.length > maximumItems) {
		fail(context, `${label}不能超过 ${maximumItems} 个`, itemIndex);
	}
	return userids;
}

export function requireObjectArray(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumItems: number,
): Record<string, unknown>[] {
	if (!Array.isArray(value) || value.length === 0) {
		fail(context, `${label}至少需要 1 项`, itemIndex);
	}
	if (value.length > maximumItems) {
		fail(context, `${label}不能超过 ${maximumItems} 项`, itemIndex);
	}
	return value.map((entry, index) => {
		if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
			fail(context, `${label}第 ${index + 1} 项必须是对象`, itemIndex);
		}
		return entry as Record<string, unknown>;
	});
}

export function parseJsonArray(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): unknown[] {
	if (Array.isArray(value)) return value;
	if (typeof value !== 'string') fail(context, `${label}必须是 JSON 数组`, itemIndex);
	try {
		const parsed = JSON.parse(value) as unknown;
		if (!Array.isArray(parsed)) fail(context, `${label}必须是 JSON 数组`, itemIndex);
		return parsed;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		fail(context, `${label} JSON 解析失败: ${(error as Error).message}`, itemIndex);
	}
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
	if (maximumCharacters !== undefined && Array.from(text).length > maximumCharacters) {
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

export function requireDate(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumDaysAgo: number,
): string {
	const text = requireText(context, value, label, itemIndex);
	const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(text);
	if (!match) fail(context, `${label}必须是有效的 YYYY-MM-DD 日期`, itemIndex);
	const year = Number(match[1]);
	const month = Number(match[2]);
	const day = Number(match[3]);
	const dateNumber = Date.UTC(year, month - 1, day);
	const parsed = new Date(dateNumber);
	if (
		parsed.getUTCFullYear() !== year ||
		parsed.getUTCMonth() !== month - 1 ||
		parsed.getUTCDate() !== day
	) {
		fail(context, `${label}必须是有效的 YYYY-MM-DD 日期`, itemIndex);
	}
	if (text.length > 10 && !Number.isFinite(Date.parse(text))) {
		fail(context, `${label}必须是有效的日期时间`, itemIndex);
	}

	const now = new Date();
	const todayNumber = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
	const ageDays = Math.floor((todayNumber - dateNumber) / 86400000);
	if (ageDays < 0 || ageDays > maximumDaysAgo) {
		fail(context, `${label}只能选择今天至最近 ${maximumDaysAgo} 天内的日期`, itemIndex);
	}
	return `${match[1]}-${match[2]}-${match[3]}`;
}
