import type {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';
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
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	return text;
}

export function optionalText(value: unknown): string | undefined {
	const text = String(value ?? '').trim();
	return text || undefined;
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

export function parseJsonArray(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject[] {
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch (error) {
			fail(context, `${label}不是有效的 JSON：${(error as Error).message}`, itemIndex);
		}
	}
	if (!Array.isArray(parsed)) {
		fail(context, `${label}必须是 JSON 数组`, itemIndex);
	}
	if (!parsed.every((entry) => entry !== null && typeof entry === 'object' && !Array.isArray(entry))) {
		fail(context, `${label}中的每一项都必须是对象`, itemIndex);
	}
	return parsed as IDataObject[];
}

export function readBatchInput(
	context: IExecuteFunctions,
	itemIndex: number,
	options: {
		modeName: string;
		jsonName: string;
		collectionName: string;
		collectionGroup: string;
		label: string;
	},
): IDataObject[] {
	const mode = String(context.getNodeParameter(options.modeName, itemIndex, 'form'));
	if (mode === 'json') {
		return parseJsonArray(
			context,
			context.getNodeParameter(options.jsonName, itemIndex, '[]'),
			options.label,
			itemIndex,
		);
	}
	if (mode !== 'form') fail(context, `${options.label}输入方式无效`, itemIndex);
	const collection = context.getNodeParameter(
		options.collectionName,
		itemIndex,
		{},
	) as IDataObject;
	const rows = collection[options.collectionGroup];
	return Array.isArray(rows) ? (rows as IDataObject[]) : [];
}

export function assertListSize(
	context: IExecuteFunctions,
	items: IDataObject[],
	label: string,
	itemIndex: number,
	maximum: number,
): void {
	if (items.length < 1 || items.length > maximum) {
		fail(context, `${label}数量必须为 1–${maximum} 条`, itemIndex);
	}
}

export function assertUnique(
	context: IExecuteFunctions,
	values: string[],
	label: string,
	itemIndex: number,
): void {
	if (new Set(values).size !== values.length) {
		fail(context, `${label}不能包含重复项`, itemIndex);
	}
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

export async function licenseApiRequest(
	context: IExecuteFunctions,
	itemIndex: number,
	options: {
		path: string;
		providerAccessToken: unknown;
		label: string;
		body?: IDataObject;
		method?: IHttpRequestMethods;
	},
): Promise<IDataObject> {
	const providerAccessToken = requireText(
		context,
		options.providerAccessToken,
		'Provider Access Token',
		itemIndex,
	);
	const request: IHttpRequestOptions = {
		method: options.method ?? 'POST',
		url: `${await getWeComBaseUrl.call(context)}${options.path}`,
		qs: { provider_access_token: providerAccessToken },
		json: true,
	};
	if (options.body !== undefined) request.body = options.body;

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
