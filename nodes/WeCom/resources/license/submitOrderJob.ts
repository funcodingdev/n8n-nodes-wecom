import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	dateTimeToUnixTimestamp,
	fail,
	licenseApiRequest,
	requireInteger,
	requireText,
} from './utils';

/**
 * 提交续期订单
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95646
 */
export async function submitOrderJob(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const jobid = requireText(this, this.getNodeParameter('jobid', index), '任务 ID', index);
	const buyerUserid = requireText(
		this,
		this.getNodeParameter('buyerUserid', index),
		'下单人 UserID',
		index,
	);
	const durationType = String(this.getNodeParameter('durationType', index, 'months'));
	const accountDuration: IDataObject = {};
	if (durationType === 'months') {
		accountDuration.months = requireInteger(
			this,
			this.getNodeParameter('months', index, 1),
			'购买月数',
			index,
			1,
			60,
		);
	} else if (durationType === 'newExpireTime') {
		const newExpireTime = dateTimeToUnixTimestamp(
			this.getNodeParameter('newExpireTime', index, ''),
		);
		if (!newExpireTime) fail(this, '新到期时间无效', index);
		const now = new Date();
		const tomorrow = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() + 1,
		).getTime() / 1000;
		if (newExpireTime < tomorrow) {
			fail(this, '新到期时间不能是今天或过去的时间', index);
		}
		if (newExpireTime > Math.floor(now.getTime() / 1000) + 1860 * 86400) {
			fail(this, '新到期时间不能超过 1860 天后', index);
		}
		accountDuration.new_expire_time = newExpireTime;
	} else {
		fail(this, '时长类型仅支持购买月数或新到期时间', index);
	}

	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/submit_order_job',
		providerAccessToken,
		label: '提交续期订单',
		body: { jobid, buyer_userid: buyerUserid, account_duration: accountDuration },
	});
}
