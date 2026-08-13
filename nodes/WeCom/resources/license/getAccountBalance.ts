import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest } from './utils';

/** 充值账户余额查询：https://developer.work.weixin.qq.com/document/path/100137 */
export async function getAccountBalance(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/service/get_account_balance',
		providerAccessToken: this.getNodeParameter('providerAccessToken', index),
		label: '充值账户余额查询',
		method: 'GET',
	});
}
