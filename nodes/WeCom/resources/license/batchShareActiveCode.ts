import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	assertListSize,
	assertUnique,
	licenseApiRequest,
	readBatchInput,
	requireOption,
	requireText,
} from './utils';

/**
 * 分配激活码给下游/下级企业
 * 官方文档：https://developer.work.weixin.qq.com/document/path/96059
 */
export async function batchShareActiveCode(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const fromCorpid = requireText(
		this,
		this.getNodeParameter('fromCorpid', index),
		'上游/上级企业 ID',
		index,
	);
	const toCorpid = requireText(
		this,
		this.getNodeParameter('toCorpid', index),
		'下游/下级企业 ID',
		index,
	);
	const rows = readBatchInput(this, index, {
		modeName: 'shareListInputMode',
		jsonName: 'shareListJson',
		collectionName: 'shareListCollection',
		collectionGroup: 'codes',
		label: '分配的接口许可列表',
	});
	assertListSize(this, rows, '分配的接口许可列表', index, 1000);
	const shareList = rows.map((row, rowIndex) => ({
		active_code: requireText(
			this,
			row.activeCode ?? row.active_code,
			`分配列表第 ${rowIndex + 1} 项的激活码`,
			index,
		),
	}));
	assertUnique(
		this,
		shareList.map((item) => item.active_code),
		'分配列表中的激活码',
		index,
	);
	const corpLinkType = requireOption(
		this,
		this.getNodeParameter('corpLinkType', index, 0),
		'分配场景',
		index,
		[0, 1],
	);

	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/batch_share_active_code',
		providerAccessToken,
		label: '分配激活码给下游/下级企业',
		body: {
			from_corpid: fromCorpid,
			to_corpid: toCorpid,
			share_list: shareList,
			corp_link_type: corpLinkType,
		},
	});
}
