import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeLinkedcorp(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const credentials = await this.getCredentials('weComApi');
			const defaultAgentId = credentials.agentId as string;

			let response: IDataObject;

			if (operation === 'getAppShareInfo') {
				const agentid = this.getNodeParameter('agentid', i, defaultAgentId) as string;
				const corpid = this.getNodeParameter('corpid', i, '') as string;

				const body: IDataObject = { agentid };
				if (corpid) body.corpid = corpid;

				// https://developer.work.weixin.qq.com/document/path/93403
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/corpgroup/corp/list_app_share_info',
					body,
				);
			} else if (operation === 'getLinkedCorpToken') {
				const business_type = this.getNodeParameter('business_type', i) as string;
				const corpid = this.getNodeParameter('corpid', i) as string;
				const agentid = this.getNodeParameter('agentid', i, defaultAgentId) as string;

				const body: IDataObject = {
					business_type,
					corpid,
					agentid,
				};

				// https://developer.work.weixin.qq.com/document/path/93359
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/corp/gettoken', body);
			} else if (operation === 'getMiniProgramSession') {
				const code = this.getNodeParameter('code', i) as string;
				const business_type = this.getNodeParameter('business_type', i) as string;
				const corpid = this.getNodeParameter('corpid', i) as string;
				const agentid = this.getNodeParameter('agentid', i, defaultAgentId) as string;

				const body: IDataObject = {
					code,
					business_type,
					corpid,
					agentid,
				};

				// https://developer.work.weixin.qq.com/document/path/93355
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/miniprogram/transfer_session',
					body,
				);
			} else if (operation === 'getLinkedCustomer') {
				const customer_type = this.getNodeParameter('customer_type', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i, '') as string;
				const unionid = this.getNodeParameter('unionid', i, '') as string;
				const corpid = this.getNodeParameter('corpid', i, '') as string;

				// 已添加客户：external_userid -> pending_id；否则 unionid -> external_userid
				if (customer_type === 'added') {
					const body: IDataObject = {
						external_userid: external_userid
							? external_userid.split(',').map((id) => id.trim())
							: [],
					};
					if (corpid) body.corpid = corpid;
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/corpgroup/batch/external_userid_to_pending_id',
						body,
					);
				} else {
					const body: IDataObject = {
						unionid: unionid || external_userid,
					};
					if (corpid) body.corpid = corpid;
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/corpgroup/unionid_to_external_userid',
						body,
					);
				}
			} else if (operation === 'getChainInfo') {
				const chain_id = this.getNodeParameter('chain_id', i, '') as string;

				if (chain_id) {
					// 获取指定上下游详情
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/corpgroup/corp/get_chain_corpinfo_list',
						{ chain_id },
					);
				} else {
					// 获取上下游列表
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/corpgroup/corp/get_chain_list',
						{},
					);
				}
			} else if (operation === 'batchImportChainContact') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const media_ID = this.getNodeParameter('media_ID', i) as string;

				const body: IDataObject = {
					chain_id,
					media_id: media_ID,
				};

				// https://developer.work.weixin.qq.com/document/path/95821
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/corpgroup/import_chain_contact',
					body,
				);
			} else if (operation === 'getChainAsyncResult') {
				const jobid = this.getNodeParameter('jobid', i) as string;

				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/corpgroup/getresult',
					{},
					{ jobid },
				);
			} else if (operation === 'removeChainCorp') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const corpid = this.getNodeParameter('corpid', i) as string;

				const body: IDataObject = {
					chain_id,
					corpid,
				};

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/corpgroup/corp/remove_corp',
					body,
				);
			} else if (operation === 'getCustomUserId') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const userid_list = this.getNodeParameter('userid_list', i) as string;

				const body: IDataObject = {
					chain_id,
					userid_list: userid_list.split(',').map((id) => id.trim()),
				};

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/corpgroup/corp/get_chain_user_custom_id',
					body,
				);
			} else if (operation === 'getSubCorpChainList') {
				const corpid = this.getNodeParameter('corpid', i) as string;

				const body: IDataObject = { corpid };

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/corpgroup/get_corp_shared_chain_list',
					body,
				);
			} else if (operation === 'getChainRuleList') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;

				const body: IDataObject = { chain_id };

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/corpgroup/rule/list_ids',
					body,
				);
			} else if (operation === 'deleteChainRule') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const rule_id = this.getNodeParameter('rule_id', i) as string;

				const body: IDataObject = {
					chain_id,
					rule_id,
				};

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/corpgroup/rule/delete_rule',
					body,
				);
			} else if (operation === 'getChainRuleDetail') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const rule_id = this.getNodeParameter('rule_id', i) as string;

				const body: IDataObject = {
					chain_id,
					rule_id,
				};

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/corpgroup/rule/get_rule_info',
					body,
				);
			} else if (operation === 'addChainRule') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const rule_name = this.getNodeParameter('rule_name', i) as string;
				const match_type = this.getNodeParameter('match_type', i) as number;
				const rangeCollection = this.getNodeParameter('rangeCollection', i, {}) as IDataObject;

				// 构建range数组
				const range: IDataObject[] = [];
				if (rangeCollection.ranges) {
					const rangesList = rangeCollection.ranges as IDataObject[];
					rangesList.forEach((r) => {
						const rangeItem: IDataObject = { type: r.type };
						if (r.type === 1 && r.userid) {
							rangeItem.userid = r.userid;
						} else if (r.type === 2 && r.partyid) {
							rangeItem.partyid = r.partyid;
						}
						range.push(rangeItem);
					});
				}

				const body: IDataObject = {
					chain_id,
					rule_name,
					rule_config: {
						match_type,
						range,
					},
				};

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/rule/add_rule', body);
			} else if (operation === 'updateChainRule') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const rule_id = this.getNodeParameter('rule_id', i) as string;
				const rule_name = this.getNodeParameter('rule_name', i, '') as string;
				const updateConfig = this.getNodeParameter('updateConfig', i, false) as boolean;

				const body: IDataObject = {
					chain_id,
					rule_id,
				};

				if (rule_name) body.rule_name = rule_name;

				if (updateConfig) {
					const match_type = this.getNodeParameter('match_type', i) as number;
					const rangeCollection = this.getNodeParameter('rangeCollection', i, {}) as IDataObject;

					// 构建range数组
					const range: IDataObject[] = [];
					if (rangeCollection.ranges) {
						const rangesList = rangeCollection.ranges as IDataObject[];
						rangesList.forEach((r) => {
							const rangeItem: IDataObject = { type: r.type };
							if (r.type === 1 && r.userid) {
								rangeItem.userid = r.userid;
							} else if (r.type === 2 && r.partyid) {
								rangeItem.partyid = r.partyid;
							}
							range.push(rangeItem);
						});
					}

					body.rule_config = {
						match_type,
						range,
					};
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corpgroup/rule/modify_rule', body);
			} else {
				response = {};
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
