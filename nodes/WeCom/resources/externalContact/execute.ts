import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeExternalContact(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 企业服务人员管理
			if (operation === 'getFollowUserList') {
				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/externalcontact/get_follow_user_list',
					{},
				);
			}
			// 客户管理
			else if (operation === 'getExternalContactList') {
				const userid = this.getNodeParameter('userid', i) as string;
				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/externalcontact/list',
					{},
					{ userid },
				);
			} else if (operation === 'getExternalContact') {
				const external_userid = this.getNodeParameter('external_userid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const qs: IDataObject = { external_userid };
				if (cursor) qs.cursor = cursor;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/externalcontact/get', {}, qs);
			} else if (operation === 'batchGetExternalContact') {
				const userid = this.getNodeParameter('userid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const body: IDataObject = { userid_list: [userid], limit };
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/batch/get_by_user',
					body,
				);
			} else if (operation === 'updateExternalContactRemark') {
				const userid = this.getNodeParameter('userid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;
				const remark = this.getNodeParameter('remark', i, '') as string;
				const description = this.getNodeParameter('description', i, '') as string;
				const remark_company = this.getNodeParameter('remark_company', i, '') as string;
				const remark_mobiles = this.getNodeParameter('remark_mobiles', i, '') as string;
				const remark_pic_mediaid = this.getNodeParameter('remark_pic_mediaid', i, '') as string;

				const body: IDataObject = { userid, external_userid };
				if (remark) body.remark = remark;
				if (description) body.description = description;
				if (remark_company) body.remark_company = remark_company;
				if (remark_mobiles) body.remark_mobiles = remark_mobiles.split(',').map((m) => m.trim());
				if (remark_pic_mediaid) body.remark_pic_mediaid = remark_pic_mediaid;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/remark', body);
			}
			// 客户标签管理
			else if (operation === 'getCorpTagList') {
				const tag_id = this.getNodeParameter('tag_id', i, '') as string;
				const group_id = this.getNodeParameter('group_id', i, '') as string;
				const body: IDataObject = {};
				if (tag_id) body.tag_id = tag_id.split(',').map((id) => id.trim());
				if (group_id) body.group_id = group_id.split(',').map((id) => id.trim());
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_corp_tag_list',
					body,
				);
			} else if (operation === 'addCorpTag') {
				const group_id = this.getNodeParameter('group_id', i, '') as string;
				const group_name = this.getNodeParameter('group_name', i, '') as string;
				const tag = this.getNodeParameter('tag', i, '[]') as string;
				const order = this.getNodeParameter('order', i, 0) as number;

				const body: IDataObject = { tag: JSON.parse(tag) };
				if (group_id) body.group_id = group_id;
				if (group_name) body.group_name = group_name;
				if (order) body.order = order;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_corp_tag',
					body,
				);
			} else if (operation === 'editCorpTag') {
				const id = this.getNodeParameter('id', i) as string;
				const name = this.getNodeParameter('name', i, '') as string;
				const order = this.getNodeParameter('order', i, 0) as number;

				const body: IDataObject = { id };
				if (name) body.name = name;
				if (order) body.order = order;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/edit_corp_tag',
					body,
				);
			} else if (operation === 'delCorpTag') {
				const tag_id = this.getNodeParameter('tag_id', i, '') as string;
				const group_id = this.getNodeParameter('group_id', i, '') as string;

				const body: IDataObject = {};
				if (tag_id) body.tag_id = tag_id.split(',').map((id) => id.trim());
				if (group_id) body.group_id = group_id.split(',').map((id) => id.trim());

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/del_corp_tag',
					body,
				);
			} else if (operation === 'markTag') {
				const userid = this.getNodeParameter('userid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;
				const add_tag = this.getNodeParameter('add_tag', i, '') as string;
				const remove_tag = this.getNodeParameter('remove_tag', i, '') as string;

				const body: IDataObject = { userid, external_userid };
				if (add_tag) body.add_tag = add_tag.split(',').map((id) => id.trim());
				if (remove_tag) body.remove_tag = remove_tag.split(',').map((id) => id.trim());

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/mark_tag',
					body,
				);
			}
			// 在职继承
			else if (operation === 'transferCustomer') {
				const handover_userid = this.getNodeParameter('handover_userid', i) as string;
				const takeover_userid = this.getNodeParameter('takeover_userid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;
				const transfer_success_msg = this.getNodeParameter('transfer_success_msg', i, '') as string;

				const body: IDataObject = {
					handover_userid,
					takeover_userid,
					external_userid: external_userid.split(',').map((id) => id.trim()),
				};
				if (transfer_success_msg) body.transfer_success_msg = transfer_success_msg;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/transfer_customer',
					body,
				);
			} else if (operation === 'transferResult') {
				const handover_userid = this.getNodeParameter('handover_userid', i) as string;
				const takeover_userid = this.getNodeParameter('takeover_userid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { handover_userid, takeover_userid };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/transfer_result',
					body,
				);
			} else if (operation === 'transferGroupChat') {
				const chat_id_list = this.getNodeParameter('chat_id_list', i) as string;
				const new_owner = this.getNodeParameter('new_owner', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/transfer',
					{
						chat_id_list: chat_id_list.split(',').map((id) => id.trim()),
						new_owner,
					},
				);
			}
			// 离职继承
			else if (operation === 'getUnassignedList') {
				const page_id = this.getNodeParameter('page_id', i, 0) as number;
				const page_size = this.getNodeParameter('page_size', i, 1000) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { page_id, page_size };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_unassigned_list',
					body,
				);
			} else if (operation === 'resignedTransferCustomer') {
				const handover_userid = this.getNodeParameter('handover_userid', i) as string;
				const takeover_userid = this.getNodeParameter('takeover_userid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/resigned/transfer_customer',
					{
						handover_userid,
						takeover_userid,
						external_userid: external_userid.split(',').map((id) => id.trim()),
					},
				);
			} else if (operation === 'resignedTransferResult') {
				const handover_userid = this.getNodeParameter('handover_userid', i) as string;
				const takeover_userid = this.getNodeParameter('takeover_userid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { handover_userid, takeover_userid };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/resigned/transfer_result',
					body,
				);
			} else if (operation === 'resignedTransferGroupChat') {
				const chat_id_list = this.getNodeParameter('chat_id_list', i) as string;
				const new_owner = this.getNodeParameter('new_owner', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/onjob_transfer',
					{
						chat_id_list: chat_id_list.split(',').map((id) => id.trim()),
						new_owner,
					},
				);
			}
			// 客户群管理
			else if (operation === 'getGroupChatList') {
				const status_filter = this.getNodeParameter('status_filter', i, 0) as number;
				const owner_filter = this.getNodeParameter('owner_filter', i, '') as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = { limit };
				if (status_filter) body.status_filter = status_filter;
				if (owner_filter) {
					body.owner_filter = { userid_list: owner_filter.split(',').map((id) => id.trim()) };
				}
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/list',
					body,
				);
			} else if (operation === 'getGroupChat') {
				const chat_id = this.getNodeParameter('chat_id', i) as string;
				const need_name = this.getNodeParameter('need_name', i, true) as boolean;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/get',
					{
						chat_id,
						need_name: need_name ? 1 : 0,
					},
				);
			} else if (operation === 'opengidToChatid') {
				const opengid = this.getNodeParameter('opengid', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/opengid_to_chatid',
					{ opengid },
				);
			}
			// 联系我与客户入群方式
			else if (operation === 'addContactWay') {
				const type = this.getNodeParameter('type', i) as number;
				const scene = this.getNodeParameter('scene', i) as number;
				const user = this.getNodeParameter('user', i, '') as string;
				const remark = this.getNodeParameter('remark', i, '') as string;
				const skip_verify = this.getNodeParameter('skip_verify', i, true) as boolean;
				const conclusions = this.getNodeParameter('conclusions', i, '{}') as string;

				const body: IDataObject = { type, scene, skip_verify };
				if (user) body.user = user.split(',').map((id) => id.trim());
				if (remark) body.remark = remark;
				if (conclusions && conclusions !== '{}') body.conclusions = JSON.parse(conclusions);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_contact_way',
					body,
				);
			} else if (operation === 'getContactWay') {
				const config_id = this.getNodeParameter('config_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_contact_way',
					{ config_id },
				);
			} else if (operation === 'updateContactWay') {
				const config_id = this.getNodeParameter('config_id', i) as string;
				const user = this.getNodeParameter('user', i, '') as string;
				const remark = this.getNodeParameter('remark', i, '') as string;
				const skip_verify = this.getNodeParameter('skip_verify', i, true) as boolean;

				const body: IDataObject = { config_id, skip_verify };
				if (user) body.user = user.split(',').map((id) => id.trim());
				if (remark) body.remark = remark;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/update_contact_way',
					body,
				);
			} else if (operation === 'delContactWay') {
				const config_id = this.getNodeParameter('config_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/del_contact_way',
					{ config_id },
				);
			} else if (operation === 'addJoinWay') {
				const scene = this.getNodeParameter('scene', i) as number;
				const chat_id_list = this.getNodeParameter('chat_id_list', i) as string;
				const auto_create_room = this.getNodeParameter('auto_create_room', i, false) as boolean;
				const room_base_name = this.getNodeParameter('room_base_name', i, '') as string;
				const room_base_id = this.getNodeParameter('room_base_id', i, 1) as number;

				const body: IDataObject = {
					scene,
					chat_id_list: chat_id_list.split(',').map((id) => id.trim()),
				};
				if (auto_create_room) {
					body.auto_create_room = 1;
					body.room_base_name = room_base_name;
					body.room_base_id = room_base_id;
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/add_join_way',
					body,
				);
			} else if (operation === 'getJoinWay') {
				const config_id = this.getNodeParameter('config_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/get_join_way',
					{ config_id },
				);
			} else if (operation === 'updateJoinWay') {
				const config_id = this.getNodeParameter('config_id', i) as string;
				const chat_id_list = this.getNodeParameter('chat_id_list', i, '') as string;
				const auto_create_room = this.getNodeParameter('auto_create_room', i, false) as boolean;

				const body: IDataObject = { config_id };
				if (chat_id_list) {
					body.chat_id_list = chat_id_list.split(',').map((id) => id.trim());
				}
				if (auto_create_room) body.auto_create_room = 1;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/update_join_way',
					body,
				);
			} else if (operation === 'delJoinWay') {
				const config_id = this.getNodeParameter('config_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/del_join_way',
					{ config_id },
				);
			}
			// 客户朋友圈
			else if (operation === 'addMomentTask') {
				const visible_range = this.getNodeParameter('visible_range', i) as string;
				const text = this.getNodeParameter('text', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_moment_task',
					{
						visible_range: JSON.parse(visible_range),
						text: JSON.parse(text),
					},
				);
			} else if (operation === 'cancelMomentTask') {
				const moment_id = this.getNodeParameter('moment_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/cancel_moment_task',
					{ moment_id },
				);
			} else if (operation === 'getMomentTaskList') {
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;
				const creator = this.getNodeParameter('creator', i, '') as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = { start_time, end_time, limit };
				if (creator) body.creator = creator;
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_moment_task_list',
					body,
				);
			} else if (operation === 'getMomentTask') {
				const moment_id = this.getNodeParameter('moment_id', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 1000) as number;

				const body: IDataObject = { moment_id, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_moment_task',
					body,
				);
			}
			// 消息推送
			else if (operation === 'addMsgTemplate') {
				const chat_type = this.getNodeParameter('chat_type', i, 'single') as string;
				const sender = this.getNodeParameter('sender', i, '{}') as string;
				const text = this.getNodeParameter('text', i) as string;
				const allow_select = this.getNodeParameter('allow_select', i, false) as boolean;

				const body: IDataObject = {
					chat_type,
					text: JSON.parse(text),
					allow_select: allow_select ? 1 : 0,
				};
				if (sender && sender !== '{}') {
					Object.assign(body, JSON.parse(sender));
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_msg_template',
					body,
				);
			} else if (operation === 'remindGroupMsgSend') {
				const msgid = this.getNodeParameter('msgid', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/remind_groupmsg_send',
					{ msgid },
				);
			} else if (operation === 'cancelGroupMsgSend') {
				const msgid = this.getNodeParameter('msgid', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/cancel_groupmsg_send',
					{ msgid },
				);
			} else if (operation === 'getGroupMsgListV2') {
				const chat_type = this.getNodeParameter('chat_type', i) as string;
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;
				const creator = this.getNodeParameter('creator', i, '') as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = { chat_type, start_time, end_time, limit };
				if (creator) body.creator = creator;
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_groupmsg_list_v2',
					body,
				);
			} else if (operation === 'sendWelcomeMsg') {
				const welcome_code = this.getNodeParameter('welcome_code', i) as string;
				const text = this.getNodeParameter('text', i, '{}') as string;

				const body: IDataObject = { welcome_code };
				if (text && text !== '{}') {
					body.text = JSON.parse(text);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/send_welcome_msg',
					body,
				);
			} else if (operation === 'addGroupWelcomeTemplate') {
				const text = this.getNodeParameter('text', i) as string;
				const agentid = this.getNodeParameter('agentid', i, 0) as number;
				const notify = this.getNodeParameter('notify', i, false) as boolean;

				const body: IDataObject = { text: JSON.parse(text) };
				if (agentid) body.agentid = agentid;
				if (notify) body.notify = 1;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/group_welcome_template/add',
					body,
				);
			} else if (operation === 'editGroupWelcomeTemplate') {
				const template_id = this.getNodeParameter('template_id', i) as string;
				const text = this.getNodeParameter('text', i, '{}') as string;

				const body: IDataObject = { template_id };
				if (text && text !== '{}') {
					body.text = JSON.parse(text);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/group_welcome_template/edit',
					body,
				);
			} else if (operation === 'getGroupWelcomeTemplate') {
				const template_id = this.getNodeParameter('template_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/group_welcome_template/get',
					{ template_id },
				);
			} else if (operation === 'delGroupWelcomeTemplate') {
				const template_id = this.getNodeParameter('template_id', i) as string;
				const agentid = this.getNodeParameter('agentid', i, 0) as number;

				const body: IDataObject = { template_id };
				if (agentid) body.agentid = agentid;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/group_welcome_template/del',
					body,
				);
			}
			// 统计管理
			else if (operation === 'getUserBehaviorData') {
				const userid = this.getNodeParameter('userid', i, '') as string;
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;

				const body: IDataObject = { start_time, end_time };
				if (userid) body.userid = userid.split(',').map((id) => id.trim());

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_user_behavior_data',
					body,
				);
			} else if (operation === 'getGroupChatStatistic') {
				const day_begin_time = this.getNodeParameter('day_begin_time', i) as number;
				const day_end_time = this.getNodeParameter('day_end_time', i, 0) as number;
				const owner_filter = this.getNodeParameter('owner_filter', i, '{}') as string;
				const order_by = this.getNodeParameter('order_by', i, 1) as number;
				const order_asc = this.getNodeParameter('order_asc', i, false) as boolean;
				const offset = this.getNodeParameter('offset', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 500) as number;

				const body: IDataObject = {
					day_begin_time,
					order_by,
					order_asc: order_asc ? 1 : 0,
					offset,
					limit,
				};
				if (day_end_time) body.day_end_time = day_end_time;
				if (owner_filter && owner_filter !== '{}') body.owner_filter = JSON.parse(owner_filter);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/statistic',
					body,
				);
			}
			// 其他接口
			else if (operation === 'addProductAlbum') {
				const product = this.getNodeParameter('product', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_product_album',
					{ product: JSON.parse(product) },
				);
			} else if (operation === 'getProductAlbumList') {
				const limit = this.getNodeParameter('limit', i, 50) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_product_album_list',
					body,
				);
			} else if (operation === 'getProductAlbum') {
				const product_id = this.getNodeParameter('product_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_product_album',
					{ product_id },
				);
			} else if (operation === 'updateProductAlbum') {
				const product_id = this.getNodeParameter('product_id', i) as string;
				const product = this.getNodeParameter('product', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/update_product_album',
					{
						product_id,
						product: JSON.parse(product),
					},
				);
			} else if (operation === 'deleteProductAlbum') {
				const product_id = this.getNodeParameter('product_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/delete_product_album',
					{ product_id },
				);
			} else if (operation === 'addInterceptRule') {
				const rule_name = this.getNodeParameter('rule_name', i) as string;
				const word_list = this.getNodeParameter('word_list', i) as string;
				const semantics_list = this.getNodeParameter('semantics_list', i, '[]') as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_intercept_rule',
					{
						rule_name,
						word_list: word_list.split(',').map((w) => w.trim()),
						semantics_list: JSON.parse(semantics_list),
					},
				);
			} else if (operation === 'getInterceptRuleList') {
				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/externalcontact/get_intercept_rule_list',
					{},
				);
			} else if (operation === 'getInterceptRule') {
				const rule_id = this.getNodeParameter('rule_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_intercept_rule',
					{ rule_id },
				);
			} else if (operation === 'updateInterceptRule') {
				const rule_id = this.getNodeParameter('rule_id', i) as string;
				const rule_name = this.getNodeParameter('rule_name', i, '') as string;
				const word_list = this.getNodeParameter('word_list', i, '') as string;

				const body: IDataObject = { rule_id };
				if (rule_name) body.rule_name = rule_name;
				if (word_list) body.word_list = word_list.split(',').map((w) => w.trim());

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/update_intercept_rule',
					body,
				);
			} else if (operation === 'deleteInterceptRule') {
				const rule_id = this.getNodeParameter('rule_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/del_intercept_rule',
					{ rule_id },
				);
			} else if (operation === 'uploadAttachment') {
				const media_type = this.getNodeParameter('media_type', i) as string;
				const attachment_type = this.getNodeParameter('attachment_type', i) as number;
				const attachment = this.getNodeParameter('attachment', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/upload_attachment',
					{
						media_type,
						attachment_type,
						attachment: JSON.parse(attachment),
					},
				);
			} else if (operation === 'getCustomerAcquisitionQuota') {
				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/externalcontact/customer_acquisition_quota',
					{},
				);
			} else if (operation === 'listCustomerAcquisitionLink') {
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/list_link',
					body,
				);
			} else if (operation === 'createCustomerAcquisitionLink') {
				const link_name = this.getNodeParameter('link_name', i) as string;
				const range = this.getNodeParameter('range', i) as string;
				const skip_verify = this.getNodeParameter('skip_verify', i, true) as boolean;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/create_link',
					{
						link_name,
						range: JSON.parse(range),
						skip_verify,
					},
				);
			} else if (operation === 'updateCustomerAcquisitionLink') {
				const link_id = this.getNodeParameter('link_id', i) as string;
				const link_name = this.getNodeParameter('link_name', i, '') as string;
				const range = this.getNodeParameter('range', i, '[]') as string;

				const body: IDataObject = { link_id };
				if (link_name) body.link_name = link_name;
				if (range && range !== '[]') body.range = JSON.parse(range);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/update_link',
					body,
				);
			} else if (operation === 'deleteCustomerAcquisitionLink') {
				const link_id = this.getNodeParameter('link_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/delete_link',
					{ link_id },
				);
			} else if (operation === 'getCustomerAcquisitionCustomer') {
				const link_id = this.getNodeParameter('link_id', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 1000) as number;

				const body: IDataObject = { link_id, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/customer',
					body,
				);
			} else if (operation === 'getServedExternalContact') {
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 1000) as number;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_served_external_contact',
					body,
				);
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

