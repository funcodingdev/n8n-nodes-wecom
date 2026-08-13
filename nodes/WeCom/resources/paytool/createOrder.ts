import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	fail,
	optionalPositiveInteger,
	optionalText,
	paytoolApiRequest,
	requireInteger,
	requireOption,
	requireText,
} from './utils';

function parseProductList(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject {
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch (error) {
			fail(context, `产品配置不是有效的 JSON：${(error as Error).message}`, itemIndex);
		}
	}
	if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
		fail(context, '产品配置必须是 JSON 对象', itemIndex);
	}
	return parsed as IDataObject;
}

function chinaDateStart(date = new Date()): number {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(date);
	const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
	return Date.UTC(get('year'), get('month') - 1, get('day'));
}

function validateTakeEffectDate(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	allowToday: boolean,
): string | undefined {
	const text = optionalText(context, value, label, itemIndex, 8);
	if (!text) return undefined;
	if (!/^\d{8}$/.test(text)) fail(context, `${label}必须使用 YYYYMMDD 格式`, itemIndex);
	const year = Number(text.slice(0, 4));
	const month = Number(text.slice(4, 6));
	const day = Number(text.slice(6, 8));
	const timestamp = Date.UTC(year, month - 1, day);
	const date = new Date(timestamp);
	if (
		date.getUTCFullYear() !== year ||
		date.getUTCMonth() !== month - 1 ||
		date.getUTCDate() !== day
	) {
		fail(context, `${label}不是有效日期`, itemIndex);
	}
	const today = chinaDateStart();
	if (allowToday ? timestamp < today : timestamp <= today) {
		fail(context, `${label}${allowToday ? '不能早于今天' : '必须晚于今天'}`, itemIndex);
	}
	if (timestamp > today + 366 * 86400_000) {
		fail(context, `${label}不能超过一年后`, itemIndex);
	}
	return text;
}

function asObject(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject {
	if (value === null || typeof value !== 'object' || Array.isArray(value)) {
		fail(context, `${label}不能为空`, itemIndex);
	}
	return value as IDataObject;
}

function getList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	required: boolean,
): IDataObject[] {
	if (!Array.isArray(value)) {
		if (!required && (value === undefined || value === null)) return [];
		fail(context, `${label}必须是数组`, itemIndex);
	}
	if ((required && value.length < 1) || value.length > 20) {
		fail(context, `${label}数量必须为 ${required ? '1–20' : '0–20'} 项`, itemIndex);
	}
	if (!value.every((entry) => entry !== null && typeof entry === 'object' && !Array.isArray(entry))) {
		fail(context, `${label}中的每一项都必须是对象`, itemIndex);
	}
	return value as IDataObject[];
}

function validateDiscount(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject | undefined {
	if (value === undefined || value === null) return undefined;
	const discount = asObject(context, value, label, itemIndex);
	if (Object.keys(discount).length === 0) return undefined;
	const discountType = requireOption(
		context,
		discount.discount_type,
		`${label}的优惠类型`,
		itemIndex,
		[1, 2],
	);
	const result: IDataObject = {
		discount_type: discountType,
		discount_remarks: requireText(
			context,
			discount.discount_remarks,
			`${label}的优惠原因`,
			itemIndex,
			256,
		),
	};
	if (discountType === 1) {
		result.discount_amount = requireInteger(
			context,
			discount.discount_amount,
			`${label}的优惠金额`,
			itemIndex,
			1,
			10_000_000,
		);
	} else {
		result.discount_ratio = requireInteger(
			context,
			discount.discount_ratio,
			`${label}的优惠折扣`,
			itemIndex,
			10,
			99,
		);
	}
	return result;
}

function validateAppRows(
	context: IExecuteFunctions,
	rows: IDataObject[],
	itemIndex: number,
	options: {
		label: string;
		orderType: number;
		requireEdition: boolean;
		requireTotalPrice: boolean;
		requireUserForPurchase: boolean;
		allowDiscount: boolean;
		allowToday: boolean;
	},
): IDataObject[] {
	const normalized = rows.map((row, rowIndex) => {
		const label = `${options.label}第 ${rowIndex + 1} 项`;
		const result: IDataObject = {
			suiteid: requireText(context, row.suiteid, `${label}的套件 ID`, itemIndex, 64),
		};
		if (row.appid !== undefined) {
			result.appid = requireInteger(
				context,
				row.appid,
				`${label}的旧套件应用 ID`,
				itemIndex,
				1,
				Number.MAX_SAFE_INTEGER,
			);
		}
		if (options.requireEdition) {
			result.edition_id = requireText(
				context,
				row.edition_id,
				`${label}的版本号 ID`,
				itemIndex,
				64,
			);
		}
		if (options.requireTotalPrice) {
			result.total_price = requireInteger(
				context,
				row.total_price,
				`${label}的应用总价`,
				itemIndex,
				1,
				5_000_000,
			);
		}
		const userCount = optionalPositiveInteger(
			context,
			row.user_count,
			`${label}的购买人数`,
			itemIndex,
			1_000_000,
		);
		if (options.requireUserForPurchase && [0, 1].includes(options.orderType) && !userCount) {
			fail(context, `${label}在新购或扩容时必须填写购买人数`, itemIndex);
		}
		if (userCount) result.user_count = userCount;
		const durationDays = optionalPositiveInteger(
			context,
			row.duration_days,
			`${label}的购买时长`,
			itemIndex,
			1825,
		);
		if ([0, 2].includes(options.orderType) && !durationDays) {
			fail(context, `${label}在新购或续期时必须填写购买时长`, itemIndex);
		}
		if (durationDays) result.duration_days = durationDays;
		const takeEffectDate = validateTakeEffectDate(
			context,
			row.take_effect_date,
			`${label}的生效日期`,
			itemIndex,
			options.allowToday,
		);
		if (takeEffectDate) result.take_effect_date = takeEffectDate;
		if (options.allowDiscount) {
			const discount = validateDiscount(
				context,
				row.discount_info,
				`${label}的优惠信息`,
				itemIndex,
			);
			if (discount) result.discount_info = discount;
		}
		return result;
	});
	const keys = normalized.map((row) => `${row.suiteid}\u0000${row.appid ?? ''}`);
	if (new Set(keys).size !== keys.length) {
		fail(context, `${options.label}不能包含重复的套件/应用`, itemIndex);
	}
	return normalized;
}

function buildFormProductList(
	context: IExecuteFunctions,
	itemIndex: number,
	businessType: number,
): IDataObject {
	if (businessType === 1) {
		const source = context.getNodeParameter('thirdApp', itemIndex, {}) as IDataObject;
		const rows = ((source.buyInfoList as IDataObject | undefined)?.apps ?? []) as IDataObject[];
		return {
			third_app: {
				order_type: source.orderType,
				buy_info_list: rows.map((row) => ({
					suiteid: row.suiteid,
					...(row.includeAppid ? { appid: row.appid } : {}),
					edition_id: row.editionId,
					user_count: row.userCount,
					duration_days: row.durationDays,
					take_effect_date: row.takeEffectDate,
					...(row.discountInfo && Object.keys(row.discountInfo as IDataObject).length > 0
						? {
							discount_info: {
								discount_type: (row.discountInfo as IDataObject).discountType,
								discount_amount: (row.discountInfo as IDataObject).discountAmount,
								discount_ratio: (row.discountInfo as IDataObject).discountRatio,
								discount_remarks: (row.discountInfo as IDataObject).discountRemarks,
							},
						}
						: {}),
				})),
				notify_custom_corp: source.notifyCustomCorp,
			},
		};
	}
	if (businessType === 2) {
		const source = context.getNodeParameter('customizedApp', itemIndex, {}) as IDataObject;
		const rows = ((source.buyInfoList as IDataObject | undefined)?.apps ?? []) as IDataObject[];
		return {
			customized_app: {
				order_type: source.orderType,
				buy_info_list: rows.map((row) => ({
					suiteid: row.suiteid,
					total_price: row.totalPrice,
					user_count: row.userCount,
					duration_days: row.durationDays,
					take_effect_date: row.takeEffectDate,
				})),
				notify_custom_corp: source.notifyCustomCorp,
			},
		};
	}
	const source = context.getNodeParameter('promotionCase', itemIndex, {}) as IDataObject;
	const rows = ((source.buyInfoList as IDataObject | undefined)?.apps ?? []) as IDataObject[];
	return {
		promotion_case: {
			order_type: source.orderType,
			case_id: source.caseId,
			promotion_edition_name: source.promotionEditionName,
			duration_days: source.durationDays,
			take_effect_date: source.takeEffectDate,
			buy_info_list: rows.map((row) => ({
				suiteid: row.suiteid,
				...(row.includeAppid ? { appid: row.appid } : {}),
				user_count: row.userCount,
			})),
			notify_custom_corp: source.notifyCustomCorp,
		},
	};
}

function validateProductList(
	context: IExecuteFunctions,
	itemIndex: number,
	businessType: number,
	productList: IDataObject,
): IDataObject {
	if (businessType === 1) {
		const source = asObject(context, productList.third_app, '第三方应用购买详情', itemIndex);
		const orderType = requireOption(context, source.order_type, '购买类型', itemIndex, [0, 1, 2]);
		const rows = getList(context, source.buy_info_list, '购买应用列表', itemIndex, true);
		return {
			third_app: {
				order_type: orderType,
				buy_info_list: validateAppRows(context, rows, itemIndex, {
					label: '购买应用列表', orderType, requireEdition: true,
					requireTotalPrice: false, requireUserForPurchase: false,
					allowDiscount: true, allowToday: false,
				}),
				notify_custom_corp: requireOption(
					context, source.notify_custom_corp ?? 1, '确认提醒状态', itemIndex, [0, 1],
				),
			},
		};
	}
	if (businessType === 2) {
		const source = asObject(context, productList.customized_app, '代开发应用购买详情', itemIndex);
		const orderType = requireOption(context, source.order_type, '购买类型', itemIndex, [0, 1, 2]);
		const rows = getList(context, source.buy_info_list, '购买应用列表', itemIndex, true);
		return {
			customized_app: {
				order_type: orderType,
				buy_info_list: validateAppRows(context, rows, itemIndex, {
					label: '购买应用列表', orderType, requireEdition: false,
					requireTotalPrice: true, requireUserForPurchase: true,
					allowDiscount: false, allowToday: true,
				}),
				notify_custom_corp: requireOption(
					context, source.notify_custom_corp ?? 1, '确认提醒状态', itemIndex, [0, 1],
				),
			},
		};
	}
	const source = asObject(context, productList.promotion_case, '行业解决方案购买详情', itemIndex);
	const orderType = requireOption(context, source.order_type, '购买类型', itemIndex, [0, 1, 2]);
	const durationDays = optionalPositiveInteger(
		context, source.duration_days, '行业方案购买时长', itemIndex, 1825,
	);
	if ([0, 2].includes(orderType) && !durationDays) {
		fail(context, '行业方案在新购或续期时必须填写购买时长', itemIndex);
	}
	const result: IDataObject = {
		order_type: orderType,
		case_id: requireText(context, source.case_id, '行业方案 ID', itemIndex, 64),
		promotion_edition_name: requireText(
			context, source.promotion_edition_name, '行业方案版本名', itemIndex, 128,
		),
		notify_custom_corp: requireOption(
			context, source.notify_custom_corp ?? 1, '确认提醒状态', itemIndex, [0, 1],
		),
	};
	if (durationDays) result.duration_days = durationDays;
	const takeEffectDate = validateTakeEffectDate(
		context, source.take_effect_date, '行业方案生效日期', itemIndex, false,
	);
	if (takeEffectDate) result.take_effect_date = takeEffectDate;
	const rows = getList(context, source.buy_info_list, '购买应用列表', itemIndex, false);
	if (rows.length > 0) {
		result.buy_info_list = validateAppRows(context, rows, itemIndex, {
			label: '购买应用列表', orderType: 1, requireEdition: false,
			requireTotalPrice: false, requireUserForPurchase: false,
			allowDiscount: false, allowToday: false,
		});
	}
	return { promotion_case: result };
}

/** 创建收款订单：https://developer.work.weixin.qq.com/document/path/98045 */
export async function createOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const businessType = requireOption(
		this, this.getNodeParameter('businessType', index), '业务类型', index, [1, 2, 3],
	);
	const payType = requireOption(
		this, this.getNodeParameter('payType', index), '支付方式', index, [0, 1, 2],
	);
	const customCorpid = optionalText(
		this, this.getNodeParameter('customCorpid', index, ''), '客户企业 CorpID', index, 64,
	);
	if (businessType === 2 && !customCorpid) {
		fail(this, '代开发应用必须指定客户企业 CorpID', index);
	}
	const productInputMode = String(
		this.getNodeParameter('productInputMode', index, 'form'),
	);
	let productList: IDataObject;
	if (productInputMode === 'form') {
		productList = buildFormProductList(this, index, businessType);
	} else if (productInputMode === 'json') {
		productList = parseProductList(
			this,
			this.getNodeParameter('productListJson', index, '{}'),
			index,
		);
	} else {
		fail(this, '产品配置输入方式无效', index);
	}
	const body: IDataObject = {
		business_type: businessType,
		pay_type: payType,
		product_list: validateProductList(this, index, businessType, productList),
	};
	if (customCorpid) body.custom_corpid = customCorpid;
	const bankReceiptMediaId = optionalText(
		this,
		this.getNodeParameter('bankReceiptMediaId', index, ''),
		'银行收款回单素材 ID',
		index,
	);
	if (payType === 1 && !bankReceiptMediaId) {
		fail(this, '服务商代支付必须填写银行收款回单素材 ID', index);
	}
	if (payType === 1) body.bank_receipt_media_id = bankReceiptMediaId;
	const creator = optionalText(
		this,
		this.getNodeParameter('creator', index, ''),
		'订单创建人 UserID',
		index,
	);
	if (creator) body.creator = creator;

	return await paytoolApiRequest(this, index, {
		path: '/cgi-bin/paytool/open_order',
		providerAccessToken: this.getNodeParameter('providerAccessToken', index),
		paytoolSecret: this.getNodeParameter('paytoolSecret', index),
		label: '创建收款订单',
		body,
	});
}
