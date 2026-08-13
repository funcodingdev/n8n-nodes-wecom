import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	dateTimeToUnixTimestamp,
	fail,
	optionalText,
	paytoolApiRequest,
	requireInteger,
} from './utils';

/** 获取发票列表：https://developer.work.weixin.qq.com/document/path/99436 */
export async function getInvoiceList(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const startRaw = this.getNodeParameter('startTime', index, '');
	const endRaw = this.getNodeParameter('endTime', index, '');
	const hasStart = startRaw !== undefined && startRaw !== null && startRaw !== '';
	const hasEnd = endRaw !== undefined && endRaw !== null && endRaw !== '';
	if (hasStart !== hasEnd) fail(this, '开始时间和结束时间必须同时指定', index);
	const startTime = dateTimeToUnixTimestamp(startRaw);
	const endTime = dateTimeToUnixTimestamp(endRaw);
	if (hasStart && !startTime) fail(this, '开始时间无效', index);
	if (hasEnd && !endTime) fail(this, '结束时间无效', index);
	if (startTime !== undefined && endTime !== undefined && startTime > endTime) {
		fail(this, '开始时间不能晚于结束时间', index);
	}
	const limit = requireInteger(
		this,
		this.getNodeParameter('limit', index, 50),
		'返回最大记录数',
		index,
		1,
		100,
	);
	const body: IDataObject = { limit };
	if (startTime !== undefined && endTime !== undefined) {
		body.start_time = startTime;
		body.end_time = endTime;
	}
	const cursor = optionalText(this, this.getNodeParameter('cursor', index, ''), '分页游标', index);
	if (cursor) body.cursor = cursor;
	return await paytoolApiRequest(this, index, {
		path: '/cgi-bin/paytool/get_invoice_list',
		providerAccessToken: this.getNodeParameter('providerAccessToken', index),
		label: '获取发票列表',
		body,
	});
}
