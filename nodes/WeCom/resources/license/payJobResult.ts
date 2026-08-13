import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireText } from './utils';

/** 获取订单支付结果：https://developer.work.weixin.qq.com/document/path/99415 */
export async function payJobResult(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const jobid = requireText(this, this.getNodeParameter('jobid', index), '支付任务 ID', index);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/pay_job_result',
		providerAccessToken,
		label: '获取订单支付结果',
		body: { jobid },
	});
}
