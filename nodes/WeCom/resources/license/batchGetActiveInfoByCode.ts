import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	assertListSize,
	licenseApiRequest,
	requireText,
} from './utils';

/**
 * 批量获取激活码详情
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95552
 */
export async function batchGetActiveInfoByCode(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const raw = requireText(
		this,
		this.getNodeParameter('activeCodeList', index),
		'激活码列表',
		index,
	);
	const activeCodeList = [
		...new Set(raw.split(/[,|\n]/).map((code) => code.trim()).filter(Boolean)),
	];
	assertListSize(this, activeCodeList.map((code) => ({ code })), '激活码列表', index, 1000);

	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/batch_get_active_info_by_code',
		providerAccessToken,
		label: '批量获取激活码详情',
		body: { corpid, active_code_list: activeCodeList },
	});
}
