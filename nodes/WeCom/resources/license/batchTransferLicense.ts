import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	assertListSize,
	assertUnique,
	fail,
	licenseApiRequest,
	readBatchInput,
	requireText,
} from './utils';

/**
 * 账号继承
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95673
 */
export async function batchTransferLicense(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const rows = readBatchInput(this, index, {
		modeName: 'transferListInputMode',
		jsonName: 'transferListJson',
		collectionName: 'transferListCollection',
		collectionGroup: 'transfers',
		label: '继承信息列表',
	});
	assertListSize(this, rows, '继承信息列表', index, 1000);
	const transferList = rows.map((row, rowIndex) => {
		const handoverUserid = requireText(
			this,
			row.handoverUserid ||
				row.handoverUserid_selected ||
				row.handover_userid ||
				row.handover_userid_selected,
			`继承信息第 ${rowIndex + 1} 项的转移成员 UserID`,
			index,
		);
		const takeoverUserid = requireText(
			this,
			row.takeoverUserid ||
				row.takeoverUserid_selected ||
				row.takeover_userid ||
				row.takeover_userid_selected,
			`继承信息第 ${rowIndex + 1} 项的接收成员 UserID`,
			index,
		);
		if (handoverUserid === takeoverUserid) {
			fail(this, `继承信息第 ${rowIndex + 1} 项的转移成员和接收成员不能相同`, index);
		}
		return { handover_userid: handoverUserid, takeover_userid: takeoverUserid };
	});
	assertUnique(
		this,
		transferList.map((transfer) => transfer.handover_userid),
		'继承信息列表中的转移成员',
		index,
	);

	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/batch_transfer_license',
		providerAccessToken,
		label: '账号继承',
		body: { corpid, transfer_list: transferList },
	});
}
