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
				const attach = this.getNodeParameter('attach', i, '') as string;
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
				if (attach) body.attach = attach;

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
				const applyMchJson = this.getNodeParameter('applyMchJson', i, '{}') as string;
				let body: IDataObject = {};
				try {
					body = JSON.parse(applyMchJson || '{}') as IDataObject;
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
