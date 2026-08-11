import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

// 辅助函数：将dateTime转换为Unix时间戳（秒级）
function dateTimeToUnixTimestamp(dateTime: string | number): number {
	if (typeof dateTime === 'number') {
		return dateTime;
	}
	if (!dateTime || dateTime === '') {
		return 0;
	}
	return Math.floor(new Date(dateTime).getTime() / 1000);
}

function buildMsgMenuMessage(
	menuItems: IDataObject[],
	head_content: string,
	tail_content: string,
): IDataObject {
	const list = menuItems.map((item: IDataObject) => {
		const type = String(item.type || '');
		const content = String(item.content || '');

		if (type === 'click') {
			return {
				type,
				click: {
					id: String(item.reply_content || ''),
					content,
				},
			};
		}

		if (type === 'view') {
			return {
				type,
				view: {
					url: String(item.url || ''),
					content,
				},
			};
		}

		if (type === 'miniprogram') {
			return {
				type,
				miniprogram: {
					appid: String(item.appid || ''),
					pagepath: String(item.pagepath || ''),
					content,
				},
			};
		}

		if (type === 'text') {
			const text: IDataObject = {
				content,
			};

			if (item.no_newline !== undefined) {
				text.no_newline = item.no_newline ? 1 : 0;
			}

			return {
				type,
				text,
			};
		}

		return {
			type,
		};
	});

	const messageContent: IDataObject = {
		list,
	};

	if (head_content) {
		messageContent.head_content = head_content;
	}

	if (tail_content) {
		messageContent.tail_content = tail_content;
	}

	return messageContent;
}

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
				const userid_list = this.getNodeParameter('userid_list', i, '') as string;
				const department_id_list = this.getNodeParameter('department_id_list', i, '') as string;

				// 验证至少提供一个列表
				if (!userid_list && !department_id_list) {
					throw new NodeOperationError(
						this.getNode(),
						'接待人员列表和部门列表至少需要填其中一个',
						{ itemIndex: i },
					);
				}

				const body: IDataObject = { open_kfid };

				if (userid_list) {
					body.userid_list = userid_list.split(',').map((id) => id.trim());
				}

				if (department_id_list) {
					body.department_id_list = department_id_list.split(',').map((id) => parseInt(id.trim(), 10));
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/servicer/add', body);
			} else if (operation === 'delServicer') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const userid_list = this.getNodeParameter('userid_list', i, '') as string;
				const department_id_list = this.getNodeParameter('department_id_list', i, '') as string;

				// 验证至少提供一个列表
				if (!userid_list && !department_id_list) {
					throw new NodeOperationError(
						this.getNode(),
						'接待人员列表和部门列表至少需要填其中一个',
						{ itemIndex: i },
					);
				}

				const body: IDataObject = { open_kfid };

				if (userid_list) {
					body.userid_list = userid_list.split(',').map((id) => id.trim());
				}

				if (department_id_list) {
					body.department_id_list = department_id_list.split(',').map((id) => parseInt(id.trim(), 10));
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/servicer/del', body);
			} else if (operation === 'listServicer') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;

				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/kf/servicer/list',
					{},
					{ open_kfid },
				);
			}
			// 会话分配与消息收发
			else if (operation === 'getServiceState') {
				// 获取会话状态
				// https://developer.work.weixin.qq.com/document/path/94669
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/service_state/get', {
					open_kfid,
					external_userid,
				});
			} else if (operation === 'transServiceState') {
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

				// 根据消息类型构建消息内容
				let messageContent: IDataObject = {};

				if (msgtype === 'text') {
					const content = this.getNodeParameter('text_content', i) as string;
					messageContent = { content };
				} else if (msgtype === 'image') {
					const media_id = this.getNodeParameter('image_media_id', i) as string;
					messageContent = { media_id };
				} else if (msgtype === 'voice') {
					const media_id = this.getNodeParameter('voice_media_id', i) as string;
					messageContent = { media_id };
				} else if (msgtype === 'video') {
					const media_id = this.getNodeParameter('video_media_id', i) as string;
					messageContent = { media_id };
				} else if (msgtype === 'file') {
					const media_id = this.getNodeParameter('file_media_id', i) as string;
					messageContent = { media_id };
				} else if (msgtype === 'link') {
					const title = this.getNodeParameter('link_title', i) as string;
					const desc = this.getNodeParameter('link_desc', i, '') as string;
					const url = this.getNodeParameter('link_url', i) as string;
					const thumb_url = this.getNodeParameter('link_thumb_url', i, '') as string;

					messageContent = { title, url };
					if (desc) messageContent.desc = desc;
					if (thumb_url) messageContent.thumb_url = thumb_url;
				} else if (msgtype === 'miniprogram') {
					const title = this.getNodeParameter('miniprogram_title', i) as string;
					const appid = this.getNodeParameter('miniprogram_appid', i) as string;
					const pagepath = this.getNodeParameter('miniprogram_pagepath', i) as string;
					const thumb_media_id = this.getNodeParameter('miniprogram_thumb_media_id', i) as string;

					messageContent = { title, appid, pagepath, thumb_media_id };
				} else if (msgtype === 'msgmenu') {
					const head_content = this.getNodeParameter('msgmenu_head_content', i) as string;
					const tail_content = this.getNodeParameter('msgmenu_tail_content', i, '') as string;
					const menuItems = this.getNodeParameter('msgmenu_list.items', i, []) as IDataObject[];
					messageContent = buildMsgMenuMessage(menuItems, head_content, tail_content);
				} else if (msgtype === 'location') {
					const name = this.getNodeParameter('location_name', i) as string;
					const address = this.getNodeParameter('location_address', i) as string;
					const latitude = this.getNodeParameter('location_latitude', i) as number;
					const longitude = this.getNodeParameter('location_longitude', i) as number;

					messageContent = { name, address, latitude, longitude };
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`不支持的消息类型: ${msgtype}`,
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/send_msg', {
					touser,
					open_kfid,
					msgtype,
					[msgtype]: messageContent,
				});
			} else if (operation === 'sendKfEventMsg') {
				const code = this.getNodeParameter('code', i) as string;
				const msgtype = this.getNodeParameter('msgtype', i) as string;

				// 根据消息类型构建消息内容
				let messageContent: IDataObject = {};

				if (msgtype === 'text') {
					const content = this.getNodeParameter('text_content', i) as string;
					messageContent = { content };
				} else if (msgtype === 'msgmenu') {
					const head_content = this.getNodeParameter('msgmenu_head_content', i) as string;
					const tail_content = this.getNodeParameter('msgmenu_tail_content', i, '') as string;
					const menuItems = this.getNodeParameter('msgmenu_list.items', i, []) as IDataObject[];
					messageContent = buildMsgMenuMessage(menuItems, head_content, tail_content);
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`不支持的消息类型: ${msgtype}`,
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/send_msg_on_event', {
					code,
					msgtype,
					[msgtype]: messageContent,
				});
			} else if (operation === 'setUpgradeService') {
				// 为客户升级为专员或客户群服务
				// https://developer.work.weixin.qq.com/document/path/94674
				// 官方路径：/cgi-bin/kf/customer/upgrade_service
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;
				const upgradeType = this.getNodeParameter('upgradeType', i) as string;

				const body: IDataObject = {
					open_kfid,
					external_userid,
					type: upgradeType === 'groupchat' ? 2 : 1,
				};

				if (upgradeType === 'member') {
					const member_userid = this.getNodeParameter('member_userid', i) as string;
					const member_wording = this.getNodeParameter('member_wording', i, '') as string;
					const member: IDataObject = { userid: member_userid };
					if (member_wording) member.wording = member_wording;
					body.member = member;
				} else {
					const groupchat_chat_id = this.getNodeParameter('groupchat_chat_id', i) as string;
					const groupchat_wording = this.getNodeParameter('groupchat_wording', i, '') as string;
					const groupchat: IDataObject = { chat_id: groupchat_chat_id };
					if (groupchat_wording) groupchat.wording = groupchat_wording;
					body.groupchat = groupchat;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/customer/upgrade_service', body);
			} else if (operation === 'cancelUpgradeService') {
				// 为客户取消升级服务推荐
				// https://developer.work.weixin.qq.com/document/path/94674
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/kf/customer/cancel_upgrade_service',
					{
						open_kfid,
						external_userid,
					},
				);
			} else if (operation === 'getUpgradeServiceConfig') {
				// 获取配置的专员与客户群
				// https://developer.work.weixin.qq.com/document/path/94674
				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/kf/customer/get_upgrade_service_config',
					{},
				);
			} else if (operation === 'syncMsg') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const token = this.getNodeParameter('token', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const voice_format = this.getNodeParameter('voice_format', i, 0) as number;
				const parse_message_types = this.getNodeParameter('parse_message_types', i, true) as boolean;

				const body: IDataObject = {
					open_kfid,
					limit,
					voice_format,
				};

				if (cursor) body.cursor = cursor;
				if (token) body.token = token;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/sync_msg', body);

				// 如果需要解析消息类型，对msg_list进行处理
				if (parse_message_types && response.msg_list && Array.isArray(response.msg_list)) {
					response.msg_list = (response.msg_list as IDataObject[]).map((msg: IDataObject) => {
						const msgtype = msg.msgtype as string;
						
						// 为每个消息添加解析后的字段，便于后续处理
						const parsedMsg: IDataObject = {
							...msg,
							parsed_content: null,
						};

						// 根据消息类型解析内容
						if (msgtype === 'text' && msg.text) {
							parsedMsg.parsed_content = msg.text;
						} else if (msgtype === 'image' && msg.image) {
							parsedMsg.parsed_content = msg.image;
						} else if (msgtype === 'voice' && msg.voice) {
							parsedMsg.parsed_content = msg.voice;
						} else if (msgtype === 'video' && msg.video) {
							parsedMsg.parsed_content = msg.video;
						} else if (msgtype === 'file' && msg.file) {
							parsedMsg.parsed_content = msg.file;
						} else if (msgtype === 'location' && msg.location) {
							parsedMsg.parsed_content = msg.location;
						} else if (msgtype === 'link' && msg.link) {
							parsedMsg.parsed_content = msg.link;
						} else if (msgtype === 'business_card' && msg.business_card) {
							parsedMsg.parsed_content = msg.business_card;
						} else if (msgtype === 'miniprogram' && msg.miniprogram) {
							parsedMsg.parsed_content = msg.miniprogram;
						} else if (msgtype === 'msgmenu' && msg.msgmenu) {
							parsedMsg.parsed_content = msg.msgmenu;
						} else if (msgtype === 'channels_shop_product' && msg.channels_shop_product) {
							parsedMsg.parsed_content = msg.channels_shop_product;
						} else if (msgtype === 'channels_shop_order' && msg.channels_shop_order) {
							parsedMsg.parsed_content = msg.channels_shop_order;
						} else if (msgtype === 'merged_msg' && msg.merged_msg) {
							parsedMsg.parsed_content = msg.merged_msg;
						} else if (msgtype === 'channels' && msg.channels) {
							parsedMsg.parsed_content = msg.channels;
						} else if (msgtype === 'event' && msg.event) {
							parsedMsg.parsed_content = msg.event;
							// 为事件类型添加event_type字段方便筛选
							parsedMsg.event_type = (msg.event as IDataObject).event_type;
						}

						return parsedMsg;
					});
				}
			} else if (operation === 'getCustomerInfo') {
				// 获取客户基础信息
				// https://developer.work.weixin.qq.com/document/path/95159
				// 官方路径：/cgi-bin/kf/customer/batchget
				const external_userid_list_raw = this.getNodeParameter('external_userid_list', i) as string;
				const need_enter_session_context = this.getNodeParameter(
					'need_enter_session_context',
					i,
					false,
				) as boolean;

				const external_userid_list = external_userid_list_raw
					.split(',')
					.map((id) => id.trim())
					.filter(Boolean);

				const body: IDataObject = { external_userid_list };
				if (need_enter_session_context) {
					body.need_enter_session_context = 1;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/customer/batchget', body);
			}
			// 统计管理
			else if (operation === 'getCorpStatistic') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const start_time = dateTimeToUnixTimestamp(this.getNodeParameter('start_time', i) as string | number);
				const end_time = dateTimeToUnixTimestamp(this.getNodeParameter('end_time', i) as string | number);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/get_corp_statistic', {
					open_kfid,
					start_time,
					end_time,
				});
			} else if (operation === 'getServicerStatistic') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const servicer_userid = this.getNodeParameter('servicer_userid', i) as string;
				const start_time = dateTimeToUnixTimestamp(this.getNodeParameter('start_time', i) as string | number);
				const end_time = dateTimeToUnixTimestamp(this.getNodeParameter('end_time', i) as string | number);

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

				let endpoint = '';
				const body: IDataObject = {};

				if (action_type === 'add') {
					endpoint = '/cgi-bin/kf/knowledge/add_group';
					const group_name = this.getNodeParameter('group_name', i) as string;
					body.name = group_name;
				} else if (action_type === 'del') {
					endpoint = '/cgi-bin/kf/knowledge/del_group';
					const group_id = this.getNodeParameter('group_id', i) as string;
					body.group_id = group_id;
				} else if (action_type === 'mod') {
					endpoint = '/cgi-bin/kf/knowledge/mod_group';
					const group_id = this.getNodeParameter('group_id', i) as string;
					const new_group_name = this.getNodeParameter('new_group_name', i) as string;
					body.group_id = group_id;
					body.name = new_group_name;
				} else if (action_type === 'list') {
					endpoint = '/cgi-bin/kf/knowledge/list_group';
					const cursor = this.getNodeParameter('cursor', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 100) as number;
					if (cursor) body.cursor = cursor;
					body.limit = limit;
				}

				response = await weComApiRequest.call(this, 'POST', endpoint, body);
			} else if (operation === 'manageKnowledgeIntent') {
				const action_type = this.getNodeParameter('action_type', i) as string;

				let endpoint = '';
				const body: IDataObject = {};

				if (action_type === 'add') {
					endpoint = '/cgi-bin/kf/knowledge/add_intent';
					const group_id = this.getNodeParameter('group_id', i) as string;
					const question_text = this.getNodeParameter('question_text', i) as string;
					const answer_type = this.getNodeParameter('answer_type', i) as string;
					const answer_text = this.getNodeParameter('answer_text', i) as string;
					const similarQuestionsCollection = this.getNodeParameter('similarQuestionsCollection', i, {}) as IDataObject;

					// 构建问题
					const question: IDataObject = { text: question_text };
					if (similarQuestionsCollection.questions) {
						const similarList = similarQuestionsCollection.questions as IDataObject[];
						if (similarList.length > 0) {
							question.similar_questions = similarList.map((q) => ({ text: q.text }));
						}
					}

					// 构建回答
					const answer: IDataObject[] = [{ msgtype: answer_type, [answer_type]: { content: answer_text } }];

					body.group_id = group_id;
					body.question = question;
					body.answer = answer;
				} else if (action_type === 'del') {
					endpoint = '/cgi-bin/kf/knowledge/del_intent';
					const intent_id = this.getNodeParameter('intent_id', i) as string;
					body.intent_id = intent_id;
				} else if (action_type === 'mod') {
					endpoint = '/cgi-bin/kf/knowledge/mod_intent';
					const intent_id = this.getNodeParameter('intent_id', i) as string;
					const question_text = this.getNodeParameter('question_text', i) as string;
					const answer_type = this.getNodeParameter('answer_type', i) as string;
					const answer_text = this.getNodeParameter('answer_text', i) as string;
					const similarQuestionsCollection = this.getNodeParameter('similarQuestionsCollection', i, {}) as IDataObject;

					// 构建问题
					const question: IDataObject = { text: question_text };
					if (similarQuestionsCollection.questions) {
						const similarList = similarQuestionsCollection.questions as IDataObject[];
						if (similarList.length > 0) {
							question.similar_questions = similarList.map((q) => ({ text: q.text }));
						}
					}

					// 构建回答
					const answer: IDataObject[] = [{ msgtype: answer_type, [answer_type]: { content: answer_text } }];

					body.intent_id = intent_id;
					body.question = question;
					body.answer = answer;
				} else if (action_type === 'list') {
					endpoint = '/cgi-bin/kf/knowledge/list_intent';
					const group_id = this.getNodeParameter('group_id', i) as string;
					const cursor = this.getNodeParameter('cursor', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 100) as number;
					body.group_id = group_id;
					if (cursor) body.cursor = cursor;
					body.limit = limit;
				}

				response = await weComApiRequest.call(this, 'POST', endpoint, body);
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
