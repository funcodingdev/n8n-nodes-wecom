import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { licenseApiRequest, requireText } from './utils';

/** 获取多企业新购订单提交结果：https://developer.work.weixin.qq.com/document/path/98892 */
export async function newOrderJobResult(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index);
	const jobid = requireText(this, this.getNodeParameter('jobid', index), '任务 ID', index);
	return await licenseApiRequest(this, index, {
		path: '/cgi-bin/license/new_order_job_result',
		providerAccessToken,
		label: '获取多企业新购订单提交结果',
		body: { jobid },
	});
}
