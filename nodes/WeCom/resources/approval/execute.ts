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
				const creator_userid = this.getNodeParameter('creator_userid', i) as string;
				const template_id = this.getNodeParameter('template_id', i) as string;
				const use_template_approver = this.getNodeParameter(
					'use_template_approver',
					i,
					1,
				) as number;
				const choose_department = this.getNodeParameter('choose_department', i, 0) as number;
				const apply_data_json = this.getNodeParameter('apply_data_json', i, '{}') as string;
				const applyContentsCollection = this.getNodeParameter(
					'applyContentsCollection',
					i,
					{},
				) as IDataObject;
				const summaryCollection = this.getNodeParameter('summaryLines', i, {}) as IDataObject;
				const processCollection = this.getNodeParameter(
					'processNodeCollection',
					i,
					{},
				) as IDataObject;
				const approvalExtraJson = this.getNodeParameter('approvalExtraJson', i, '{}') as string;

				const body: IDataObject = {
					creator_userid,
					template_id,
					use_template_approver,
				};
				if (choose_department) body.choose_department = choose_department;

				const formContents = ((applyContentsCollection?.contents as IDataObject[]) || [])
					.filter((c) => c.id)
					.map((c) => {
						const control = String(c.control || 'Text');
						const value: IDataObject = {};
						if (control === 'Money' && c.new_money) {
							value.new_money = String(c.new_money);
						} else if (control === 'Number') {
							value.new_number = String(c.text ?? '');
						} else {
							value.text = String(c.text ?? '');
						}
						return { control, id: c.id, value };
					});

				try {
					const apply_data = JSON.parse(apply_data_json || '{}') as IDataObject;
					if (apply_data && typeof apply_data === 'object' && Object.keys(apply_data).length) {
						body.apply_data = apply_data;
					} else if (formContents.length) {
						body.apply_data = { contents: formContents };
					} else {
						throw new Error('请填写申请表单控件值或申请表单数据JSON');
					}
				} catch (e) {
					if ((e as Error).message.includes('请填写')) throw e;
					throw new Error(`申请表单数据JSON 解析失败: ${(e as Error).message}`);
				}

				const lines = ((summaryCollection?.lines as IDataObject[]) || []).filter((l) => l.text);
				if (lines.length) {
					body.summary_list = lines.slice(0, 3).map((l) => ({
						summary_info: [{ text: l.text, lang: l.lang || 'zh_CN' }],
					}));
				} else {
					// 官方要求必填；提供默认一行摘要
					body.summary_list = [
						{ summary_info: [{ text: '审批申请', lang: 'zh_CN' }] },
					];
				}

				if (use_template_approver === 0) {
					const nodes = ((processCollection?.nodes as IDataObject[]) || [])
						.map((n) => {
							const userids = String(n.userid_list || '')
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean);
							const node: IDataObject = {
								type: n.type ?? 1,
								userid: userids,
							};
							if (n.type === 1 || n.type === 3) {
								node.apv_rel = n.apv_rel ?? 1;
							}
							return node;
						})
						.filter((n) => Array.isArray(n.userid) && (n.userid as string[]).length);
					if (nodes.length) body.process = { node_list: nodes };
				}

				try {
					const extra = JSON.parse(approvalExtraJson || '{}') as IDataObject;
					if (extra && typeof extra === 'object') Object.assign(body, extra);
				} catch {
					/* ignore */
				}

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/applyevent', body);
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
				// https://developer.work.weixin.qq.com/document/path/94213
				// 修改成员假期余额
				const userid = this.getNodeParameter('userid', i) as string;
				const vacation_id = Number(this.getNodeParameter('vacation_id', i) as string | number);
				const leftduration = this.getNodeParameter('leftduration', i) as number;
				const time_attr = this.getNodeParameter('time_attr', i, 0) as number;
				const remarks = this.getNodeParameter('remarks', i, '') as string;

				responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/vacation/setoneuserquota', {
					userid,
					vacation_id,
					leftduration,
					time_attr,
					...(remarks && { remarks }),
				});
			} else if (operation === 'createApprovalTemplate') {
				// 创建审批模板
				// https://developer.work.weixin.qq.com/document/path/97437
				const template_name_text = this.getNodeParameter('template_name_text', i) as string;
				const template_name_lang = this.getNodeParameter('template_name_lang', i, 'zh_CN') as string;
				const template_content_json = this.getNodeParameter('template_content_json', i, '{}') as string;
				const templateExtraJson = this.getNodeParameter('templateExtraJson', i, '{}') as string;
				const controlsCollection = this.getNodeParameter(
					'templateControlsCollection',
					i,
					{},
				) as IDataObject;
				const body: IDataObject = {
					template_name: [{ text: template_name_text, lang: template_name_lang }],
				};

				const formControls = ((controlsCollection?.controls as IDataObject[]) || []).map(
					(c, idx) => {
						const control = String(c.control || 'Text');
						const id =
							String(c.id || '').trim() ||
							`${control}-${String(idx + 1).padStart(2, '0')}`;
						const property: IDataObject = {
							control,
							id,
							title: [{ text: c.title || control, lang: template_name_lang }],
							require: c.require === false ? 0 : 1,
							un_print: c.un_print ? 1 : 0,
						};
						if (c.placeholder) {
							property.placeholder = [
								{ text: c.placeholder, lang: template_name_lang },
							];
						}
						const config: IDataObject = {};
						if (control === 'Selector') {
							const opts = String(c.selector_options || '')
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean)
								.map((text, oi) => ({
									key: `option-${oi + 1}`,
									value: { text, lang: template_name_lang },
								}));
							config.selector = {
								type: c.selector_type || 'single',
								options: opts,
							};
						}
						return { property, config };
					},
				);

				try {
					const content = JSON.parse(template_content_json || '{}') as IDataObject;
					if (content && typeof content === 'object' && Object.keys(content).length) {
						body.template_content = content;
					} else if (formControls.length) {
						body.template_content = { controls: formControls };
					} else {
						throw new Error('请填写模板控件表单或模板控件内容JSON');
					}
				} catch (e) {
					if ((e as Error).message.includes('请填写')) throw e;
					throw new Error(`模板控件内容JSON 解析失败: ${(e as Error).message}`);
				}
				try {
					const extra = JSON.parse(templateExtraJson || '{}') as IDataObject;
					if (extra && typeof extra === 'object') Object.assign(body, extra);
				} catch {
					/* ignore */
				}
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/approval/create_template',
					body,
				);
			} else if (operation === 'updateApprovalTemplate') {
				// 更新审批模板
				// https://developer.work.weixin.qq.com/document/path/97438
				const template_id = this.getNodeParameter('template_id', i) as string;
				const template_name_text = this.getNodeParameter('template_name_text', i, '') as string;
				const template_name_lang = this.getNodeParameter('template_name_lang', i, 'zh_CN') as string;
				const template_content_json = this.getNodeParameter('template_content_json', i, '{}') as string;
				const templateExtraJson = this.getNodeParameter('templateExtraJson', i, '{}') as string;
				const controlsCollection = this.getNodeParameter(
					'templateControlsCollection',
					i,
					{},
				) as IDataObject;
				const body: IDataObject = { template_id };
				if (template_name_text) {
					body.template_name = [{ text: template_name_text, lang: template_name_lang }];
				}
				const formControls = ((controlsCollection?.controls as IDataObject[]) || []).map(
					(c, idx) => {
						const control = String(c.control || 'Text');
						const id =
							String(c.id || '').trim() ||
							`${control}-${String(idx + 1).padStart(2, '0')}`;
						const property: IDataObject = {
							control,
							id,
							title: [{ text: c.title || control, lang: template_name_lang }],
							require: c.require === false ? 0 : 1,
							un_print: c.un_print ? 1 : 0,
						};
						if (c.placeholder) {
							property.placeholder = [
								{ text: c.placeholder, lang: template_name_lang },
							];
						}
						const config: IDataObject = {};
						if (control === 'Selector') {
							const opts = String(c.selector_options || '')
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean)
								.map((text, oi) => ({
									key: `option-${oi + 1}`,
									value: { text, lang: template_name_lang },
								}));
							config.selector = {
								type: c.selector_type || 'single',
								options: opts,
							};
						}
						return { property, config };
					},
				);
				try {
					const content = JSON.parse(template_content_json || '{}') as IDataObject;
					if (content && typeof content === 'object' && Object.keys(content).length) {
						body.template_content = content;
					} else if (formControls.length) {
						body.template_content = { controls: formControls };
					}
				} catch (e) {
					throw new Error(`模板控件内容JSON 解析失败: ${(e as Error).message}`);
				}
				try {
					const extra = JSON.parse(templateExtraJson || '{}') as IDataObject;
					if (extra && typeof extra === 'object') Object.assign(body, extra);
				} catch {
					/* ignore */
				}
				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/approval/update_template',
					body,
				);
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
					const afProcessNodesCollection = this.getNodeParameter(
						'afProcessNodesCollection',
						i,
						{},
					) as IDataObject;
					if (af_apply_id) bodyDefaults.apply_id = af_apply_id;
					if (af_approval_id) bodyDefaults.approval_id = af_approval_id;
					bodyDefaults.approval_status = af_approval_status;
					if (af_approval_url) bodyDefaults.approval_url = af_approval_url;
					let node_list: IDataObject[] = ((afProcessNodesCollection?.nodes as IDataObject[]) || [])
						.map((n) => {
							const node: IDataObject = {
								node_apv_status: n.node_apv_status ?? 1,
								node_apv_rel: n.node_apv_rel ?? 1,
							};
							const current = String(n.current_approvers || '')
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean);
							const completed = String(n.completed_approvers || '')
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean);
							if (current.length) node.current_approvers = current;
							if (completed.length) node.completed_approvers = completed;
							if (n.apv_update_time) node.apv_update_time = n.apv_update_time;
							return node;
						})
						.filter((n) => n.current_approvers || n.completed_approvers);
					try {
						const fromJson = JSON.parse(af_process_node_list_json || '[]');
						if (Array.isArray(fromJson) && fromJson.length) {
							node_list = fromJson as IDataObject[];
						}
					} catch {
						/* ignore */
					}
					if (node_list.length) {
						bodyDefaults.process_list = { node_list };
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

