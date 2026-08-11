import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { executeExtraHttpOp } from '../../shared/extraHttpOp';
import { approvalExtraHttpOpsById } from './extraHttpOps';

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
				const enableFilters = this.getNodeParameter('enableFilters', i, false) as boolean;

				const body: { starttime: number; endtime: number; cursor: number; size: number; filters?: Array<{ key: string; value: string }> } = {
					starttime,
					endtime,
					cursor,
					size,
				};

				if (enableFilters) {
					const filtersCollection = this.getNodeParameter('filtersCollection', i, {}) as { filters?: Array<{ key: string; value: string }> };
					if (filtersCollection.filters && filtersCollection.filters.length > 0) {
						body.filters = filtersCollection.filters.map((f) => ({ key: f.key, value: f.value }));
					}
				}

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/getapprovalinfo', body);
			} else if (operation === 'getApprovalDetail') {
				// 获取审批申请详情
				// https://developer.work.weixin.qq.com/document/path/91983
				const sp_no = this.getNodeParameter('sp_no', i) as string;
				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/getapprovaldetail', {
					sp_no,
				});
			} else if (operation === 'getOpenApprovalData') {
				// 旧版获取审批数据
				// https://developer.work.weixin.qq.com/document/path/90269
				const thirdNo = this.getNodeParameter('thirdNo', i) as string;
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/corp/getopenapprovaldata',
					{ thirdNo },
				);
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
			} else if (approvalExtraHttpOpsById[operation]) {
				const bodyDefaults: IDataObject = {};
				const appr_starttime = this.getNodeParameter('appr_starttime', i, 0) as number;
				const appr_endtime = this.getNodeParameter('appr_endtime', i, 0) as number;
				const next_spnum = this.getNodeParameter('next_spnum', i, '') as string;
				if (appr_starttime) bodyDefaults.starttime = appr_starttime;
				if (appr_endtime) bodyDefaults.endtime = appr_endtime;
				if (next_spnum) bodyDefaults.next_spnum = next_spnum;
				if (operation === 'advancedFeatureGetApplyIdList') {
					const af_business_type = this.getNodeParameter('af_business_type', i, 1) as number;
					const af_userid = this.getNodeParameter('af_userid', i, '') as string;
					const af_limit = this.getNodeParameter('af_limit', i, 100) as number;
					const af_cursor = this.getNodeParameter('af_cursor', i, '') as string;
					const af_req_type = this.getNodeParameter('af_req_type', i, 0) as number;
					bodyDefaults.business_type = af_business_type;
					if (af_userid) bodyDefaults.userid = af_userid;
					if (af_limit) bodyDefaults.limit = af_limit;
					if (af_cursor) bodyDefaults.cursor = af_cursor;
					bodyDefaults.req_type = af_req_type;
				}
				if (operation === 'advancedFeatureSetApprovalDetail') {
					const af_apply_id = this.getNodeParameter('af_apply_id', i, '') as string;
					const af_approval_id = this.getNodeParameter('af_approval_id', i, '') as string;
					const af_approval_status = this.getNodeParameter('af_approval_status', i, 1) as number;
					const af_approval_url = this.getNodeParameter('af_approval_url', i, '') as string;
					const af_process_node_list_json = this.getNodeParameter(
						'af_process_node_list_json',
						i,
						'[]',
					) as string;
					if (af_apply_id) bodyDefaults.apply_id = af_apply_id;
					if (af_approval_id) bodyDefaults.approval_id = af_approval_id;
					bodyDefaults.approval_status = af_approval_status;
					if (af_approval_url) bodyDefaults.approval_url = af_approval_url;
					try {
						const node_list = JSON.parse(af_process_node_list_json || '[]');
						if (Array.isArray(node_list) && node_list.length) {
							bodyDefaults.process_list = { node_list };
						}
					} catch {
						/* ignore */
					}
				}
				responseData = await executeExtraHttpOp.call(
					this,
					approvalExtraHttpOpsById[operation],
					i,
					bodyDefaults,
				);
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

