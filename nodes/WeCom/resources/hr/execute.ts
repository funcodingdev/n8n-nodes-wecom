import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const MAX_UINT32 = 4294967295;
const FORBIDDEN_UPDATE_FIELDS = new Set([11006, 11012, 12004]);
const VALUE_KEYS = ['value_string', 'value_uint64', 'value_uint32', 'value_int64', 'value_mobile'];

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function text(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxBytes = 4096,
	required = true,
): string {
	const normalized = String(value ?? '').trim();
	if (required && !normalized) fail(context, `${label}不能为空`, itemIndex);
	if (Buffer.byteLength(normalized, 'utf8') > maxBytes) {
		fail(context, `${label}不能超过 ${maxBytes} 字节`, itemIndex);
	}
	return normalized;
}

function integer(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min: number,
	max: number,
): number {
	const normalized = Number(value);
	if (!Number.isSafeInteger(normalized) || normalized < min || normalized > max) {
		fail(context, `${label}必须是 ${min}–${max} 之间的整数`, itemIndex);
	}
	return normalized;
}

function timestamp(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	if (value === undefined || value === null || String(value).trim() === '') {
		fail(context, `${label}不能为空`, itemIndex);
	}
	const raw = String(value).trim();
	const normalized = /^\d+$/.test(raw) ? Number(raw) : Math.floor(Date.parse(raw) / 1000);
	if (!Number.isSafeInteger(normalized) || normalized < 0) {
		fail(context, `${label}不是有效的日期时间`, itemIndex);
	}
	return normalized;
}

function jsonValue(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): unknown {
	try {
		return JSON.parse(String(value));
	} catch {
		fail(context, `${label}不是有效的 JSON`, itemIndex);
	}
}

function jsonObject(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject {
	const parsed = jsonValue(context, value, label, itemIndex);
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		fail(context, `${label}必须是 JSON 对象`, itemIndex);
	}
	return parsed as IDataObject;
}

function normalizeFieldSelector(
	context: IExecuteFunctions,
	raw: IDataObject,
	itemIndex: number,
	index: number,
): IDataObject {
	return {
		fieldid: integer(context, raw.fieldid, `第 ${index + 1} 个字段 ID`, itemIndex, 1, MAX_UINT32),
		sub_idx: integer(
			context,
			raw.sub_idx ?? 0,
			`第 ${index + 1} 个字段组下标`,
			itemIndex,
			0,
			MAX_UINT32,
		),
	};
}

function normalizeUpdateItem(
	context: IExecuteFunctions,
	raw: IDataObject,
	itemIndex: number,
	index: number,
): IDataObject {
	const normalized = normalizeFieldSelector(context, raw, itemIndex, index);
	if (FORBIDDEN_UPDATE_FIELDS.has(Number(normalized.fieldid))) {
		fail(context, `字段 ${normalized.fieldid} 不支持更新`, itemIndex);
	}
	const presentKeys = VALUE_KEYS.filter((key) => Object.prototype.hasOwnProperty.call(raw, key));
	if (presentKeys.length > 1)
		fail(context, `第 ${index + 1} 个更新字段只能设置一种值类型`, itemIndex);
	if (!presentKeys.length) return normalized;
	const key = presentKeys[0];
	if (key === 'value_string') {
		normalized.value_string = String(raw.value_string ?? '');
	} else if (key === 'value_uint64') {
		normalized.value_uint64 = integer(
			context,
			raw.value_uint64,
			`第 ${index + 1} 个字段 64 位非负整数值`,
			itemIndex,
			0,
			Number.MAX_SAFE_INTEGER,
		);
	} else if (key === 'value_uint32') {
		normalized.value_uint32 = integer(
			context,
			raw.value_uint32,
			`第 ${index + 1} 个字段 32 位非负整数值`,
			itemIndex,
			0,
			MAX_UINT32,
		);
	} else if (key === 'value_int64') {
		normalized.value_int64 = integer(
			context,
			raw.value_int64,
			`第 ${index + 1} 个字段 64 位整数值`,
			itemIndex,
			Number.MIN_SAFE_INTEGER,
			Number.MAX_SAFE_INTEGER,
		);
	} else {
		if (
			!raw.value_mobile ||
			typeof raw.value_mobile !== 'object' ||
			Array.isArray(raw.value_mobile)
		) {
			fail(context, `第 ${index + 1} 个字段电话号码必须是对象`, itemIndex);
		}
		const mobile = raw.value_mobile as IDataObject;
		normalized.value_mobile = {
			value_country_code: text(
				context,
				mobile.value_country_code,
				'电话区号',
				itemIndex,
				32,
				false,
			),
			value_mobile: text(context, mobile.value_mobile, '电话号码', itemIndex, 64, false),
		};
	}
	return normalized;
}

function formUpdateItems(
	context: IExecuteFunctions,
	collection: IDataObject,
	itemIndex: number,
): IDataObject[] {
	const rawFields = (collection.fields as IDataObject[]) || [];
	return rawFields.map((raw, index) => {
		const base: IDataObject = {
			fieldid: raw.fieldid,
			sub_idx: raw.sub_idx ?? 0,
		};
		if (!raw.clear_value) {
			const type = String(raw.value_type ?? 'string');
			if (type === 'string') base.value_string = String(raw.value_text ?? '');
			else if (type === 'uint64') base.value_uint64 = raw.value_number;
			else if (type === 'uint32') base.value_uint32 = raw.value_number;
			else if (type === 'int64') base.value_int64 = raw.value_number;
			else if (type === 'date')
				base.value_uint64 = timestamp(context, raw.value_date, '日期时间值', itemIndex);
			else if (type === 'mobile') {
				base.value_mobile = {
					value_country_code: raw.value_country_code ?? '',
					value_mobile: raw.value_mobile ?? '',
				};
			} else {
				fail(context, `第 ${index + 1} 个字段值类型不受支持`, itemIndex);
			}
		}
		return normalizeUpdateItem(context, base, itemIndex, index);
	});
}

function normalizeUpdateItems(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject[] {
	if (!Array.isArray(value)) fail(context, 'update_items 必须是数组', itemIndex);
	const seen = new Set<string>();
	return value.map((raw, index) => {
		if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
			fail(context, `第 ${index + 1} 个更新字段必须是对象`, itemIndex);
		}
		const item = normalizeUpdateItem(context, raw as IDataObject, itemIndex, index);
		const key = `${item.fieldid}:${item.sub_idx}`;
		if (seen.has(key))
			fail(context, `更新字段重复：${item.fieldid}（下标 ${item.sub_idx}）`, itemIndex);
		seen.add(key);
		return item;
	});
}

function normalizeRemoveItems(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject[] {
	if (!Array.isArray(value)) fail(context, 'remove_items 必须是数组', itemIndex);
	const seen = new Set<string>();
	return value.map((raw, index) => {
		if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
			fail(context, `第 ${index + 1} 个删除字段组必须是对象`, itemIndex);
		}
		const entry = raw as IDataObject;
		const groupType = integer(context, entry.group_type, '字段组类型', itemIndex, 1, 5);
		const subIdx = integer(context, entry.sub_idx, '字段组下标', itemIndex, 0, MAX_UINT32);
		const key = `${groupType}:${subIdx}`;
		if (seen.has(key)) fail(context, `删除字段组重复：${groupType}（下标 ${subIdx}）`, itemIndex);
		seen.add(key);
		return { group_type: groupType, sub_idx: subIdx };
	});
}

function normalizeInsertItems(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject[] {
	if (!Array.isArray(value)) fail(context, 'insert_items 必须是数组', itemIndex);
	return value.map((raw, index) => {
		if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
			fail(context, `第 ${index + 1} 个插入字段组必须是对象`, itemIndex);
		}
		const entry = raw as IDataObject;
		const rawItems = entry.item ?? [];
		if (!Array.isArray(rawItems))
			fail(context, `第 ${index + 1} 个插入字段组的 item 必须是数组`, itemIndex);
		const insertFields = rawItems.map((field, fieldIndex) => {
			if (!field || typeof field !== 'object' || Array.isArray(field)) {
				fail(context, `第 ${index + 1} 个插入字段组中的字段必须是对象`, itemIndex);
			}
			const normalized = normalizeUpdateItem(context, field as IDataObject, itemIndex, fieldIndex);
			delete normalized.sub_idx;
			return normalized;
		});
		return {
			group_type: integer(context, entry.group_type, '插入字段组类型', itemIndex, 1, 5),
			item: insertFields,
		};
	});
}

export async function executeHr(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			if (operation === 'getFieldList') {
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/hr/get_fields', {});
			} else if (operation === 'getStaffInfo') {
				const getAll = this.getNodeParameter('get_all', i, true) as boolean;
				const body: IDataObject = {
					userid: text(this, this.getNodeParameter('userid', i), '成员 UserID', i, 64),
					get_all: getAll,
				};
				if (!getAll) {
					const collection = this.getNodeParameter('fieldidsCollection', i, {}) as IDataObject;
					const rawFields = (collection.fields as IDataObject[]) || [];
					if (!rawFields.length) fail(this, '不获取全部字段时必须指定至少一个字段', i);
					const seen = new Set<string>();
					body.fieldids = rawFields.map((raw, index) => {
						const field = normalizeFieldSelector(this, raw, i, index);
						const key = `${field.fieldid}:${field.sub_idx}`;
						if (seen.has(key))
							fail(this, `查询字段重复：${field.fieldid}（下标 ${field.sub_idx}）`, i);
						seen.add(key);
						return field;
					});
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/hr/get_staff_info', body);
			} else if (operation === 'updateStaffInfo') {
				const extra = jsonObject(
					this,
					this.getNodeParameter('requestBody', i, '{}'),
					'完整请求体',
					i,
				);
				const formUpdates = formUpdateItems(
					this,
					this.getNodeParameter('fieldsCollection', i, {}) as IDataObject,
					i,
				);
				const removeCollection = this.getNodeParameter(
					'removeItemsCollection',
					i,
					{},
				) as IDataObject;
				const formRemoves = (removeCollection.items as IDataObject[]) || [];
				const insertJson = jsonValue(
					this,
					this.getNodeParameter('insertItemsJson', i, '[]'),
					'插入字段组',
					i,
				);
				const updateItems = normalizeUpdateItems(this, extra.update_items ?? formUpdates, i);
				const removeItems = normalizeRemoveItems(this, extra.remove_items ?? formRemoves, i);
				const insertItems = normalizeInsertItems(this, extra.insert_items ?? insertJson, i);
				if (!updateItems.length && !removeItems.length && !insertItems.length) {
					fail(this, '更新字段、删除字段组和插入字段组不能全部为空', i);
				}
				const body: IDataObject = {
					...extra,
					userid: text(this, this.getNodeParameter('userid', i), '成员 UserID', i, 64),
				};
				if (updateItems.length) body.update_items = updateItems;
				else delete body.update_items;
				if (removeItems.length) body.remove_items = removeItems;
				else delete body.remove_items;
				if (insertItems.length) body.insert_items = insertItems;
				else delete body.insert_items;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/hr/update_staff_info', body);
			} else {
				fail(this, `不支持的人事助手操作：${operation}`, i);
			}

			returnData.push({ json: response, pairedItem: { item: i } });
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (this.continueOnFail()) {
				returnData.push({ json: { error: message }, pairedItem: { item: i } });
				continue;
			}
			if (error instanceof NodeOperationError) throw error;
			throw new NodeOperationError(this.getNode(), message, { itemIndex: i });
		}
	}

	return returnData;
}
