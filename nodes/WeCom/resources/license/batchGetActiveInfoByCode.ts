import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import {
	assertListSize,
	fail,
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
	const raw = String(this.getNodeParameter('activeCodeList', index, '') ?? '');
	const fromText = raw
		.split(/[,|\n]/)
		.map((code) => code.trim())
		.filter(Boolean);

	const fromJsonRaw = this.getNodeParameter('activeCodeListJson', index, '[]');
	let fromJson: string[] = [];
	if (fromJsonRaw !== undefined && fromJsonRaw !== null && String(fromJsonRaw).trim() !== '') {
		let parsed: unknown = fromJsonRaw;
		if (typeof fromJsonRaw === 'string') {
			try {
				parsed = JSON.parse(fromJsonRaw);
			} catch {
				fail(this, '激活码列表 JSON 不是有效的 JSON', index);
			}
		}
		if (!Array.isArray(parsed)) fail(this, '激活码列表 JSON 必须是数组', index);
		fromJson = parsed
			.map((entry) => {
				if (typeof entry === 'string' || typeof entry === 'number') return String(entry).trim();
				if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
					const row = entry as IDataObject;
					return String(row.active_code ?? row.activeCode ?? row.code ?? row.id ?? '').trim();
				}
				return '';
			})
			.filter(Boolean);
	}

	const activeCodeList = [...new Set([...fromText, ...fromJson])];
	if (!activeCodeList.length) fail(this, '激活码列表不能为空', index);
	assertListSize(this, activeCodeList.map((code) => ({ code })), '激活码列表', index, 1000);

	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/batch_get_active_info_by_code',
		providerAccessToken,
		label: '批量获取激活码详情',
		body: { corpid, active_code_list: activeCodeList },
	});
}
