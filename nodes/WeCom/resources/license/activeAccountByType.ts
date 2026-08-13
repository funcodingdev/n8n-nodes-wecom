import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireOption, requireText } from './utils';

/** 指定账号类型激活：https://developer.work.weixin.qq.com/document/path/95553 */
export async function activeAccountByType(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const type = requireOption(
		this,
		this.getNodeParameter('type', index),
		'账号类型',
		index,
		[1, 2],
	);
	const corpid = requireText(this, this.getNodeParameter('corpid', index), '企业 ID', index);
	const userid = requireText(
		this,
		this.getNodeParameter('userid', index, '') || this.getNodeParameter('userid_selected', index, ''),
		'企业成员 UserID',
		index,
	);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/active_account_by_type',
		providerAccessToken,
		label: '指定账号类型激活',
		body: { type, corpid, userid },
	});
}
