import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { parseQueryJson, parseRequestJson } from '../../shared/extraHttpOp';
import { externalContactExtraHttpOpsById } from './extraHttpOps';
import {
	buildConclusion,
	buildMessageAttachments,
	buildSingleWelcomeAttachment,
	collectionRows,
	dateTimeToUnixTimestamp,
	fail,
	interceptWordList,
	integerList,
	optionalByteText,
	optionalText,
	parsePartyIdJson,
	parseStringIdJson,
	parseUserIdJson,
	productImageAttachments,
	rangeNodes,
	resolveRangeCollection,
	requireByteText,
	requireInteger,
	requireOption,
	requireText,
	stringList,
} from './utils';

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
				const userid = requireText(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, ''),
					'成员 UserID',
					i,
				);
				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/externalcontact/list',
					{},
					{ userid },
				);
			} else if (operation === 'getExternalContact') {
				const external_userid = requireText(
					this,
					this.getNodeParameter('external_userid', i),
					'外部联系人 UserID',
					i,
				);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);
				const qs: IDataObject = { external_userid };
				if (cursor) qs.cursor = cursor;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/externalcontact/get', {}, qs);
			} else if (operation === 'batchGetExternalContact') {
				const useridList = stringList(
					this,
					[
						this.getNodeParameter('userid_text', i, ''),
						this.getNodeParameter('userid', i, []),
						...parseUserIdJson(
							this,
							this.getNodeParameter('useridJson', i, '[]'),
							'成员列表 JSON',
							i,
						),
					],
					'成员 UserID 列表',
					i,
					{ minimum: 1, maximum: 100 },
				);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);
				const limit = requireInteger(
					this,
					this.getNodeParameter('limit', i, 50),
					'每页数量',
					i,
					1,
					100,
				);
				const body: IDataObject = { userid_list: useridList, limit };
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/batch/get_by_user',
					body,
				);
			} else if (operation === 'updateExternalContactRemark') {
				const userid = requireText(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, ''),
					'成员 UserID',
					i,
				);
				const external_userid = requireText(
					this,
					this.getNodeParameter('external_userid', i),
					'外部联系人 UserID',
					i,
				);
				const remark = optionalText(
					this,
					this.getNodeParameter('remark', i, ''),
					'备注',
					i,
					20,
				);
				const description = optionalText(
					this,
					this.getNodeParameter('description', i, ''),
					'描述',
					i,
					150,
				);
				const remark_company = optionalText(
					this,
					this.getNodeParameter('remark_company', i, ''),
					'备注公司',
					i,
					20,
				);
				const clearRemarkMobiles = this.getNodeParameter(
					'clearRemarkMobiles',
					i,
					false,
				) as boolean;
				const remarkMobiles = clearRemarkMobiles
					? ['']
					: stringList(
							this,
							[
								this.getNodeParameter('remark_mobiles', i, ''),
								...parseStringIdJson(
									this,
									this.getNodeParameter('remarkMobilesJson', i, '[]'),
									'备注手机号 JSON',
									i,
									['mobile', 'phone', 'tel', 'number'],
								),
							],
							'备注手机号',
							i,
							{ maximum: 5 },
						);
				const remark_pic_mediaid = optionalText(
					this,
					this.getNodeParameter('remark_pic_mediaid', i, ''),
					'备注图片 Media ID',
					i,
				);
				if (
					!remark &&
					!description &&
					!remark_company &&
					remarkMobiles.length === 0 &&
					!remark_pic_mediaid
				) {
					fail(this, '备注、描述、备注公司、备注手机号和备注图片不能同时为空', i);
				}

				const body: IDataObject = { userid, external_userid };
				if (remark) body.remark = remark;
				if (description) body.description = description;
				if (remark_company) body.remark_company = remark_company;
				if (remarkMobiles.length > 0) body.remark_mobiles = remarkMobiles;
				if (remark_pic_mediaid) body.remark_pic_mediaid = remark_pic_mediaid;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/remark', body);
			}
			// 客户标签管理
			else if (operation === 'getCorpTagList') {
				const tagIds = stringList(
					this,
					[
						this.getNodeParameter('tag_id', i, ''),
						...parseStringIdJson(
							this,
							this.getNodeParameter('tagIdJson', i, '[]'),
							'标签ID列表 JSON',
							i,
							['tag_id', 'tagid', 'id'],
						),
					],
					'标签 ID',
					i,
				);
				const groupIds = stringList(
					this,
					[
						this.getNodeParameter('group_id', i, ''),
						...parseStringIdJson(
							this,
							this.getNodeParameter('groupIdJson', i, '[]'),
							'标签组ID列表 JSON',
							i,
							['group_id', 'groupid', 'id'],
						),
					],
					'标签组 ID',
					i,
				);
				const body: IDataObject = {};
				if (groupIds.length > 0) body.group_id = groupIds;
				else if (tagIds.length > 0) body.tag_id = tagIds;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_corp_tag_list',
					body,
				);
			} else if (operation === 'addCorpTag') {
				const group_id = optionalText(
					this,
					this.getNodeParameter('group_id', i, ''),
					'标签组 ID',
					i,
				);
				const group_name = optionalText(
					this,
					this.getNodeParameter('group_name', i, ''),
					'标签组名称',
					i,
					30,
				);
				const tagCollection = this.getNodeParameter('tagCollection', i, {}) as IDataObject;
				const order = requireInteger(
					this,
					this.getNodeParameter('order', i, 0),
					'标签组排序',
					i,
					0,
					4294967295,
				);
				const agentid = requireInteger(
					this,
					(this.getNodeParameter('agentid', i, 0) || this.getNodeParameter('agentid_selected', i, '')),
					'旧套件 AgentID',
					i,
					0,
					Number.MAX_SAFE_INTEGER,
				);
				if (!group_id && !group_name) fail(this, '标签组 ID 和标签组名称至少填写一个', i);

				// 构建标签列表（JSON 非空时覆盖表单）
				const tagJsonRaw = this.getNodeParameter('tagListJson', i, '[]');
				let tagEntries = collectionRows(tagCollection, 'tags');
				if (tagJsonRaw !== undefined && tagJsonRaw !== null && String(tagJsonRaw).trim() !== '') {
					let parsed: unknown = tagJsonRaw;
					if (typeof tagJsonRaw === 'string') {
						try {
							parsed = JSON.parse(tagJsonRaw);
						} catch {
							fail(this, '标签列表 JSON 不是有效的 JSON', i);
						}
					}
					if (!Array.isArray(parsed)) fail(this, '标签列表 JSON 必须是数组', i);
					if (parsed.length > 0) tagEntries = parsed as IDataObject[];
				}
				const tag = tagEntries.map((entry, tagIndex) => ({
					name: requireText(this, entry.name, `第 ${tagIndex + 1} 个标签名称`, i, 30),
					order: requireInteger(
						this,
						entry.order ?? 0,
						`第 ${tagIndex + 1} 个标签排序`,
						i,
						0,
						4294967295,
					),
				}));
				if (tag.length === 0) fail(this, '标签列表不能为空', i);
				if (new Set(tag.map((entry) => String(entry.name))).size !== tag.length) {
					fail(this, '同一标签组内的标签名称不能重复', i);
				}

				const body: IDataObject = { tag };
				if (group_id) body.group_id = group_id;
				else {
					body.group_name = group_name;
					body.order = order;
				}
				if (agentid > 0) body.agentid = agentid;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_corp_tag',
					body,
				);
			} else if (operation === 'editCorpTag') {
				const id = requireText(this, this.getNodeParameter('id', i), '标签或标签组 ID', i);
				const updateName = this.getNodeParameter('updateName', i, false) as boolean;
				const updateOrder = this.getNodeParameter('updateOrder', i, false) as boolean;
				if (!updateName && !updateOrder) fail(this, '名称和排序至少更新一项', i);

				const body: IDataObject = { id };
				if (updateName) {
					body.name = requireText(this, this.getNodeParameter('name', i, ''), '新名称', i, 30);
				}
				if (updateOrder) {
					body.order = requireInteger(
						this,
						this.getNodeParameter('order', i, 0),
						'新排序',
						i,
						0,
						4294967295,
					);
				}
				const agentid = requireInteger(
					this,
					(this.getNodeParameter('agentid', i, 0) || this.getNodeParameter('agentid_selected', i, '')),
					'旧套件 AgentID',
					i,
					0,
					Number.MAX_SAFE_INTEGER,
				);
				if (agentid > 0) body.agentid = agentid;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/edit_corp_tag',
					body,
				);
			} else if (operation === 'delCorpTag') {
				const tagIds = stringList(
					this,
					[
						this.getNodeParameter('tag_id', i, ''),
						...parseStringIdJson(
							this,
							this.getNodeParameter('tagIdJson', i, '[]'),
							'标签ID列表 JSON',
							i,
							['tag_id', 'tagid', 'id'],
						),
					],
					'标签 ID',
					i,
				);
				const groupIds = stringList(
					this,
					[
						this.getNodeParameter('group_id', i, ''),
						...parseStringIdJson(
							this,
							this.getNodeParameter('groupIdJson', i, '[]'),
							'标签组ID列表 JSON',
							i,
							['group_id', 'groupid', 'id'],
						),
					],
					'标签组 ID',
					i,
				);
				if (tagIds.length === 0 && groupIds.length === 0) {
					fail(this, '标签 ID 和标签组 ID 不能同时为空', i);
				}

				const body: IDataObject = {};
				if (tagIds.length > 0) body.tag_id = tagIds;
				if (groupIds.length > 0) body.group_id = groupIds;
				const agentid = requireInteger(
					this,
					(this.getNodeParameter('agentid', i, 0) || this.getNodeParameter('agentid_selected', i, '')),
					'旧套件 AgentID',
					i,
					0,
					Number.MAX_SAFE_INTEGER,
				);
				if (agentid > 0) body.agentid = agentid;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/del_corp_tag',
					body,
				);
			} else if (operation === 'markTag') {
				const userid = requireText(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, ''),
					'成员 UserID',
					i,
				);
				const external_userid = requireText(
					this,
					this.getNodeParameter('external_userid', i),
					'外部联系人 UserID',
					i,
				);
				const addTags = stringList(
					this,
					[
						this.getNodeParameter('add_tag', i, ''),
						...parseStringIdJson(
							this,
							this.getNodeParameter('addTagJson', i, '[]'),
							'添加标签 JSON',
							i,
							['tag_id', 'tagid', 'id'],
						),
					],
					'添加标签',
					i,
				);
				const removeTags = stringList(
					this,
					[
						this.getNodeParameter('remove_tag', i, ''),
						...parseStringIdJson(
							this,
							this.getNodeParameter('removeTagJson', i, '[]'),
							'移除标签 JSON',
							i,
							['tag_id', 'tagid', 'id'],
						),
					],
					'移除标签',
					i,
				);
				if (addTags.length === 0 && removeTags.length === 0) {
					fail(this, '添加标签和移除标签不能同时为空', i);
				}
				const overlap = addTags.find((id) => removeTags.includes(id));
				if (overlap) fail(this, `标签 ${overlap} 不能同时添加和移除`, i);

				const body: IDataObject = { userid, external_userid };
				if (addTags.length > 0) body.add_tag = addTags;
				if (removeTags.length > 0) body.remove_tag = removeTags;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/mark_tag',
					body,
				);
			}
			// 在职继承
			else if (operation === 'transferCustomer') {
				const handover_userid = requireText(
					this,
					this.getNodeParameter('handover_userid', i, '') ||
						this.getNodeParameter('handover_userid_selected', i, ''),
					'原成员 UserID',
					i,
				);
				const takeover_userid = requireText(
					this,
					this.getNodeParameter('takeover_userid', i, '') ||
						this.getNodeParameter('takeover_userid_selected', i, ''),
					'接替成员 UserID',
					i,
				);
				if (handover_userid === takeover_userid) fail(this, '原成员和接替成员不能相同', i);
				const externalUserIds = stringList(
					this,
					[
						this.getNodeParameter('external_userid', i),
						...parseStringIdJson(
							this,
							this.getNodeParameter('externalUseridJson', i, '[]'),
							'客户列表 JSON',
							i,
							['external_userid', 'externalUserid', 'userid', 'id'],
						),
					],
					'客户 UserID 列表',
					i,
					{ minimum: 1, maximum: 100 },
				);
				const transfer_success_msg = optionalText(
					this,
					this.getNodeParameter('transfer_success_msg', i, ''),
					'转移说明',
					i,
					200,
				);

				const body: IDataObject = {
					handover_userid,
					takeover_userid,
					external_userid: externalUserIds,
				};
				if (transfer_success_msg) body.transfer_success_msg = transfer_success_msg;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/transfer_customer',
					body,
				);
			} else if (operation === 'transferResult') {
				const handover_userid = requireText(
					this,
					this.getNodeParameter('handover_userid', i, '') ||
						this.getNodeParameter('handover_userid_selected', i, ''),
					'原成员 UserID',
					i,
				);
				const takeover_userid = requireText(
					this,
					this.getNodeParameter('takeover_userid', i, '') ||
						this.getNodeParameter('takeover_userid_selected', i, ''),
					'接替成员 UserID',
					i,
				);
				if (handover_userid === takeover_userid) fail(this, '原成员和接替成员不能相同', i);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);

				const body: IDataObject = { handover_userid, takeover_userid };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/transfer_result',
					body,
				);
			} else if (operation === 'transferGroupChat') {
				const chatIdList = stringList(
					this,
					[
						this.getNodeParameter('chat_id_list', i),
						...parseStringIdJson(
							this,
							this.getNodeParameter('chatIdListJson', i, '[]'),
							'客户群ID列表 JSON',
							i,
							['chat_id', 'chatid', 'id'],
						),
					],
					'客户群 ID 列表',
					i,
					{ minimum: 1, maximum: 100 },
				);
				const new_owner = requireText(
					this,
					this.getNodeParameter('new_owner', i, '') || this.getNodeParameter('new_owner_selected', i, ''),
					'新群主 UserID',
					i,
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/onjob_transfer',
					{
						chat_id_list: chatIdList,
						new_owner,
					},
				);
			}
			// 离职继承
			else if (operation === 'getUnassignedList') {
				const page_id = requireInteger(
					this,
					this.getNodeParameter('page_id', i, 0),
					'Page ID',
					i,
					0,
					Number.MAX_SAFE_INTEGER,
				);
				const page_size = requireInteger(
					this,
					this.getNodeParameter('page_size', i, 1000),
					'每页数量',
					i,
					1,
					1000,
				);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);

				const body: IDataObject = { page_size };
				if (cursor) body.cursor = cursor;
				else body.page_id = page_id;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_unassigned_list',
					body,
				);
			} else if (operation === 'resignedTransferCustomer') {
				const handover_userid = requireText(
					this,
					this.getNodeParameter('handover_userid', i, '') ||
						this.getNodeParameter('handover_userid_selected', i, ''),
					'离职成员 UserID',
					i,
				);
				const takeover_userid = requireText(
					this,
					this.getNodeParameter('takeover_userid', i, '') ||
						this.getNodeParameter('takeover_userid_selected', i, ''),
					'接替成员 UserID',
					i,
				);
				if (handover_userid === takeover_userid) fail(this, '离职成员和接替成员不能相同', i);
				const externalUserIds = stringList(
					this,
					[
						this.getNodeParameter('external_userid', i),
						...parseStringIdJson(
							this,
							this.getNodeParameter('externalUseridJson', i, '[]'),
							'客户列表 JSON',
							i,
							['external_userid', 'externalUserid', 'userid', 'id'],
						),
					],
					'客户 UserID 列表',
					i,
					{ minimum: 1, maximum: 100 },
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/resigned/transfer_customer',
					{
						handover_userid,
						takeover_userid,
						external_userid: externalUserIds,
					},
				);
			} else if (operation === 'resignedTransferResult') {
				const handover_userid = requireText(
					this,
					this.getNodeParameter('handover_userid', i, '') ||
						this.getNodeParameter('handover_userid_selected', i, ''),
					'离职成员 UserID',
					i,
				);
				const takeover_userid = requireText(
					this,
					this.getNodeParameter('takeover_userid', i, '') ||
						this.getNodeParameter('takeover_userid_selected', i, ''),
					'接替成员 UserID',
					i,
				);
				if (handover_userid === takeover_userid) fail(this, '离职成员和接替成员不能相同', i);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);

				const body: IDataObject = { handover_userid, takeover_userid };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/resigned/transfer_result',
					body,
				);
			} else if (operation === 'resignedTransferGroupChat') {
				const chatIdList = stringList(
					this,
					[
						this.getNodeParameter('chat_id_list', i),
						...parseStringIdJson(
							this,
							this.getNodeParameter('chatIdListJson', i, '[]'),
							'客户群ID列表 JSON',
							i,
							['chat_id', 'chatid', 'id'],
						),
					],
					'客户群 ID 列表',
					i,
					{ minimum: 1, maximum: 100 },
				);
				const new_owner = requireText(
					this,
					this.getNodeParameter('new_owner', i, '') || this.getNodeParameter('new_owner_selected', i, ''),
					'新群主 UserID',
					i,
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/transfer',
					{
						chat_id_list: chatIdList,
						new_owner,
					},
				);
			}
			// 客户群管理
			else if (operation === 'getGroupChatList') {
				const status_filter = requireOption(
					this,
					this.getNodeParameter('status_filter', i, 0),
					'跟进状态',
					i,
					[0, 1, 2, 3],
				);
				const ownerFilter = stringList(
					this,
					[
						this.getNodeParameter('owner_filter', i, ''),
						this.getNodeParameter('owner_filter_selected', i, []),
						...parseUserIdJson(
							this,
							this.getNodeParameter('ownerFilterJson', i, '[]'),
							'群主列表 JSON',
							i,
						),
					],
					'群主 UserID 列表',
					i,
					{ maximum: 100 },
				);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);
				const limit = requireInteger(
					this,
					this.getNodeParameter('limit', i, 100),
					'每页数量',
					i,
					1,
					1000,
				);

				const body: IDataObject = { limit };
				if (status_filter) body.status_filter = status_filter;
				if (ownerFilter.length > 0) {
					body.owner_filter = { userid_list: ownerFilter };
				}
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/list',
					body,
				);
			} else if (operation === 'getGroupChat') {
				const chat_id = requireText(this, this.getNodeParameter('chat_id', i), '客户群 ID', i);
				const need_name = this.getNodeParameter('need_name', i, false) as boolean;

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
				const opengid = requireText(this, this.getNodeParameter('opengid', i), 'OpenGID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/opengid_to_chatid',
					{ opengid },
				);
			}
			// 联系我与客户入群方式
			else if (operation === 'addContactWay') {
				const type = requireOption(this, this.getNodeParameter('type', i), '联系方式类型', i, [1, 2]);
				const scene = requireOption(this, this.getNodeParameter('scene', i), '场景', i, [1, 2]);
				const users = stringList(
					this,
					[
						this.getNodeParameter('user', i, ''),
						this.getNodeParameter('user_selected', i, []),
						...parseUserIdJson(
							this,
							this.getNodeParameter('userJson', i, '[]'),
							'成员列表 JSON',
							i,
						),
					],
					'成员 UserID',
					i,
					{ maximum: 100 },
				);
				const parties =
					type === 2
						? integerList(
								this,
								[
									this.getNodeParameter('party', i, ''),
									this.getNodeParameter('party_selected', i, []),
									...parsePartyIdJson(
										this,
										this.getNodeParameter('partyJson', i, '[]'),
										'部门列表 JSON',
										i,
									),
								],
								'部门 ID',
								i,
								{ maximum: 100 },
							)
						: [];
				if (type === 1 && users.length !== 1) fail(this, '单人联系方式必须且只能配置 1 名成员', i);
				if (type === 2 && users.length === 0 && parties.length === 0) {
					fail(this, '多人联系方式的成员和部门不能同时为空', i);
				}
				const remark = optionalText(
					this,
					this.getNodeParameter('remark', i, ''),
					'备注',
					i,
					30,
				);
				const skip_verify = this.getNodeParameter('skip_verify', i, true) as boolean;
				const state = optionalText(
					this,
					this.getNodeParameter('state', i, ''),
					'State 参数',
					i,
					30,
				);
				const is_temp = this.getNodeParameter('is_temp', i, false) as boolean;
				const is_exclusive = this.getNodeParameter('is_exclusive', i, false) as boolean;
				const mark_source = this.getNodeParameter('mark_source', i, true) as boolean;
				if (is_temp && type !== 1) fail(this, '临时会话仅支持单人联系方式', i);

				const body: IDataObject = { type, scene, skip_verify, mark_source };
				if (users.length > 0) body.user = users;
				if (parties.length > 0) body.party = parties;
				if (remark) body.remark = remark;
				if (state) body.state = state;
				if (is_exclusive) body.is_exclusive = true;

				// 小程序联系时可设置样式
				if (scene === 1) {
					const style = requireOption(this, this.getNodeParameter('style', i, 1), '控件样式', i, [1, 2, 3]);
					if (type === 2 && style === 3) fail(this, '多人联系方式仅支持样式 1 或样式 2', i);
					body.style = style;
				}

				// 临时会话模式
				if (is_temp) {
					body.is_temp = true;
					const expires_in = requireInteger(
						this,
						this.getNodeParameter('expires_in', i, 604800),
						'二维码有效期',
						i,
						1,
						1209600,
					);
					const chat_expires_in = requireInteger(
						this,
						this.getNodeParameter('chat_expires_in', i, 86400),
						'会话有效期',
						i,
						1,
						1209600,
					);
					const unionid = optionalText(
						this,
						this.getNodeParameter('unionid', i, ''),
						'客户 UnionID',
						i,
					);
					body.expires_in = expires_in;
					body.chat_expires_in = chat_expires_in;
					if (unionid) body.unionid = unionid;

					const enableConclusions = this.getNodeParameter('enableConclusions', i, false) as boolean;
					if (enableConclusions) body.conclusions = buildConclusion(this, i);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_contact_way',
					body,
				);
			} else if (operation === 'getContactWay') {
				const config_id = requireText(this, this.getNodeParameter('config_id', i), '联系方式配置 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_contact_way',
					{ config_id },
				);
			} else if (operation === 'updateContactWay') {
				const config_id = requireText(this, this.getNodeParameter('config_id', i), '联系方式配置 ID', i);
				const body: IDataObject = { config_id };
				let updatedFields = 0;
				if (this.getNodeParameter('updateUsers', i, false) as boolean) {
					body.user = stringList(
						this,
						[
							this.getNodeParameter('user', i, ''),
							this.getNodeParameter('user_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('userJson', i, '[]'),
								'成员列表 JSON',
								i,
							),
						],
						'成员 UserID',
						i,
						{ maximum: 100 },
					);
					updatedFields++;
				}
				if (this.getNodeParameter('updateParty', i, false) as boolean) {
					body.party = integerList(
						this,
						[
							this.getNodeParameter('party', i, ''),
							this.getNodeParameter('party_selected', i, []),
							...parsePartyIdJson(
								this,
								this.getNodeParameter('partyJson', i, '[]'),
								'部门列表 JSON',
								i,
							),
						],
						'部门 ID',
						i,
						{ maximum: 100 },
					);
					updatedFields++;
				}
				if (this.getNodeParameter('updateRemark', i, false) as boolean) {
					body.remark =
						optionalText(this, this.getNodeParameter('remark', i, ''), '备注', i, 30) ?? '';
					updatedFields++;
				}
				if (this.getNodeParameter('updateSkipVerify', i, false) as boolean) {
					body.skip_verify = this.getNodeParameter('skip_verify', i, true) as boolean;
					updatedFields++;
				}
				if (this.getNodeParameter('updateStyle', i, false) as boolean) {
					body.style = requireOption(this, this.getNodeParameter('style', i, 1), '控件样式', i, [1, 2, 3]);
					updatedFields++;
				}
				if (this.getNodeParameter('updateState', i, false) as boolean) {
					body.state =
						optionalText(this, this.getNodeParameter('state', i, ''), 'State 参数', i, 30) ?? '';
					updatedFields++;
				}
				if (this.getNodeParameter('updateExpiresIn', i, false) as boolean) {
					body.expires_in = requireInteger(
						this,
						this.getNodeParameter('expires_in', i, 604800),
						'二维码有效期',
						i,
						1,
						1209600,
					);
					updatedFields++;
				}
				if (this.getNodeParameter('updateChatExpiresIn', i, false) as boolean) {
					body.chat_expires_in = requireInteger(
						this,
						this.getNodeParameter('chat_expires_in', i, 86400),
						'会话有效期',
						i,
						1,
						1209600,
					);
					updatedFields++;
				}
				if (this.getNodeParameter('updateUnionid', i, false) as boolean) {
					body.unionid =
						optionalText(this, this.getNodeParameter('unionid', i, ''), '客户 UnionID', i) ?? '';
					updatedFields++;
				}
				if (this.getNodeParameter('updateMarkSource', i, false) as boolean) {
					body.mark_source = this.getNodeParameter('mark_source', i, true) as boolean;
					updatedFields++;
				}
				if (this.getNodeParameter('updateConclusions', i, false) as boolean) {
					body.conclusions = buildConclusion(this, i);
					updatedFields++;
				}
				if (updatedFields === 0) fail(this, '至少选择一个要更新的字段', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/update_contact_way',
					body,
				);
			} else if (operation === 'delContactWay') {
				const config_id = requireText(this, this.getNodeParameter('config_id', i), '联系方式配置 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/del_contact_way',
					{ config_id },
				);
			} else if (operation === 'listContactWay') {
				const start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('start_time', i, ''),
					'创建起始时间',
					i,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('end_time', i, ''),
					'创建结束时间',
					i,
				);
				if (start_time !== undefined && end_time !== undefined && start_time > end_time) {
					fail(this, '创建起始时间不能晚于创建结束时间', i);
				}
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);
				const limit = requireInteger(
					this,
					this.getNodeParameter('limit', i, 100),
					'每页数量',
					i,
					1,
					1000,
				);

				const body: IDataObject = { limit };
				if (start_time !== undefined) body.start_time = start_time;
				if (end_time !== undefined) body.end_time = end_time;
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/list_contact_way',
					body,
				);
			} else if (operation === 'closeTempChat') {
				const userid = requireText(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, ''),
					'成员 UserID',
					i,
				);
				const external_userid = requireText(
					this,
					this.getNodeParameter('external_userid', i),
					'外部联系人 UserID',
					i,
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/close_temp_chat',
					{ userid, external_userid },
				);
			} else if (operation === 'addJoinWay') {
				const scene = requireOption(this, this.getNodeParameter('scene', i), '场景', i, [1, 2]);
				const chatIdList = stringList(
					this,
					[
						this.getNodeParameter('chat_id_list', i),
						...parseStringIdJson(
							this,
							this.getNodeParameter('chatIdListJson', i, '[]'),
							'群聊ID列表 JSON',
							i,
							['chat_id', 'chatid', 'id'],
						),
					],
					'群聊 ID 列表',
					i,
					{ minimum: 1, maximum: 5 },
				);
				const remark = optionalText(this, this.getNodeParameter('remark', i, ''), '备注', i, 30);
				const auto_create_room = this.getNodeParameter('auto_create_room', i, true) as boolean;
				const state = optionalText(
					this,
					this.getNodeParameter('state', i, ''),
					'State 参数',
					i,
					30,
				);
				const mark_source = this.getNodeParameter('mark_source', i, true) as boolean;

				const body: IDataObject = {
					scene,
					chat_id_list: chatIdList,
					auto_create_room: auto_create_room ? 1 : 0,
					mark_source,
				};
				if (remark) body.remark = remark;
				if (state) body.state = state;

				if (auto_create_room && (this.getNodeParameter('customRoomNaming', i, false) as boolean)) {
					body.room_base_name = requireText(
						this,
						this.getNodeParameter('room_base_name', i, ''),
						'群名前缀',
						i,
						40,
					);
					body.room_base_id = requireInteger(
						this,
						this.getNodeParameter('room_base_id', i, 1),
						'群起始序号',
						i,
						1,
						Number.MAX_SAFE_INTEGER,
					);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/add_join_way',
					body,
				);
			} else if (operation === 'getJoinWay') {
				const config_id = requireText(this, this.getNodeParameter('config_id', i), '进群方式配置 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/get_join_way',
					{ config_id },
				);
			} else if (operation === 'updateJoinWay') {
				const config_id = requireText(this, this.getNodeParameter('config_id', i), '进群方式配置 ID', i);
				const scene = requireOption(this, this.getNodeParameter('scene', i), '场景', i, [1, 2]);
				const chatIdList = stringList(
					this,
					[
						this.getNodeParameter('chat_id_list', i),
						...parseStringIdJson(
							this,
							this.getNodeParameter('chatIdListJson', i, '[]'),
							'群聊ID列表 JSON',
							i,
							['chat_id', 'chatid', 'id'],
						),
					],
					'群聊 ID 列表',
					i,
					{ minimum: 1, maximum: 5 },
				);

				const body: IDataObject = {
					config_id,
					scene,
					chat_id_list: chatIdList,
				};
				if (this.getNodeParameter('updateRemark', i, false) as boolean) {
					body.remark =
						optionalText(this, this.getNodeParameter('remark', i, ''), '备注', i, 30) ?? '';
				}
				if (this.getNodeParameter('updateState', i, false) as boolean) {
					body.state =
						optionalText(this, this.getNodeParameter('state', i, ''), 'State 参数', i, 30) ?? '';
				}
				if (this.getNodeParameter('updateMarkSource', i, false) as boolean) {
					body.mark_source = this.getNodeParameter('mark_source', i, true) as boolean;
				}
				if (this.getNodeParameter('updateAutoCreateRoom', i, false) as boolean) {
					const autoCreateRoom = this.getNodeParameter('auto_create_room', i, true) as boolean;
					body.auto_create_room = autoCreateRoom ? 1 : 0;
					if (autoCreateRoom && (this.getNodeParameter('customRoomNaming', i, false) as boolean)) {
						body.room_base_name = requireText(
							this,
							this.getNodeParameter('room_base_name', i, ''),
							'群名前缀',
							i,
							40,
						);
						body.room_base_id = requireInteger(
							this,
							this.getNodeParameter('room_base_id', i, 1),
							'群起始序号',
							i,
							1,
							Number.MAX_SAFE_INTEGER,
						);
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/update_join_way',
					body,
				);
			} else if (operation === 'delJoinWay') {
				const config_id = requireText(this, this.getNodeParameter('config_id', i), '进群方式配置 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/groupchat/del_join_way',
					{ config_id },
				);
			}
			// 客户朋友圈
			else if (operation === 'addMomentTask') {
				const enableVisibleRange = this.getNodeParameter('enableVisibleRange', i, false) as boolean;
				const contentType = String(this.getNodeParameter('contentType', i));
				if (!['text', 'image', 'video', 'link'].includes(contentType)) {
					fail(this, '朋友圈内容类型无效', i);
				}

				const body: IDataObject = {};

				// 构建可见范围
				if (enableVisibleRange) {
					const visible_range: IDataObject = {};
					const senderUserList = stringList(
						this,
						[
							this.getNodeParameter('sender_user_list', i, ''),
							this.getNodeParameter('sender_user_list_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('senderUserListJson', i, '[]'),
								'发表成员 JSON',
								i,
							),
						],
						'发表成员列表',
						i,
						{ maximum: 100000 },
					);
					const senderDepartmentList = integerList(
						this,
						[
							this.getNodeParameter('sender_department_list', i, ''),
							this.getNodeParameter('sender_department_list_selected', i, []),
							...parsePartyIdJson(
								this,
								this.getNodeParameter('senderDepartmentListJson', i, '[]'),
								'发表部门 JSON',
								i,
							),
						],
						'发表部门列表',
						i,
						{ maximum: 100000 },
					);

					if (senderUserList.length > 0 || senderDepartmentList.length > 0) {
						const sender_list: IDataObject = {};
						if (senderUserList.length > 0) sender_list.user_list = senderUserList;
						if (senderDepartmentList.length > 0) sender_list.department_list = senderDepartmentList;
						visible_range.sender_list = sender_list;
					}

					// 可见客户标签列表
					const enableExternalContactList = this.getNodeParameter('enableExternalContactList', i, false) as boolean;
					if (enableExternalContactList) {
						const tagList = stringList(
							this,
							[
								this.getNodeParameter('external_contact_tag_list', i, ''),
								...parseStringIdJson(
									this,
									this.getNodeParameter('externalContactTagListJson', i, '[]'),
									'可见客户标签 JSON',
									i,
									['tagid', 'tag_id', 'id'],
								),
							],
							'可见客户标签列表',
							i,
							{ minimum: 1 },
						);
						visible_range.external_contact_list = { tag_list: tagList };
					}

					if (Object.keys(visible_range).length > 0) {
						body.visible_range = visible_range;
					}
				}

				// 文本内容
				const text_content = optionalByteText(
					this,
					this.getNodeParameter('text_content', i, ''),
					'朋友圈文本',
					i,
					4000,
				);
				if (text_content && Array.from(text_content).length > 2000) {
					fail(this, '朋友圈文本不能超过 2000 个字', i);
				}
				if (text_content) {
					body.text = { content: text_content };
				}

				// 附件内容
				if (contentType === 'image') {
					const imagesJsonRaw = this.getNodeParameter('imagesJson', i, '[]');
					let imagesList: IDataObject[] = [];
					if (
						imagesJsonRaw !== undefined &&
						imagesJsonRaw !== null &&
						String(imagesJsonRaw).trim() !== ''
					) {
						let parsed: unknown = imagesJsonRaw;
						if (typeof imagesJsonRaw === 'string') {
							try {
								parsed = JSON.parse(imagesJsonRaw);
							} catch {
								fail(this, '图片列表 JSON 不是有效的 JSON', i);
							}
						}
						if (!Array.isArray(parsed)) fail(this, '图片列表 JSON 必须是数组', i);
						if (parsed.length > 0) {
							imagesList = (parsed as unknown[]).map((item) => {
								if (typeof item === 'string') return { media_id: item };
								if (item && typeof item === 'object' && !Array.isArray(item)) {
									return item as IDataObject;
								}
								fail(this, '图片列表 JSON 每项必须是 media_id 字符串或对象', i);
								return {};
							});
						}
					}
					if (imagesList.length === 0) {
						const imageCollection = this.getNodeParameter('imageCollection', i, {}) as IDataObject;
						imagesList = collectionRows(imageCollection, 'images');
					}
					if (imagesList.length < 1 || imagesList.length > 9) {
						fail(this, '图片附件数量必须为 1–9 张', i);
					}
					body.attachments = imagesList.map((img, imageIndex) => ({
							msgtype: 'image',
							image: {
								media_id: requireText(
									this,
									img.media_id,
									`第 ${imageIndex + 1} 张图片 Media ID`,
									i,
								),
							},
						}));
				} else if (contentType === 'video') {
					const video_media_id = requireText(
						this,
						this.getNodeParameter('video_media_id', i, ''),
						'视频 Media ID',
						i,
					);
					body.attachments = [{ msgtype: 'video', video: { media_id: video_media_id } }];
				} else if (contentType === 'link') {
					const title = optionalByteText(
						this,
						this.getNodeParameter('link_title', i, ''),
						'链接标题',
						i,
						128,
					);
					if (title && Array.from(title).length > 64) fail(this, '链接标题不能超过 64 个字', i);
					const url = requireText(this, this.getNodeParameter('link_url', i), '链接 URL', i);
					const media_id = requireText(
						this,
						this.getNodeParameter('link_media_id', i),
						'链接封面 Media ID',
						i,
					);
					const link: IDataObject = {};
					if (title) link.title = title;
					link.url = url;
					link.media_id = media_id;
					body.attachments = [{
						msgtype: 'link',
						link,
					}];
				}
				if (!body.text && !body.attachments) fail(this, '朋友圈文本和附件不能同时为空', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_moment_task',
					body,
				);
			} else if (operation === 'cancelMomentTask') {
				const moment_id = requireText(this, this.getNodeParameter('moment_id', i), '朋友圈 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/cancel_moment_task',
					{ moment_id },
				);
			} else if (operation === 'getMomentTaskResult') {
				const jobid = requireText(this, this.getNodeParameter('jobid', i), '异步任务 ID', i);
				if (Buffer.byteLength(jobid, 'utf8') > 64) fail(this, '异步任务 ID 不能超过 64 个字节', i);

				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/externalcontact/get_moment_task_result',
					{},
					{ jobid },
				);
			} else if (operation === 'getMomentTaskList') {
				const start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('start_time', i),
					'开始时间',
					i,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('end_time', i),
					'结束时间',
					i,
				);
				if (start_time === undefined || end_time === undefined) fail(this, '开始时间和结束时间均为必填', i);
				if (start_time > end_time) fail(this, '开始时间不能晚于结束时间', i);
				if (end_time - start_time > 30 * 86400) fail(this, '朋友圈记录时间范围不能超过 30 天', i);
				const creator = optionalText(
					this,
					this.getNodeParameter('creator', i, '') || this.getNodeParameter('creator_selected', i, ''),
					'创建人 UserID',
					i,
				);
				const filter_type = requireOption(
					this,
					this.getNodeParameter('filter_type', i, 2),
					'朋友圈类型',
					i,
					[0, 1, 2],
				);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 20), '每页数量', i, 1, 20);

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
				const moment_id = requireText(this, this.getNodeParameter('moment_id', i), '朋友圈 ID', i);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 500), '每页数量', i, 1, 1000);

				const body: IDataObject = { moment_id, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_moment_task',
					body,
				);
			} else if (operation === 'getMomentCustomerList') {
				const moment_id = requireText(this, this.getNodeParameter('moment_id', i), '朋友圈 ID', i);
				const userid = requireText(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, ''),
					'发表成员 UserID',
					i,
				);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 500), '每页数量', i, 1, 1000);

				const body: IDataObject = { moment_id, userid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_moment_customer_list',
					body,
				);
			} else if (operation === 'getMomentSendResult') {
				const moment_id = requireText(this, this.getNodeParameter('moment_id', i), '朋友圈 ID', i);
				const userid = requireText(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, ''),
					'发表成员 UserID',
					i,
				);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 3000), '每页数量', i, 1, 5000);

				const body: IDataObject = { moment_id, userid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_moment_send_result',
					body,
				);
			} else if (operation === 'getMomentComments') {
				const moment_id = requireText(this, this.getNodeParameter('moment_id', i), '朋友圈 ID', i);
				const userid = requireText(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, ''),
					'发表成员 UserID',
					i,
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_moment_comments',
					{ moment_id, userid },
				);
			}
			// 朋友圈规则组管理
			else if (operation === 'listMomentStrategy') {
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 1000), '每页数量', i, 1, 1000);

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/list',
					body,
				);
			} else if (operation === 'getMomentStrategy') {
				const strategy_id = requireInteger(
					this,
					this.getNodeParameter('strategy_id', i),
					'规则组 ID',
					i,
					1,
					Number.MAX_SAFE_INTEGER,
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/get',
					{ strategy_id },
				);
			} else if (operation === 'getMomentStrategyRange') {
				const strategy_id = requireInteger(
					this,
					this.getNodeParameter('strategy_id', i),
					'规则组 ID',
					i,
					1,
					Number.MAX_SAFE_INTEGER,
				);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 1000), '每页数量', i, 1, 1000);

				const body: IDataObject = { strategy_id, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/get_range',
					body,
				);
			} else if (operation === 'createMomentStrategy') {
				const strategy_name = requireText(this, this.getNodeParameter('strategy_name', i), '规则组名称', i);
				const parent_id = requireInteger(
					this,
					this.getNodeParameter('parent_id', i, 0),
					'父规则组 ID',
					i,
					0,
					Number.MAX_SAFE_INTEGER,
				);
				const adminList = stringList(
					this,
					[
						this.getNodeParameter('admin_list', i, ''),
						this.getNodeParameter('admin_list_selected', i, []),
						...parseUserIdJson(
							this,
							this.getNodeParameter('adminListJson', i, '[]'),
							'管理员列表 JSON',
							i,
						),
					],
					'管理员列表',
					i,
					{ minimum: 1, maximum: 20 },
				);
				const privilege_view_moment_list = this.getNodeParameter('privilege_view_moment_list', i, true) as boolean;
				const privilege_send_moment = this.getNodeParameter('privilege_send_moment', i, true) as boolean;
				const privilege_manage_moment_cover_and_sign = this.getNodeParameter('privilege_manage_moment_cover_and_sign', i, true) as boolean;
				const range = rangeNodes(
					this,
					resolveRangeCollection(this, i, 'rangeCollection', 'rangeNodesJson', '管理范围'),
					'ranges',
					'管理范围',
					i,
					{
						minimum: 1,
						maximum: 3000,
						extraUserids: [
							this.getNodeParameter('range_userids', i, ''),
							this.getNodeParameter('range_userids_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('rangeUseridsJson', i, '[]'),
								'管理范围成员 JSON',
								i,
							),
						],
						extraPartyids: [
							this.getNodeParameter('range_partyids', i, ''),
							this.getNodeParameter('range_partyids_selected', i, []),
							...parsePartyIdJson(
								this,
								this.getNodeParameter('rangePartyidsJson', i, '[]'),
								'管理范围部门 JSON',
								i,
							),
						],
					},
				);

				const body: IDataObject = {
					strategy_name,
					admin_list: adminList,
					range,
				};
				if (parent_id > 0) {
					body.parent_id = parent_id;
				} else {
					body.privilege = {
						view_moment_list: privilege_view_moment_list,
						send_moment: privilege_send_moment,
						manage_moment_cover_and_sign: privilege_manage_moment_cover_and_sign,
					};
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/create',
					body,
				);
			} else if (operation === 'editMomentStrategy') {
				const strategy_id = requireInteger(
					this,
					this.getNodeParameter('strategy_id', i),
					'规则组 ID',
					i,
					1,
					Number.MAX_SAFE_INTEGER,
				);
				const updateStrategyName = this.getNodeParameter('updateStrategyName', i, false) as boolean;
				const updateAdminList = this.getNodeParameter('updateAdminList', i, false) as boolean;
				const updatePrivilege = this.getNodeParameter('updatePrivilege', i, false) as boolean;
				const rangeAdd = rangeNodes(
					this,
					resolveRangeCollection(this, i, 'rangeAddCollection', 'rangeAddNodesJson', '添加管理范围'),
					'ranges',
					'添加管理范围',
					i,
					{
						maximum: 3000,
						extraUserids: [
							this.getNodeParameter('range_add_userids', i, ''),
							this.getNodeParameter('range_add_userids_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('rangeAddUseridsJson', i, '[]'),
								'添加范围成员 JSON',
								i,
							),
						],
						extraPartyids: [
							this.getNodeParameter('range_add_partyids', i, ''),
							this.getNodeParameter('range_add_partyids_selected', i, []),
							...parsePartyIdJson(
								this,
								this.getNodeParameter('rangeAddPartyidsJson', i, '[]'),
								'添加范围部门 JSON',
								i,
							),
						],
					},
				);
				const rangeDel = rangeNodes(
					this,
					resolveRangeCollection(this, i, 'rangeDelCollection', 'rangeDelNodesJson', '删除管理范围'),
					'ranges',
					'删除管理范围',
					i,
					{
						maximum: 3000,
						extraUserids: [
							this.getNodeParameter('range_del_userids', i, ''),
							this.getNodeParameter('range_del_userids_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('rangeDelUseridsJson', i, '[]'),
								'删除范围成员 JSON',
								i,
							),
						],
						extraPartyids: [
							this.getNodeParameter('range_del_partyids', i, ''),
							this.getNodeParameter('range_del_partyids_selected', i, []),
							...parsePartyIdJson(
								this,
								this.getNodeParameter('rangeDelPartyidsJson', i, '[]'),
								'删除范围部门 JSON',
								i,
							),
						],
					},
				);
				if (rangeAdd.length + rangeDel.length > 3000) {
					fail(this, '单次添加和删除的管理范围节点合计不能超过 3000 个', i);
				}
				const deleted = new Set(
					rangeDel.map((node) => `${node.type}:${node.type === 1 ? node.userid : node.partyid}`),
				);
				const overlap = rangeAdd.find((node) =>
					deleted.has(`${node.type}:${node.type === 1 ? node.userid : node.partyid}`),
				);
				if (overlap) fail(this, '同一管理范围节点不能同时添加和删除', i);

				const body: IDataObject = { strategy_id };
				if (updateStrategyName) {
					body.strategy_name = requireText(
						this,
						this.getNodeParameter('strategy_name', i, ''),
						'规则组名称',
						i,
					);
				}

				// 更新管理员列表
				if (updateAdminList) {
					body.admin_list = stringList(
						this,
						[
							this.getNodeParameter('admin_list', i, ''),
							this.getNodeParameter('admin_list_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('adminListJson', i, '[]'),
								'管理员列表 JSON',
								i,
							),
						],
						'管理员列表',
						i,
						{ minimum: 1, maximum: 20 },
					);
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

				if (rangeAdd.length > 0) body.range_add = rangeAdd;
				if (rangeDel.length > 0) body.range_del = rangeDel;
				if (
					!updateStrategyName &&
					!updateAdminList &&
					!updatePrivilege &&
					rangeAdd.length === 0 &&
					rangeDel.length === 0
				) {
					fail(this, '至少选择一个要更新的规则组字段', i);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/edit',
					body,
				);
			} else if (operation === 'deleteMomentStrategy') {
				const strategy_id = requireInteger(
					this,
					this.getNodeParameter('strategy_id', i),
					'规则组 ID',
					i,
					1,
					Number.MAX_SAFE_INTEGER,
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/moment_strategy/del',
					{ strategy_id },
				);
			}
			// 消息推送
			else if (operation === 'addMsgTemplate') {
				const chat_type = String(this.getNodeParameter('chat_type', i, 'single'));
				if (!['single', 'group'].includes(chat_type)) fail(this, '群发任务类型无效', i);
				const sender = optionalText(
					this,
					this.getNodeParameter('sender', i, '') ||
						this.getNodeParameter('sender_selected', i, ''),
					'发送成员 UserID',
					i,
				);
				const text_content = optionalByteText(
					this,
					this.getNodeParameter('text_content', i, ''),
					'群发文本',
					i,
					4000,
				);
				const enableAttachments = this.getNodeParameter('enableAttachments', i, false) as boolean;

				const body: IDataObject = { chat_type };

				// 发送成员（群聊时必填）
				if (sender) {
					body.sender = sender;
				}

				// 单聊场景参数
				if (chat_type === 'single') {
					const externalUserIds = stringList(
						this,
						[
							this.getNodeParameter('external_userid', i, ''),
							...parseStringIdJson(
								this,
								this.getNodeParameter('externalUseridJson', i, '[]'),
								'客户列表 JSON',
								i,
								['external_userid', 'externalUserid', 'userid', 'id'],
							),
						],
						'客户 ExternalUserID 列表',
						i,
						{ maximum: 10000 },
					);
					const allow_select = this.getNodeParameter('allow_select', i, false) as boolean;
					const enableTagFilter = this.getNodeParameter('enableTagFilter', i, false) as boolean;

					if (externalUserIds.length > 0) body.external_userid = externalUserIds;

					// 是否允许成员重新选择
					if (allow_select) {
						body.allow_select = true;
					}

					// 标签过滤
					if (enableTagFilter && externalUserIds.length === 0) {
						const tagFilterGroupsJsonRaw = this.getNodeParameter('tagFilterGroupsJson', i, '[]');
						let groups: IDataObject[] = [];
						if (
							tagFilterGroupsJsonRaw !== undefined &&
							tagFilterGroupsJsonRaw !== null &&
							String(tagFilterGroupsJsonRaw).trim() !== ''
						) {
							let parsed: unknown = tagFilterGroupsJsonRaw;
							if (typeof tagFilterGroupsJsonRaw === 'string') {
								try {
									parsed = JSON.parse(tagFilterGroupsJsonRaw);
								} catch {
									fail(this, '标签过滤组 JSON 不是有效的 JSON', i);
								}
							}
							if (!Array.isArray(parsed)) fail(this, '标签过滤组 JSON 必须是数组', i);
							if (parsed.length > 0) groups = parsed as IDataObject[];
						}
						if (groups.length === 0) {
							const tagFilterGroups = this.getNodeParameter('tagFilterGroups', i, {}) as IDataObject;
							groups = collectionRows(tagFilterGroups, 'groups');
						}
						if (groups.length === 0) fail(this, '启用标签过滤后至少需要 1 个标签组', i);
						body.tag_filter = {
							group_list: groups.map((group, groupIndex) => ({
								tag_list: stringList(
									this,
									[
										group.tag_list,
										...parseStringIdJson(
											this,
											group.tag_list_json ?? '[]',
											`第 ${groupIndex + 1} 个标签组 JSON`,
											i,
											['tag_id', 'tagid', 'id'],
										),
									],
									`第 ${groupIndex + 1} 个标签组`,
									i,
									{ minimum: 1, maximum: 100 },
								),
							})),
						};
					}
					if (!sender && externalUserIds.length === 0 && !body.tag_filter) {
						fail(this, '单聊群发的发送成员、客户列表和标签过滤不能同时为空', i);
					}
				}

				// 群聊场景参数
				if (chat_type === 'group') {
					if (!sender) fail(this, '群聊群发必须填写发送成员 UserID', i);
					const chatIdList = stringList(
						this,
						[
							this.getNodeParameter('chat_id_list', i, ''),
							...parseStringIdJson(
								this,
								this.getNodeParameter('chatIdListJson', i, '[]'),
								'客户群ID列表 JSON',
								i,
								['chat_id', 'chatid', 'id'],
							),
						],
						'客户群 ID 列表',
						i,
						{ maximum: 2000 },
					);
					if (chatIdList.length > 0) body.chat_id_list = chatIdList;
				}

				// 文本内容
				if (text_content) {
					body.text = { content: text_content };
				}

				// 附件列表
				if (enableAttachments) {
					const attachmentsJsonRaw = this.getNodeParameter('attachmentsJson', i, '[]');
					let usedJson = false;
					if (
						attachmentsJsonRaw !== undefined &&
						attachmentsJsonRaw !== null &&
						String(attachmentsJsonRaw).trim() !== ''
					) {
						let parsed: unknown = attachmentsJsonRaw;
						if (typeof attachmentsJsonRaw === 'string') {
							try {
								parsed = JSON.parse(attachmentsJsonRaw);
							} catch {
								fail(this, '附件列表 JSON 不是有效的 JSON', i);
							}
						}
						if (!Array.isArray(parsed)) fail(this, '附件列表 JSON 必须是数组', i);
						if (parsed.length > 0) {
							body.attachments = parsed as IDataObject[];
							usedJson = true;
						}
					}
					if (!usedJson) {
						body.attachments = buildMessageAttachments(
							this,
							i,
							this.getNodeParameter('attachments', i, {}),
						);
					}
				}
				if (!body.text && !body.attachments) fail(this, '群发文本和附件不能同时为空', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_msg_template',
					body,
				);
			} else if (operation === 'remindGroupMsgSend') {
				const msgid = requireText(this, this.getNodeParameter('msgid', i), '群发消息 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/remind_groupmsg_send',
					{ msgid },
				);
			} else if (operation === 'cancelGroupMsgSend') {
				const msgid = requireText(this, this.getNodeParameter('msgid', i), '群发消息 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/cancel_groupmsg_send',
					{ msgid },
				);
			} else if (operation === 'getGroupMsgListV2') {
				const chat_type = String(this.getNodeParameter('chat_type', i));
				if (!['single', 'group'].includes(chat_type)) fail(this, '群发任务类型无效', i);
				const start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('start_time', i),
					'开始时间',
					i,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('end_time', i),
					'结束时间',
					i,
				);
				if (start_time === undefined || end_time === undefined) fail(this, '开始时间和结束时间均为必填', i);
				if (start_time > end_time) fail(this, '开始时间不能晚于结束时间', i);
				if (end_time - start_time > 31 * 86400) fail(this, '群发记录时间范围不能超过 1 个月', i);
				const creator = optionalText(
					this,
					this.getNodeParameter('creator', i, '') || this.getNodeParameter('creator_selected', i, ''),
					'创建人 UserID',
					i,
				);
				const filter_type = requireOption(
					this,
					this.getNodeParameter('filter_type', i, 2),
					'创建人类型',
					i,
					[0, 1, 2],
				);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 50), '每页数量', i, 1, 100);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);

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
				const msgid = requireText(this, this.getNodeParameter('msgid', i), '群发消息 ID', i);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 500), '每页数量', i, 1, 1000);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);

				const body: IDataObject = { msgid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_groupmsg_task',
					body,
				);
			} else if (operation === 'getGroupMsgSendResult') {
				const msgid = requireText(this, this.getNodeParameter('msgid', i), '群发消息 ID', i);
				const userid = requireText(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, ''),
					'发送成员 UserID',
					i,
				);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 500), '每页数量', i, 1, 1000);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '游标', i);

				const body: IDataObject = { msgid, userid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_groupmsg_send_result',
					body,
				);
			} else if (operation === 'sendWelcomeMsg') {
				const welcome_code = requireText(this, this.getNodeParameter('welcome_code', i), '欢迎语 Code', i);
				const text_content = optionalByteText(
					this,
					this.getNodeParameter('text_content', i, ''),
					'欢迎语文本',
					i,
					4000,
				);
				const enableAttachments = this.getNodeParameter('enableAttachments', i, false) as boolean;

				const body: IDataObject = { welcome_code };

				// 文本内容
				if (text_content) {
					body.text = { content: text_content };
				}

				// 附件列表（JSON 非空时覆盖表单）
				if (enableAttachments) {
					const attachmentsJson = this.getNodeParameter('attachmentsJson', i, '[]');
					let usedJson = false;
					if (
						attachmentsJson !== undefined &&
						attachmentsJson !== null &&
						String(attachmentsJson).trim() !== ''
					) {
						let parsed: unknown = attachmentsJson;
						if (typeof attachmentsJson === 'string') {
							try {
								parsed = JSON.parse(attachmentsJson);
							} catch {
								fail(this, '附件列表 JSON 不是有效的 JSON', i);
							}
						}
						if (!Array.isArray(parsed)) fail(this, '附件列表 JSON 必须是数组', i);
						if (parsed.length > 0) {
							body.attachments = parsed as IDataObject[];
							usedJson = true;
						}
					}
					if (!usedJson) {
						body.attachments = buildMessageAttachments(
							this,
							i,
							this.getNodeParameter('attachments', i, {}),
						);
					}
				}
				if (!body.text && !body.attachments) fail(this, '欢迎语文本和附件不能同时为空', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/send_welcome_msg',
					body,
				);
			} else if (operation === 'addGroupWelcomeTemplate') {
				const text_content = optionalByteText(
					this,
					this.getNodeParameter('text_content', i, ''),
					'入群欢迎语文本',
					i,
					3000,
				);
				const attachment = buildSingleWelcomeAttachment(
					this,
					i,
					this.getNodeParameter('attachmentType', i, 'none'),
				);
				const agentid = requireInteger(
					this,
					(this.getNodeParameter('agentid', i, 0) || this.getNodeParameter('agentid_selected', i, '')),
					'旧套件 AgentID',
					i,
					0,
					Number.MAX_SAFE_INTEGER,
				);
				const notify = requireOption(
					this,
					this.getNodeParameter('notify', i, 1),
					'是否通知成员',
					i,
					[0, 1],
				);

				const body: IDataObject = { ...attachment, notify };

				// 文本内容
				if (text_content) {
					body.text = { content: text_content };
				}

				if (agentid) body.agentid = agentid;
				if (!body.text && Object.keys(attachment).length === 0) {
					fail(this, '入群欢迎语文本和附件不能同时为空', i);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/group_welcome_template/add',
					body,
				);
			} else if (operation === 'editGroupWelcomeTemplate') {
				const template_id = requireText(this, this.getNodeParameter('template_id', i), '欢迎语模板 ID', i);
				const text_content = optionalByteText(
					this,
					this.getNodeParameter('text_content', i, ''),
					'入群欢迎语文本',
					i,
					3000,
				);
				const attachment = buildSingleWelcomeAttachment(
					this,
					i,
					this.getNodeParameter('attachmentType', i, 'none'),
				);
				const agentid = requireInteger(
					this,
					(this.getNodeParameter('agentid', i, 0) || this.getNodeParameter('agentid_selected', i, '')),
					'旧套件 AgentID',
					i,
					0,
					Number.MAX_SAFE_INTEGER,
				);

				const body: IDataObject = { template_id, ...attachment };

				// 文本内容
				if (text_content) {
					body.text = { content: text_content };
				}

				if (agentid) body.agentid = agentid;
				if (!body.text && Object.keys(attachment).length === 0) {
					fail(this, '入群欢迎语文本和附件不能同时为空', i);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/group_welcome_template/edit',
					body,
				);
			} else if (operation === 'getGroupWelcomeTemplate') {
				const template_id = requireText(this, this.getNodeParameter('template_id', i), '欢迎语模板 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/group_welcome_template/get',
					{ template_id },
				);
			} else if (operation === 'delGroupWelcomeTemplate') {
				const template_id = requireText(this, this.getNodeParameter('template_id', i), '欢迎语模板 ID', i);
				const agentid = requireInteger(
					this,
					(this.getNodeParameter('agentid', i, 0) || this.getNodeParameter('agentid_selected', i, '')),
					'旧套件 AgentID',
					i,
					0,
					Number.MAX_SAFE_INTEGER,
				);

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
				const start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('start_time', i),
					'起始时间',
					i,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('end_time', i),
					'结束时间',
					i,
				);
				if (start_time === undefined || end_time === undefined) fail(this, '起始时间和结束时间均为必填', i);
				if (start_time > end_time) fail(this, '起始时间不能晚于结束时间', i);
				if (end_time - start_time > 30 * 86400) fail(this, '统计时间范围不能超过 30 天', i);
				const now = Math.floor(Date.now() / 1000);
				if (start_time < now - 180 * 86400 || end_time > now) {
					fail(this, '只能查询最近 180 天内的数据，结束时间不能晚于当前时间', i);
				}

				const body: IDataObject = { start_time, end_time };

				if (filterType === 'user') {
					body.userid = stringList(
						this,
						[
							this.getNodeParameter('userid', i, ''),
							this.getNodeParameter('userid_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('useridJson', i, '[]'),
								'成员列表 JSON',
								i,
							),
						],
						'成员 UserID 列表',
						i,
						{ minimum: 1, maximum: 100 },
					);
				} else if (filterType === 'party') {
					body.partyid = integerList(
						this,
						[
							this.getNodeParameter('partyid', i, ''),
							this.getNodeParameter('partyid_selected', i, []),
							...parsePartyIdJson(
								this,
								this.getNodeParameter('partyidJson', i, '[]'),
								'部门列表 JSON',
								i,
							),
						],
						'部门 ID 列表',
						i,
						{ minimum: 1, maximum: 100 },
					);
				} else fail(this, '筛选类型无效', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_user_behavior_data',
					body,
				);
			} else if (operation === 'getGroupChatStatistic') {
				const statistic_type = this.getNodeParameter('statistic_type', i, 'by_owner') as string;
				const day_begin_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('day_begin_time', i),
					'起始日期',
					i,
				);
				const day_end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('day_end_time', i, ''),
					'结束日期',
					i,
				);
				if (day_begin_time === undefined) fail(this, '起始日期为必填', i);
				const effectiveEnd = day_end_time ?? day_begin_time;
				if (day_begin_time > effectiveEnd) fail(this, '起始日期不能晚于结束日期', i);
				if (effectiveEnd - day_begin_time > 30 * 86400) fail(this, '群聊统计时间范围不能超过 30 天', i);
				const now = Math.floor(Date.now() / 1000);
				if (day_begin_time < now - 180 * 86400 || effectiveEnd > now) {
					fail(this, '只能查询昨天至前 180 天内的数据', i);
				}
				const ownerUserids = stringList(
					this,
					[
						this.getNodeParameter('owner_userid_list', i, ''),
						this.getNodeParameter('owner_userid_list_selected', i, []),
						...parseUserIdJson(
							this,
							this.getNodeParameter('ownerUseridListJson', i, '[]'),
							'群主列表 JSON',
							i,
						),
					],
					'群主 UserID 列表',
					i,
					{ maximum: 100 },
				);

				const body: IDataObject = { day_begin_time };
				if (day_end_time) body.day_end_time = day_end_time;

				if (ownerUserids.length > 0) body.owner_filter = { userid_list: ownerUserids };

				if (statistic_type === 'by_owner') {
					const order_by = requireOption(
						this,
						this.getNodeParameter('order_by', i, 1),
						'排序方式',
						i,
						[1, 2, 3, 4],
					);
					const order_asc = this.getNodeParameter('order_asc', i, false) as boolean;
					const offset = requireInteger(
						this,
						this.getNodeParameter('offset', i, 0),
						'偏移量',
						i,
						0,
						Number.MAX_SAFE_INTEGER,
					);
					const limit = requireInteger(this, this.getNodeParameter('limit', i, 500), '每页数量', i, 1, 1000);

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
				} else if (statistic_type === 'by_day') {
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/externalcontact/groupchat/statistic_group_by_day',
						body,
					);
				} else fail(this, '统计方式无效', i);
			}
			// 商品图册
			else if (operation === 'addProductAlbum') {
				const description = requireText(this, this.getNodeParameter('description', i), '商品描述', i, 300);
				const price = requireInteger(this, this.getNodeParameter('price', i), '商品价格', i, 0, 500000);
				const product_sn = optionalByteText(this, this.getNodeParameter('product_sn', i, ''), '商品编码', i, 128);
				if (product_sn && !/^[A-Za-z0-9]+$/.test(product_sn)) fail(this, '商品编码只能包含数字和英文字母', i);
				const attachmentCollection = this.getNodeParameter('attachmentCollection', i, {}) as IDataObject;

				const body: IDataObject = {
					description,
					price,
					attachments: productImageAttachments(
						this,
						attachmentCollection,
						'商品图片',
						i,
						this.getNodeParameter('attachmentsJson', i, '[]'),
					),
				};
				if (product_sn) body.product_sn = product_sn;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/add_product_album',
					body,
				);
			} else if (operation === 'getProductAlbumList') {
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 50), '每页数量', i, 1, 100);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '分页游标', i);

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_product_album_list',
					body,
				);
			} else if (operation === 'getProductAlbum') {
				const product_id = requireText(this, this.getNodeParameter('product_id', i), '商品 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_product_album',
					{ product_id },
				);
			} else if (operation === 'updateProductAlbum') {
				const product_id = requireText(this, this.getNodeParameter('product_id', i), '商品 ID', i);
				const updateDescription = this.getNodeParameter('updateDescription', i, false) as boolean;
				const updatePrice = this.getNodeParameter('updatePrice', i, false) as boolean;
				const updateProductSn = this.getNodeParameter('updateProductSn', i, false) as boolean;
				const updateAttachments = this.getNodeParameter('updateAttachments', i, false) as boolean;

				const body: IDataObject = { product_id };
				if (updateDescription) {
					body.description = requireText(this, this.getNodeParameter('description', i, ''), '商品描述', i, 300);
				}
				if (updatePrice) {
					body.price = requireInteger(this, this.getNodeParameter('price', i, 0), '商品价格', i, 0, 500000);
				}
				if (updateProductSn) {
					const productSn = requireByteText(this, this.getNodeParameter('product_sn', i, ''), '商品编码', i, 128);
					if (!/^[A-Za-z0-9]+$/.test(productSn)) fail(this, '商品编码只能包含数字和英文字母', i);
					body.product_sn = productSn;
				}
				if (updateAttachments) {
					const attachmentCollection = this.getNodeParameter('attachmentCollection', i, {}) as IDataObject;
					body.attachments = productImageAttachments(
						this,
						attachmentCollection,
						'商品图片',
						i,
						this.getNodeParameter('attachmentsJson', i, '[]'),
					);
				}
				if (!updateDescription && !updatePrice && !updateProductSn && !updateAttachments) {
					fail(this, '至少选择一个要更新的商品字段', i);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/update_product_album',
					body,
				);
			} else if (operation === 'deleteProductAlbum') {
				const product_id = requireText(this, this.getNodeParameter('product_id', i), '商品 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/delete_product_album',
					{ product_id },
				);
			} else if (operation === 'addInterceptRule') {
				const rule_name = requireText(this, this.getNodeParameter('rule_name', i), '规则名称', i, 20);
				const word_list = interceptWordList(
					this,
					[
						this.getNodeParameter('word_list', i),
						...parseStringIdJson(
							this,
							this.getNodeParameter('wordListJson', i, '[]'),
							'敏感词列表 JSON',
							i,
							['word', 'text', 'value'],
						),
					],
					i,
				);
				const intercept_type = requireOption(this, this.getNodeParameter('intercept_type', i), '拦截方式', i, [1, 2]);
				const applicableRangeType = this.getNodeParameter('applicableRangeType', i) as string;
				const enableSemantics = this.getNodeParameter('enableSemantics', i, false) as boolean;

				const body: IDataObject = { rule_name, word_list, intercept_type };

				const applicable_range: IDataObject = {};
				if (applicableRangeType === 'user' || applicableRangeType === 'both') {
					applicable_range.user_list = stringList(
						this,
						[
							this.getNodeParameter('applicable_user_list', i, ''),
							this.getNodeParameter('applicable_user_list_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('applicableUserListJson', i, '[]'),
								'适用成员 JSON',
								i,
							),
						],
						'适用成员 UserID 列表',
						i,
						{ minimum: applicableRangeType === 'user' ? 1 : 0, maximum: 1000 },
					);
				}
				if (applicableRangeType === 'department' || applicableRangeType === 'both') {
					applicable_range.department_list = integerList(
						this,
						[
							this.getNodeParameter('applicable_department_list', i, ''),
							this.getNodeParameter('applicable_department_list_selected', i, []),
							...parsePartyIdJson(
								this,
								this.getNodeParameter('applicableDepartmentListJson', i, '[]'),
								'适用部门 JSON',
								i,
							),
						],
						'适用部门 ID 列表',
						i,
						{ minimum: applicableRangeType === 'department' ? 1 : 0, maximum: 1000 },
					);
				}
				if (!['user', 'department', 'both'].includes(applicableRangeType)) fail(this, '适用范围类型无效', i);
				const applicableNodeCount = ((applicable_range.user_list as string[] | undefined)?.length ?? 0)
					+ ((applicable_range.department_list as number[] | undefined)?.length ?? 0);
				if (applicableNodeCount < 1 || applicableNodeCount > 1000) fail(this, '适用范围节点数量必须为 1–1000 个', i);
				if ((applicable_range.user_list as string[] | undefined)?.length === 0) delete applicable_range.user_list;
				if ((applicable_range.department_list as number[] | undefined)?.length === 0) delete applicable_range.department_list;
				body.applicable_range = applicable_range;

				if (enableSemantics) {
					const semanticsList = [...new Set((this.getNodeParameter('semantics_list', i, []) as unknown[]).map(Number))];
					if (semanticsList.length < 1 || semanticsList.some((value) => ![1, 2, 3].includes(value))) {
						fail(this, '额外拦截语义规则至少选择一项，且仅支持 1、2、3', i);
					}
					body.semantics_list = semanticsList;
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
				const rule_id = requireText(this, this.getNodeParameter('rule_id', i), '规则 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_intercept_rule',
					{ rule_id },
				);
			} else if (operation === 'updateInterceptRule') {
				const rule_id = requireText(this, this.getNodeParameter('rule_id', i), '规则 ID', i);
				const updateRuleName = this.getNodeParameter('updateRuleName', i, false) as boolean;
				const updateWordList = this.getNodeParameter('updateWordList', i, false) as boolean;
				const updateInterceptType = this.getNodeParameter('updateInterceptType', i, false) as boolean;
				const updateSemantics = this.getNodeParameter('updateSemantics', i, false) as boolean;
				const enableAddRange = this.getNodeParameter('enableAddRange', i, false) as boolean;
				const enableRemoveRange = this.getNodeParameter('enableRemoveRange', i, false) as boolean;

				const body: IDataObject = { rule_id };
				if (updateRuleName) {
					body.rule_name = requireText(this, this.getNodeParameter('rule_name', i, ''), '规则名称', i, 20);
				}
				if (updateWordList) {
					body.word_list = interceptWordList(
						this,
						[
							this.getNodeParameter('word_list', i, ''),
							...parseStringIdJson(
								this,
								this.getNodeParameter('wordListJson', i, '[]'),
								'敏感词列表 JSON',
								i,
								['word', 'text', 'value'],
							),
						],
						i,
					);
				}

				// 更新拦截方式
				if (updateInterceptType) {
					body.intercept_type = requireOption(this, this.getNodeParameter('intercept_type', i), '拦截方式', i, [1, 2]);
				}

				// 更新语义规则
				if (updateSemantics) {
					const semanticsList = [...new Set((this.getNodeParameter('semantics_list', i, []) as unknown[]).map(Number))];
					if (semanticsList.some((value) => ![1, 2, 3].includes(value))) fail(this, '额外拦截语义规则仅支持 1、2、3', i);
					body.extra_rule = { semantics_list: semanticsList };
				}

				let addUsers: string[] = [];
				let addDepartments: number[] = [];
				if (enableAddRange) {
					addUsers = stringList(
						this,
						[
							this.getNodeParameter('add_user_list', i, ''),
							this.getNodeParameter('add_user_list_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('addUserListJson', i, '[]'),
								'新增成员 JSON',
								i,
							),
						],
						'新增成员 UserID 列表',
						i,
						{ maximum: 1000 },
					);
					addDepartments = integerList(
						this,
						[
							this.getNodeParameter('add_department_list', i, ''),
							this.getNodeParameter('add_department_list_selected', i, []),
							...parsePartyIdJson(
								this,
								this.getNodeParameter('addDepartmentListJson', i, '[]'),
								'新增部门 JSON',
								i,
							),
						],
						'新增部门 ID 列表',
						i,
						{ maximum: 1000 },
					);
					if (addUsers.length + addDepartments.length < 1 || addUsers.length + addDepartments.length > 1000) fail(this, '新增适用范围节点数量必须为 1–1000 个', i);
					body.add_applicable_range = {
						...(addUsers.length > 0 ? { user_list: addUsers } : {}),
						...(addDepartments.length > 0 ? { department_list: addDepartments } : {}),
					};
				}

				let removeUsers: string[] = [];
				let removeDepartments: number[] = [];
				if (enableRemoveRange) {
					removeUsers = stringList(
						this,
						[
							this.getNodeParameter('remove_user_list', i, ''),
							this.getNodeParameter('remove_user_list_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('removeUserListJson', i, '[]'),
								'删除成员 JSON',
								i,
							),
						],
						'删除成员 UserID 列表',
						i,
						{ maximum: 1000 },
					);
					removeDepartments = integerList(
						this,
						[
							this.getNodeParameter('remove_department_list', i, ''),
							this.getNodeParameter('remove_department_list_selected', i, []),
							...parsePartyIdJson(
								this,
								this.getNodeParameter('removeDepartmentListJson', i, '[]'),
								'删除部门 JSON',
								i,
							),
						],
						'删除部门 ID 列表',
						i,
						{ maximum: 1000 },
					);
					if (removeUsers.length + removeDepartments.length < 1 || removeUsers.length + removeDepartments.length > 1000) fail(this, '删除适用范围节点数量必须为 1–1000 个', i);
					body.remove_applicable_range = {
						...(removeUsers.length > 0 ? { user_list: removeUsers } : {}),
						...(removeDepartments.length > 0 ? { department_list: removeDepartments } : {}),
					};
				}
				if (addUsers.some((value) => removeUsers.includes(value)) || addDepartments.some((value) => removeDepartments.includes(value))) {
					fail(this, '同一节点不能同时新增和删除', i);
				}
				if (!updateRuleName && !updateWordList && !updateInterceptType && !updateSemantics && !enableAddRange && !enableRemoveRange) {
					fail(this, '至少选择一个要更新的敏感词规则字段', i);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/update_intercept_rule',
					body,
				);
			} else if (operation === 'deleteInterceptRule') {
				const rule_id = requireText(this, this.getNodeParameter('rule_id', i), '规则 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/del_intercept_rule',
					{ rule_id },
				);
			} else if (operation === 'uploadAttachment') {
				const attachment_type = requireOption(this, this.getNodeParameter('attachment_type', i), '附件类型', i, [1, 2]);
				const media_type = String(this.getNodeParameter('media_type', i));
				if (attachment_type === 1 && !['image', 'video'].includes(media_type)) {
					fail(this, '朋友圈附件仅支持图片或视频', i);
				}
				if (attachment_type === 2 && media_type !== 'image') fail(this, '商品图册附件仅支持图片', i);
				const binaryPropertyName = requireText(
					this,
					this.getNodeParameter('binaryPropertyName', i, 'data'),
					'二进制属性名',
					i,
				);

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
				if (buffer.length <= 5 || buffer.length > 10 * 1024 * 1024) {
					fail(this, '附件大小必须大于 5 字节且不超过 10 MB', i);
				}
				const fileName = String(binaryData.fileName ?? '').toLowerCase();
				const mimeType = String(binaryData.mimeType ?? '').toLowerCase();
				if (
					media_type === 'image'
					&& !['image/jpeg', 'image/png'].includes(mimeType)
					&& !/\.(jpe?g|png)$/i.test(fileName)
				) fail(this, '图片附件仅支持 JPG 或 PNG 格式', i);
				if (media_type === 'video' && mimeType !== 'video/mp4' && !/\.mp4$/i.test(fileName)) {
					fail(this, '视频附件仅支持 MP4 格式', i);
				}

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
									filename: binaryData.fileName || `attachment.${media_type === 'image' ? 'jpg' : 'mp4'}`,
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
				const link_id = requireText(this, this.getNodeParameter('link_id', i), '获客链接 ID', i);
				const start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('start_time', i),
					'统计起始时间',
					i,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('end_time', i),
					'统计结束时间',
					i,
				);
				if (start_time === undefined || end_time === undefined) fail(this, '统计起始时间和结束时间均为必填', i);
				if (start_time > end_time) fail(this, '统计起始时间不能晚于结束时间', i);
				if (end_time - start_time > 30 * 86400) fail(this, '获客链接统计时间范围不能超过 30 天', i);
				const now = Math.floor(Date.now() / 1000);
				if (start_time < now - 180 * 86400 || end_time > now) {
					fail(this, '只能查询最近 180 天内的数据，结束时间不能晚于当前时间', i);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/statistic',
					{ link_id, start_time, end_time },
				);
			} else if (operation === 'listCustomerAcquisitionLink') {
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '分页游标', i);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 100), '每页数量', i, 1, 100);

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/list_link',
					body,
				);
			} else if (operation === 'getCustomerAcquisitionLink') {
				const link_id = requireText(this, this.getNodeParameter('link_id', i), '获客链接 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/get',
					{ link_id },
				);
			} else if (operation === 'createCustomerAcquisitionLink') {
				const link_name = requireText(this, this.getNodeParameter('link_name', i), '链接名称', i, 30);
				const rangeType = this.getNodeParameter('rangeType', i) as string;
				const skip_verify = this.getNodeParameter('skip_verify', i, true) as boolean;
				const mark_source = this.getNodeParameter('mark_source', i, true) as boolean;
				const enablePriorityOption = this.getNodeParameter('enablePriorityOption', i, false) as boolean;

				const range: IDataObject = {};
				if (rangeType === 'user' || rangeType === 'both') {
					const users = stringList(
						this,
						[
							this.getNodeParameter('user_list', i, ''),
							this.getNodeParameter('user_list_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('userListJson', i, '[]'),
								'使用范围成员 JSON',
								i,
							),
						],
						'使用范围成员 UserID 列表',
						i,
						{
							minimum: rangeType === 'user' ? 1 : 0,
							maximum: 500,
						},
					);
					if (users.length > 0) range.user_list = users;
				}
				if (rangeType === 'department' || rangeType === 'both') {
					const departments = integerList(
						this,
						[
							this.getNodeParameter('department_list', i, ''),
							this.getNodeParameter('department_list_selected', i, []),
							...parsePartyIdJson(
								this,
								this.getNodeParameter('departmentListJson', i, '[]'),
								'使用范围部门 JSON',
								i,
							),
						],
						'使用范围部门 ID 列表',
						i,
						{
							minimum: rangeType === 'department' ? 1 : 0,
							maximum: 500,
						},
					);
					if (departments.length > 0) range.department_list = departments;
				}
				if (!['user', 'department', 'both'].includes(rangeType)) fail(this, '使用范围类型无效', i);
				const rangeNodeCount = ((range.user_list as string[] | undefined)?.length ?? 0)
					+ ((range.department_list as number[] | undefined)?.length ?? 0);
				if (rangeNodeCount < 1 || rangeNodeCount > 500) fail(this, '使用范围节点数量必须为 1–500 个', i);

				const body: IDataObject = { link_name, range, skip_verify, mark_source };

				if (enablePriorityOption) {
					const priority_type = requireOption(this, this.getNodeParameter('priority_type', i, 1), '优先分配类型', i, [1, 2]);
					const priority_option: IDataObject = { priority_type };
					if (priority_type === 2) {
						priority_option.priority_userid_list = stringList(
							this,
							[
								this.getNodeParameter('priority_userid_list', i, ''),
								this.getNodeParameter('priority_userid_list_selected', i, []),
								...parseUserIdJson(
									this,
									this.getNodeParameter('priorityUseridListJson', i, '[]'),
									'优先分配成员 JSON',
									i,
								),
							],
							'优先分配成员 UserID 列表',
							i,
							{ minimum: 1, maximum: 1000 },
						);
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
				const link_id = requireText(this, this.getNodeParameter('link_id', i), '获客链接 ID', i);
				const updateLinkName = this.getNodeParameter('updateLinkName', i, false) as boolean;
				const updateRange = this.getNodeParameter('updateRange', i, false) as boolean;
				const updateSkipVerify = this.getNodeParameter('updateSkipVerify', i, false) as boolean;
				const updateMarkSource = this.getNodeParameter('updateMarkSource', i, false) as boolean;
				const updatePriorityOption = this.getNodeParameter('updatePriorityOption', i, false) as boolean;

				const body: IDataObject = { link_id };
				if (updateLinkName) body.link_name = requireText(this, this.getNodeParameter('link_name', i, ''), '链接名称', i, 30);
				if (updateSkipVerify) body.skip_verify = this.getNodeParameter('skip_verify', i, true) as boolean;
				if (updateMarkSource) body.mark_source = this.getNodeParameter('mark_source', i, true) as boolean;

				if (updateRange) {
					const rangeType = this.getNodeParameter('rangeType', i) as string;
					const range: IDataObject = {};
					if (rangeType === 'user' || rangeType === 'both') {
						const users = stringList(
							this,
							[
								this.getNodeParameter('user_list', i, ''),
								this.getNodeParameter('user_list_selected', i, []),
								...parseUserIdJson(
									this,
									this.getNodeParameter('userListJson', i, '[]'),
									'使用范围成员 JSON',
									i,
								),
							],
							'使用范围成员 UserID 列表',
							i,
							{
								minimum: rangeType === 'user' ? 1 : 0,
								maximum: 500,
							},
						);
						if (users.length > 0) range.user_list = users;
					}
					if (rangeType === 'department' || rangeType === 'both') {
						const departments = integerList(
							this,
							[
								this.getNodeParameter('department_list', i, ''),
								this.getNodeParameter('department_list_selected', i, []),
								...parsePartyIdJson(
									this,
									this.getNodeParameter('departmentListJson', i, '[]'),
									'使用范围部门 JSON',
									i,
								),
							],
							'使用范围部门 ID 列表',
							i,
							{
								minimum: rangeType === 'department' ? 1 : 0,
								maximum: 500,
							},
						);
						if (departments.length > 0) range.department_list = departments;
					}
					if (!['user', 'department', 'both'].includes(rangeType)) fail(this, '使用范围类型无效', i);
					const rangeNodeCount = ((range.user_list as string[] | undefined)?.length ?? 0)
						+ ((range.department_list as number[] | undefined)?.length ?? 0);
					if (rangeNodeCount < 1 || rangeNodeCount > 500) fail(this, '使用范围节点数量必须为 1–500 个', i);
					body.range = range;
				}

				if (updatePriorityOption) {
					const priority_type = requireOption(this, this.getNodeParameter('priority_type', i, 1), '优先分配类型', i, [1, 2]);
					const priority_option: IDataObject = { priority_type };
					if (priority_type === 2) {
						priority_option.priority_userid_list = stringList(
							this,
							[
								this.getNodeParameter('priority_userid_list', i, ''),
								this.getNodeParameter('priority_userid_list_selected', i, []),
								...parseUserIdJson(
									this,
									this.getNodeParameter('priorityUseridListJson', i, '[]'),
									'优先分配成员 JSON',
									i,
								),
							],
							'优先分配成员 UserID 列表',
							i,
							{ minimum: 1, maximum: 1000 },
						);
					}
					body.priority_option = priority_option;
				}
				if (!updateLinkName && !updateRange && !updateSkipVerify && !updateMarkSource && !updatePriorityOption) {
					fail(this, '至少选择一个要更新的获客链接字段', i);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/update_link',
					body,
				);
			} else if (operation === 'deleteCustomerAcquisitionLink') {
				const link_id = requireText(this, this.getNodeParameter('link_id', i), '获客链接 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/delete_link',
					{ link_id },
				);
			} else if (operation === 'getCustomerAcquisitionCustomer') {
				const link_id = requireText(this, this.getNodeParameter('link_id', i), '获客链接 ID', i);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '分页游标', i);
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 1000), '每页数量', i, 1, 1000);

				const body: IDataObject = { link_id, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/customer',
					body,
				);
			} else if (operation === 'getCustomerAcquisitionChatInfo') {
				const chat_key = requireText(this, this.getNodeParameter('chat_key', i), '会话信息凭据', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/get_chat_info',
					{ chat_key },
				);
			} else if (operation === 'getServedExternalContact') {
				const limit = requireInteger(this, this.getNodeParameter('limit', i, 1000), '每页数量', i, 1, 1000);
				const cursor = optionalText(this, this.getNodeParameter('cursor', i, ''), '分页游标', i);

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/contact_list',
					body,
				);
			} else if (operation === 'createOnceKey') {
				const link_id = requireText(this, this.getNodeParameter('link_id', i), '获客链接 ID', i);
				const key_num = requireInteger(this, this.getNodeParameter('key_num', i, 100), '生成数量', i, 1, 1000);

				const body: IDataObject = { link_id, key_num };

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/customer_acquisition/create_once_key',
					body,
				);
			} else if (operation === 'sendSchoolMessage') {
				const msgtype = String(this.getNodeParameter('msgtype', i));
				if (!['text', 'image', 'voice', 'video', 'file', 'news', 'mpnews', 'miniprogram'].includes(msgtype)) {
					fail(this, '学校通知消息类型无效', i);
				}
				const agentid = requireInteger(
					this,
					(this.getNodeParameter('agentid', i, 0) || this.getNodeParameter('agentid_selected', i, '')),
					'应用 ID',
					i,
					1,
					Number.MAX_SAFE_INTEGER,
				);
				const recv_scope = requireOption(this, this.getNodeParameter('recv_scope', i, 0), '发送对象', i, [0, 1, 2]);
				const toall = this.getNodeParameter('toall', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter('enable_duplicate_check', i, false) as boolean;

				const body: IDataObject = {
					msgtype,
					agentid,
					recv_scope,
					toall: toall ? 1 : 0,
				};

				if (!toall) {
					const parentUserids = recv_scope === 1
						? []
						: stringList(
								this,
								[
									this.getNodeParameter('to_parent_userid', i, ''),
									...parseStringIdJson(
										this,
										this.getNodeParameter('toParentUseridJson', i, '[]'),
										'家长列表 JSON',
										i,
										['userid', 'user_id', 'parent_userid', 'id'],
									),
								],
								'家长 UserID 列表',
								i,
								{ maximum: 1000 },
							);
					const studentUserids = stringList(
						this,
						[
							this.getNodeParameter('to_student_userid', i, ''),
							...parseStringIdJson(
								this,
								this.getNodeParameter('toStudentUseridJson', i, '[]'),
								'学生列表 JSON',
								i,
								['userid', 'user_id', 'student_userid', 'id'],
							),
						],
						'学生 UserID 列表',
						i,
						{ maximum: 1000 },
					);
					const parties = stringList(
						this,
						[
							this.getNodeParameter('to_party', i, ''),
							...parseStringIdJson(
								this,
								this.getNodeParameter('toPartyJson', i, '[]'),
								'部门列表 JSON',
								i,
								['partyid', 'party_id', 'departmentid', 'id'],
							),
						],
						'部门 ID 列表',
						i,
						{ maximum: 100 },
					);
					if (parentUserids.length + studentUserids.length + parties.length < 1) {
						fail(this, '未发送给所有人时，家长、学生和部门列表至少填写一项', i);
					}
					if (parentUserids.length > 0) body.to_parent_userid = parentUserids;
					if (studentUserids.length > 0) body.to_student_userid = studentUserids;
					if (parties.length > 0) body.to_party = parties;
				}

				if (enable_duplicate_check) {
					body.enable_duplicate_check = 1;
					body.duplicate_check_interval = requireInteger(
						this,
						this.getNodeParameter('duplicate_check_interval', i, 1800),
						'重复消息检查时间间隔',
						i,
						1,
						14400,
					);
				} else {
					body.enable_duplicate_check = 0;
				}

				if (msgtype === 'text') {
					const content = requireByteText(this, this.getNodeParameter('content', i), '消息内容', i, 2048);
					const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
					body.text = { content };
					body.enable_id_trans = enable_id_trans ? 1 : 0;
				} else if (msgtype === 'image') {
					const media_id = requireText(this, this.getNodeParameter('media_id', i), '图片 Media ID', i);
					body.image = { media_id };
				} else if (msgtype === 'voice') {
					const media_id = requireText(this, this.getNodeParameter('media_id', i), '语音 Media ID', i);
					body.voice = { media_id };
				} else if (msgtype === 'video') {
					const media_id = requireText(this, this.getNodeParameter('media_id', i), '视频 Media ID', i);
					const title = optionalByteText(this, this.getNodeParameter('title', i, ''), '视频标题', i, 128);
					const description = optionalByteText(this, this.getNodeParameter('description', i, ''), '视频描述', i, 512);
					const videoData: IDataObject = { media_id };
					if (title) videoData.title = title;
					if (description) videoData.description = description;
					body.video = videoData;
				} else if (msgtype === 'file') {
					const media_id = requireText(this, this.getNodeParameter('media_id', i), '文件 Media ID', i);
					body.file = { media_id };
				} else if (msgtype === 'news') {
					const articlesJsonRaw = this.getNodeParameter('articlesJson', i, '[]');
					let articleRows = collectionRows(this.getNodeParameter('articles', i, {}), 'article');
					if (
						articlesJsonRaw !== undefined &&
						articlesJsonRaw !== null &&
						String(articlesJsonRaw).trim() !== ''
					) {
						let parsed: unknown = articlesJsonRaw;
						if (typeof articlesJsonRaw === 'string') {
							try {
								parsed = JSON.parse(articlesJsonRaw);
							} catch {
								fail(this, '图文列表 JSON 不是有效的 JSON', i);
							}
						}
						if (!Array.isArray(parsed)) fail(this, '图文列表 JSON 必须是数组', i);
						if (parsed.length > 0) articleRows = parsed as IDataObject[];
					}
					if (articleRows.length < 1 || articleRows.length > 8) fail(this, '图文消息数量必须为 1–8 条', i);
					const articleList = articleRows.map((article, articleIndex) => {
						const item: IDataObject = {
							title: requireByteText(this, article.title, `第 ${articleIndex + 1} 条图文的标题`, i, 128),
							url: requireText(this, article.url, `第 ${articleIndex + 1} 条图文的跳转链接`, i),
						};
						const description = optionalByteText(this, article.description, `第 ${articleIndex + 1} 条图文的描述`, i, 512);
						const picurl = optionalText(this, article.picurl, `第 ${articleIndex + 1} 条图文的图片链接`, i);
						if (description) item.description = description;
						if (picurl) item.picurl = picurl;
						return item;
					});
					const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
					body.news = { articles: articleList };
					body.enable_id_trans = enable_id_trans ? 1 : 0;
				} else if (msgtype === 'mpnews') {
					const articlesJsonRaw = this.getNodeParameter('articlesJson', i, '[]');
					let articleRows = collectionRows(this.getNodeParameter('articles', i, {}), 'article');
					if (
						articlesJsonRaw !== undefined &&
						articlesJsonRaw !== null &&
						String(articlesJsonRaw).trim() !== ''
					) {
						let parsed: unknown = articlesJsonRaw;
						if (typeof articlesJsonRaw === 'string') {
							try {
								parsed = JSON.parse(articlesJsonRaw);
							} catch {
								fail(this, '图文列表 JSON 不是有效的 JSON', i);
							}
						}
						if (!Array.isArray(parsed)) fail(this, '图文列表 JSON 必须是数组', i);
						if (parsed.length > 0) articleRows = parsed as IDataObject[];
					}
					if (articleRows.length < 1 || articleRows.length > 8) fail(this, 'Mpnews 图文数量必须为 1–8 条', i);
					const articleList = articleRows.map((article, articleIndex) => {
						const item: IDataObject = {
							title: requireByteText(this, article.title, `第 ${articleIndex + 1} 条 Mpnews 的标题`, i, 128),
							thumb_media_id: requireText(this, article.thumb_media_id, `第 ${articleIndex + 1} 条 Mpnews 的缩略图 Media ID`, i),
							content: requireByteText(this, article.content, `第 ${articleIndex + 1} 条 Mpnews 的内容`, i, 666 * 1024),
						};
						const author = optionalByteText(this, article.author, `第 ${articleIndex + 1} 条 Mpnews 的作者`, i, 64);
						const contentSourceUrl = optionalText(this, article.content_source_url, `第 ${articleIndex + 1} 条 Mpnews 的阅读原文链接`, i);
						const digest = optionalByteText(this, article.digest, `第 ${articleIndex + 1} 条 Mpnews 的摘要`, i, 512);
						if (author) item.author = author;
						if (contentSourceUrl) item.content_source_url = contentSourceUrl;
						if (digest) item.digest = digest;
						return item;
					});
					const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
					body.mpnews = { articles: articleList };
					body.enable_id_trans = enable_id_trans ? 1 : 0;
				} else if (msgtype === 'miniprogram') {
					const appid = requireText(this, this.getNodeParameter('appid', i), '小程序 AppID', i);
					const title = optionalByteText(this, this.getNodeParameter('title', i, ''), '小程序标题', i, 64);
					const thumb_media_id = requireText(this, this.getNodeParameter('thumb_media_id', i), '小程序封面 Media ID', i);
					const pagepath = requireText(this, this.getNodeParameter('pagepath', i), '小程序页面路径', i);
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
				const buildPrivilege = (): IDataObject => ({
					view_customer_list: true,
					view_customer_data: true,
					view_room_list: true,
					contact_me: true,
					join_room: true,
					share_customer: this.getNodeParameter('priv_share_customer', i, true) as boolean,
					oper_resign_customer: this.getNodeParameter('priv_oper_resign_customer', i, true) as boolean,
					oper_resign_group: this.getNodeParameter('priv_oper_resign_group', i, true) as boolean,
					send_customer_msg: this.getNodeParameter('priv_send_customer_msg', i, true) as boolean,
					edit_welcome_msg: this.getNodeParameter('priv_edit_welcome_msg', i, true) as boolean,
					view_behavior_data: this.getNodeParameter('priv_view_behavior_data', i, true) as boolean,
					view_room_data: this.getNodeParameter('priv_view_room_data', i, true) as boolean,
					send_group_msg: this.getNodeParameter('priv_send_group_msg', i, true) as boolean,
					room_deduplication: this.getNodeParameter('priv_room_deduplication', i, true) as boolean,
					rapid_reply: this.getNodeParameter('priv_rapid_reply', i, true) as boolean,
					onjob_customer_transfer: this.getNodeParameter('priv_onjob_customer_transfer', i, true) as boolean,
					edit_anti_spam_rule: this.getNodeParameter('priv_edit_anti_spam_rule', i, true) as boolean,
					export_customer_list: this.getNodeParameter('priv_export_customer_list', i, true) as boolean,
					export_customer_data: this.getNodeParameter('priv_export_customer_data', i, true) as boolean,
					export_customer_group_list: this.getNodeParameter('priv_export_customer_group_list', i, true) as boolean,
					manage_customer_tag: this.getNodeParameter('priv_manage_customer_tag', i, true) as boolean,
				});

				const strategyIdOps = [
					'externalcontactCustomerStrategyDel',
					'externalcontactCustomerStrategyEdit',
					'externalcontactCustomerStrategyGet',
					'externalcontactCustomerStrategyGetRange',
					'externalcontactAddStrategyTag',
					'externalcontactGetStrategyTagList',
				];
				if (strategyIdOps.includes(operation)) {
					const strategyId = Number(this.getNodeParameter('strategy_id', i, 0));
					if (strategyId > 0) bodyDefaults.strategy_id = strategyId;
				}

				if (operation === 'externalcontactCustomerStrategyList' || operation === 'externalcontactCustomerStrategyGetRange') {
					const cursor = optionalText(this, this.getNodeParameter('ec_cursor', i, ''), '分页游标', i);
					if (cursor) bodyDefaults.cursor = cursor;
					bodyDefaults.limit = this.getNodeParameter('ec_limit', i, 1000) as number;
				}

				if (operation === 'externalcontactCustomerStrategyCreate') {
					const parentId = this.getNodeParameter('parent_id', i, 0) as number;
					bodyDefaults.parent_id = parentId;
					bodyDefaults.strategy_name = this.getNodeParameter('strategy_name', i, '') as string;
					bodyDefaults.admin_list = [
						this.getNodeParameter('admin_list', i, ''),
						this.getNodeParameter('admin_list_selected', i, []),
						...parseUserIdJson(
							this,
							this.getNodeParameter('adminListJson', i, '[]'),
							'管理员列表 JSON',
							i,
						),
					];
					bodyDefaults.range = rangeNodes(
						this,
						resolveRangeCollection(this, i, 'rangeCollection', 'rangeNodesJson', '管理范围'),
						'ranges',
						'管理范围',
						i,
						{ minimum: 1, maximum: 100 },
					);
					if (Number(parentId) === 0) bodyDefaults.privilege = buildPrivilege();
				}

				if (operation === 'externalcontactCustomerStrategyEdit') {
					if (this.getNodeParameter('updateStrategyName', i, false) as boolean) {
						bodyDefaults.strategy_name = this.getNodeParameter('strategy_name', i, '') as string;
					}
					if (this.getNodeParameter('updateAdminList', i, false) as boolean) {
						bodyDefaults.admin_list = [
							this.getNodeParameter('admin_list', i, ''),
							this.getNodeParameter('admin_list_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('adminListJson', i, '[]'),
								'管理员列表 JSON',
								i,
							),
						];
					}
					const rangeAdd = rangeNodes(
						this,
						resolveRangeCollection(this, i, 'rangeAddCollection', 'rangeAddNodesJson', '添加管理范围'),
						'ranges',
						'添加管理范围',
						i,
						{ maximum: 100 },
					);
					const rangeDel = rangeNodes(
						this,
						resolveRangeCollection(this, i, 'rangeDelCollection', 'rangeDelNodesJson', '删除管理范围'),
						'ranges',
						'删除管理范围',
						i,
						{ maximum: 100 },
					);
					if (rangeAdd.length > 0) bodyDefaults.range_add = rangeAdd;
					if (rangeDel.length > 0) bodyDefaults.range_del = rangeDel;
					if (this.getNodeParameter('updatePrivilege', i, false) as boolean) {
						bodyDefaults.privilege = buildPrivilege();
					}
				}

				if (operation === 'externalcontactAddStrategyTag') {
					bodyDefaults.group_id = this.getNodeParameter('tag_group_id', i, '') as string;
					bodyDefaults.group_name = this.getNodeParameter('tag_group_name', i, '') as string;
					bodyDefaults.order = this.getNodeParameter('tag_group_order', i, 0) as number;
					bodyDefaults.tag = collectionRows(this.getNodeParameter('strategyTagCollection', i, {}), 'tags');
				}
				if (operation === 'externalcontactEditStrategyTag') {
					bodyDefaults.id = this.getNodeParameter('strategy_tag_id', i, '') as string;
					if (this.getNodeParameter('updateStrategyTagName', i, false) as boolean) {
						bodyDefaults.name = this.getNodeParameter('strategy_tag_name', i, '') as string;
					}
					if (this.getNodeParameter('updateStrategyTagOrder', i, false) as boolean) {
						bodyDefaults.order = this.getNodeParameter('strategy_tag_order', i, 0) as number;
					}
				}
				if (operation === 'externalcontactGetStrategyTagList' || operation === 'externalcontactDelStrategyTag') {
					bodyDefaults.tag_id = [
						this.getNodeParameter('strategy_tag_ids', i, ''),
						...parseStringIdJson(
							this,
							this.getNodeParameter('strategyTagIdsJson', i, '[]'),
							'标签 ID 列表 JSON',
							i,
							['tag_id', 'tagid', 'id'],
						),
					];
					bodyDefaults.group_id = [
						this.getNodeParameter('strategy_group_ids', i, ''),
						...parseStringIdJson(
							this,
							this.getNodeParameter('strategyGroupIdsJson', i, '[]'),
							'标签组 ID 列表 JSON',
							i,
							['group_id', 'groupid', 'id'],
						),
					];
				}
				if (operation === 'externalcontactSetSubscribeMode') {
					bodyDefaults.subscribe_mode = this.getNodeParameter('subscribe_mode', i, 1) as number;
				}
				if (operation === 'externalcontactConvertToOpenid' || operation === 'crmGetExternalContact') {
					bodyDefaults.external_userid = this.getNodeParameter('ec_external_userid', i, '') as string;
				}
				if (operation === 'crmGetExternalContactList') {
					bodyDefaults.userid =
						(this.getNodeParameter('ec_userid', i, '') as string) ||
						(this.getNodeParameter('ec_userid_selected', i, '') as string);
				}
				if (operation === 'externalcontactTransfer' || operation === 'crmTransferExternalContact') {
					bodyDefaults.external_userid = this.getNodeParameter('ec_external_userid', i, '') as string;
					bodyDefaults.handover_userid =
						(this.getNodeParameter('handover_userid', i, '') as string) ||
						(this.getNodeParameter('handover_userid_selected', i, '') as string);
					bodyDefaults.takeover_userid =
						(this.getNodeParameter('takeover_userid', i, '') as string) ||
						(this.getNodeParameter('takeover_userid_selected', i, '') as string);
				}
				if (operation === 'externalcontactGetGroupMsgResult' || operation === 'crmGetGroupMsgResult') {
					bodyDefaults.msgid = this.getNodeParameter('msgid', i, '') as string;
				}
				if (operation === 'crmGetUnassignedList') {
					const cursor = optionalText(this, this.getNodeParameter('ec_cursor', i, ''), '分页游标', i);
					if (cursor) bodyDefaults.cursor = cursor;
					bodyDefaults.page_size = this.getNodeParameter('ec_limit', i, 1000) as number;
				}
				if (operation === 'crmGetUserBehaviorData') {
					const filterType = String(this.getNodeParameter('behaviorFilterType', i, 'user'));
					if (filterType === 'user') {
						bodyDefaults.userid = [
							this.getNodeParameter('ec_userid', i, ''),
							this.getNodeParameter('ec_userid_list_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('ecUseridListJson', i, '[]'),
								'成员列表 JSON',
								i,
							),
						];
					} else {
						bodyDefaults.partyid = [
							this.getNodeParameter('behavior_partyid', i, ''),
							this.getNodeParameter('behavior_partyid_selected', i, []),
							...parsePartyIdJson(
								this,
								this.getNodeParameter('behaviorPartyidJson', i, '[]'),
								'部门列表 JSON',
								i,
							),
						];
					}
					bodyDefaults.start_time = dateTimeToUnixTimestamp(
						this,
						this.getNodeParameter('behavior_start_time', i, ''),
						'统计开始时间',
						i,
					);
					bodyDefaults.end_time = dateTimeToUnixTimestamp(
						this,
						this.getNodeParameter('behavior_end_time', i, ''),
						'统计结束时间',
						i,
					);
				}
				if (operation === 'crmAddMsgTemplate') {
					const crmMsgText = optionalByteText(this, this.getNodeParameter('crm_msg_text', i, ''), '群发文本内容', i, 4000);
					if (crmMsgText) bodyDefaults.text = { content: crmMsgText };
					bodyDefaults.external_userid = [
						this.getNodeParameter('crm_external_userid_list', i, ''),
						...parseStringIdJson(
							this,
							this.getNodeParameter('crmExternalUseridListJson', i, '[]'),
							'群发接收客户 JSON',
							i,
							['external_userid', 'externalUserid', 'userid', 'id'],
						),
					];
					bodyDefaults.sender =
						(this.getNodeParameter('crm_sender', i, '') as string) ||
						(this.getNodeParameter('crm_sender_selected', i, '') as string);
					const crm_attachments_json = this.getNodeParameter('crm_attachments_json', i, '[]') as string;
					const formAttachments = collectionRows(
						this.getNodeParameter('crmAttachmentsCollection', i, {}),
						'items',
					)
						.map((a) => {
							const msgtype = String(a.msgtype || 'image');
							const item: IDataObject = { msgtype };
							if (msgtype === 'image') {
								const image: IDataObject = {};
								if (a.media_id) image.media_id = a.media_id;
								if (a.pic_url) image.pic_url = a.pic_url;
								if (Object.keys(image).length) item.image = image;
							} else if (msgtype === 'link') {
								const link: IDataObject = {};
								if (a.title) link.title = a.title;
								if (a.desc) link.desc = a.desc;
								if (a.url) link.url = a.url;
								if (a.pic_url) link.picurl = a.pic_url;
								if (Object.keys(link).length) item.link = link;
							} else if (msgtype === 'miniprogram') {
								const mp: IDataObject = {};
								if (a.title) mp.title = a.title;
								if (a.pic_url) mp.pic_media_id = a.pic_url;
								if (a.media_id) mp.pic_media_id = a.media_id;
								if (a.appid) mp.appid = a.appid;
								if (a.page) mp.page = a.page;
								if (Object.keys(mp).length) item.miniprogram = mp;
							}
							return item;
						})
						.filter((a) => Object.keys(a).length > 1);
					if (formAttachments.length) bodyDefaults.attachments = formAttachments;
					try {
						const attachments = JSON.parse(crm_attachments_json || '[]');
						if (!Array.isArray(attachments)) fail(this, '群发附件 JSON 必须是数组', i);
						if (attachments.length) bodyDefaults.attachments = attachments;
					} catch (error) {
						if (error instanceof Error && error.name === 'NodeOperationError') throw error;
						fail(this, `群发附件 JSON 解析失败: ${(error as Error).message}`, i);
					}
				}

				const body: IDataObject = { ...bodyDefaults, ...parseRequestJson.call(this, i) };
				const maxOrder = 2 ** 32 - 1;
				const normalizeRange = (value: unknown, label: string, minimum = 0): IDataObject[] =>
					rangeNodes(this, { ranges: value }, 'ranges', label, i, { minimum, maximum: 100 });
				const normalizePrivilege = (value: unknown): IDataObject => {
					if (!value || typeof value !== 'object' || Array.isArray(value)) fail(this, '权限配置必须是对象', i);
					return {
						...(value as IDataObject),
						view_customer_list: true,
						view_customer_data: true,
						view_room_list: true,
						contact_me: true,
						join_room: true,
					};
				};
				const normalizeLegacyAttachments = (value: unknown): IDataObject[] => {
					if (!Array.isArray(value) || value.length < 1 || value.length > 9) {
						fail(this, '群发附件数量必须为 1–9 个', i);
					}
					return (value as IDataObject[]).map((attachment, attachmentIndex) => {
						const msgtype = String(attachment.msgtype ?? '');
						if (msgtype === 'image') {
							const image = attachment.image as IDataObject | undefined;
							const mediaId = optionalText(this, image?.media_id, `第 ${attachmentIndex + 1} 个图片 Media ID`, i);
							const picUrl = optionalByteText(this, image?.pic_url, `第 ${attachmentIndex + 1} 个图片 URL`, i, 2048);
							if (!mediaId && !picUrl) fail(this, `第 ${attachmentIndex + 1} 个图片必须填写 Media ID 或图片 URL`, i);
							return { msgtype, image: mediaId ? { media_id: mediaId } : { pic_url: picUrl } };
						}
						if (msgtype === 'link') {
							const link = attachment.link as IDataObject | undefined;
							const normalized: IDataObject = {
								title: requireByteText(this, link?.title, `第 ${attachmentIndex + 1} 个链接标题`, i, 128),
								url: requireByteText(this, link?.url, `第 ${attachmentIndex + 1} 个链接 URL`, i, 2048),
							};
							const desc = optionalByteText(this, link?.desc, `第 ${attachmentIndex + 1} 个链接描述`, i, 512);
							const picurl = optionalByteText(this, link?.picurl, `第 ${attachmentIndex + 1} 个链接封面 URL`, i, 2048);
							if (desc) normalized.desc = desc;
							if (picurl) normalized.picurl = picurl;
							return { msgtype, link: normalized };
						}
						if (msgtype === 'miniprogram') {
							const mini = attachment.miniprogram as IDataObject | undefined;
							return {
								msgtype,
								miniprogram: {
									title: requireByteText(this, mini?.title, `第 ${attachmentIndex + 1} 个小程序标题`, i, 64),
									pic_media_id: requireText(this, mini?.pic_media_id, `第 ${attachmentIndex + 1} 个小程序封面 Media ID`, i),
									appid: requireText(this, mini?.appid, `第 ${attachmentIndex + 1} 个小程序 AppID`, i),
									page: requireText(this, mini?.page, `第 ${attachmentIndex + 1} 个小程序页面路径`, i),
								},
							};
						}
						fail(this, `第 ${attachmentIndex + 1} 个群发附件类型无效`, i);
					});
				};

				if (operation === 'externalcontactCustomerStrategyList') {
					body.limit = requireInteger(this, body.limit ?? 1000, '每页数量', i, 1, 1000);
					const cursor = optionalText(this, body.cursor, '分页游标', i);
					if (cursor) body.cursor = cursor;
					else delete body.cursor;
				} else if (['externalcontactCustomerStrategyGet', 'externalcontactCustomerStrategyGetRange', 'externalcontactCustomerStrategyDel'].includes(operation)) {
					body.strategy_id = requireInteger(this, body.strategy_id, '规则组 ID', i, 1, Number.MAX_SAFE_INTEGER);
					if (operation === 'externalcontactCustomerStrategyGetRange') {
						body.limit = requireInteger(this, body.limit ?? 1000, '每页数量', i, 1, 1000);
					}
				} else if (operation === 'externalcontactCustomerStrategyCreate') {
					body.parent_id = requireInteger(this, body.parent_id ?? 0, '父规则组 ID', i, 0, Number.MAX_SAFE_INTEGER);
					body.strategy_name = requireText(this, body.strategy_name, '规则组名称', i);
					body.admin_list = stringList(this, body.admin_list, '管理员 UserID 列表', i, { minimum: 1, maximum: 20 });
					body.range = normalizeRange(body.range, '管理范围', 1);
					if (body.parent_id !== 0) delete body.privilege;
					else body.privilege = normalizePrivilege(body.privilege);
				} else if (operation === 'externalcontactCustomerStrategyEdit') {
					body.strategy_id = requireInteger(this, body.strategy_id, '规则组 ID', i, 1, Number.MAX_SAFE_INTEGER);
					if (body.strategy_name !== undefined) body.strategy_name = requireText(this, body.strategy_name, '规则组名称', i);
					if (body.admin_list !== undefined) body.admin_list = stringList(this, body.admin_list, '管理员 UserID 列表', i, { minimum: 1, maximum: 20 });
					if (body.privilege !== undefined) body.privilege = normalizePrivilege(body.privilege);
					const rangeAdd = body.range_add === undefined ? [] : normalizeRange(body.range_add, '添加管理范围');
					const rangeDel = body.range_del === undefined ? [] : normalizeRange(body.range_del, '删除管理范围');
					if (rangeAdd.length + rangeDel.length > 100) fail(this, '单次添加和删除的管理范围合计不能超过 100 个节点', i);
					const delKeys = new Set(rangeDel.map((node) => `${node.type}:${node.userid ?? node.partyid}`));
					if (rangeAdd.some((node) => delKeys.has(`${node.type}:${node.userid ?? node.partyid}`))) fail(this, '同一管理范围节点不能同时添加和删除', i);
					if (rangeAdd.length > 0) body.range_add = rangeAdd; else delete body.range_add;
					if (rangeDel.length > 0) body.range_del = rangeDel; else delete body.range_del;
					if (Object.keys(body).every((key) => key === 'strategy_id')) fail(this, '至少选择一个要更新的规则组字段', i);
				} else if (operation === 'externalcontactAddStrategyTag') {
					body.strategy_id = requireInteger(this, body.strategy_id, '规则组 ID', i, 1, Number.MAX_SAFE_INTEGER);
					const groupId = optionalText(this, body.group_id, '标签组 ID', i);
					if (groupId) {
						body.group_id = groupId;
						delete body.group_name;
						delete body.order;
					} else {
						delete body.group_id;
						body.group_name = requireText(this, body.group_name, '标签组名称', i, 30);
						body.order = requireInteger(this, body.order ?? 0, '标签组次序', i, 0, maxOrder);
					}
					if (!Array.isArray(body.tag) || body.tag.length < 1) fail(this, '标签列表至少需要 1 项', i);
					const tagNames = new Set<string>();
					body.tag = (body.tag as IDataObject[]).map((tag, tagIndex) => {
						const name = requireText(this, tag.name, `第 ${tagIndex + 1} 个标签名称`, i, 30);
						if (tagNames.has(name)) fail(this, `标签名称不能重复: ${name}`, i);
						tagNames.add(name);
						return { name, order: requireInteger(this, tag.order ?? 0, `第 ${tagIndex + 1} 个标签次序`, i, 0, maxOrder) };
					});
				} else if (operation === 'externalcontactEditStrategyTag') {
					body.id = requireText(this, body.id, '标签或标签组 ID', i);
					if (body.name !== undefined) body.name = requireText(this, body.name, '新名称', i, 30);
					if (body.order !== undefined) body.order = requireInteger(this, body.order, '新次序', i, 0, maxOrder);
					if (body.name === undefined && body.order === undefined) fail(this, '名称和次序至少更新一项', i);
				} else if (operation === 'externalcontactGetStrategyTagList' || operation === 'externalcontactDelStrategyTag') {
					if (body.strategy_id !== undefined) body.strategy_id = requireInteger(this, body.strategy_id, '规则组 ID', i, 1, Number.MAX_SAFE_INTEGER);
					const groupIds = stringList(this, body.group_id, '标签组 ID 列表', i);
					const tagIds = stringList(this, body.tag_id, '标签 ID 列表', i);
					if (groupIds.length > 0) {
						body.group_id = groupIds;
						if (operation === 'externalcontactGetStrategyTagList') delete body.tag_id;
					} else delete body.group_id;
					if (tagIds.length > 0 && body.tag_id !== undefined) body.tag_id = tagIds;
					else if (groupIds.length === 0) delete body.tag_id;
					if (operation === 'externalcontactDelStrategyTag' && groupIds.length + tagIds.length < 1) fail(this, '标签和标签组 ID 不能同时为空', i);
				} else if (operation === 'externalcontactSetSubscribeMode') {
					body.subscribe_mode = requireOption(this, body.subscribe_mode, '关注模式', i, [1, 2]);
				} else if (operation === 'externalcontactConvertToOpenid' || operation === 'crmGetExternalContact') {
					body.external_userid = requireText(this, body.external_userid, '外部联系人 UserID', i);
				} else if (operation === 'crmGetExternalContactList') {
					body.userid = requireText(this, body.userid, '成员 UserID', i);
				} else if (operation === 'externalcontactTransfer' || operation === 'crmTransferExternalContact') {
					body.external_userid = requireText(this, body.external_userid, '外部联系人 UserID', i);
					body.handover_userid = requireText(this, body.handover_userid, '原跟进成员 UserID', i);
					body.takeover_userid = requireText(this, body.takeover_userid, '接替成员 UserID', i);
					if (body.handover_userid === body.takeover_userid) fail(this, '原跟进成员和接替成员不能相同', i);
				} else if (operation === 'externalcontactGetGroupMsgResult' || operation === 'crmGetGroupMsgResult') {
					body.msgid = requireText(this, body.msgid, '群发消息 ID', i);
				} else if (operation === 'crmGetUnassignedList') {
					body.page_size = requireInteger(this, body.page_size ?? 1000, '每页数量', i, 1, 1000);
				} else if (operation === 'crmGetUserBehaviorData') {
					const userids = stringList(this, body.userid, '成员 UserID 列表', i, { maximum: 100 });
					const partyids = integerList(this, body.partyid, '部门 ID 列表', i, { maximum: 100 });
					if (userids.length + partyids.length < 1) fail(this, '成员和部门列表不能同时为空', i);
					if (userids.length > 0) body.userid = userids; else delete body.userid;
					if (partyids.length > 0) body.partyid = partyids; else delete body.partyid;
					const start = Number(body.start_time);
					const end = Number(body.end_time);
					if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start <= 0 || end <= 0) fail(this, '统计开始时间和结束时间均为必填', i);
					if (start > end) fail(this, '统计开始时间不能晚于结束时间', i);
					if (end - start > 30 * 86400) fail(this, '统计时间范围不能超过 30 天', i);
					const now = Math.floor(Date.now() / 1000);
					if (start < now - 180 * 86400 || end > now) fail(this, '只能查询最近 180 天内的数据', i);
				} else if (operation === 'crmAddMsgTemplate') {
					const externalUserids = stringList(this, body.external_userid, '客户 UserID 列表', i, { maximum: 10000 });
					const sender = optionalText(this, body.sender, '发送成员 UserID', i);
					if (externalUserids.length + (sender ? 1 : 0) < 1) fail(this, '客户列表和发送成员不能同时为空', i);
					if (externalUserids.length > 0) body.external_userid = externalUserids; else delete body.external_userid;
					if (sender) body.sender = sender; else delete body.sender;
					const textContent = body.text && typeof body.text === 'object' && !Array.isArray(body.text)
						? optionalByteText(this, (body.text as IDataObject).content, '群发文本内容', i, 4000)
						: undefined;
					if (textContent) body.text = { content: textContent }; else delete body.text;
					if (body.attachments !== undefined) body.attachments = normalizeLegacyAttachments(body.attachments);
					if (!textContent && body.attachments === undefined) fail(this, '群发文本和附件不能同时为空', i);
				}

				const op = externalContactExtraHttpOpsById[operation];
				response = await weComApiRequest.call(
					this,
					op.method,
					op.path,
					op.method === 'GET' ? {} : body,
					parseQueryJson.call(this, i),
				);
			} else {
				fail(this, `不支持的客户联系操作: ${operation}`, i);
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
