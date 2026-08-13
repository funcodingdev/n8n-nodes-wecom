import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireText } from './utils';

/** 提交多企业新购订单：https://developer.work.weixin.qq.com/document/path/98892 */
export async function submitNewOrderJob(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const jobid = requireText(this, this.getNodeParameter('jobid', index), '任务 ID', index);
	const buyerUserid = requireText(
		this,
		this.getNodeParameter('buyerUserid', index, '') ||
			this.getNodeParameter('buyerUserid_selected', index, ''),
		'下单人 UserID',
		index,
	);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/submit_new_order_job',
		providerAccessToken,
		label: '提交多企业新购订单',
		body: { jobid, buyer_userid: buyerUserid },
	});
}
