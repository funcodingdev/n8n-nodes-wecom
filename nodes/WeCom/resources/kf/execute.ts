import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeKf(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 客服账号管理
			if (operation === 'addKfAccount') {
				const name = this.getNodeParameter('name', i) as string;
				const media_id = this.getNodeParameter('media_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/add', {
					name,
					media_id,
				});
			} else if (operation === 'delKfAccount') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/del', {
					open_kfid,
				});
			} else if (operation === 'updateKfAccount') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const name = this.getNodeParameter('name', i, '') as string;
				const media_id = this.getNodeParameter('media_id', i, '') as string;

				const body: IDataObject = { open_kfid };
				if (name) body.name = name;
				if (media_id) body.media_id = media_id;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/update', body);
			} else if (operation === 'listKfAccount') {
				const limit = this.getNodeParameter('limit', i, 50) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/list', body);
			} else if (operation === 'getKfAccountLink') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const scene = this.getNodeParameter('scene', i, '') as string;

				const body: IDataObject = { open_kfid };
				if (scene) body.scene = scene;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/add_contact_way', body);
			}
			// 接待人员管理
			else if (operation === 'addServicer') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const userid_list = this.getNodeParameter('userid_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/servicer/add', {
					open_kfid,
					userid_list: userid_list.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'delServicer') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const userid_list = this.getNodeParameter('userid_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/servicer/del', {
					open_kfid,
					userid_list: userid_list.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'listServicer') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/servicer/list', {
					open_kfid,
				});
			}
			// 会话分配与消息收发
			else if (operation === 'transServiceState') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;
				const service_state = this.getNodeParameter('service_state', i) as number;
				const servicer_userid = this.getNodeParameter('servicer_userid', i, '') as string;

				const body: IDataObject = {
					open_kfid,
					external_userid,
					service_state,
				};

				if (servicer_userid) body.servicer_userid = servicer_userid;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/service_state/trans', body);
			} else if (operation === 'sendKfMsg') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const touser = this.getNodeParameter('touser', i) as string;
				const msgtype = this.getNodeParameter('msgtype', i) as string;
				const content = this.getNodeParameter('content', i) as string;

				let parsedContent;
				try {
					parsedContent = JSON.parse(content);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `content 必须是有效的 JSON: ${error.message}`, { itemIndex: i });
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/send_msg', {
					touser,
					open_kfid,
					msgtype,
					[msgtype]: parsedContent,
				});
			} else if (operation === 'sendKfEventMsg') {
				const code = this.getNodeParameter('code', i) as string;
				const msgtype = this.getNodeParameter('msgtype', i) as string;
				const content = this.getNodeParameter('content', i) as string;

				let parsedContent;
				try {
					parsedContent = JSON.parse(content);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `content 必须是有效的 JSON: ${error.message}`, { itemIndex: i });
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/send_msg_on_event', {
					code,
					msgtype,
					[msgtype]: parsedContent,
				});
			} else if (operation === 'setUpgradeService') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const upgrade_config = this.getNodeParameter('upgrade_config', i) as string;

				let parsedConfig;
				try {
					parsedConfig = JSON.parse(upgrade_config);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `upgrade_config 必须是有效的 JSON: ${error.message}`, { itemIndex: i });
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/customer/upgrade_service_config', {
					open_kfid,
					upgrade_config: parsedConfig,
				});
			} else if (operation === 'getCustomerInfo') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/customer/get_upgrade_service_config', {
					open_kfid,
					external_userid,
				});
			}
			// 统计管理
			else if (operation === 'getCorpStatistic') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/get_corp_statistic', {
					open_kfid,
					start_time,
					end_time,
				});
			} else if (operation === 'getServicerStatistic') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const servicer_userid = this.getNodeParameter('servicer_userid', i) as string;
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/get_servicer_statistic', {
					open_kfid,
					servicer_userid,
					start_time,
					end_time,
				});
			}
			// 机器人管理
			else if (operation === 'manageKnowledgeGroup') {
				const action_type = this.getNodeParameter('action_type', i) as string;
				const params = this.getNodeParameter('params', i, '{}') as string;

				let parsedParams;
				try {
					parsedParams = JSON.parse(params);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `params 必须是有效的 JSON: ${error.message}`, { itemIndex: i });
				}

				// 根据操作类型调用不同的API
				let endpoint = '';
				if (action_type === 'add') {
					endpoint = '/cgi-bin/kf/knowledge/add_group';
				} else if (action_type === 'del') {
					endpoint = '/cgi-bin/kf/knowledge/del_group';
				} else if (action_type === 'mod') {
					endpoint = '/cgi-bin/kf/knowledge/mod_group';
				} else if (action_type === 'list') {
					endpoint = '/cgi-bin/kf/knowledge/list_group';
				}

				response = await weComApiRequest.call(this, 'POST', endpoint, parsedParams);
			} else if (operation === 'manageKnowledgeIntent') {
				const action_type = this.getNodeParameter('action_type', i) as string;
				const params = this.getNodeParameter('params', i, '{}') as string;

				let parsedParams;
				try {
					parsedParams = JSON.parse(params);
				} catch (error) {
					throw new NodeOperationError(this.getNode(), `params 必须是有效的 JSON: ${error.message}`, { itemIndex: i });
				}

				// 根据操作类型调用不同的API
				let endpoint = '';
				if (action_type === 'add') {
					endpoint = '/cgi-bin/kf/knowledge/add_intent';
				} else if (action_type === 'del') {
					endpoint = '/cgi-bin/kf/knowledge/del_intent';
				} else if (action_type === 'mod') {
					endpoint = '/cgi-bin/kf/knowledge/mod_intent';
				} else if (action_type === 'list') {
					endpoint = '/cgi-bin/kf/knowledge/list_intent';
				}

				response = await weComApiRequest.call(this, 'POST', endpoint, parsedParams);
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

