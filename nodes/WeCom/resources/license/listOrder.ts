import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	dateTimeToUnixTimestamp,
	fail,
	licenseApiRequest,
	optionalText,
	requireInteger,
} from './utils';

/**
 * 获取订单列表
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95647
 */
export async function listOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const startRaw = this.getNodeParameter('startTime', index, '');
	const endRaw = this.getNodeParameter('endTime', index, '');
	const hasStart = startRaw !== undefined && startRaw !== null && startRaw !== '';
	const hasEnd = endRaw !== undefined && endRaw !== null && endRaw !== '';
	if (hasStart !== hasEnd) fail(this, '开始时间和结束时间必须同时指定', index);
	const startTime = dateTimeToUnixTimestamp(startRaw);
	const endTime = dateTimeToUnixTimestamp(endRaw);
	if (hasStart && !startTime) fail(this, '开始时间无效', index);
	if (hasEnd && !endTime) fail(this, '结束时间无效', index);
	if (startTime !== undefined && endTime !== undefined) {
		if (endTime <= startTime) fail(this, '结束时间必须晚于开始时间', index);
		if (endTime - startTime > 31 * 86400) {
			fail(this, '开始时间与结束时间不能相差超过 31 天', index);
		}
	}

	const limit = requireInteger(
		this,
		this.getNodeParameter('limit', index, 500),
		'返回最大记录数',
		index,
		1,
		1000,
	);
	const body: IDataObject = { limit };
	const corpid = optionalText(this.getNodeParameter('corpid', index, ''));
	const cursor = optionalText(this.getNodeParameter('cursor', index, ''));
	if (corpid) body.corpid = corpid;
	if (startTime !== undefined && endTime !== undefined) {
		body.start_time = startTime;
		body.end_time = endTime;
	}
	if (cursor) body.cursor = cursor;

	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/list_order',
		providerAccessToken,
		label: '获取订单列表',
		body,
	});
}
