import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';
import {
	dateTimeToUnixTimestamp,
	fail,
	optionalText,
	requireInteger,
	requireText,
} from './utils';

/** 获取代支付流水：https://developer.work.weixin.qq.com/document/path/99602 */
export async function getBillList(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const suiteAccessToken = requireText(
		this,
		this.getNodeParameter('suiteAccessToken', index),
		'Suite Access Token',
		index,
	);
	const beginTime = dateTimeToUnixTimestamp(this.getNodeParameter('beginTime', index));
	const endTime = dateTimeToUnixTimestamp(this.getNodeParameter('endTime', index));
	if (!beginTime) fail(this, '流水记录开始时间无效', index);
	if (!endTime) fail(this, '流水记录结束时间无效', index);
	if (beginTime > endTime) fail(this, '流水记录开始时间不能晚于结束时间', index);
	if (endTime - beginTime > 31 * 86400) {
		fail(this, '流水记录起止间隔不能超过 31 天', index);
	}
	const authCorpid = requireText(
		this,
		this.getNodeParameter('authCorpid', index),
		'授权企业 CorpID',
		index,
	);
	const limit = requireInteger(
		this,
		this.getNodeParameter('limit', index, 100),
		'返回数量',
		index,
		1,
		1000,
	);
	const body: IDataObject = {
		begin_time: beginTime,
		end_time: endTime,
		auth_corpid: authCorpid,
		limit,
	};
	const cursor = optionalText(this, this.getNodeParameter('cursor', index, ''), '分页游标', index);
	if (cursor) body.cursor = cursor;
	const request: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/customer_acquisition/get_bill_list`,
		qs: { suite_access_token: suiteAccessToken },
		body,
		json: true,
	};
	try {
		const response = (await this.helpers.httpRequest(request)) as IDataObject;
		if (response.errcode !== undefined && Number(response.errcode) !== 0) {
			fail(
				this,
				`获取代支付流水失败: ${response.errmsg} (错误码: ${response.errcode})`,
				index,
			);
		}
		return response;
	} catch (error) {
		if (error instanceof NodeOperationError) throw error;
		fail(this, `获取代支付流水失败: ${(error as Error).message}`, index);
	}
}
