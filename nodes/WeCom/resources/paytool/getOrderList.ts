import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	dateTimeToUnixTimestamp,
	fail,
	optionalText,
	paytoolApiRequest,
	requireInteger,
	requireOption,
} from './utils';

/** 获取收款订单列表：https://developer.work.weixin.qq.com/document/path/98053 */
export async function getOrderList(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const limit = requireInteger(
		this,
		this.getNodeParameter('limit', index, 100),
		'分页数量',
		index,
		1,
		2000,
	);
	const businessType = requireOption(
		this,
		this.getNodeParameter('businessType', index, 0),
		'业务类型',
		index,
		[0, 1, 2, 3],
	);
	const startRaw = this.getNodeParameter('startTime', index, '');
	const endRaw = this.getNodeParameter('endTime', index, '');
	const startTime = dateTimeToUnixTimestamp(startRaw);
	const endTime = dateTimeToUnixTimestamp(endRaw);
	if (startRaw !== '' && startTime === undefined) fail(this, '起始时间无效', index);
	if (endRaw !== '' && endTime === undefined) fail(this, '结束时间无效', index);
	if (startTime !== undefined && endTime !== undefined && startTime > endTime) {
		fail(this, '起始时间不能晚于结束时间', index);
	}
	const body: IDataObject = { limit };
	if (businessType !== 0) body.business_type = businessType;
	if (startTime !== undefined) body.start_time = startTime;
	if (endTime !== undefined) body.end_time = endTime;
	const cursor = optionalText(this, this.getNodeParameter('cursor', index, ''), '分页游标', index);
	if (cursor) body.cursor = cursor;

	return await paytoolApiRequest(this, index, {
		path: '/cgi-bin/paytool/get_order_list',
		providerAccessToken: this.getNodeParameter('providerAccessToken', index),
		paytoolSecret: this.getNodeParameter('paytoolSecret', index),
		label: '获取收款订单列表',
		body,
	});
}
