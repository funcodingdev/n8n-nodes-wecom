import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { isIP } from 'node:net';
import { weComApiRequest } from '../../shared/transport';
import { weComMultipartUpload } from '../../shared/multipartUpload';

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function requireText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	minimumLength = 1,
	maximumLength?: number,
): string {
	const text = String(value ?? '').trim();
	const length = Array.from(text).length;
	if (length < minimumLength) fail(context, `${label}至少需要 ${minimumLength} 个字符`, itemIndex);
	if (maximumLength !== undefined && length > maximumLength) {
		fail(context, `${label}不能超过 ${maximumLength} 个字符`, itemIndex);
	}
	return text;
}

function optionalText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumLength: number,
): string | undefined {
	const text = String(value ?? '').trim();
	if (!text) return undefined;
	if (Array.from(text).length > maximumLength) {
		fail(context, `${label}不能超过 ${maximumLength} 个字符`, itemIndex);
	}
	return text;
}

function requireInteger(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	minimum: number,
	maximum = Number.MAX_SAFE_INTEGER,
): number {
	const number = typeof value === 'number' ? value : Number(value);
	if (!Number.isInteger(number) || number < minimum || number > maximum) {
		fail(context, `${label}必须是 ${minimum}–${maximum} 之间的整数`, itemIndex);
	}
	return number;
}

function requireOrderNumber(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string {
	const orderNumber = requireText(context, value, label, itemIndex, 6, 32);
	if (!/^[A-Za-z0-9_\-|*]+$/.test(orderNumber)) {
		fail(context, `${label}只能包含数字、字母、下划线、连字符、竖线和星号`, itemIndex);
	}
	return orderNumber;
}

function requireRefundNumber(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): string {
	const refundNumber = requireText(context, value, '商户退款单号', itemIndex, 1, 64);
	if (!/^[A-Za-z0-9_@\-|*]+$/.test(refundNumber)) {
		fail(context, '商户退款单号只能包含数字、字母、下划线、连字符、竖线、星号和 @', itemIndex);
	}
	return refundNumber;
}

function parseObject(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject {
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch (error) {
			fail(context, `${label} JSON 解析失败: ${(error as Error).message}`, itemIndex);
		}
	}
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		fail(context, `${label}必须是 JSON 对象`, itemIndex);
	}
	return parsed as IDataObject;
}

function optionalRfc3339(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string | undefined {
	const text = optionalText(context, value, label, itemIndex, 64);
	if (text === undefined) return undefined;
	if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/.test(text) || !Number.isFinite(Date.parse(text))) {
		fail(context, `${label}必须是有效的 RFC3339 日期时间`, itemIndex);
	}
	return text;
}

function normalizeDate(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string {
	const text = requireText(context, value, label, itemIndex);
	const match = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(text);
	if (!match) fail(context, `${label}必须是有效的 YYYY-MM-DD 日期`, itemIndex);
	const date = `${match[1]}-${match[2]}-${match[3]}`;
	const parsed = new Date(`${date}T00:00:00Z`);
	if (parsed.toISOString().slice(0, 10) !== date) {
		fail(context, `${label}必须是有效的 YYYY-MM-DD 日期`, itemIndex);
	}
	return date;
}

function validateBillDate(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): string {
	const billDate = normalizeDate(context, value, '账单日期', itemIndex);
	const timestamp = Date.parse(`${billDate}T00:00:00Z`);
	const now = new Date();
	const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
	const threeMonthsAgo = new Date(today);
	threeMonthsAgo.setUTCMonth(threeMonthsAgo.getUTCMonth() - 3);
	if (timestamp > today || timestamp < threeMonthsAgo.getTime()) {
		fail(context, '账单日期只能选择今天至最近 3 个月内的日期', itemIndex);
	}
	return billDate;
}

function validatePastDate(
	context: IExecuteFunctions,
	date: string,
	label: string,
	itemIndex: number,
): void {
	const today = new Date().toISOString().slice(0, 10);
	if (date < '1900-01-01' || date >= today) {
		fail(context, `${label}必须在 1900-01-01（含）至今天（不含）之间`, itemIndex);
	}
}

function validateIdentityNumber(
	context: IExecuteFunctions,
	idDocType: number,
	value: string,
	label: string,
	itemIndex: number,
): void {
	const patterns: Record<number, RegExp> = {
		0: /^\d{17}[\dX]$/,
		1: /^[A-Za-z0-9-]{4,15}$/,
		2: /^[Hh][A-Za-z0-9]{8}(?:[A-Za-z0-9]{2})?$/,
		3: /^[Mm][A-Za-z0-9]{8}(?:[A-Za-z0-9]{2})?$/,
		4: /^(?:\d{8}|\d{10})$/,
		5: /^[A-Za-z0-9]{15}$/,
		6: /^\d{17}[\dX]$/,
		7: /^\d{17}[\dX]$/,
		8: /^\d{17}[\dX]$/,
	};
	if (!patterns[idDocType]?.test(value)) {
		fail(context, `${label}与所选证件类型的官方格式不匹配`, itemIndex);
	}
}

function validateOrderDetail(
	context: IExecuteFunctions,
	detail: IDataObject,
	itemIndex: number,
): void {
	if (detail.cost_price !== undefined) {
		requireInteger(context, detail.cost_price, '订单原价', itemIndex, 1);
	}
	if (detail.invoice_id !== undefined) {
		requireText(context, detail.invoice_id, '商品小票 ID', itemIndex, 1, 32);
	}
	if (detail.goods_detail === undefined) return;
	if (!Array.isArray(detail.goods_detail) || detail.goods_detail.length === 0) {
		fail(context, '商品详情必须是非空数组', itemIndex);
	}
	for (const [index, rawGood] of detail.goods_detail.entries()) {
		if (!rawGood || typeof rawGood !== 'object' || Array.isArray(rawGood)) {
			fail(context, `商品详情第 ${index + 1} 项必须是对象`, itemIndex);
		}
		const good = rawGood as IDataObject;
		const merchantGoodsId = requireText(
			context,
			good.merchant_goods_id,
			`商品详情第 ${index + 1} 项商户商品编码`,
			itemIndex,
			1,
			32,
		);
		if (!/^[A-Za-z0-9_-]+$/.test(merchantGoodsId)) {
			fail(context, `商品详情第 ${index + 1} 项商户商品编码格式无效`, itemIndex);
		}
		if (good.wechatpay_goods_id !== undefined) {
			requireText(context, good.wechatpay_goods_id, '微信支付商品编码', itemIndex, 1, 32);
		}
		if (good.goods_name !== undefined) {
			requireText(context, good.goods_name, '商品名称', itemIndex, 1, 256);
		}
		requireInteger(context, good.quantity, `商品详情第 ${index + 1} 项数量`, itemIndex, 1);
		requireInteger(context, good.unit_price, `商品详情第 ${index + 1} 项单价`, itemIndex, 1);
	}
}

function validateApplyBody(context: IExecuteFunctions, body: IDataObject, itemIndex: number): void {
	requireText(context, body.out_request_no, '商户申请单号', itemIndex, 1, 32);
	requireInteger(context, body.organization_type, '主体类型', itemIndex, 0, 3);
	requireText(context, body.merchant_short_name, '商户简称', itemIndex, 1, 64);
	requireInteger(context, body.business_id, '经营范围 ID', itemIndex, 1, 31);
	requireText(context, body.userid, '提现人员 UserID', itemIndex);
	for (const [key, label] of [
		['business_license_info', '营业执照/登记证书信息'],
		['id_card_info', '经营者/法人证件信息'],
		['contact_info', '超级管理员信息'],
		['account_info', '结算账户信息'],
		['sales_scene_info', '经营场景证明'],
	] as const) {
		if (!body[key] || typeof body[key] !== 'object' || Array.isArray(body[key])) {
			fail(context, `${label}不能为空且必须是对象`, itemIndex);
		}
	}
	const license = body.business_license_info as IDataObject;
	for (const [key, label] of [
		['business_license_copy_open_wx_pay_media_id', '营业执照/登记证书图片 MediaID'],
		['business_license_number', '营业执照号'],
		['merchant_name', '商户名称'],
		['legal_person', '法人姓名'],
	] as const) requireText(context, license[key], label, itemIndex);
	const organizationType = body.organization_type as number;
	const licenseNumber = String(license.business_license_number);
	const unifiedCreditCode = /^9[0-9A-HJ-NP-RT-UW-Y]{17}$/;
	if (organizationType === 0 && !unifiedCreditCode.test(licenseNumber)) {
		fail(context, '企业营业执照号必须是以 9 开头的 18 位统一社会信用代码', itemIndex);
	}
	if (organizationType === 1 && !/^\d{15}$/.test(licenseNumber) && !unifiedCreditCode.test(licenseNumber)) {
		fail(context, '个体营业执照号必须是 15 位数字或 18 位统一社会信用代码', itemIndex);
	}
	const rawBusinessBegin = String(license.business_time_begin_time ?? '').trim();
	const rawBusinessEnd = String(license.business_time_end_time ?? '').trim();
	if ([2, 3].includes(organizationType)) {
		requireText(context, license.company_address, '注册地址', itemIndex, 4, 128);
		if (!rawBusinessBegin || !rawBusinessEnd) {
			fail(context, '社会团体组织或事业单位必须填写营业期限', itemIndex);
		}
	}
	if (rawBusinessBegin) {
		const businessBegin = normalizeDate(context, rawBusinessBegin, '营业期限开始', itemIndex);
		validatePastDate(context, businessBegin, '营业期限开始', itemIndex);
		if (rawBusinessEnd && rawBusinessEnd !== '长期') {
			const businessEnd = normalizeDate(context, rawBusinessEnd, '营业期限结束', itemIndex);
			if (businessEnd <= businessBegin) fail(context, '营业期限结束必须晚于开始日期', itemIndex);
		}
	}
	const idCard = body.id_card_info as IDataObject;
	for (const [key, label] of [
		['id_card_copy_open_wx_pay_media_id', '证件正面 MediaID'],
		['id_card_name', '证件姓名'],
		['id_card_number', '证件号码'],
		['id_card_valid_time_begin', '证件有效期开始'],
		['id_card_valid_time', '证件有效期结束'],
	] as const) requireText(context, idCard[key], label, itemIndex);
	const idDocType = requireInteger(context, idCard.id_doc_type ?? 8, '证件类型', itemIndex, 0, 8);
	validateIdentityNumber(context, idDocType, String(idCard.id_card_number), '经营者/法人证件号码', itemIndex);
	const idBegin = normalizeDate(context, idCard.id_card_valid_time_begin, '证件有效期开始', itemIndex);
	validatePastDate(context, idBegin, '证件有效期开始', itemIndex);
	if (idCard.id_card_valid_time !== '长期') {
		const idEnd = normalizeDate(context, idCard.id_card_valid_time, '证件有效期结束', itemIndex);
		if (idEnd <= idBegin) fail(context, '证件有效期结束必须晚于开始日期', itemIndex);
	}
	if (organizationType === 0) {
		requireText(context, idCard.id_card_address, '企业法人证件居住地址', itemIndex, 4, 128);
	}
	const contact = body.contact_info as IDataObject;
	const contactType = requireText(context, contact.contact_type, '超级管理员类型', itemIndex);
	if (!['65', '66'].includes(contactType)) fail(context, '超级管理员类型不受支持', itemIndex);
	requireText(context, contact.mobile_phone, '管理员手机', itemIndex);
	const email = requireText(context, contact.contact_email, '管理员邮箱', itemIndex);
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(context, '管理员邮箱格式无效', itemIndex);
	const contactIdentity = contact.contact_info as IDataObject | undefined;
	if (!contactIdentity || typeof contactIdentity !== 'object') {
		fail(context, '超级管理员证件信息不能为空', itemIndex);
	}
	requireText(context, contactIdentity.id_card_name, '管理员姓名', itemIndex);
	requireText(context, contactIdentity.id_card_number, '管理员证件号', itemIndex);
	if (contactType === '65') {
		if (
			contactIdentity.id_card_name !== idCard.id_card_name ||
			contactIdentity.id_card_number !== idCard.id_card_number
		) {
			fail(context, '法人类型管理员的姓名和证件号必须与经营者/法人一致', itemIndex);
		}
	} else {
		const contactDocType = requireInteger(
			context,
			contactIdentity.id_doc_type,
			'经办人证件类型',
			itemIndex,
			0,
			8,
		);
		for (const [key, label] of [
			['id_card_copy_open_wx_pay_media_id', '经办人证件正面 MediaID'],
			['id_card_valid_time_begin', '经办人证件有效期开始'],
			['id_card_valid_time', '经办人证件有效期结束'],
		] as const) requireText(context, contactIdentity[key], label, itemIndex);
		validateIdentityNumber(
			context,
			contactDocType,
			String(contactIdentity.id_card_number),
			'经办人证件号码',
			itemIndex,
		);
		requireText(
			context,
			contact.business_authorization_letter_open_wx_pay_media_id,
			'业务办理授权函 MediaID',
			itemIndex,
		);
	}
	const account = body.account_info as IDataObject;
	for (const [key, label] of [
		['account_bank', '开户银行'],
		['account_name', '开户名称'],
		['account_number', '银行账号'],
		['bank_address_code', '开户省市编码'],
	] as const) requireText(context, account[key], label, itemIndex);
	const accountType = requireInteger(context, account.bank_account_type ?? 0, '账户类型', itemIndex, 0, 75);
	if (![0, 74, 75].includes(accountType)) fail(context, '账户类型不受支持', itemIndex);
	if (organizationType === 1 && accountType === 0) fail(context, '个体主体必须选择账户类型', itemIndex);
	const sales = body.sales_scene_info as IDataObject;
	const sceneType = requireInteger(context, sales.type, '经营场景', itemIndex, 1, 2);
	if (sceneType === 2 && !sales.store_url && !sales.store_pic_open_wx_pay_media_id) {
		fail(context, '线上店铺 URL 与二维码 MediaID 至少填写一项', itemIndex);
	}
	if (sales.store_url !== undefined && Buffer.byteLength(String(sales.store_url), 'utf8') > 1024) {
		fail(context, '线上店铺 URL 不能超过 1024 个 UTF-8 字节', itemIndex);
	}
	if (sceneType === 1) {
		for (const [key, label] of [
			['address_code', '线下场所省市区编码'],
			['offline_address', '线下场所详细地址'],
			['entrance_pic_open_wx_pay_media_id', '门头照片 MediaID'],
			['indoor_pic_open_wx_pay_media_id', '店内照片 MediaID'],
		] as const) requireText(context, sales[key], label, itemIndex);
		if (!/^\d{6}$/.test(String(sales.address_code))) {
			fail(context, '线下场所省市区编码必须是 6 位数字', itemIndex);
		}
		requireText(context, sales.offline_address, '线下场所详细地址', itemIndex, 4, 512);
	}
	if (organizationType === 0 && body.owner === false) {
		if (!body.ubo_info || typeof body.ubo_info !== 'object' || Array.isArray(body.ubo_info)) {
			fail(context, '企业法人不是受益人时必须提供 ubo_info 对象', itemIndex);
		}
		const ubo = body.ubo_info as IDataObject;
		for (const [key, label] of [
			['id_card_copy_open_wx_pay_media_id', '受益人证件正面 MediaID'],
			['id_card_name', '受益人姓名'],
			['id_card_number', '受益人证件号码'],
			['id_card_valid_time_begin', '受益人证件有效期开始'],
			['id_card_valid_time', '受益人证件有效期结束'],
		] as const) requireText(context, ubo[key], label, itemIndex);
		const uboDocType = requireInteger(context, ubo.id_doc_type ?? 8, '受益人证件类型', itemIndex, 0, 8);
		validateIdentityNumber(context, uboDocType, String(ubo.id_card_number), '受益人证件号码', itemIndex);
	}
}

export async function executeMiniapppay(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			if (operation === 'createOrder') {
				// https://developer.work.weixin.qq.com/document/path/97322
				const appid = requireText(this, this.getNodeParameter('appid', i), 'AppID', i, 1, 32);
				const mchid = requireText(this, this.getNodeParameter('mchid', i), '商户号', i, 1, 32);
				const out_trade_no = requireOrderNumber(
					this,
					this.getNodeParameter('out_trade_no', i),
					'商户订单号',
					i,
				);
				const description = requireText(
					this,
					this.getNodeParameter('description', i),
					'商品描述',
					i,
					1,
					127,
				);
				const amount_total = requireInteger(
					this,
					this.getNodeParameter('amount_total', i),
					'订单金额',
					i,
					1,
				);
				const amount_currency = requireText(
					this,
					this.getNodeParameter('amount_currency', i, 'CNY'),
					'货币类型',
					i,
					1,
					16,
				);
				if (amount_currency !== 'CNY') fail(this, '境内商户号仅支持 CNY', i);
				const payer_openid = requireText(
					this,
					this.getNodeParameter('payer_openid', i),
					'支付者 OpenID',
					i,
					1,
					128,
				);
				const scenekey = optionalText(
					this,
					this.getNodeParameter('scenekey', i, ''),
					'下单场景 Key',
					i,
					256,
				);
				const notify_url = optionalText(
					this,
					this.getNodeParameter('notify_url', i, ''),
					'支付通知 URL',
					i,
					2048,
				);
				if (notify_url !== undefined) {
					try {
						const url = new URL(notify_url);
						if (!['http:', 'https:'].includes(url.protocol)) throw new Error('protocol');
					} catch {
						fail(this, '支付通知 URL 必须是有效的 HTTP(S) 地址', i);
					}
				}
				const attach = optionalText(
					this,
					this.getNodeParameter('attach', i, ''),
					'附加数据',
					i,
					128,
				);
				const goods_tag = optionalText(
					this,
					this.getNodeParameter('goods_tag', i, ''),
					'订单优惠标记',
					i,
					32,
				);
				const time_expire = optionalRfc3339(
					this,
					this.getNodeParameter('time_expire', i, ''),
					'交易结束时间',
					i,
				);
				const payer_client_ip = requireText(
					this,
					this.getNodeParameter('payer_client_ip', i),
					'用户终端 IP',
					i,
					1,
					45,
				);
				if (isIP(payer_client_ip) === 0) fail(this, '用户终端 IP 必须是有效的 IPv4 或 IPv6 地址', i);
				const store_id = requireText(
					this,
					this.getNodeParameter('store_id', i),
					'门店编号',
					i,
					1,
					32,
				);

				const body: IDataObject = {
					appid,
					mchid,
					out_trade_no,
					description,
					amount: { total: amount_total, currency: amount_currency || 'CNY' },
					payer: { openid: payer_openid },
					scene_info: {
						payer_client_ip,
						store_info: { id: store_id },
					},
				};
				if (scenekey !== undefined) body.scenekey = scenekey;
				if (notify_url !== undefined) body.notify_url = notify_url;
				if (attach !== undefined) body.attach = attach;
				if (goods_tag !== undefined) body.goods_tag = goods_tag;
				if (time_expire !== undefined) body.time_expire = time_expire;
				const detail = parseObject(
					this,
					this.getNodeParameter('detail_json', i, '{}'),
					'优惠详情',
					i,
				);
				if (Object.keys(detail).length > 0) body.detail = detail;
				const advanced = parseObject(
					this,
					this.getNodeParameter('advancedJson', i, '{}'),
					'高级下单字段',
					i,
				);
				if (
					advanced.scene_info !== undefined &&
					(!advanced.scene_info || typeof advanced.scene_info !== 'object' || Array.isArray(advanced.scene_info))
				) {
					fail(this, '高级下单字段 scene_info 必须是对象', i);
				}
				const advancedScene = advanced.scene_info as IDataObject | undefined;
				if (
					advancedScene?.store_info !== undefined &&
					(!advancedScene.store_info ||
						typeof advancedScene.store_info !== 'object' ||
						Array.isArray(advancedScene.store_info))
				) {
					fail(this, '高级下单字段 scene_info.store_info 必须是对象', i);
				}
				Object.assign(body, advanced);
				body.appid = appid;
				body.mchid = mchid;
				body.out_trade_no = out_trade_no;
				body.description = description;
				body.amount = { total: amount_total, currency: amount_currency };
				body.payer = { openid: payer_openid };
				body.scene_info = {
					...(advancedScene ?? {}),
					payer_client_ip,
					store_info: {
						...((advancedScene?.store_info as IDataObject | undefined) ?? {}),
						id: store_id,
					},
				};
				if (body.detail !== undefined) {
					if (!body.detail || typeof body.detail !== 'object' || Array.isArray(body.detail)) {
						fail(this, '优惠详情必须是 JSON 对象', i);
					}
					validateOrderDetail(this, body.detail as IDataObject, i);
				}
				for (const [key, label, maximum] of [
					['device_id', '商户端设备号', 32],
				] as const) {
					if (advancedScene?.[key] !== undefined) {
						requireText(this, advancedScene[key], label, i, 1, maximum);
					}
				}
				const advancedStore = advancedScene?.store_info as IDataObject | undefined;
				for (const [key, label, maximum] of [
					['name', '门店名称', 256],
					['area_code', '门店地区编码', 32],
					['address', '门店详细地址', 512],
				] as const) {
					if (advancedStore?.[key] !== undefined) {
						requireText(this, advancedStore[key], label, i, 1, maximum);
					}
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/miniapppay/create_order',
					body,
				);
			} else if (operation === 'getOrder') {
				// https://developer.work.weixin.qq.com/document/path/97323
				const mchid = requireText(this, this.getNodeParameter('mchid', i), '商户号', i, 1, 32);
				const out_trade_no = requireOrderNumber(this, this.getNodeParameter('out_trade_no', i), '商户订单号', i);
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/get_order', {
					mchid,
					out_trade_no,
				});
			} else if (operation === 'closeOrder') {
				// https://developer.work.weixin.qq.com/document/path/97324
				const mchid = requireText(this, this.getNodeParameter('mchid', i), '商户号', i, 1, 32);
				const out_trade_no = requireOrderNumber(this, this.getNodeParameter('out_trade_no', i), '商户订单号', i);
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/close_order', {
					mchid,
					out_trade_no,
				});
			} else if (operation === 'getSign') {
				// https://developer.work.weixin.qq.com/document/path/98130
				const appid = requireText(this, this.getNodeParameter('appid', i), 'AppID', i, 1, 32);
				const prepay_id = requireText(this, this.getNodeParameter('prepay_id', i), '预支付 ID', i, 1, 128);
				const nonce = requireText(this, this.getNodeParameter('nonce', i), '随机字符串', i, 1, 32);
				if (!/^[A-Za-z0-9]+$/.test(nonce)) fail(this, '随机字符串只能包含数字和字母', i);
				const rawTimestamp = this.getNodeParameter('timestamp', i, '');
				let timestamp = 0;
				if (rawTimestamp !== undefined && rawTimestamp !== null && String(rawTimestamp).trim() !== '') {
					const raw = String(rawTimestamp).trim();
					timestamp = /^\d+$/.test(raw)
						? Number(raw)
						: Math.floor(Date.parse(raw) / 1000);
					if (!Number.isSafeInteger(timestamp) || timestamp < 1 || timestamp > 4294967295) {
						fail(this, '时间戳不是有效的日期时间', i);
					}
				} else {
					timestamp = Math.floor(Date.now() / 1000);
				}
				const sign_type = requireText(
					this,
					this.getNodeParameter('sign_type', i, 'RSA'),
					'签名类型',
					i,
					1,
					32,
				);
				if (sign_type !== 'RSA') fail(this, '签名类型仅支持 RSA', i);

				const body: IDataObject = { appid, prepay_id, nonce, timestamp };
				if (sign_type) body.sign_type = sign_type;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/get_sign', body);
			} else if (operation === 'refund') {
				// https://developer.work.weixin.qq.com/document/path/97333
				const mchid = requireText(this, this.getNodeParameter('mchid', i), '商户号', i, 1, 32);
				const appid = requireText(this, this.getNodeParameter('appid', i), 'AppID', i, 1, 32);
				const out_trade_no = requireOrderNumber(this, this.getNodeParameter('out_trade_no', i), '商户订单号', i);
				const out_refund_no = requireRefundNumber(this, this.getNodeParameter('out_refund_no', i), i);
				const refund_amount = requireInteger(this, this.getNodeParameter('refund_amount', i), '退款金额', i, 1);
				const total_amount = requireInteger(this, this.getNodeParameter('total_amount', i), '原订单金额', i, 1);
				if (refund_amount > total_amount) fail(this, '退款金额不能超过原订单金额', i);
				const amount_currency = requireText(this, this.getNodeParameter('amount_currency', i, 'CNY'), '退款币种', i, 1, 18);
				if (amount_currency !== 'CNY') fail(this, '退款币种仅支持 CNY', i);
				const reason = optionalText(this, this.getNodeParameter('reason', i, ''), '退款原因', i, 80);
				const funds_account = String(this.getNodeParameter('funds_account', i, '') ?? '').trim();
				if (funds_account && funds_account !== 'AVAILABLE') fail(this, '资金账户仅支持 AVAILABLE', i);

				const body: IDataObject = {
					mchid,
					appid,
					out_trade_no,
					out_refund_no,
					amount: {
						refund: refund_amount,
						total: total_amount,
						currency: amount_currency || 'CNY',
					},
				};
				if (reason !== undefined) body.reason = reason;
				if (funds_account) body.funds_account = funds_account;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/refund', body);
			} else if (operation === 'getRefundDetail') {
				// https://developer.work.weixin.qq.com/document/path/97352
				const mchid = requireText(this, this.getNodeParameter('mchid', i), '商户号', i, 1, 32);
				const out_refund_no = requireRefundNumber(this, this.getNodeParameter('out_refund_no', i), i);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/miniapppay/get_refund_detail',
					{ mchid, out_refund_no },
				);
			} else if (operation === 'getBill') {
				// https://developer.work.weixin.qq.com/document/path/98115
				const mchid = requireText(this, this.getNodeParameter('mchid', i), '商户号', i, 8, 32);
				const bill_date = validateBillDate(this, this.getNodeParameter('bill_date', i), i);
				const bill_type = String(this.getNodeParameter('bill_type', i, 'ALL'));
				if (!['ALL', 'SUCCESS', 'REFUND'].includes(bill_type)) fail(this, '账单类型不受支持', i);
				const tar_type = String(this.getNodeParameter('tar_type', i, ''));
				if (!['', 'GZIP'].includes(tar_type)) fail(this, '压缩类型不受支持', i);

				const body: IDataObject = { mchid, bill_date };
				if (bill_type) body.bill_type = bill_type;
				if (tar_type) body.tar_type = tar_type;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/get_bill', body);
			} else if (operation === 'applyMch') {
				// https://developer.work.weixin.qq.com/document/path/98973
				const out_request_no = requireText(
					this,
					this.getNodeParameter('out_request_no', i),
					'商户申请单号',
					i,
					1,
					32,
				);
				const organization_type = requireInteger(
					this,
					this.getNodeParameter('organization_type', i, 0),
					'主体类型',
					i,
					0,
					3,
				);
				const merchant_short_name = requireText(
					this,
					this.getNodeParameter('merchant_short_name', i),
					'商户简称',
					i,
					1,
					64,
				);
				if (Buffer.byteLength(merchant_short_name, 'utf8') > 64) {
					fail(this, '商户简称不能超过 64 个 UTF-8 字节', i);
				}
				const apply_userid = requireText(
					this,
					this.getNodeParameter('apply_userid', i, '') ||
						this.getNodeParameter('apply_userid_selected', i, ''),
					'提现人员 UserID',
					i,
				);
				const business_id = requireInteger(
					this,
					this.getNodeParameter('business_id', i),
					'经营范围 ID',
					i,
					1,
					31,
				);
				const owner = this.getNodeParameter('owner', i, true) as boolean;
				const merchant_name = requireText(
					this,
					this.getNodeParameter('merchant_name', i),
					'商户名称',
					i,
					2,
					128,
				);
				const legal_person = requireText(
					this,
					this.getNodeParameter('legal_person', i),
					'法人姓名',
					i,
					2,
					100,
				);
				const business_license_number = requireText(this, this.getNodeParameter(
					'business_license_number',
					i,
				), '营业执照号', i);
				const business_license_copy_media_id = requireText(this, this.getNodeParameter(
					'business_license_copy_media_id',
					i,
				), '营业执照图片 MediaID', i);
				const company_address = String(this.getNodeParameter('company_address', i, '') ?? '').trim();
				const rawBusinessTimeBegin = String(this.getNodeParameter(
					'business_time_begin_time',
					i,
					'',
				) ?? '').trim();
				const business_time_begin_time = rawBusinessTimeBegin
					? normalizeDate(this, rawBusinessTimeBegin, '营业期限开始', i)
					: '';
				if (business_time_begin_time) {
					validatePastDate(this, business_time_begin_time, '营业期限开始', i);
				}
				const rawBusinessTimeEnd = String(this.getNodeParameter(
					'business_time_end_time',
					i,
					'',
				) ?? '').trim();
				const business_time_end_time = rawBusinessTimeEnd === '长期' || !rawBusinessTimeEnd
					? rawBusinessTimeEnd
					: normalizeDate(this, rawBusinessTimeEnd, '营业期限结束', i);
				if (business_time_begin_time && business_time_end_time !== '长期' && business_time_end_time <= business_time_begin_time) {
					fail(this, '营业期限结束必须晚于开始日期', i);
				}
				const cert_type = requireInteger(
					this,
					this.getNodeParameter('cert_type', i, 0),
					'登记证书类型',
					i,
					0,
					2522,
				);
				if (organization_type === 2 && cert_type === 0) fail(this, '社会团体组织必须选择登记证书类型', i);
				if ([2, 3].includes(organization_type)) {
					requireText(this, company_address, '注册地址', i, 4, 128);
					if (!business_time_begin_time || !business_time_end_time) {
						fail(this, '社会团体组织或事业单位必须填写营业期限', i);
					}
				}
				const id_doc_type = requireInteger(
					this,
					this.getNodeParameter('id_doc_type', i, 8),
					'证件类型',
					i,
					0,
					8,
				);
				const id_card_name = requireText(this, this.getNodeParameter('id_card_name', i), '证件姓名', i, 2, 100);
				const id_card_number = requireText(this, this.getNodeParameter('id_card_number', i), '证件号码', i);
				const id_card_address = String(this.getNodeParameter('id_card_address', i, '') ?? '').trim();
				const id_card_valid_time_begin = normalizeDate(this, this.getNodeParameter(
					'id_card_valid_time_begin',
					i,
				), '证件有效期开始', i);
				validatePastDate(this, id_card_valid_time_begin, '证件有效期开始', i);
				const rawIdCardValidTime = requireText(this, this.getNodeParameter('id_card_valid_time', i), '证件有效期结束', i);
				const id_card_valid_time = rawIdCardValidTime === '长期'
					? rawIdCardValidTime
					: normalizeDate(this, rawIdCardValidTime, '证件有效期结束', i);
				if (id_card_valid_time !== '长期' && id_card_valid_time <= id_card_valid_time_begin) {
					fail(this, '证件有效期结束必须晚于开始日期', i);
				}
				const id_card_copy_media_id = requireText(this, this.getNodeParameter(
					'id_card_copy_media_id',
					i,
				), '证件正面 MediaID', i);
				validateIdentityNumber(this, id_doc_type, id_card_number, '经营者/法人证件号码', i);
				const id_card_national_media_id = this.getNodeParameter(
					'id_card_national_media_id',
					i,
					'',
				) as string;
				const contact_type = String(this.getNodeParameter('contact_type', i, '65'));
				if (!['65', '66'].includes(contact_type)) fail(this, '超级管理员类型不受支持', i);
				const contact_name = requireText(this, this.getNodeParameter('contact_name', i), '管理员姓名', i);
				const contact_id_number = requireText(this, this.getNodeParameter('contact_id_number', i), '管理员证件号', i);
				const contact_mobile_phone = requireText(this, this.getNodeParameter(
					'contact_mobile_phone',
					i,
				), '管理员手机', i);
				if (!/^(?:\d{11}|[\d+-]{5,20})$/.test(contact_mobile_phone)) fail(this, '管理员手机格式无效', i);
				const contact_email = requireText(this, this.getNodeParameter('contact_email', i), '管理员邮箱', i);
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)) fail(this, '管理员邮箱格式无效', i);
				const bank_account_type = requireInteger(
					this,
					this.getNodeParameter('bank_account_type', i, 0),
					'账户类型',
					i,
					0,
					75,
				);
				if (![0, 74, 75].includes(bank_account_type)) fail(this, '账户类型不受支持', i);
				if (organization_type === 1 && bank_account_type === 0) fail(this, '个体主体必须选择账户类型', i);
				const account_bank = requireText(this, this.getNodeParameter('account_bank', i), '开户银行', i);
				const account_name = requireText(this, this.getNodeParameter('account_name', i), '开户名称', i);
				const account_number = requireText(this, this.getNodeParameter('account_number', i), '银行账号', i);
				const bank_address_code = requireText(this, this.getNodeParameter('bank_address_code', i), '开户省市编码', i);
				const bank_name = this.getNodeParameter('bank_name', i, '') as string;
				const sales_scene_type = requireInteger(
					this,
					this.getNodeParameter('sales_scene_type', i, 2),
					'经营场景',
					i,
					1,
					2,
				);
				const store_url = String(this.getNodeParameter('store_url', i, '') ?? '').trim();
				if (Buffer.byteLength(store_url, 'utf8') > 1024) fail(this, '线上店铺 URL 不能超过 1024 个 UTF-8 字节', i);
				const store_pic_media_id = String(this.getNodeParameter('store_pic_media_id', i, '') ?? '').trim();
				const offline_address_code = this.getNodeParameter(
					'offline_address_code',
					i,
					'',
				) as string;
				const offline_address = String(this.getNodeParameter('offline_address', i, '') ?? '').trim();
				if (offline_address && (Array.from(offline_address).length < 4 || Array.from(offline_address).length > 512)) {
					fail(this, '线下场所详细地址必须为 4–512 个字符', i);
				}
				const entrance_pic_media_id = this.getNodeParameter(
					'entrance_pic_media_id',
					i,
					'',
				) as string;
				const indoor_pic_media_id = this.getNodeParameter(
					'indoor_pic_media_id',
					i,
					'',
				) as string;
				const applyMchJson = this.getNodeParameter('applyMchJson', i, '{}') as string;

				const body: IDataObject = {
					out_request_no,
					organization_type,
					owner,
				};
				if (merchant_short_name) body.merchant_short_name = merchant_short_name;
				if (apply_userid) body.userid = apply_userid;
				if (business_id) body.business_id = business_id;

				const license: IDataObject = {};
				if (merchant_name) license.merchant_name = merchant_name;
				if (legal_person) license.legal_person = legal_person;
				if (business_license_number) license.business_license_number = business_license_number;
				if (business_license_copy_media_id) {
					license.business_license_copy_open_wx_pay_media_id = business_license_copy_media_id;
				}
				if (company_address) license.company_address = company_address;
				if (business_time_begin_time) license.business_time_begin_time = business_time_begin_time;
				if (business_time_end_time) license.business_time_end_time = business_time_end_time;
				if (cert_type) license.cert_type = cert_type;
				if (Object.keys(license).length) body.business_license_info = license;

				const idCard: IDataObject = { id_doc_type };
				if (id_card_name) idCard.id_card_name = id_card_name;
				if (id_card_number) idCard.id_card_number = id_card_number;
				if (id_card_address) idCard.id_card_address = id_card_address;
				if (id_card_valid_time_begin) idCard.id_card_valid_time_begin = id_card_valid_time_begin;
				if (id_card_valid_time) idCard.id_card_valid_time = id_card_valid_time;
				if (id_card_copy_media_id) {
					idCard.id_card_copy_open_wx_pay_media_id = id_card_copy_media_id;
				}
				if (id_card_national_media_id) {
					idCard.id_card_national_open_wx_pay_media_id = id_card_national_media_id;
				}
				if (Object.keys(idCard).length > 1 || id_card_name || id_card_number) {
					body.id_card_info = idCard;
				}

				const contactInner: IDataObject = {};
				if (contact_name) contactInner.id_card_name = contact_name;
				if (contact_id_number) contactInner.id_card_number = contact_id_number;
				if (contact_type === '66') {
					// 经办人需完整证件字段时，可在 JSON 中补充
					if (id_doc_type !== undefined) contactInner.id_doc_type = id_doc_type;
				}
				const contact: IDataObject = { contact_type };
				if (Object.keys(contactInner).length) contact.contact_info = contactInner;
				if (contact_mobile_phone) contact.mobile_phone = contact_mobile_phone;
				if (contact_email) contact.contact_email = contact_email;
				if (
					contact_type ||
					contact_mobile_phone ||
					contact_email ||
					Object.keys(contactInner).length
				) {
					body.contact_info = contact;
				}

				const account: IDataObject = {};
				if (bank_account_type) account.bank_account_type = bank_account_type;
				if (account_bank) account.account_bank = account_bank;
				if (account_name) account.account_name = account_name;
				if (account_number) account.account_number = account_number;
				if (bank_address_code) account.bank_address_code = bank_address_code;
				if (bank_name) account.bank_name = bank_name;
				if (Object.keys(account).length) body.account_info = account;

				const sales: IDataObject = { type: sales_scene_type };
				if (sales_scene_type === 2) {
					if (store_url) sales.store_url = store_url;
					if (store_pic_media_id) {
						sales.store_pic_open_wx_pay_media_id = store_pic_media_id;
					}
				} else if (sales_scene_type === 1) {
					if (!/^\d{6}$/.test(offline_address_code)) {
						fail(this, '线下场所省市区编码必须是 6 位数字', i);
					}
					if (offline_address_code) sales.address_code = offline_address_code;
					if (offline_address) sales.offline_address = offline_address;
					if (entrance_pic_media_id) {
						sales.entrance_pic_open_wx_pay_media_id = entrance_pic_media_id;
					}
					if (indoor_pic_media_id) {
						sales.indoor_pic_open_wx_pay_media_id = indoor_pic_media_id;
					}
				}
				body.sales_scene_info = sales;

				{
					const extra = parseObject(this, applyMchJson, '进件申请其余字段', i);
					const nestKeys = [
						'business_license_info',
						'id_card_info',
						'contact_info',
						'account_info',
						'sales_scene_info',
						'ubo_info',
						'finance_institution_info',
					] as const;
					const nested: Record<string, IDataObject> = {};
					for (const k of nestKeys) {
						if (
							extra[k] !== undefined &&
							(!extra[k] || typeof extra[k] !== 'object' || Array.isArray(extra[k]))
						) {
							fail(this, `${k} 必须是 JSON 对象`, i);
						}
						if (extra[k] && typeof extra[k] === 'object') {
							nested[k] = extra[k] as IDataObject;
							delete extra[k];
						}
					}
					Object.assign(body, extra);
					for (const k of nestKeys) {
						if (nested[k] || body[k]) {
							const baseObject = (body[k] as IDataObject) || {};
							const extraObject = nested[k] || {};
							if (k === 'contact_info') {
								body[k] = {
									...baseObject,
									...extraObject,
									contact_info: {
										...((baseObject.contact_info as IDataObject) || {}),
										...((extraObject.contact_info as IDataObject) || {}),
									},
								};
							} else {
								body[k] = { ...baseObject, ...extraObject };
							}
						}
					}
					body.out_request_no = out_request_no;
					body.organization_type = organization_type;
					body.merchant_short_name = merchant_short_name;
					body.business_id = business_id;
					body.userid = apply_userid;
					body.owner = owner;
				}
				validateApplyBody(this, body, i);
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/apply_mch', body);
			} else if (operation === 'getApplymentStatus') {
				// https://developer.work.weixin.qq.com/document/path/98974
				const out_request_no = requireText(
					this,
					this.getNodeParameter('out_request_no', i),
					'商户申请单号',
					i,
					1,
					32,
				);
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/miniapppay/get_applyment_status',
					{ out_request_no },
				);
			} else if (operation === 'uploadImage') {
				// https://developer.work.weixin.qq.com/document/path/98972
				const binaryProperty = requireText(
					this,
					this.getNodeParameter('binaryProperty', i, 'data'),
					'二进制字段名',
					i,
				);
				const binaryData = this.helpers.assertBinaryData(i, binaryProperty);
				const mimeType = String(binaryData.mimeType ?? '').toLowerCase();
				const fileName = String(binaryData.fileName ?? '').toLowerCase();
				const supportedMimeTypes = ['image/jpeg', 'image/png', 'image/bmp', 'image/x-ms-bmp'];
				if (
					!/[.](?:jpe?g|png|bmp)$/.test(fileName) ||
					(mimeType !== '' && !supportedMimeTypes.includes(mimeType))
				) {
					fail(this, '进件图片仅支持 JPG、JPEG、PNG 或 BMP 格式', i);
				}
				responseData = await weComMultipartUpload.call(this, {
					itemIndex: i,
					path: '/cgi-bin/miniapppay/upload_image',
					binaryPropertyName: binaryProperty,
					formFieldName: 'media',
					minBytes: 5,
					maxBytes: 2 * 1024 * 1024,
				});
			} else if (operation === 'downloadBillFile') {
				// 账单申请返回的 download_url，例如:
				// https://api.mch.weixin.qq.com/v3/billdownload/file?token=xxx
				const download_url = requireText(
					this,
					this.getNodeParameter('download_url', i),
					'账单下载地址',
					i,
					1,
					2048,
				);
				let parsedDownloadUrl: URL;
				try {
					parsedDownloadUrl = new URL(download_url);
				} catch {
					fail(this, '账单下载地址格式无效', i);
				}
				if (
					parsedDownloadUrl.protocol !== 'https:' ||
					parsedDownloadUrl.hostname !== 'api.mch.weixin.qq.com' ||
					parsedDownloadUrl.pathname !== '/v3/billdownload/file'
				) {
					fail(this, '账单下载地址必须是微信支付官方 HTTPS 下载地址', i);
				}
				const auth_header = String(this.getNodeParameter('auth_header', i, '') ?? '').trim();
				if (auth_header.length > 2048) fail(this, 'Authorization 头不能超过 2048 个字符', i);
				const binaryPropertyOut = requireText(this, this.getNodeParameter(
					'binaryPropertyOut',
					i,
					'data',
				), '输出二进制字段名', i);

				const headers: IDataObject = {};
				if (auth_header) {
					const raw = auth_header.trim();
					if (/^authorization\s*:/i.test(raw)) {
						const v = raw.replace(/^authorization\s*:\s*/i, '');
						headers.Authorization = v;
					} else {
						headers.Authorization = raw;
					}
				}

				const fileBuffer = (await this.helpers.httpRequest({
					method: 'GET',
					url: download_url,
					headers,
					encoding: 'arraybuffer',
					json: false,
					returnFullResponse: false,
				})) as ArrayBuffer | Buffer | string;

				const buffer = Buffer.isBuffer(fileBuffer)
					? fileBuffer
					: Buffer.from(fileBuffer as ArrayBuffer);
				if (buffer.length === 0) fail(this, '下载到的账单文件为空', i);
				const binaryData = await this.helpers.prepareBinaryData(
					buffer,
					`bill-${Date.now()}.csv`,
					'text/csv',
				);

				returnData.push({
					json: {
						success: true,
						download_url,
						// 便于路径覆盖校验与文档对照
						api: 'https://api.mch.weixin.qq.com/v3/billdownload/file',
						size: buffer.length,
					},
					binary: {
						[binaryPropertyOut]: binaryData,
					},
					pairedItem: { item: i },
				});
				continue;
			} else {
				fail(this, `不支持的小程序对外收款操作: ${operation}`, i);
			}

			returnData.push({
				json: responseData,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
