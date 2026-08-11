import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { executeExtraHttpOp } from '../../shared/extraHttpOp';
import { externalContactExtraHttpOpsById } from './extraHttpOps';

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
				const tagCollection = this.getNodeParameter('tagCollection', i, {}) as IDataObject;
				const order = this.getNodeParameter('order', i, 0) as number;

				// 构建标签列表
				const tag: IDataObject[] = [];
				if (tagCollection.tags) {
					const tagsList = tagCollection.tags as IDataObject[];
					tagsList.forEach((t) => {
						const tagItem: IDataObject = { name: t.name };
						if (t.order) tagItem.order = t.order;
						tag.push(tagItem);
					});
				}

				const body: IDataObject = { tag };
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
				const state = this.getNodeParameter('state', i, '') as string;
				const is_temp = this.getNodeParameter('is_temp', i, false) as boolean;
				const is_exclusive = this.getNodeParameter('is_exclusive', i, false) as boolean;
				const mark_source = this.getNodeParameter('mark_source', i, true) as boolean;

				const body: IDataObject = { type, scene, skip_verify };
				if (user) body.user = user.split(',').map((id) => id.trim());
				if (remark) body.remark = remark;
				if (state) body.state = state;
				if (is_exclusive) body.is_exclusive = is_exclusive;
				body.mark_source = mark_source;

				// 多人类型时可设置部门
				if (type === 2) {
					const party = this.getNodeParameter('party', i, '') as string;
					if (party) body.party = party.split(',').map((id) => parseInt(id.trim(), 10));
				}

				// 小程序联系时可设置样式
				if (scene === 1) {
					const style = this.getNodeParameter('style', i, 1) as number;
					if (style) body.style = style;
				}

				// 临时会话模式
				if (is_temp) {
					body.is_temp = true;
					const expires_in = this.getNodeParameter('expires_in', i, 604800) as number;
					const chat_expires_in = this.getNodeParameter('chat_expires_in', i, 86400) as number;
					const unionid = this.getNodeParameter('unionid', i, '') as string;
					body.expires_in = expires_in;
					body.chat_expires_in = chat_expires_in;
					if (unionid) body.unionid = unionid;

					// 构建结束语（仅临时会话模式下有效）
					const enableConclusions = this.getNodeParameter('enableConclusions', i, false) as boolean;
					if (enableConclusions) {
						const conclusionType = this.getNodeParameter('conclusionType', i, 'text') as string;
						const conclusions: IDataObject = {};

						if (conclusionType === 'text') {
							const content = this.getNodeParameter('conclusion_text', i, '') as string;
							if (content) conclusions.text = { content };
						} else if (conclusionType === 'image') {
							const media_id = this.getNodeParameter('conclusion_image_media_id', i, '') as string;
							if (media_id) conclusions.image = { media_id };
						} else if (conclusionType === 'link') {
							const link: IDataObject = {};
							const title = this.getNodeParameter('conclusion_link_title', i, '') as string;
							const picurl = this.getNodeParameter('conclusion_link_picurl', i, '') as string;
							const desc = this.getNodeParameter('conclusion_link_desc', i, '') as string;
							const url = this.getNodeParameter('conclusion_link_url', i, '') as string;
							if (title) link.title = title;
							if (picurl) link.picurl = picurl;
							if (desc) link.desc = desc;
							if (url) link.url = url;
							if (Object.keys(link).length > 0) conclusions.link = link;
						} else if (conclusionType === 'miniprogram') {
							const miniprogram: IDataObject = {};
							const title = this.getNodeParameter('conclusion_miniprogram_title', i, '') as string;
							const appid = this.getNodeParameter('conclusion_miniprogram_appid', i, '') as string;
							const page = this.getNodeParameter('conclusion_miniprogram_page', i, '') as string;
							const pic_media_id = this.getNodeParameter('conclusion_miniprogram_pic_media_id', i, '') as string;
							if (title) miniprogram.title = title;
							if (appid) miniprogram.appid = appid;
							if (page) miniprogram.page = page;
							if (pic_media_id) miniprogram.pic_media_id = pic_media_id;
							if (Object.keys(miniprogram).length > 0) conclusions.miniprogram = miniprogram;
						}

						if (Object.keys(conclusions).length > 0) {
							body.conclusions = conclusions;
						}
					}
				}

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
				const party = this.getNodeParameter('party', i, '') as string;
				const remark = this.getNodeParameter('remark', i, '') as string;
				const skip_verify = this.getNodeParameter('skip_verify', i, true) as boolean;
				const style = this.getNodeParameter('style', i, 0) as number;
				const state = this.getNodeParameter('state', i, '') as string;
				const expires_in = this.getNodeParameter('expires_in', i, 0) as number;
				const chat_expires_in = this.getNodeParameter('chat_expires_in', i, 0) as number;
				const unionid = this.getNodeParameter('unionid', i, '') as string;
				const mark_source = this.getNodeParameter('mark_source', i, true) as boolean;
				const enableConclusions = this.getNodeParameter('enableConclusions', i, false) as boolean;

				const body: IDataObject = { config_id };
				if (user) body.user = user.split(',').map((id) => id.trim());
				if (party) body.party = party.split(',').map((id) => parseInt(id.trim(), 10));
				if (remark) body.remark = remark;
				body.skip_verify = skip_verify;
				if (style > 0) body.style = style;
				if (state) body.state = state;
				if (expires_in > 0) body.expires_in = expires_in;
				if (chat_expires_in > 0) body.chat_expires_in = chat_expires_in;
				if (unionid) body.unionid = unionid;
				body.mark_source = mark_source;

				// 构建结束语（仅临时会话模式下有效）
				if (enableConclusions) {
					const conclusionType = this.getNodeParameter('conclusionType', i, 'text') as string;
					const conclusions: IDataObject = {};

					if (conclusionType === 'text') {
						const content = this.getNodeParameter('conclusion_text', i, '') as string;
						if (content) conclusions.text = { content };
					} else if (conclusionType === 'image') {
						const media_id = this.getNodeParameter('conclusion_image_media_id', i, '') as string;
						if (media_id) conclusions.image = { media_id };
					} else if (conclusionType === 'link') {
						const link: IDataObject = {};
						const title = this.getNodeParameter('conclusion_link_title', i, '') as string;
						const picurl = this.getNodeParameter('conclusion_link_picurl', i, '') as string;
						const desc = this.getNodeParameter('conclusion_link_desc', i, '') as string;
						const url = this.getNodeParameter('conclusion_link_url', i, '') as string;
						if (title) link.title = title;
						if (picurl) link.picurl = picurl;
						if (desc) link.desc = desc;
						if (url) link.url = url;
						if (Object.keys(link).length > 0) conclusions.link = link;
					} else if (conclusionType === 'miniprogram') {
						const miniprogram: IDataObject = {};
						const title = this.getNodeParameter('conclusion_miniprogram_title', i, '') as string;
						const appid = this.getNodeParameter('conclusion_miniprogram_appid', i, '') as string;
						const page = this.getNodeParameter('conclusion_miniprogram_page', i, '') as string;
						const pic_media_id = this.getNodeParameter('conclusion_miniprogram_pic_media_id', i, '') as string;
						if (title) miniprogram.title = title;
						if (appid) miniprogram.appid = appid;
						if (page) miniprogram.page = page;
						if (pic_media_id) miniprogram.pic_media_id = pic_media_id;
						if (Object.keys(miniprogram).length > 0) conclusions.miniprogram = miniprogram;
					}

					if (Object.keys(conclusions).length > 0) {
						body.conclusions = conclusions;
					}
				}

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
			} else if (operation === 'listContactWay') {
				const start_time = this.getNodeParameter('start_time', i, 0) as number;
				const end_time = this.getNodeParameter('end_time', i, 0) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = { limit };
				if (start_time > 0) body.start_time = start_time;
				if (end_time > 0) body.end_time = end_time;
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/list_contact_way',
					body,
				);
			} else if (operation === 'closeTempChat') {
				const userid = this.getNodeParameter('userid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/close_temp_chat',
					{ userid, external_userid },
				);
			} else if (operation === 'addJoinWay') {
				const scene = this.getNodeParameter('scene', i) as number;
				const chat_id_list = this.getNodeParameter('chat_id_list', i) as string;
				const remark = this.getNodeParameter('remark', i, '') as string;
				const auto_create_room = this.getNodeParameter('auto_create_room', i, true) as boolean;
				const state = this.getNodeParameter('state', i, '') as string;
				const mark_source = this.getNodeParameter('mark_source', i, true) as boolean;

				const body: IDataObject = {
					scene,
					chat_id_list: chat_id_list.split(',').map((id) => id.trim()),
				};
				if (remark) body.remark = remark;
				if (state) body.state = state;
				body.mark_source = mark_source;

				if (auto_create_room) {
					body.auto_create_room = 1;
					const room_base_name = this.getNodeParameter('room_base_name', i, '') as string;
					const room_base_id = this.getNodeParameter('room_base_id', i, 1) as number;
					if (room_base_name) body.room_base_name = room_base_name;
					if (room_base_id) body.room_base_id = room_base_id;
				} else {
					body.auto_create_room = 0;
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
				const scene = this.getNodeParameter('scene', i) as number;
				const chat_id_list = this.getNodeParameter('chat_id_list', i) as string;
				const remark = this.getNodeParameter('remark', i, '') as string;
				const auto_create_room = this.getNodeParameter('auto_create_room', i, true) as boolean;
				const state = this.getNodeParameter('state', i, '') as string;
				const mark_source = this.getNodeParameter('mark_source', i, true) as boolean;

				const body: IDataObject = {
					config_id,
					scene,
					chat_id_list: chat_id_list.split(',').map((id) => id.trim()),
				};
				if (remark) body.remark = remark;
				if (state) body.state = state;
				body.mark_source = mark_source;

				if (auto_create_room) {
					body.auto_create_room = 1;
					const room_base_name = this.getNodeParameter('room_base_name', i, '') as string;
					const room_base_id = this.getNodeParameter('room_base_id', i, 1) as number;
					if (room_base_name) body.room_base_name = room_base_name;
					if (room_base_id) body.room_base_id = room_base_id;
				} else {
					body.auto_create_room = 0;
				}

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
				const enableVisibleRange = this.getNodeParameter('enableVisibleRange', i, true) as boolean;
				const contentType = this.getNodeParameter('contentType', i) as string;

				const body: IDataObject = {};

				// 构建可见范围
				if (enableVisibleRange) {
					const visible_range: IDataObject = {};
					const sender_user_list = this.getNodeParameter('sender_user_list', i, '') as string;
					const sender_department_list = this.getNodeParameter('sender_department_list', i, '') as string;

					if (sender_user_list || sender_department_list) {
						const sender_list: IDataObject = {};
						if (sender_user_list) {
							sender_list.user_list = sender_user_list.split(',').map((id) => id.trim());
						}
						if (sender_department_list) {
							sender_list.department_list = sender_department_list.split(',').map((id) => parseInt(id.trim(), 10));
						}
						visible_range.sender_list = sender_list;
					}

					// 可见客户标签列表
					const enableExternalContactList = this.getNodeParameter('enableExternalContactList', i, false) as boolean;
					if (enableExternalContactList) {
						const external_contact_tag_list = this.getNodeParameter('external_contact_tag_list', i, '') as string;
						if (external_contact_tag_list) {
							visible_range.external_contact_list = {
								tag_list: external_contact_tag_list.split(',').map((id) => id.trim()),
							};
						}
					}

					if (Object.keys(visible_range).length > 0) {
						body.visible_range = visible_range;
					}
				}

				// 文本内容
				const text_content = this.getNodeParameter('text_content', i, '') as string;
				if (text_content) {
					body.text = { content: text_content };
				}

				// 附件内容
				if (contentType === 'image') {
					const imageCollection = this.getNodeParameter('imageCollection', i, {}) as IDataObject;
					if (imageCollection.images) {
						const imagesList = imageCollection.images as IDataObject[];
						body.attachments = imagesList.map((img) => ({
							msgtype: 'image',
							image: { media_id: img.media_id },
						}));
					}
				} else if (contentType === 'video') {
					const video_media_id = this.getNodeParameter('video_media_id', i, '') as string;
					if (video_media_id) {
						body.attachments = [{
							msgtype: 'video',
							video: { media_id: video_media_id },
						}];
					}
				} else if (contentType === 'link') {
					const title = this.getNodeParameter('link_title', i, '') as string;
					const url = this.getNodeParameter('link_url', i) as string;
					const media_id = this.getNodeParameter('link_media_id', i) as string;
					const link: IDataObject = {};
					if (title) link.title = title;
					link.url = url;
					link.media_id = media_id;
					body.attachments = [{
						msgtype: 'link',
						link,
					}];
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_moment_task',
					body,
				);
			} else if (operation === 'cancelMomentTask') {
				const moment_id = this.getNodeParameter('moment_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/cancel_moment_task',
					{ moment_id },
				);
			} else if (operation === 'getMomentTaskResult') {
				const jobid = this.getNodeParameter('jobid', i) as string;

				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/externalcontact/get_moment_task_result',
					{},
					{ jobid },
				);
			} else if (operation === 'getMomentTaskList') {
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;
				const creator = this.getNodeParameter('creator', i, '') as string;
				const filter_type = this.getNodeParameter('filter_type', i, 2) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;

				const body: IDataObject = { start_time, end_time, limit };
				if (creator) body.creator = creator;
				if (filter_type !== 2) body.filter_type = filter_type;
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_moment_list',
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
			} else if (operation === 'getMomentCustomerList') {
				const moment_id = this.getNodeParameter('moment_id', i) as string;
				const userid = this.getNodeParameter('userid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 500) as number;

				const body: IDataObject = { moment_id, userid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_moment_customer_list',
					body,
				);
			} else if (operation === 'getMomentSendResult') {
				const moment_id = this.getNodeParameter('moment_id', i) as string;
				const userid = this.getNodeParameter('userid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 3000) as number;

				const body: IDataObject = { moment_id, userid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_moment_send_result',
					body,
				);
			} else if (operation === 'getMomentComments') {
				const moment_id = this.getNodeParameter('moment_id', i) as string;
				const userid = this.getNodeParameter('userid', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_moment_comments',
					{ moment_id, userid },
				);
			}
			// 朋友圈规则组管理
			else if (operation === 'listMomentStrategy') {
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 1000) as number;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/list',
					body,
				);
			} else if (operation === 'getMomentStrategy') {
				const strategy_id = this.getNodeParameter('strategy_id', i) as number;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/get',
					{ strategy_id },
				);
			} else if (operation === 'getMomentStrategyRange') {
				const strategy_id = this.getNodeParameter('strategy_id', i) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 1000) as number;

				const body: IDataObject = { strategy_id, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/get_range',
					body,
				);
			} else if (operation === 'createMomentStrategy') {
				const strategy_name = this.getNodeParameter('strategy_name', i) as string;
				const parent_id = this.getNodeParameter('parent_id', i, 0) as number;
				const admin_list = this.getNodeParameter('admin_list', i) as string;
				const privilege_view_moment_list = this.getNodeParameter('privilege_view_moment_list', i, true) as boolean;
				const privilege_send_moment = this.getNodeParameter('privilege_send_moment', i, true) as boolean;
				const privilege_manage_moment_cover_and_sign = this.getNodeParameter('privilege_manage_moment_cover_and_sign', i, true) as boolean;
				const rangeCollection = this.getNodeParameter('rangeCollection', i, {}) as IDataObject;

				const body: IDataObject = {
					strategy_name,
					admin_list: admin_list.split(',').map((id) => id.trim()),
					privilege: {
						view_moment_list: privilege_view_moment_list,
						send_moment: privilege_send_moment,
						manage_moment_cover_and_sign: privilege_manage_moment_cover_and_sign,
					},
				};
				if (parent_id > 0) body.parent_id = parent_id;

				// 构建管理范围
				if (rangeCollection.ranges) {
					const rangesList = rangeCollection.ranges as IDataObject[];
					body.range = rangesList.map((r) => {
						const rangeItem: IDataObject = { type: r.type };
						if (r.type === 1 && r.userid) rangeItem.userid = r.userid;
						if (r.type === 2 && r.partyid) rangeItem.partyid = r.partyid;
						return rangeItem;
					});
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/create',
					body,
				);
			} else if (operation === 'editMomentStrategy') {
				const strategy_id = this.getNodeParameter('strategy_id', i) as number;
				const strategy_name = this.getNodeParameter('strategy_name', i, '') as string;
				const updateAdminList = this.getNodeParameter('updateAdminList', i, false) as boolean;
				const updatePrivilege = this.getNodeParameter('updatePrivilege', i, false) as boolean;
				const rangeAddCollection = this.getNodeParameter('rangeAddCollection', i, {}) as IDataObject;
				const rangeDelCollection = this.getNodeParameter('rangeDelCollection', i, {}) as IDataObject;

				const body: IDataObject = { strategy_id };
				if (strategy_name) body.strategy_name = strategy_name;

				// 更新管理员列表
				if (updateAdminList) {
					const admin_list = this.getNodeParameter('admin_list', i, '') as string;
					if (admin_list) {
						body.admin_list = admin_list.split(',').map((id) => id.trim());
					}
				}

				// 更新权限配置
				if (updatePrivilege) {
					const privilege_view_moment_list = this.getNodeParameter('privilege_view_moment_list', i, true) as boolean;
					const privilege_send_moment = this.getNodeParameter('privilege_send_moment', i, true) as boolean;
					const privilege_manage_moment_cover_and_sign = this.getNodeParameter('privilege_manage_moment_cover_and_sign', i, true) as boolean;
					body.privilege = {
						view_moment_list: privilege_view_moment_list,
						send_moment: privilege_send_moment,
						manage_moment_cover_and_sign: privilege_manage_moment_cover_and_sign,
					};
				}

				// 添加管理范围
				if (rangeAddCollection.ranges) {
					const rangesList = rangeAddCollection.ranges as IDataObject[];
					body.range_add = rangesList.map((r) => {
						const rangeItem: IDataObject = { type: r.type };
						if (r.type === 1 && r.userid) rangeItem.userid = r.userid;
						if (r.type === 2 && r.partyid) rangeItem.partyid = r.partyid;
						return rangeItem;
					});
				}

				// 删除管理范围
				if (rangeDelCollection.ranges) {
					const rangesList = rangeDelCollection.ranges as IDataObject[];
					body.range_del = rangesList.map((r) => {
						const rangeItem: IDataObject = { type: r.type };
						if (r.type === 1 && r.userid) rangeItem.userid = r.userid;
						if (r.type === 2 && r.partyid) rangeItem.partyid = r.partyid;
						return rangeItem;
					});
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/edit',
					body,
				);
			} else if (operation === 'deleteMomentStrategy') {
				const strategy_id = this.getNodeParameter('strategy_id', i) as number;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/del',
					{ strategy_id },
				);
			}
			// 消息推送
			else if (operation === 'addMsgTemplate') {
				const chat_type = this.getNodeParameter('chat_type', i, 'single') as string;
				const sender = this.getNodeParameter('sender', i, '') as string;
				const text_content = this.getNodeParameter('text_content', i, '') as string;
				const enableAttachments = this.getNodeParameter('enableAttachments', i, false) as boolean;

				const body: IDataObject = { chat_type };

				// 发送成员（群聊时必填）
				if (sender) {
					body.sender = sender;
				}

				// 单聊场景参数
				if (chat_type === 'single') {
					const external_userid = this.getNodeParameter('external_userid', i, '') as string;
					const allow_select = this.getNodeParameter('allow_select', i, false) as boolean;
					const enableTagFilter = this.getNodeParameter('enableTagFilter', i, false) as boolean;

					// 客户列表
					if (external_userid) {
						body.external_userid = external_userid.split(',').map((id) => id.trim());
					}

					// 是否允许成员重新选择
					if (allow_select) {
						body.allow_select = true;
					}

					// 标签过滤
					if (enableTagFilter) {
						const tagFilterGroups = this.getNodeParameter('tagFilterGroups', i, {}) as IDataObject;
						if (tagFilterGroups.groups) {
							const groupsList = tagFilterGroups.groups as IDataObject[];
							const group_list: IDataObject[] = [];
							for (const group of groupsList) {
								if (group.tag_list) {
									const tagListStr = group.tag_list as string;
									group_list.push({
										tag_list: tagListStr.split(',').map((id) => id.trim()),
									});
								}
							}
							if (group_list.length > 0) {
								body.tag_filter = { group_list };
							}
						}
					}
				}

				// 群聊场景参数
				if (chat_type === 'group') {
					const chat_id_list = this.getNodeParameter('chat_id_list', i, '') as string;
					if (chat_id_list) {
						body.chat_id_list = chat_id_list.split(',').map((id) => id.trim());
					}
				}

				// 文本内容
				if (text_content) {
					body.text = { content: text_content };
				}

				// 附件列表
				if (enableAttachments) {
					const attachmentsCollection = this.getNodeParameter('attachments', i, {}) as IDataObject;
					const attachments: IDataObject[] = [];

					// 处理图片附件
					if (attachmentsCollection.images) {
						const imagesList = attachmentsCollection.images as IDataObject[];
						for (const img of imagesList) {
							const image: IDataObject = {};
							if (img.media_id) image.media_id = img.media_id;
							if (img.pic_url) image.pic_url = img.pic_url;
							if (Object.keys(image).length > 0) {
								attachments.push({ msgtype: 'image', image });
							}
						}
					}

					// 处理链接附件
					if (attachmentsCollection.links) {
						const linksList = attachmentsCollection.links as IDataObject[];
						for (const lnk of linksList) {
							const link: IDataObject = {};
							if (lnk.title) link.title = lnk.title;
							if (lnk.picurl) link.picurl = lnk.picurl;
							if (lnk.desc) link.desc = lnk.desc;
							if (lnk.url) link.url = lnk.url;
							if (Object.keys(link).length > 0) {
								attachments.push({ msgtype: 'link', link });
							}
						}
					}

					// 处理小程序附件
					if (attachmentsCollection.miniprograms) {
						const miniprogramsList = attachmentsCollection.miniprograms as IDataObject[];
						for (const mp of miniprogramsList) {
							const miniprogram: IDataObject = {};
							if (mp.title) miniprogram.title = mp.title;
							if (mp.pic_media_id) miniprogram.pic_media_id = mp.pic_media_id;
							if (mp.appid) miniprogram.appid = mp.appid;
							if (mp.page) miniprogram.page = mp.page;
							if (Object.keys(miniprogram).length > 0) {
								attachments.push({ msgtype: 'miniprogram', miniprogram });
							}
						}
					}

					// 处理视频附件
					if (attachmentsCollection.videos) {
						const videosList = attachmentsCollection.videos as IDataObject[];
						for (const vid of videosList) {
							if (vid.media_id) {
								attachments.push({
									msgtype: 'video',
									video: { media_id: vid.media_id },
								});
							}
						}
					}

					// 处理文件附件
					if (attachmentsCollection.files) {
						const filesList = attachmentsCollection.files as IDataObject[];
						for (const file of filesList) {
							if (file.media_id) {
								attachments.push({
									msgtype: 'file',
									file: { media_id: file.media_id },
								});
							}
						}
					}

					if (attachments.length > 0) {
						body.attachments = attachments;
					}
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
				const filter_type = this.getNodeParameter('filter_type', i, 2) as number;
				const limit = this.getNodeParameter('limit', i, 50) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { chat_type, start_time, end_time, limit };
				if (creator) body.creator = creator;
				if (filter_type !== 2) body.filter_type = filter_type;
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_groupmsg_list_v2',
					body,
				);
			} else if (operation === 'getGroupMsgTask') {
				const msgid = this.getNodeParameter('msgid', i) as string;
				const limit = this.getNodeParameter('limit', i, 500) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { msgid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_groupmsg_task',
					body,
				);
			} else if (operation === 'getGroupMsgSendResult') {
				const msgid = this.getNodeParameter('msgid', i) as string;
				const userid = this.getNodeParameter('userid', i) as string;
				const limit = this.getNodeParameter('limit', i, 500) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { msgid, userid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_groupmsg_send_result',
					body,
				);
			} else if (operation === 'sendWelcomeMsg') {
				const welcome_code = this.getNodeParameter('welcome_code', i) as string;
				const text_content = this.getNodeParameter('text_content', i, '') as string;
				const enableAttachments = this.getNodeParameter('enableAttachments', i, false) as boolean;

				const body: IDataObject = { welcome_code };

				// 文本内容
				if (text_content) {
					body.text = { content: text_content };
				}

				// 附件列表
				if (enableAttachments) {
					const attachmentsCollection = this.getNodeParameter('attachments', i, {}) as IDataObject;
					const attachments: IDataObject[] = [];

					// 处理图片附件
					if (attachmentsCollection.images) {
						const imagesList = attachmentsCollection.images as IDataObject[];
						for (const img of imagesList) {
							const image: IDataObject = {};
							if (img.media_id) image.media_id = img.media_id;
							if (img.pic_url) image.pic_url = img.pic_url;
							if (Object.keys(image).length > 0) {
								attachments.push({ msgtype: 'image', image });
							}
						}
					}

					// 处理链接附件
					if (attachmentsCollection.links) {
						const linksList = attachmentsCollection.links as IDataObject[];
						for (const lnk of linksList) {
							const link: IDataObject = {};
							if (lnk.title) link.title = lnk.title;
							if (lnk.picurl) link.picurl = lnk.picurl;
							if (lnk.desc) link.desc = lnk.desc;
							if (lnk.url) link.url = lnk.url;
							if (Object.keys(link).length > 0) {
								attachments.push({ msgtype: 'link', link });
							}
						}
					}

					// 处理小程序附件
					if (attachmentsCollection.miniprograms) {
						const miniprogramsList = attachmentsCollection.miniprograms as IDataObject[];
						for (const mp of miniprogramsList) {
							const miniprogram: IDataObject = {};
							if (mp.title) miniprogram.title = mp.title;
							if (mp.pic_media_id) miniprogram.pic_media_id = mp.pic_media_id;
							if (mp.appid) miniprogram.appid = mp.appid;
							if (mp.page) miniprogram.page = mp.page;
							if (Object.keys(miniprogram).length > 0) {
								attachments.push({ msgtype: 'miniprogram', miniprogram });
							}
						}
					}

					// 处理视频附件
					if (attachmentsCollection.videos) {
						const videosList = attachmentsCollection.videos as IDataObject[];
						for (const vid of videosList) {
							if (vid.media_id) {
								attachments.push({
									msgtype: 'video',
									video: { media_id: vid.media_id },
								});
							}
						}
					}

					// 处理文件附件
					if (attachmentsCollection.files) {
						const filesList = attachmentsCollection.files as IDataObject[];
						for (const file of filesList) {
							if (file.media_id) {
								attachments.push({
									msgtype: 'file',
									file: { media_id: file.media_id },
								});
							}
						}
					}

					if (attachments.length > 0) {
						body.attachments = attachments;
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/send_welcome_msg',
					body,
				);
			} else if (operation === 'addGroupWelcomeTemplate') {
				const text_content = this.getNodeParameter('text_content', i, '') as string;
				const attachmentType = this.getNodeParameter('attachmentType', i, 'none') as string;
				const agentid = this.getNodeParameter('agentid', i, 0) as number;
				const notify = this.getNodeParameter('notify', i, 1) as number;

				const body: IDataObject = {};

				// 文本内容
				if (text_content) {
					body.text = { content: text_content };
				}

				// 附件（只能有一个）
				if (attachmentType === 'image') {
					const media_id = this.getNodeParameter('image_media_id', i, '') as string;
					const pic_url = this.getNodeParameter('image_pic_url', i, '') as string;
					const image: IDataObject = {};
					if (media_id) image.media_id = media_id;
					if (pic_url) image.pic_url = pic_url;
					if (Object.keys(image).length > 0) body.image = image;
				} else if (attachmentType === 'link') {
					const link: IDataObject = {};
					const title = this.getNodeParameter('link_title', i, '') as string;
					const picurl = this.getNodeParameter('link_picurl', i, '') as string;
					const desc = this.getNodeParameter('link_desc', i, '') as string;
					const url = this.getNodeParameter('link_url', i, '') as string;
					if (title) link.title = title;
					if (picurl) link.picurl = picurl;
					if (desc) link.desc = desc;
					if (url) link.url = url;
					if (Object.keys(link).length > 0) body.link = link;
				} else if (attachmentType === 'miniprogram') {
					const miniprogram: IDataObject = {};
					const title = this.getNodeParameter('miniprogram_title', i, '') as string;
					const appid = this.getNodeParameter('miniprogram_appid', i, '') as string;
					const page = this.getNodeParameter('miniprogram_page', i, '') as string;
					const pic_media_id = this.getNodeParameter('miniprogram_pic_media_id', i, '') as string;
					if (title) miniprogram.title = title;
					if (appid) miniprogram.appid = appid;
					if (page) miniprogram.page = page;
					if (pic_media_id) miniprogram.pic_media_id = pic_media_id;
					if (Object.keys(miniprogram).length > 0) body.miniprogram = miniprogram;
				} else if (attachmentType === 'file') {
					const media_id = this.getNodeParameter('file_media_id', i, '') as string;
					if (media_id) body.file = { media_id };
				} else if (attachmentType === 'video') {
					const media_id = this.getNodeParameter('video_media_id', i, '') as string;
					if (media_id) body.video = { media_id };
				}

				if (agentid) body.agentid = agentid;
				body.notify = notify;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/group_welcome_template/add',
					body,
				);
			} else if (operation === 'editGroupWelcomeTemplate') {
				const template_id = this.getNodeParameter('template_id', i) as string;
				const text_content = this.getNodeParameter('text_content', i, '') as string;
				const attachmentType = this.getNodeParameter('attachmentType', i, 'none') as string;
				const agentid = this.getNodeParameter('agentid', i, 0) as number;

				const body: IDataObject = { template_id };

				// 文本内容
				if (text_content) {
					body.text = { content: text_content };
				}

				// 附件（只能有一个）
				if (attachmentType === 'image') {
					const media_id = this.getNodeParameter('image_media_id', i, '') as string;
					const pic_url = this.getNodeParameter('image_pic_url', i, '') as string;
					const image: IDataObject = {};
					if (media_id) image.media_id = media_id;
					if (pic_url) image.pic_url = pic_url;
					if (Object.keys(image).length > 0) body.image = image;
				} else if (attachmentType === 'link') {
					const link: IDataObject = {};
					const title = this.getNodeParameter('link_title', i, '') as string;
					const picurl = this.getNodeParameter('link_picurl', i, '') as string;
					const desc = this.getNodeParameter('link_desc', i, '') as string;
					const url = this.getNodeParameter('link_url', i, '') as string;
					if (title) link.title = title;
					if (picurl) link.picurl = picurl;
					if (desc) link.desc = desc;
					if (url) link.url = url;
					if (Object.keys(link).length > 0) body.link = link;
				} else if (attachmentType === 'miniprogram') {
					const miniprogram: IDataObject = {};
					const title = this.getNodeParameter('miniprogram_title', i, '') as string;
					const appid = this.getNodeParameter('miniprogram_appid', i, '') as string;
					const page = this.getNodeParameter('miniprogram_page', i, '') as string;
					const pic_media_id = this.getNodeParameter('miniprogram_pic_media_id', i, '') as string;
					if (title) miniprogram.title = title;
					if (appid) miniprogram.appid = appid;
					if (page) miniprogram.page = page;
					if (pic_media_id) miniprogram.pic_media_id = pic_media_id;
					if (Object.keys(miniprogram).length > 0) body.miniprogram = miniprogram;
				} else if (attachmentType === 'file') {
					const media_id = this.getNodeParameter('file_media_id', i, '') as string;
					if (media_id) body.file = { media_id };
				} else if (attachmentType === 'video') {
					const media_id = this.getNodeParameter('video_media_id', i, '') as string;
					if (media_id) body.video = { media_id };
				}

				if (agentid) body.agentid = agentid;

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
				const filterType = this.getNodeParameter('filterType', i, 'user') as string;
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;

				const body: IDataObject = { start_time, end_time };

				if (filterType === 'user') {
					const userid = this.getNodeParameter('userid', i, '') as string;
					if (userid) body.userid = userid.split(',').map((id) => id.trim());
				} else if (filterType === 'party') {
					const partyid = this.getNodeParameter('partyid', i, '') as string;
					if (partyid) body.partyid = partyid.split(',').map((id) => parseInt(id.trim(), 10));
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_user_behavior_data',
					body,
				);
			} else if (operation === 'getGroupChatStatistic') {
				const statistic_type = this.getNodeParameter('statistic_type', i, 'by_owner') as string;
				const day_begin_time = this.getNodeParameter('day_begin_time', i) as number;
				const day_end_time = this.getNodeParameter('day_end_time', i, 0) as number;
				const owner_userid_list = this.getNodeParameter('owner_userid_list', i, '') as string;

				const body: IDataObject = { day_begin_time };
				if (day_end_time) body.day_end_time = day_end_time;

				// 构建群主筛选
				if (owner_userid_list) {
					body.owner_filter = {
						userid_list: owner_userid_list.split(',').map((id) => id.trim()),
					};
				}

				if (statistic_type === 'by_owner') {
					// 按群主聚合
					const order_by = this.getNodeParameter('order_by', i, 1) as number;
					const order_asc = this.getNodeParameter('order_asc', i, false) as boolean;
					const offset = this.getNodeParameter('offset', i, 0) as number;
					const limit = this.getNodeParameter('limit', i, 500) as number;

					body.order_by = order_by;
					body.order_asc = order_asc ? 1 : 0;
					body.offset = offset;
					body.limit = limit;

					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/externalcontact/groupchat/statistic',
						body,
					);
				} else {
					// 按自然日聚合
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/externalcontact/groupchat/statistic_group_by_day',
						body,
					);
				}
			}
			// 其他接口
			else if (operation === 'addProductAlbum') {
				const description = this.getNodeParameter('description', i) as string;
				const price = this.getNodeParameter('price', i) as number;
				const product_sn = this.getNodeParameter('product_sn', i, '') as string;
				const attachmentCollection = this.getNodeParameter('attachmentCollection', i, {}) as IDataObject;

				const body: IDataObject = { description, price };
				if (product_sn) body.product_sn = product_sn;

				// 构建附件列表
				if (attachmentCollection.attachments) {
					const attachmentsList = attachmentCollection.attachments as IDataObject[];
					body.attachments = attachmentsList.map((att) => ({
						type: 'image',
						image: { media_id: att.media_id },
					}));
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_product_album',
					body,
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
				const description = this.getNodeParameter('description', i, '') as string;
				const price = this.getNodeParameter('price', i, 0) as number;
				const product_sn = this.getNodeParameter('product_sn', i, '') as string;
				const updateAttachments = this.getNodeParameter('updateAttachments', i, false) as boolean;

				const body: IDataObject = { product_id };
				if (description) body.description = description;
				if (price) body.price = price;
				if (product_sn) body.product_sn = product_sn;

				// 构建附件列表
				if (updateAttachments) {
					const attachmentCollection = this.getNodeParameter('attachmentCollection', i, {}) as IDataObject;
					if (attachmentCollection.attachments) {
						const attachmentsList = attachmentCollection.attachments as IDataObject[];
						body.attachments = attachmentsList.map((att) => ({
							type: 'image',
							image: { media_id: att.media_id },
						}));
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/update_product_album',
					body,
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
				const intercept_type = this.getNodeParameter('intercept_type', i) as number;
				const applicableRangeType = this.getNodeParameter('applicableRangeType', i) as string;
				const enableSemantics = this.getNodeParameter('enableSemantics', i, false) as boolean;

				const body: IDataObject = {
					rule_name,
					word_list: word_list.split(',').map((w) => w.trim()),
					intercept_type,
				};

				// 构建适用范围
				const applicable_range: IDataObject = {};
				if (applicableRangeType === 'user' || applicableRangeType === 'both') {
					const userList = this.getNodeParameter('applicable_user_list', i, '') as string;
					if (userList) {
						applicable_range.user_list = userList.split(',').map((u) => u.trim());
					}
				}
				if (applicableRangeType === 'department' || applicableRangeType === 'both') {
					const deptList = this.getNodeParameter('applicable_department_list', i, '') as string;
					if (deptList) {
						applicable_range.department_list = deptList.split(',').map((d) => parseInt(d.trim(), 10));
					}
				}
				body.applicable_range = applicable_range;

				// 构建语义规则
				if (enableSemantics) {
					const semantics_list = this.getNodeParameter('semantics_list', i, []) as number[];
					if (semantics_list.length > 0) {
						body.semantics_list = semantics_list;
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_intercept_rule',
					body,
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
				const updateInterceptType = this.getNodeParameter('updateInterceptType', i, false) as boolean;
				const updateSemantics = this.getNodeParameter('updateSemantics', i, false) as boolean;
				const enableAddRange = this.getNodeParameter('enableAddRange', i, false) as boolean;
				const enableRemoveRange = this.getNodeParameter('enableRemoveRange', i, false) as boolean;

				const body: IDataObject = { rule_id };
				if (rule_name) body.rule_name = rule_name;
				if (word_list) body.word_list = word_list.split(',').map((w) => w.trim());

				// 更新拦截方式
				if (updateInterceptType) {
					const intercept_type = this.getNodeParameter('intercept_type', i) as number;
					body.intercept_type = intercept_type;
				}

				// 更新语义规则
				if (updateSemantics) {
					const semantics_list = this.getNodeParameter('semantics_list', i, []) as number[];
					body.extra_rule = { semantics_list };
				}

				// 新增适用范围
				if (enableAddRange) {
					const add_applicable_range: IDataObject = {};
					const addUserList = this.getNodeParameter('add_user_list', i, '') as string;
					const addDeptList = this.getNodeParameter('add_department_list', i, '') as string;
					if (addUserList) {
						add_applicable_range.user_list = addUserList.split(',').map((u) => u.trim());
					}
					if (addDeptList) {
						add_applicable_range.department_list = addDeptList.split(',').map((d) => parseInt(d.trim(), 10));
					}
					if (Object.keys(add_applicable_range).length > 0) {
						body.add_applicable_range = add_applicable_range;
					}
				}

				// 删除适用范围
				if (enableRemoveRange) {
					const remove_applicable_range: IDataObject = {};
					const removeUserList = this.getNodeParameter('remove_user_list', i, '') as string;
					const removeDeptList = this.getNodeParameter('remove_department_list', i, '') as string;
					if (removeUserList) {
						remove_applicable_range.user_list = removeUserList.split(',').map((u) => u.trim());
					}
					if (removeDeptList) {
						remove_applicable_range.department_list = removeDeptList.split(',').map((d) => parseInt(d.trim(), 10));
					}
					if (Object.keys(remove_applicable_range).length > 0) {
						body.remove_applicable_range = remove_applicable_range;
					}
				}

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
				const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;

				// 获取二进制数据
				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				// 使用 weComApiRequest 上传文件
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/media/upload_attachment',
					{},
					{
						media_type,
						attachment_type,
					},
					{},
					{
						body: {
							media: {
								value: buffer,
								options: {
									filename: binaryData.fileName || 'file',
									contentType: binaryData.mimeType || 'application/octet-stream',
								},
							},
						},
					},
				);
			} else if (operation === 'getCustomerAcquisitionQuota') {
				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/externalcontact/customer_acquisition_quota',
					{},
				);
			} else if (operation === 'getCustomerAcquisitionStatistic') {
				const link_id = this.getNodeParameter('link_id', i) as string;
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/statistic',
					{ link_id, start_time, end_time },
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
			} else if (operation === 'getCustomerAcquisitionLink') {
				const link_id = this.getNodeParameter('link_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/get',
					{ link_id },
				);
			} else if (operation === 'createCustomerAcquisitionLink') {
				const link_name = this.getNodeParameter('link_name', i) as string;
				const rangeType = this.getNodeParameter('rangeType', i) as string;
				const skip_verify = this.getNodeParameter('skip_verify', i, true) as boolean;
				const mark_source = this.getNodeParameter('mark_source', i, true) as boolean;
				const enablePriorityOption = this.getNodeParameter('enablePriorityOption', i, false) as boolean;

				const range: IDataObject = {};

				if (rangeType === 'user') {
					const user_list = this.getNodeParameter('user_list', i, '') as string;
					if (user_list) {
						range.user_list = user_list.split(',').map((id) => id.trim());
					}
				} else if (rangeType === 'department') {
					const department_list = this.getNodeParameter('department_list', i, '') as string;
					if (department_list) {
						range.department_list = department_list.split(',').map((id) => parseInt(id.trim(), 10));
					}
				}

				const body: IDataObject = { link_name, range, skip_verify, mark_source };

				// 优先分配配置
				if (enablePriorityOption) {
					const priority_type = this.getNodeParameter('priority_type', i, 1) as number;
					const priority_option: IDataObject = { priority_type };
					if (priority_type === 2) {
						const priority_userid_list = this.getNodeParameter('priority_userid_list', i, '') as string;
						if (priority_userid_list) {
							priority_option.priority_userid_list = priority_userid_list.split(',').map((id) => id.trim());
						}
					}
					body.priority_option = priority_option;
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/create_link',
					body,
				);
			} else if (operation === 'updateCustomerAcquisitionLink') {
				const link_id = this.getNodeParameter('link_id', i) as string;
				const link_name = this.getNodeParameter('link_name', i, '') as string;
				const updateRange = this.getNodeParameter('updateRange', i, false) as boolean;
				const skip_verify = this.getNodeParameter('skip_verify', i, true) as boolean;
				const mark_source = this.getNodeParameter('mark_source', i, true) as boolean;
				const updatePriorityOption = this.getNodeParameter('updatePriorityOption', i, false) as boolean;

				const body: IDataObject = { link_id, skip_verify, mark_source };
				if (link_name) body.link_name = link_name;

				if (updateRange) {
					const rangeType = this.getNodeParameter('rangeType', i) as string;
					const range: IDataObject = {};

					if (rangeType === 'user') {
						const user_list = this.getNodeParameter('user_list', i, '') as string;
						if (user_list) {
							range.user_list = user_list.split(',').map((id) => id.trim());
						}
					} else if (rangeType === 'department') {
						const department_list = this.getNodeParameter('department_list', i, '') as string;
						if (department_list) {
							range.department_list = department_list.split(',').map((id) => parseInt(id.trim(), 10));
						}
					}

					if (Object.keys(range).length > 0) body.range = range;
				}

				// 优先分配配置
				if (updatePriorityOption) {
					const priority_type = this.getNodeParameter('priority_type', i, 1) as number;
					const priority_option: IDataObject = { priority_type };
					if (priority_type === 2) {
						const priority_userid_list = this.getNodeParameter('priority_userid_list', i, '') as string;
						if (priority_userid_list) {
							priority_option.priority_userid_list = priority_userid_list.split(',').map((id) => id.trim());
						}
					}
					body.priority_option = priority_option;
				}

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
			} else if (operation === 'getCustomerAcquisitionChatInfo') {
				const chat_key = this.getNodeParameter('chat_key', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/get_chat_info',
					{ chat_key },
				);
			} else if (operation === 'getServedExternalContact') {
				const limit = this.getNodeParameter('limit', i, 1000) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/contact_list',
					body,
				);
			} else if (operation === 'createOnceKey') {
				const link_id = this.getNodeParameter('link_id', i) as string;
				const key_num = this.getNodeParameter('key_num', i, 100) as number;

				const body: IDataObject = { link_id };
				if (key_num) body.key_num = key_num;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/create_once_key',
					body,
				);
			} else if (operation === 'sendSchoolMessage') {
				// 发送学校通知
				const msgtype = this.getNodeParameter('msgtype', i) as string;
				const agentid = this.getNodeParameter('agentid', i) as number;
				const recv_scope = this.getNodeParameter('recv_scope', i, 0) as number;
				const to_parent_userid = this.getNodeParameter('to_parent_userid', i, '') as string;
				const to_student_userid = this.getNodeParameter('to_student_userid', i, '') as string;
				const to_party = this.getNodeParameter('to_party', i, '') as string;
				const toall = this.getNodeParameter('toall', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter('enable_duplicate_check', i, false) as boolean;
				const duplicate_check_interval = this.getNodeParameter('duplicate_check_interval', i, 1800) as number;

				const body: IDataObject = {
					msgtype,
					agentid,
					recv_scope,
					toall: toall ? 1 : 0,
				};

				if (to_parent_userid) {
					body.to_parent_userid = to_parent_userid.split(',').map((id) => id.trim());
				}

				if (to_student_userid) {
					body.to_student_userid = to_student_userid.split(',').map((id) => id.trim());
				}

				if (to_party) {
					body.to_party = to_party.split(',').map((id) => id.trim());
				}

				if (enable_duplicate_check) {
					body.enable_duplicate_check = 1;
					body.duplicate_check_interval = duplicate_check_interval;
				} else {
					body.enable_duplicate_check = 0;
				}

				// 根据消息类型构建消息体
				if (msgtype === 'text') {
					const content = this.getNodeParameter('content', i) as string;
					const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
					body.text = { content };
					body.enable_id_trans = enable_id_trans ? 1 : 0;
				} else if (msgtype === 'image') {
					const media_id = this.getNodeParameter('media_id', i) as string;
					body.image = { media_id };
				} else if (msgtype === 'voice') {
					const media_id = this.getNodeParameter('media_id', i) as string;
					body.voice = { media_id };
				} else if (msgtype === 'video') {
					const media_id = this.getNodeParameter('media_id', i) as string;
					const title = this.getNodeParameter('title', i, '') as string;
					const description = this.getNodeParameter('description', i, '') as string;
					const videoData: IDataObject = { media_id };
					if (title) videoData.title = title;
					if (description) videoData.description = description;
					body.video = videoData;
				} else if (msgtype === 'file') {
					const media_id = this.getNodeParameter('media_id', i) as string;
					body.file = { media_id };
				} else if (msgtype === 'news') {
					const articles = this.getNodeParameter('articles', i, {}) as IDataObject;
					const articleList = (articles.article as IDataObject[]) || [];
					const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
					body.news = { articles: articleList };
					body.enable_id_trans = enable_id_trans ? 1 : 0;
				} else if (msgtype === 'mpnews') {
					const articles = this.getNodeParameter('articles', i, {}) as IDataObject;
					const articleList = (articles.article as IDataObject[]) || [];
					const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
					body.mpnews = { articles: articleList };
					body.enable_id_trans = enable_id_trans ? 1 : 0;
				} else if (msgtype === 'miniprogram') {
					const appid = this.getNodeParameter('appid', i) as string;
					const title = this.getNodeParameter('title', i, '') as string;
					const thumb_media_id = this.getNodeParameter('thumb_media_id', i) as string;
					const pagepath = this.getNodeParameter('pagepath', i) as string;
					const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
					const miniprogramData: IDataObject = {
						appid,
						thumb_media_id,
						pagepath,
					};
					if (title) miniprogramData.title = title;
					body.miniprogram = miniprogramData;
					body.enable_id_trans = enable_id_trans ? 1 : 0;
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/message/send',
					body,
				);
			} else if (externalContactExtraHttpOpsById[operation]) {
				const bodyDefaults: IDataObject = {};
				const strategy_id = this.getNodeParameter('strategy_id', i, 0) as number;
				const ec_external_userid = this.getNodeParameter('ec_external_userid', i, '') as string;
				const ec_userid = this.getNodeParameter('ec_userid', i, '') as string;
				const ec_cursor = this.getNodeParameter('ec_cursor', i, '') as string;
				const ec_limit = this.getNodeParameter('ec_limit', i, 0) as number;
				const strategy_name = this.getNodeParameter('strategy_name', i, '') as string;
				const parent_id = this.getNodeParameter('parent_id', i, 0) as number;
				const admin_list = this.getNodeParameter('admin_list', i, '') as string;
				const range_json = this.getNodeParameter('range_json', i, '[]') as string;
				const privilege_json = this.getNodeParameter('privilege_json', i, '{}') as string;
				const tag_group_id = this.getNodeParameter('tag_group_id', i, '') as string;
				const tag_group_name = this.getNodeParameter('tag_group_name', i, '') as string;
				const tag_list_json = this.getNodeParameter('tag_list_json', i, '[]') as string;
				const msgid = this.getNodeParameter('msgid', i, '') as string;
				const takeover_userid = this.getNodeParameter('takeover_userid', i, '') as string;
				const subscribe_config_json = this.getNodeParameter('subscribe_config_json', i, '{}') as string;
				const behavior_start_time = this.getNodeParameter('behavior_start_time', i, 0) as number;
				const behavior_end_time = this.getNodeParameter('behavior_end_time', i, 0) as number;
				if (strategy_id) bodyDefaults.strategy_id = strategy_id;
				if (ec_external_userid) bodyDefaults.external_userid = ec_external_userid;
				if (ec_userid) bodyDefaults.userid = ec_userid;
				if (ec_cursor) bodyDefaults.cursor = ec_cursor;
				if (ec_limit) bodyDefaults.limit = ec_limit;
				if (strategy_name) bodyDefaults.strategy_name = strategy_name;
				if (parent_id) bodyDefaults.parent_id = parent_id;
				if (admin_list) {
					bodyDefaults.admin_list = admin_list.split(',').map((s) => s.trim()).filter(Boolean);
				}
				try {
					const range = JSON.parse(range_json || '[]');
					if (Array.isArray(range) && range.length) bodyDefaults.range = range;
				} catch { /* ignore */ }
				try {
					const privilege = JSON.parse(privilege_json || '{}');
					if (privilege && typeof privilege === 'object' && Object.keys(privilege as object).length) {
						bodyDefaults.privilege = privilege;
					}
				} catch { /* ignore */ }
				if (tag_group_id) bodyDefaults.group_id = tag_group_id;
				if (tag_group_name) bodyDefaults.group_name = tag_group_name;
				try {
					const tags = JSON.parse(tag_list_json || '[]');
					if (Array.isArray(tags) && tags.length) {
						if (operation === 'externalcontactDelStrategyTag') bodyDefaults.tag_id = tags;
						else bodyDefaults.tag = tags;
					}
				} catch { /* ignore */ }
				if (msgid) bodyDefaults.msgid = msgid;
				if (takeover_userid) bodyDefaults.takeover_userid = takeover_userid;
				try {
					const sub = JSON.parse(subscribe_config_json || '{}');
					if (sub && typeof sub === 'object') Object.assign(bodyDefaults, sub);
				} catch { /* ignore */ }
				if (behavior_start_time) bodyDefaults.start_time = behavior_start_time;
				if (behavior_end_time) bodyDefaults.end_time = behavior_end_time;
				response = await executeExtraHttpOp.call(
					this,
					externalContactExtraHttpOpsById[operation],
					i,
					bodyDefaults,
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

