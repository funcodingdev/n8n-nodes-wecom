import type { IDataObject, IExecuteFunctions, IHttpRequestMethods } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from './transport';

export type ExtraHttpOp = {
	/** n8n operation value */
	id: string;
	/** UI display name */
	name: string;
	action: string;
	description: string;
	path: string;
	method: 'GET' | 'POST';
};

export function parseRequestJson(
	this: IExecuteFunctions,
	itemIndex: number,
	paramName = 'requestBody',
): IDataObject {
	const raw = this.getNodeParameter(paramName, itemIndex, '{}') as string;
	if (!raw || !String(raw).trim()) return {};
	try {
		const v = JSON.parse(raw) as unknown;
		if (v && typeof v === 'object' && !Array.isArray(v)) return v as IDataObject;
		throw new Error('必须是 JSON 对象');
	} catch (e) {
		throw new NodeOperationError(
			this.getNode(),
			`请求体JSON 解析失败: ${(e as Error).message}`,
			{ itemIndex },
		);
	}
}

export function parseQueryJson(
	this: IExecuteFunctions,
	itemIndex: number,
	paramName = 'requestQuery',
): IDataObject {
	const raw = this.getNodeParameter(paramName, itemIndex, '{}') as string;
	if (!raw || !String(raw).trim()) return {};
	try {
		const v = JSON.parse(raw) as unknown;
		if (v && typeof v === 'object' && !Array.isArray(v)) return v as IDataObject;
		throw new Error('必须是 JSON 对象');
	} catch (e) {
		throw new NodeOperationError(
			this.getNode(),
			`Query参数JSON 解析失败: ${(e as Error).message}`,
			{ itemIndex },
		);
	}
}

export function extraHttpOpOptions(ops: ExtraHttpOp[]) {
	return ops.map((o) => ({
		name: o.name,
		value: o.id,
		action: o.action,
		// 面向用户：展示操作说明，不暴露内部 API 路径
		description: o.action || o.name,
	}));
}

export function extraHttpOpById(ops: ExtraHttpOp[]): Record<string, ExtraHttpOp> {
	return Object.fromEntries(ops.map((o) => [o.id, o]));
}

/**
 * 执行登记表中的遗漏 HTTP 接口：请求体/Query 用 JSON 参数
 * @param bodyDefaults 由表单字段预填的默认体（requestBody 同名字段优先）
 * @param qsDefaults 由表单字段预填的 Query（requestQuery 同名字段优先）
 */
export async function executeExtraHttpOp(
	this: IExecuteFunctions,
	op: ExtraHttpOp,
	itemIndex: number,
	bodyDefaults: IDataObject = {},
	qsDefaults: IDataObject = {},
): Promise<IDataObject> {
	const bodyFromJson = parseRequestJson.call(this, itemIndex);
	const qsFromJson = parseQueryJson.call(this, itemIndex);
	// 默认字段在前，JSON 可覆盖
	const body: IDataObject = { ...bodyDefaults, ...bodyFromJson };
	const qs: IDataObject = { ...qsDefaults, ...qsFromJson };
	return weComApiRequest.call(
		this,
		op.method as IHttpRequestMethods,
		op.path,
		op.method === 'GET' ? {} : body,
		qs,
	);
}
