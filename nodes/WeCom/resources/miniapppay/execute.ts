import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { weComMultipartUpload } from '../../shared/multipartUpload';

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
				const appid = this.getNodeParameter('appid', i) as string;
				const mchid = this.getNodeParameter('mchid', i) as string;
				const out_trade_no = this.getNodeParameter('out_trade_no', i) as string;
				const description = this.getNodeParameter('description', i) as string;
				const amount_total = this.getNodeParameter('amount_total', i) as number;
				const amount_currency = this.getNodeParameter('amount_currency', i, 'CNY') as string;
				const payer_openid = this.getNodeParameter('payer_openid', i) as string;
				const scenekey = this.getNodeParameter('scenekey', i, '') as string;
				const notify_url = this.getNodeParameter('notify_url', i, '') as string;
				const attach = this.getNodeParameter('attach', i, '') as string;
				const goods_tag = this.getNodeParameter('goods_tag', i, '') as string;
				const time_expire = this.getNodeParameter('time_expire', i, '') as string;
				const detail_json = this.getNodeParameter('detail_json', i, '{}') as string;
				const payer_client_ip = this.getNodeParameter('payer_client_ip', i) as string;
				const store_id = this.getNodeParameter('store_id', i) as string;
				const advancedJson = this.getNodeParameter('advancedJson', i, '{}') as string;

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
				if (scenekey) body.scenekey = scenekey;
				if (notify_url) body.notify_url = notify_url;
				if (attach) body.attach = attach;
				if (goods_tag) body.goods_tag = goods_tag;
				if (time_expire) body.time_expire = time_expire;
				try {
					const detail = JSON.parse(detail_json || '{}') as IDataObject;
					if (detail && typeof detail === 'object' && Object.keys(detail).length) {
						body.detail = detail;
					}
				} catch {
					// ignore
				}

				try {
					const advanced = JSON.parse(advancedJson || '{}') as IDataObject;
					Object.assign(body, advanced);
				} catch {
					// ignore invalid advanced json
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/miniapppay/create_order',
					body,
				);
			} else if (operation === 'getOrder') {
				// https://developer.work.weixin.qq.com/document/path/97323
				const mchid = this.getNodeParameter('mchid', i) as string;
				const out_trade_no = this.getNodeParameter('out_trade_no', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/get_order', {
					mchid,
					out_trade_no,
				});
			} else if (operation === 'closeOrder') {
				// https://developer.work.weixin.qq.com/document/path/97324
				const mchid = this.getNodeParameter('mchid', i) as string;
				const out_trade_no = this.getNodeParameter('out_trade_no', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/close_order', {
					mchid,
					out_trade_no,
				});
			} else if (operation === 'getSign') {
				// https://developer.work.weixin.qq.com/document/path/98130
				const appid = this.getNodeParameter('appid', i) as string;
				const prepay_id = this.getNodeParameter('prepay_id', i) as string;
				const nonce = this.getNodeParameter('nonce', i) as string;
				let timestamp = this.getNodeParameter('timestamp', i, 0) as number;
				const sign_type = this.getNodeParameter('sign_type', i, 'RSA') as string;
				if (!timestamp) timestamp = Math.floor(Date.now() / 1000);

				const body: IDataObject = { appid, prepay_id, nonce, timestamp };
				if (sign_type) body.sign_type = sign_type;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/get_sign', body);
			} else if (operation === 'refund') {
				// https://developer.work.weixin.qq.com/document/path/97333
				const mchid = this.getNodeParameter('mchid', i) as string;
				const appid = this.getNodeParameter('appid', i) as string;
				const out_trade_no = this.getNodeParameter('out_trade_no', i) as string;
				const out_refund_no = this.getNodeParameter('out_refund_no', i) as string;
				const refund_amount = this.getNodeParameter('refund_amount', i) as number;
				const total_amount = this.getNodeParameter('total_amount', i) as number;
				const amount_currency = this.getNodeParameter('amount_currency', i, 'CNY') as string;
				const reason = this.getNodeParameter('reason', i, '') as string;
				const funds_account = this.getNodeParameter('funds_account', i, '') as string;

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
				if (reason) body.reason = reason;
				if (funds_account) body.funds_account = funds_account;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/refund', body);
			} else if (operation === 'getRefundDetail') {
				// https://developer.work.weixin.qq.com/document/path/97352
				const mchid = this.getNodeParameter('mchid', i) as string;
				const out_refund_no = this.getNodeParameter('out_refund_no', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/miniapppay/get_refund_detail',
					{ mchid, out_refund_no },
				);
			} else if (operation === 'getBill') {
				// https://developer.work.weixin.qq.com/document/path/98115
				const mchid = this.getNodeParameter('mchid', i) as string;
				const bill_date = this.getNodeParameter('bill_date', i) as string;
				const bill_type = this.getNodeParameter('bill_type', i, 'ALL') as string;
				const tar_type = this.getNodeParameter('tar_type', i, '') as string;

				const body: IDataObject = { mchid, bill_date };
				if (bill_type) body.bill_type = bill_type;
				if (tar_type) body.tar_type = tar_type;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/get_bill', body);
			} else if (operation === 'applyMch') {
				// https://developer.work.weixin.qq.com/document/path/98973
				const out_request_no = this.getNodeParameter('out_request_no', i) as string;
				const organization_type = this.getNodeParameter('organization_type', i, 0) as number;
				const merchant_short_name = this.getNodeParameter('merchant_short_name', i, '') as string;
				const apply_userid = this.getNodeParameter('apply_userid', i, '') as string;
				const business_id = this.getNodeParameter('business_id', i, 0) as number;
				const owner = this.getNodeParameter('owner', i, true) as boolean;
				const merchant_name = this.getNodeParameter('merchant_name', i, '') as string;
				const legal_person = this.getNodeParameter('legal_person', i, '') as string;
				const business_license_number = this.getNodeParameter(
					'business_license_number',
					i,
					'',
				) as string;
				const business_license_copy_media_id = this.getNodeParameter(
					'business_license_copy_media_id',
					i,
					'',
				) as string;
				const company_address = this.getNodeParameter('company_address', i, '') as string;
				const business_time_begin_time = this.getNodeParameter(
					'business_time_begin_time',
					i,
					'',
				) as string;
				const business_time_end_time = this.getNodeParameter(
					'business_time_end_time',
					i,
					'',
				) as string;
				const cert_type = this.getNodeParameter('cert_type', i, 0) as number;
				const id_doc_type = this.getNodeParameter('id_doc_type', i, 8) as number;
				const id_card_name = this.getNodeParameter('id_card_name', i, '') as string;
				const id_card_number = this.getNodeParameter('id_card_number', i, '') as string;
				const id_card_address = this.getNodeParameter('id_card_address', i, '') as string;
				const id_card_valid_time_begin = this.getNodeParameter(
					'id_card_valid_time_begin',
					i,
					'',
				) as string;
				const id_card_valid_time = this.getNodeParameter('id_card_valid_time', i, '') as string;
				const id_card_copy_media_id = this.getNodeParameter(
					'id_card_copy_media_id',
					i,
					'',
				) as string;
				const id_card_national_media_id = this.getNodeParameter(
					'id_card_national_media_id',
					i,
					'',
				) as string;
				const contact_type = this.getNodeParameter('contact_type', i, '65') as string;
				const contact_name = this.getNodeParameter('contact_name', i, '') as string;
				const contact_id_number = this.getNodeParameter('contact_id_number', i, '') as string;
				const contact_mobile_phone = this.getNodeParameter(
					'contact_mobile_phone',
					i,
					'',
				) as string;
				const contact_email = this.getNodeParameter('contact_email', i, '') as string;
				const bank_account_type = this.getNodeParameter('bank_account_type', i, 0) as number;
				const account_bank = this.getNodeParameter('account_bank', i, '') as string;
				const account_name = this.getNodeParameter('account_name', i, '') as string;
				const account_number = this.getNodeParameter('account_number', i, '') as string;
				const bank_address_code = this.getNodeParameter('bank_address_code', i, '') as string;
				const bank_name = this.getNodeParameter('bank_name', i, '') as string;
				const sales_scene_type = this.getNodeParameter('sales_scene_type', i, 2) as number;
				const store_url = this.getNodeParameter('store_url', i, '') as string;
				const store_pic_media_id = this.getNodeParameter('store_pic_media_id', i, '') as string;
				const offline_address_code = this.getNodeParameter(
					'offline_address_code',
					i,
					'',
				) as string;
				const offline_address = this.getNodeParameter('offline_address', i, '') as string;
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

				try {
					const extra = JSON.parse(applyMchJson || '{}') as IDataObject;
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
						if (extra[k] && typeof extra[k] === 'object') {
							nested[k] = extra[k] as IDataObject;
							delete extra[k];
						}
					}
					Object.assign(body, extra);
					for (const k of nestKeys) {
						if (nested[k] || body[k]) {
							body[k] = {
								...((body[k] as IDataObject) || {}),
								...nested[k],
							};
						}
					}
					// contact_info 内层证件也做浅合并
					if (nested.contact_info?.contact_info || (body.contact_info as IDataObject)?.contact_info) {
						const baseContact = (body.contact_info as IDataObject) || {};
						const extraContact = nested.contact_info || {};
						const baseInner = (baseContact.contact_info as IDataObject) || {};
						const extraInner = (extraContact.contact_info as IDataObject) || {};
						body.contact_info = {
							...baseContact,
							...extraContact,
							contact_info: { ...baseInner, ...extraInner },
						};
					}
					if (!body.out_request_no) body.out_request_no = out_request_no;
				} catch {
					throw new Error('进件申请JSON 解析失败');
				}
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniapppay/apply_mch', body);
			} else if (operation === 'getApplymentStatus') {
				// https://developer.work.weixin.qq.com/document/path/98974
				const out_request_no = this.getNodeParameter('out_request_no', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/miniapppay/get_applyment_status',
					{ out_request_no },
				);
			} else if (operation === 'uploadImage') {
				// https://developer.work.weixin.qq.com/document/path/98972
				const binaryProperty = this.getNodeParameter('binaryProperty', i, 'data') as string;
				responseData = await weComMultipartUpload.call(this, {
					itemIndex: i,
					path: '/cgi-bin/miniapppay/upload_image',
					binaryPropertyName: binaryProperty,
					formFieldName: 'media',
					minBytes: 1,
				});
			} else if (operation === 'downloadBillFile') {
				// 账单申请返回的 download_url，例如:
				// https://api.mch.weixin.qq.com/v3/billdownload/file?token=xxx
				const download_url = this.getNodeParameter('download_url', i) as string;
				const auth_header = this.getNodeParameter('auth_header', i, '') as string;
				const binaryPropertyOut = this.getNodeParameter(
					'binaryPropertyOut',
					i,
					'data',
				) as string;

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
