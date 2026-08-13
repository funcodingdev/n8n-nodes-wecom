import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	assertListSize,
	assertUnique,
	fail,
	licenseApiRequest,
	optionalText,
	readBatchInput,
	requireInteger,
	requireOption,
	requireText,
} from './utils';

/**
 * 创建多企业新购任务
 * 官方文档：https://developer.work.weixin.qq.com/document/path/98892
 */
export async function createNewOrderJob(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const rows = readBatchInput(this, index, {
		modeName: 'buyListInputMode',
		jsonName: 'buyListJson',
		collectionName: 'buyListCollection',
		collectionGroup: 'buyInfos',
		label: '企业新购信息列表',
	});
	assertListSize(this, rows, '企业新购信息列表', index, 10);

	const buyList = rows.map((row, rowIndex) => {
		const prefix = `企业新购信息第 ${rowIndex + 1} 项`;
		const corpid = requireText(this, row.corpid, `${prefix}的企业 ID`, index);
		const baseCount = requireInteger(
			this,
			row.baseCount ?? row.base_count ?? 0,
			`${prefix}的基础账号个数`,
			index,
			0,
			1_000_000,
		);
		const externalContactCount = requireInteger(
			this,
			row.externalContactCount ?? row.external_contact_count ?? 0,
			`${prefix}的互通账号个数`,
			index,
			0,
			1_000_000,
		);
		if (baseCount === 0 && externalContactCount === 0) {
			fail(this, `${prefix}的基础账号和互通账号不能同时为 0`, index);
		}
		const months = requireInteger(
			this,
			row.months ?? 0,
			`${prefix}的购买月数`,
			index,
			0,
			60,
		);
		const days = requireInteger(
			this,
			row.days ?? 0,
			`${prefix}的购买天数`,
			index,
			0,
			1860,
		);
		const totalDays = months * 31 + days;
		if (totalDays < 31 || totalDays > 1860) {
			fail(this, `${prefix}的总购买时长必须为 31–1860 天`, index);
		}
		const accountCount: IDataObject = {};
		if (baseCount > 0) accountCount.base_count = baseCount;
		if (externalContactCount > 0) accountCount.external_contact_count = externalContactCount;
		const accountDuration: IDataObject = {};
		if (months > 0) accountDuration.months = months;
		if (days > 0) accountDuration.days = days;
		const result: IDataObject = {
			corpid,
			account_count: accountCount,
			account_duration: accountDuration,
		};
		const autoActiveStatus = row.autoActiveStatus ?? row.auto_active_status;
		if (autoActiveStatus !== undefined && autoActiveStatus !== '') {
			result.auto_active_status = requireOption(
				this,
				autoActiveStatus,
				`${prefix}的自动激活状态`,
				index,
				[0, 1],
			);
		}
		return result;
	});
	assertUnique(
		this,
		buyList.map((buyInfo) => String(buyInfo.corpid)),
		'企业新购信息列表中的企业 ID',
		index,
	);
	const body: IDataObject = { buy_list: buyList };
	const jobid = optionalText(this.getNodeParameter('jobid', index, ''));
	if (jobid) body.jobid = jobid;

	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/create_new_order_job',
		providerAccessToken,
		label: '创建多企业新购任务',
		body,
	});
}
