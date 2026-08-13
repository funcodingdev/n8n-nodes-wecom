import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	fail,
	licenseApiRequest,
	requireInteger,
	requireText,
} from './utils';

/**
 * 下单购买账号
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95644
 */
export async function createNewOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const buyerUserid = requireText(
		this,
		this.getNodeParameter('buyerUserid', index),
		'下单人 UserID',
		index,
	);
	const baseCount = requireInteger(
		this,
		this.getNodeParameter('baseCount', index, 0),
		'基础账号个数',
		index,
		0,
		1_000_000,
	);
	const externalContactCount = requireInteger(
		this,
		this.getNodeParameter('externalContactCount', index, 0),
		'互通账号个数',
		index,
		0,
		1_000_000,
	);
	if (baseCount === 0 && externalContactCount === 0) {
		fail(this, '基础账号和互通账号不能同时为 0', index);
	}

	const months = requireInteger(
		this,
		this.getNodeParameter('months', index, 1),
		'购买月数',
		index,
		0,
		60,
	);
	const days = requireInteger(
		this,
		this.getNodeParameter('days', index, 0),
		'购买天数',
		index,
		0,
		1860,
	);
	const totalDays = months * 31 + days;
	if (totalDays < 31 || totalDays > 1860) {
		fail(this, '总购买时长必须为 31–1860 天', index);
	}

	const accountCount: IDataObject = {};
	if (baseCount > 0) accountCount.base_count = baseCount;
	if (externalContactCount > 0) accountCount.external_contact_count = externalContactCount;
	const accountDuration: IDataObject = {};
	if (months > 0) accountDuration.months = months;
	if (days > 0) accountDuration.days = days;

	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/create_new_order',
		providerAccessToken,
		label: '下单购买账号',
		body: {
			corpid,
			buyer_userid: buyerUserid,
			account_count: accountCount,
			account_duration: accountDuration,
		},
	});
}
