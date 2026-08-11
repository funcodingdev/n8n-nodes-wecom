import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

function splitCsv(value: string): string[] {
	return value
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

function splitCsvNumbers(value: string): number[] {
	return splitCsv(value)
		.map((s) => Number(s))
		.filter((n) => !Number.isNaN(n));
}

export async function executeExternalpay(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			if (operation === 'getMerchant') {
				// https://developer.work.weixin.qq.com/document/path/93666
				const mch_id = this.getNodeParameter('mch_id', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalpay/getmerchant', {
					mch_id,
				});
			} else if (operation === 'setMchUseScope') {
				const mch_id = this.getNodeParameter('mch_id', i) as string;
				const scope_users = this.getNodeParameter('scope_users', i, '') as string;
				const scope_partyids = this.getNodeParameter('scope_partyids', i, '') as string;
				const scope_tagids = this.getNodeParameter('scope_tagids', i, '') as string;

				const allow_use_scope: IDataObject = {};
				if (scope_users) allow_use_scope.user = splitCsv(scope_users);
				if (scope_partyids) allow_use_scope.partyid = splitCsvNumbers(scope_partyids);
				if (scope_tagids) allow_use_scope.tagid = splitCsvNumbers(scope_tagids);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalpay/set_mch_use_scope',
					{ mch_id, allow_use_scope },
				);
			} else if (operation === 'getBillList') {
				// https://developer.work.weixin.qq.com/document/path/93667
				const begin_time = this.getNodeParameter('begin_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;
				const payee_userid = this.getNodeParameter('payee_userid', i, '') as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 10) as number;

				const body: IDataObject = { begin_time, end_time, limit };
				if (payee_userid) body.payee_userid = payee_userid;
				if (cursor) body.cursor = cursor;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalpay/get_bill_list',
					body,
				);
			} else if (operation === 'getPaymentInfo') {
				// https://developer.work.weixin.qq.com/document/path/95944
				const payment_id = this.getNodeParameter('payment_id', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalpay/get_payment_info',
					{ payment_id },
				);
			} else if (operation === 'getFundFlow') {
				// https://developer.work.weixin.qq.com/document/path/98100
				const begin_time = this.getNodeParameter('begin_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;
				const mch_id = this.getNodeParameter('mch_id', i, '') as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 10) as number;

				const body: IDataObject = { begin_time, end_time, limit };
				if (mch_id) body.mch_id = mch_id;
				if (cursor) body.cursor = cursor;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalpay/get_fund_flow',
					body,
				);
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
