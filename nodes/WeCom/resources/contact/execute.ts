import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeContact(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			if (operation === 'getUser') {
				const userid = this.getNodeParameter('userid', i) as string;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/user/get', {}, { userid });
			} else if (operation === 'listUsers') {
				const department_id = this.getNodeParameter('department_id', i, '1') as string;
				const fetch_child = this.getNodeParameter('fetch_child', i, false) as boolean;

				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/user/simplelist',
					{},
					{
						department_id,
						fetch_child: fetch_child ? 1 : 0,
					},
				);
			} else if (operation === 'listUsersDetail') {
				const department_id = this.getNodeParameter('department_id', i, '1') as string;
				const fetch_child = this.getNodeParameter('fetch_child', i, false) as boolean;

				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/user/list',
					{},
					{
						department_id,
						fetch_child: fetch_child ? 1 : 0,
					},
				);
			} else if (operation === 'listUserIds') {
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 1000) as number;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/user/list_id',
					{
						cursor,
						limit,
					},
				);
			} else if (operation === 'getDepartment') {
				const id = this.getNodeParameter('id', i, '') as string;
				const qs: IDataObject = {};
				if (id) {
					qs.id = id;
				}

				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/department/list', {}, qs);
			} else if (operation === 'convertToOpenid') {
				const userid = this.getNodeParameter('userid', i) as string;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/user/convert_to_openid',
					{ userid },
				);
			} else if (operation === 'convertToUserid') {
				const openid = this.getNodeParameter('openid', i) as string;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/user/convert_to_userid',
					{ openid },
				);
			} else if (operation === 'convertTmpExternalUserId') {
				const tmp_external_userid = this.getNodeParameter('tmp_external_userid', i) as string;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/externalcontact/get_by_tmp_external_userid',
					{ tmp_external_userid },
				);
			} else if (operation === 'authSucc') {
				const userid = this.getNodeParameter('userid', i) as string;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/user/authsucc', {}, { userid });
			} else if (operation === 'getTagList') {
				const tag_type = this.getNodeParameter('tag_type', i, '') as string;
				const qs: IDataObject = {};
				if (tag_type) {
					qs.tag_type = tag_type;
				}
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/tag/list', {}, qs);
			} else if (operation === 'getTag') {
				const tagid = this.getNodeParameter('tagid', i) as string;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/tag/get', {}, { tagid });
			} else if (operation === 'createUser') {
				const userid = this.getNodeParameter('userid', i) as string;
				const name = this.getNodeParameter('name', i) as string;
				const mobile = this.getNodeParameter('mobile', i, '') as string;
				const department = this.getNodeParameter('department', i) as string;
				const departmentArray = department.split(',').map((id) => parseInt(id.trim(), 10));

				const body: IDataObject = {
					userid,
					name,
					department: departmentArray,
				};

				// 可选字段
				if (mobile) body.mobile = mobile;
				const position = this.getNodeParameter('position', i, '') as string;
				if (position) body.position = position;
				const gender = this.getNodeParameter('gender', i, '0') as string;
				if (gender) body.gender = gender;
				const email = this.getNodeParameter('email', i, '') as string;
				if (email) body.email = email;
				const biz_mail = this.getNodeParameter('biz_mail', i, '') as string;
				if (biz_mail) body.biz_mail = biz_mail;
				const address = this.getNodeParameter('address', i, '') as string;
				if (address) body.address = address;
				const alias = this.getNodeParameter('alias', i, '') as string;
				if (alias) body.alias = alias;
				const telephone = this.getNodeParameter('telephone', i, '') as string;
				if (telephone) body.telephone = telephone;
				const enable = this.getNodeParameter('enable', i, 1) as number;
				body.enable = enable;
				const avatar_mediaid = this.getNodeParameter('avatar_mediaid', i, '') as string;
				if (avatar_mediaid) body.avatar_mediaid = avatar_mediaid;
				const external_corp_name = this.getNodeParameter('external_corp_name', i, '') as string;
				const wechat_channels_nickname = this.getNodeParameter(
					'wechat_channels_nickname',
					i,
					'',
				) as string;
				const externalAttrCollection = this.getNodeParameter(
					'externalAttrCollection',
					i,
					{},
				) as IDataObject;
				const external_profile = this.getNodeParameter('external_profile', i, '{}') as string;
				const profile: IDataObject = {};
				if (external_corp_name) profile.external_corp_name = external_corp_name;
				if (wechat_channels_nickname) {
					profile.wechat_channels = { nickname: wechat_channels_nickname };
				}
				const externalAttrs = ((externalAttrCollection?.attrs as IDataObject[]) || [])
					.filter((a) => a.name)
					.map((a) => {
						const type = Number(a.type) || 0;
						const item: IDataObject = { type, name: a.name };
						if (type === 0) item.text = { value: a.text_value || '' };
						if (type === 1) item.web = { title: a.web_title || '', url: a.web_url || '' };
						if (type === 2) {
							item.miniprogram = {
								appid: a.miniprogram_appid || '',
								pagepath: a.miniprogram_pagepath || '',
								title: a.miniprogram_title || '',
							};
						}
						return item;
					});
				if (externalAttrs.length) profile.external_attr = externalAttrs;
				if (external_profile && external_profile !== '{}') {
					try {
						Object.assign(profile, JSON.parse(external_profile));
					} catch {
						/* ignore */
					}
				}
				if (Object.keys(profile).length) body.external_profile = profile;
				const to_invite = this.getNodeParameter('to_invite', i, true) as boolean;
				body.to_invite = to_invite;
				const order = this.getNodeParameter('order', i, '') as string;
				if (order) {
					body.order = order.split(',').map((val) => parseInt(val.trim(), 10));
				}
				const is_leader_in_dept = this.getNodeParameter('is_leader_in_dept', i, '') as string;
				if (is_leader_in_dept) {
					body.is_leader_in_dept = is_leader_in_dept.split(',').map((val) => parseInt(val.trim(), 10));
				}
				const direct_leader = this.getNodeParameter('direct_leader', i, '') as string;
				if (direct_leader) {
					body.direct_leader = direct_leader.split(',').map((id) => id.trim());
				}
				const main_department = this.getNodeParameter('main_department', i, 0) as number;
				if (main_department) {
					body.main_department = main_department;
				}
				const extattrCollection = this.getNodeParameter('extattrCollection', i, {}) as IDataObject;
				const extAttrs = ((extattrCollection?.attrs as IDataObject[]) || [])
					.filter((a) => a.name)
					.map((a) => {
						const type = Number(a.type) || 0;
						const item: IDataObject = { type, name: a.name };
						if (type === 0) item.text = { value: a.text_value || '' };
						if (type === 1) item.web = { title: a.web_title || '', url: a.web_url || '' };
						return item;
					});
				const extattrBody: IDataObject = {};
				if (extAttrs.length) extattrBody.attrs = extAttrs;
				const extattr = this.getNodeParameter('extattr', i, '{}') as string;
				if (extattr && extattr !== '{}') {
					try {
						Object.assign(extattrBody, JSON.parse(extattr));
					} catch {
						/* ignore */
					}
				}
				if (Object.keys(extattrBody).length) body.extattr = extattrBody;
				const external_position = this.getNodeParameter('external_position', i, '') as string;
				if (external_position) {
					body.external_position = external_position;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/user/create', body);
			} else if (operation === 'updateUser') {
				const userid = this.getNodeParameter('userid', i) as string;
				const body: IDataObject = { userid };

				const name = this.getNodeParameter('name', i, '') as string;
				if (name) body.name = name;
				const mobile = this.getNodeParameter('mobile', i, '') as string;
				if (mobile) body.mobile = mobile;
				const department = this.getNodeParameter('department', i, '') as string;
				if (department) {
					body.department = department.split(',').map((id) => parseInt(id.trim(), 10));
				}
				const position = this.getNodeParameter('position', i, '') as string;
				if (position) body.position = position;
				const gender = this.getNodeParameter('gender', i, '') as string;
				if (gender) body.gender = gender;
				const email = this.getNodeParameter('email', i, '') as string;
				if (email) body.email = email;
				const biz_mail = this.getNodeParameter('biz_mail', i, '') as string;
				if (biz_mail) body.biz_mail = biz_mail;
				const address = this.getNodeParameter('address', i, '') as string;
				if (address) body.address = address;
				const alias = this.getNodeParameter('alias', i, '') as string;
				if (alias) body.alias = alias;
				const telephone = this.getNodeParameter('telephone', i, '') as string;
				if (telephone) body.telephone = telephone;
				const enable = this.getNodeParameter('enable', i, undefined) as number | undefined;
				if (enable !== undefined) body.enable = enable;
				const avatar_mediaid = this.getNodeParameter('avatar_mediaid', i, '') as string;
				if (avatar_mediaid) body.avatar_mediaid = avatar_mediaid;
				const external_corp_name = this.getNodeParameter('external_corp_name', i, '') as string;
				const wechat_channels_nickname = this.getNodeParameter(
					'wechat_channels_nickname',
					i,
					'',
				) as string;
				const externalAttrCollection = this.getNodeParameter(
					'externalAttrCollection',
					i,
					{},
				) as IDataObject;
				const external_profile = this.getNodeParameter('external_profile', i, '{}') as string;
				const profile: IDataObject = {};
				if (external_corp_name) profile.external_corp_name = external_corp_name;
				if (wechat_channels_nickname) {
					profile.wechat_channels = { nickname: wechat_channels_nickname };
				}
				const externalAttrs = ((externalAttrCollection?.attrs as IDataObject[]) || [])
					.filter((a) => a.name)
					.map((a) => {
						const type = Number(a.type) || 0;
						const item: IDataObject = { type, name: a.name };
						if (type === 0) item.text = { value: a.text_value || '' };
						if (type === 1) item.web = { title: a.web_title || '', url: a.web_url || '' };
						if (type === 2) {
							item.miniprogram = {
								appid: a.miniprogram_appid || '',
								pagepath: a.miniprogram_pagepath || '',
								title: a.miniprogram_title || '',
							};
						}
						return item;
					});
				if (externalAttrs.length) profile.external_attr = externalAttrs;
				if (external_profile && external_profile !== '{}') {
					try {
						Object.assign(profile, JSON.parse(external_profile));
					} catch {
						/* ignore */
					}
				}
				if (Object.keys(profile).length) body.external_profile = profile;
				const order = this.getNodeParameter('order', i, '') as string;
				if (order) {
					body.order = order.split(',').map((val) => parseInt(val.trim(), 10));
				}
				const is_leader_in_dept = this.getNodeParameter('is_leader_in_dept', i, '') as string;
				if (is_leader_in_dept) {
					body.is_leader_in_dept = is_leader_in_dept.split(',').map((val) => parseInt(val.trim(), 10));
				}
				const direct_leader = this.getNodeParameter('direct_leader', i, '') as string;
				if (direct_leader) {
					body.direct_leader = direct_leader.split(',').map((id) => id.trim());
				}
				const main_department = this.getNodeParameter('main_department', i, 0) as number;
				if (main_department) {
					body.main_department = main_department;
				}
				const extattrCollection = this.getNodeParameter('extattrCollection', i, {}) as IDataObject;
				const extAttrs = ((extattrCollection?.attrs as IDataObject[]) || [])
					.filter((a) => a.name)
					.map((a) => {
						const type = Number(a.type) || 0;
						const item: IDataObject = { type, name: a.name };
						if (type === 0) item.text = { value: a.text_value || '' };
						if (type === 1) item.web = { title: a.web_title || '', url: a.web_url || '' };
						return item;
					});
				const extattrBody: IDataObject = {};
				if (extAttrs.length) extattrBody.attrs = extAttrs;
				const extattr = this.getNodeParameter('extattr', i, '{}') as string;
				if (extattr && extattr !== '{}') {
					try {
						Object.assign(extattrBody, JSON.parse(extattr));
					} catch {
						/* ignore */
					}
				}
				if (Object.keys(extattrBody).length) body.extattr = extattrBody;
				const external_position = this.getNodeParameter('external_position', i, '') as string;
				if (external_position) {
					body.external_position = external_position;
				}
				const biz_mail_alias_list = this.getNodeParameter('biz_mail_alias_list', i, '') as string;
				const biz_mail_alias = this.getNodeParameter('biz_mail_alias', i, '{}') as string;
				const aliases = biz_mail_alias_list
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
				if (aliases.length) body.biz_mail_alias = { item: aliases };
				if (biz_mail_alias && biz_mail_alias !== '{}') {
					try {
						body.biz_mail_alias = JSON.parse(biz_mail_alias);
					} catch {
						/* ignore */
					}
				}
				const new_userid = this.getNodeParameter('new_userid', i, '') as string;
				if (new_userid) {
					body.new_userid = new_userid;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/user/update', body);
			} else if (operation === 'deleteUser') {
				const userid = this.getNodeParameter('userid', i) as string;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/user/delete', {}, { userid });
			} else if (operation === 'batchDeleteUser') {
				const useridlist = this.getNodeParameter('useridlist', i) as string;
				const useridArray = useridlist.split(',').map((id) => id.trim());
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/user/batchdelete', {
					useridlist: useridArray,
				});
			} else if (operation === 'getUserIdByMobile') {
				const mobile = this.getNodeParameter('mobile', i) as string;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/user/getuserid', { mobile });
			} else if (operation === 'getUserIdByEmail') {
				const email = this.getNodeParameter('email', i) as string;
				const email_type = this.getNodeParameter('email_type', i, 1) as number;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/user/get_userid_by_email', {
					email,
					email_type,
				});
			} else if (operation === 'inviteUser') {
				const user = this.getNodeParameter('user', i, '') as string;
				const party = this.getNodeParameter('party', i, '') as string;
				const tag = this.getNodeParameter('tag', i, '') as string;

				const body: IDataObject = {};
				if (user) body.user = user.split(',').map((id) => id.trim());
				if (party) body.party = party.split(',').map((id) => parseInt(id.trim(), 10));
				if (tag) body.tag = tag.split(',').map((id) => parseInt(id.trim(), 10));

				// user、party、tag三者不能同时为空
				if (!user && !party && !tag) {
					throw new Error('user、party、tag三者不能同时为空');
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/batch/invite', body);
			} else if (operation === 'getJoinQrCode') {
				const size_type = this.getNodeParameter('size_type', i, 1) as number;
				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/corp/get_join_qrcode',
					{},
					{ size_type },
				);
			} else if (operation === 'createDepartment') {
				const name = this.getNodeParameter('name', i) as string;
				const parentid = this.getNodeParameter('parentid', i, '1') as string;

				const body: IDataObject = {
					name,
					parentid: parseInt(parentid, 10),
				};

				const name_en = this.getNodeParameter('name_en', i, '') as string;
				if (name_en) body.name_en = name_en;
				const order = this.getNodeParameter('order', i, 1) as number;
				if (order) body.order = order;
				const id = this.getNodeParameter('id', i, '') as string;
				if (id) body.id = parseInt(id, 10);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/department/create', body);
			} else if (operation === 'updateDepartment') {
				const id = this.getNodeParameter('id', i) as string;
				const body: IDataObject = { id: parseInt(id, 10) };

				const name = this.getNodeParameter('name', i, '') as string;
				if (name) body.name = name;
				const name_en = this.getNodeParameter('name_en', i, '') as string;
				if (name_en) body.name_en = name_en;
				const parentid = this.getNodeParameter('parentid', i, '') as string;
				if (parentid) body.parentid = parseInt(parentid, 10);
				const order = this.getNodeParameter('order', i, undefined) as number | undefined;
				if (order !== undefined) body.order = order;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/department/update', body);
			} else if (operation === 'deleteDepartment') {
				const id = this.getNodeParameter('id', i) as string;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/department/delete', {}, { id });
			} else if (operation === 'getSubDepartmentIds') {
				const id = this.getNodeParameter('id', i, '') as string;
				const qs: IDataObject = {};
				if (id) qs.id = id;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/department/simplelist', {}, qs);
			} else if (operation === 'getDepartmentDetail') {
				const id = this.getNodeParameter('id', i) as string;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/department/get', {}, { id });
			} else if (operation === 'createTag') {
				const tagname = this.getNodeParameter('tagname', i) as string;
				const body: IDataObject = { tagname };

				const tagid = this.getNodeParameter('tagid', i, '') as string;
				if (tagid) body.tagid = parseInt(tagid, 10);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/tag/create', body);
			} else if (operation === 'updateTag') {
				const tagid = this.getNodeParameter('tagid', i) as string;
				const tagname = this.getNodeParameter('tagname', i) as string;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/tag/update', {
					tagid: parseInt(tagid, 10),
					tagname,
				});
			} else if (operation === 'deleteTag') {
				const tagid = this.getNodeParameter('tagid', i) as string;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/tag/delete', {}, { tagid });
			} else if (operation === 'addTagUsers') {
				const tagid = this.getNodeParameter('tagid', i) as string;
				const userlist = this.getNodeParameter('userlist', i, '') as string;
				const partylist = this.getNodeParameter('partylist', i, '') as string;

				// userlist、partylist不能同时为空
				if (!userlist && !partylist) {
					throw new Error('userlist、partylist不能同时为空');
				}

				const body: IDataObject = { tagid: parseInt(tagid, 10) };
				if (userlist) body.userlist = userlist.split(',').map((id) => id.trim());
				if (partylist) body.partylist = partylist.split(',').map((id) => parseInt(id.trim(), 10));

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/tag/addtagusers', body);
			} else if (operation === 'delTagUsers') {
				const tagid = this.getNodeParameter('tagid', i) as string;
				const userlist = this.getNodeParameter('userlist', i, '') as string;
				const partylist = this.getNodeParameter('partylist', i, '') as string;

				// userlist、partylist不能同时为空
				if (!userlist && !partylist) {
					throw new Error('userlist、partylist不能同时为空');
				}

				const body: IDataObject = { tagid: parseInt(tagid, 10) };
				if (userlist) body.userlist = userlist.split(',').map((id) => id.trim());
				if (partylist) body.partylist = partylist.split(',').map((id) => parseInt(id.trim(), 10));

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/tag/deltagusers', body);
			} else if (operation === 'batchSyncUser') {
				const media_ID = this.getNodeParameter('media_ID', i) as string;
				const to_invite = this.getNodeParameter('to_invite', i, true) as boolean;
				const enableCallback = this.getNodeParameter('enableCallback', i, false) as boolean;
				const body: IDataObject = { media_id: media_ID, to_invite };

				if (enableCallback) {
					const callback: IDataObject = {};
					const url = this.getNodeParameter('callback_url', i, '') as string;
					const token = this.getNodeParameter('callback_token', i, '') as string;
					const encodingaeskey = this.getNodeParameter('callback_encodingaeskey', i, '') as string;
					if (url) callback.url = url;
					if (token) callback.token = token;
					if (encodingaeskey) callback.encodingaeskey = encodingaeskey;
					if (Object.keys(callback).length > 0) body.callback = callback;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/batch/syncuser', body);
			} else if (operation === 'batchReplaceUser') {
				const media_ID = this.getNodeParameter('media_ID', i) as string;
				const to_invite = this.getNodeParameter('to_invite', i, true) as boolean;
				const enableCallback = this.getNodeParameter('enableCallback', i, false) as boolean;
				const body: IDataObject = { media_id: media_ID, to_invite };

				if (enableCallback) {
					const callback: IDataObject = {};
					const url = this.getNodeParameter('callback_url', i, '') as string;
					const token = this.getNodeParameter('callback_token', i, '') as string;
					const encodingaeskey = this.getNodeParameter('callback_encodingaeskey', i, '') as string;
					if (url) callback.url = url;
					if (token) callback.token = token;
					if (encodingaeskey) callback.encodingaeskey = encodingaeskey;
					if (Object.keys(callback).length > 0) body.callback = callback;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/batch/replaceuser', body);
			} else if (operation === 'batchReplaceDepartment') {
				const media_ID = this.getNodeParameter('media_ID', i) as string;
				const enableCallback = this.getNodeParameter('enableCallback', i, false) as boolean;
				const body: IDataObject = { media_id: media_ID };

				if (enableCallback) {
					const callback: IDataObject = {};
					const url = this.getNodeParameter('callback_url', i, '') as string;
					const token = this.getNodeParameter('callback_token', i, '') as string;
					const encodingaeskey = this.getNodeParameter('callback_encodingaeskey', i, '') as string;
					if (url) callback.url = url;
					if (token) callback.token = token;
					if (encodingaeskey) callback.encodingaeskey = encodingaeskey;
					if (Object.keys(callback).length > 0) body.callback = callback;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/batch/replaceparty', body);
			} else if (operation === 'getAsyncResult') {
				const jobid = this.getNodeParameter('jobid', i) as string;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/batch/getresult', {}, { jobid });
			} else if (operation === 'exportSimpleUser') {
				const encoding_aeskey = this.getNodeParameter('encoding_aeskey', i) as string;
				const block_size = this.getNodeParameter('block_size', i, 106) as number;
				const body: IDataObject = { encoding_aeskey };
				if (block_size) body.block_size = block_size;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/export/simple_user', body);
			} else if (operation === 'exportUser') {
				const encoding_aeskey = this.getNodeParameter('encoding_aeskey', i) as string;
				const block_size = this.getNodeParameter('block_size', i, 106) as number;
				const body: IDataObject = { encoding_aeskey };
				if (block_size) body.block_size = block_size;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/export/user', body);
			} else if (operation === 'exportDepartment') {
				const encoding_aeskey = this.getNodeParameter('encoding_aeskey', i) as string;
				const block_size = this.getNodeParameter('block_size', i, 106) as number;
				const body: IDataObject = { encoding_aeskey };
				if (block_size) body.block_size = block_size;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/export/department', body);
			} else if (operation === 'exportTagUser') {
				const tagid = this.getNodeParameter('tagid', i) as string;
				const encoding_aeskey = this.getNodeParameter('encoding_aeskey', i) as string;
				const block_size = this.getNodeParameter('block_size', i, 106) as number;
				const body: IDataObject = { tagid: parseInt(tagid, 10), encoding_aeskey };
				if (block_size) body.block_size = block_size;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/export/taguser', body);
			} else if (operation === 'getExportResult') {
				const jobid = this.getNodeParameter('jobid', i) as string;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/export/get_result', {}, { jobid });
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

