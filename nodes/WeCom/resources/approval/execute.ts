import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeApproval(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData;

			if (operation === 'getTemplateDetail') {
				// 获取审批模板详情
				// https://developer.work.weixin.qq.com/document/path/91982
				const template_id = this.getNodeParameter('template_id', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/gettemplatedetail', {
					template_id,
				});
			} else if (operation === 'submitApproval') {
				// 提交审批申请
				// https://developer.work.weixin.qq.com/document/path/91853
				const approvalData = this.getNodeParameter('approvalData', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/applyevent',
					JSON.parse(approvalData),
				);
			} else if (operation === 'getApprovalSpNoList') {
				// 批量获取审批单号
				// https://developer.work.weixin.qq.com/document/path/91816
				const starttime = this.getNodeParameter('starttime', i) as number;
				const endtime = this.getNodeParameter('endtime', i) as number;
				const cursor = this.getNodeParameter('cursor', i, 0) as number;
				const size = this.getNodeParameter('size', i, 100) as number;
				const filters = this.getNodeParameter('filters', i, '[]') as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/getapprovalinfo', {
					starttime,
					endtime,
					cursor,
					size,
					filters: JSON.parse(filters),
				});
			} else if (operation === 'getApprovalDetail') {
				// 获取审批申请详情
				// https://developer.work.weixin.qq.com/document/path/91983
				const sp_no = this.getNodeParameter('sp_no', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/getapprovaldetail', {
					sp_no,
				});
			} else if (operation === 'getVacationConfig') {
				// 获取企业假期管理配置
				// https://developer.work.weixin.qq.com/document/path/93375
				responseData = await weComApiRequest.call(this, 'GET', '/cgi-bin/oa/vacation/getcorpconf', {});
			} else if (operation === 'getVacationQuota') {
				// 获取成员假期余额
				// https://developer.work.weixin.qq.com/document/path/93376
				const userid = this.getNodeParameter('userid', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/vacation/getuservacationquota', {
					userid,
				});
			} else if (operation === 'setVacationQuota') {
				// 修改成员假期余额
				// https://developer.work.weixin.qq.com/document/path/93377
				const userid = this.getNodeParameter('userid', i) as string;
				const vacation_id = this.getNodeParameter('vacation_id', i) as string;
				const leftduration = this.getNodeParameter('leftduration', i) as number;
				const remarks = this.getNodeParameter('remarks', i, '') as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/vacation/setoneuserquota', {
					userid,
					vacation_id,
					leftduration,
					...(remarks && { remarks }),
				});
			} else if (operation === 'createApprovalTemplate') {
				// 创建审批模板
				// https://developer.work.weixin.qq.com/document/path/97437
				const templateData = this.getNodeParameter('templateData', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/approval/create_template',
					JSON.parse(templateData),
				);
			} else if (operation === 'updateApprovalTemplate') {
				// 更新审批模板
				// https://developer.work.weixin.qq.com/document/path/97438
				const template_id = this.getNodeParameter('template_id', i) as string;
				const templateData = this.getNodeParameter('templateData', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/approval/update_template', {
					template_id,
					...JSON.parse(templateData),
				});
			}

			returnData.push({
				json: responseData || {},
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}

