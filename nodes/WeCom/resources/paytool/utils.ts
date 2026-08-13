import { createHmac, randomBytes } from 'crypto';
import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

export function fail(
	context: IExecuteFunctions,
	message: string,
	itemIndex: number,
): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

export function requireText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxBytes?: number,
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	if (maxBytes !== undefined && Buffer.byteLength(text, 'utf8') > maxBytes) {
		fail(context, `${label}不能超过 ${maxBytes} 个字节`, itemIndex);
	}
	return text;
}

export function optionalText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxBytes?: number,
): string | undefined {
	const text = String(value ?? '').trim();
	if (!text) return undefined;
	if (maxBytes !== undefined && Buffer.byteLength(text, 'utf8') > maxBytes) {
		fail(context, `${label}不能超过 ${maxBytes} 个字节`, itemIndex);
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
	const parsed = Number(value);
	if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
		fail(context, `${label}必须是 ${minimum}–${maximum} 的整数`, itemIndex);
	}
	return parsed;
}

export function optionalPositiveInteger(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximum: number,
): number | undefined {
	if (value === undefined || value === null || value === '' || Number(value) === 0) return undefined;
	return requireInteger(context, value, label, itemIndex, 1, maximum);
}

export function requireOption(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	allowed: readonly number[],
): number {
	const parsed = Number(value);
	if (!Number.isSafeInteger(parsed) || !allowed.includes(parsed)) {
		fail(context, `${label}仅支持 ${allowed.join('、')}`, itemIndex);
	}
	return parsed;
}

export function dateTimeToUnixTimestamp(value: unknown): number | undefined {
	if (value === undefined || value === null || value === '') return undefined;
	if (typeof value === 'number') {
		return Number.isFinite(value) && value > 0 ? Math.floor(value) : undefined;
	}
	const timestamp = new Date(String(value)).getTime();
	return Number.isFinite(timestamp) && timestamp > 0
		? Math.floor(timestamp / 1000)
		: undefined;
}

function flattenObject(value: unknown, pairs: string[]): void {
	if (value === null || value === undefined || value === '') return;
	if (Array.isArray(value)) {
		for (const item of value) flattenObject(item, pairs);
		return;
	}
	if (typeof value === 'object') {
		for (const [key, child] of Object.entries(value)) {
			if (key === 'sig' || child === null || child === undefined || child === '') continue;
			if (typeof child === 'object') flattenObject(child, pairs);
			else pairs.push(`${key}=${String(child)}`);
		}
		return;
	}
	pairs.push(String(value));
}

export function generatePaytoolSignature(body: IDataObject, secret: string): string {
	const pairs: string[] = [];
	flattenObject(body, pairs);
	pairs.sort();
	return createHmac('sha256', secret).update(pairs.join('&')).digest('base64');
}

export async function paytoolApiRequest(
	context: IExecuteFunctions,
	itemIndex: number,
	options: {
		path: string;
		providerAccessToken: unknown;
		label: string;
		body: IDataObject;
		paytoolSecret?: unknown;
	},
): Promise<IDataObject> {
	const providerAccessToken = requireText(
		context,
		options.providerAccessToken,
		'Provider Access Token',
		itemIndex,
	);
	if (options.paytoolSecret !== undefined) {
		const secret = requireText(
			context,
			options.paytoolSecret,
			'收银台 API 调用密钥',
			itemIndex,
		);
		options.body.nonce_str = randomBytes(16).toString('hex');
		options.body.ts = Math.floor(Date.now() / 1000);
		options.body.sig = generatePaytoolSignature(options.body, secret);
	}
	const request: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(context)}${options.path}`,
		qs: { provider_access_token: providerAccessToken },
		body: options.body,
		json: true,
	};
	try {
		const response = (await context.helpers.httpRequest(request)) as IDataObject;
		if (response.errcode !== undefined && Number(response.errcode) !== 0) {
			fail(
				context,
				`${options.label}失败: ${response.errmsg} (错误码: ${response.errcode})`,
				itemIndex,
			);
		}
		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		fail(context, `${options.label}失败: ${(error as Error).message}`, itemIndex);
	}
}
