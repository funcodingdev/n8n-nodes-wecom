import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

function splitCsv(value: unknown, limit?: number): string[] {
	const source = Array.isArray(value) ? value : [value];
	const values = [
		...new Set(
			source
				.flatMap((entry) => String(entry ?? '').split(/[,，|\n\r]+/))
				.map((item) => item.trim())
				.filter(Boolean),
		),
	];
	return limit === undefined ? values : values.slice(0, limit);
}

function parseUserIdJson(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string[] {
	if (value === undefined || value === null || String(value).trim() === '') return [];
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch {
			throw new NodeOperationError(context.getNode(), `${label}不是有效的 JSON`, { itemIndex });
		}
	}
	if (!Array.isArray(parsed)) {
		throw new NodeOperationError(context.getNode(), `${label}必须是 JSON 数组`, { itemIndex });
	}
	if (parsed.length === 0) return [];
	return splitCsv(
		parsed.map((entry) => {
			if (typeof entry === 'string' || typeof entry === 'number') return entry;
			if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
				const row = entry as IDataObject;
				return row.userid ?? row.userid_selected ?? row.user_id ?? '';
			}
			return '';
		}),
	);
}

function parseIdJson(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	keys: string[],
): string[] {
	if (value === undefined || value === null || String(value).trim() === '') return [];
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch {
			throw new NodeOperationError(context.getNode(), `${label}不是有效的 JSON`, { itemIndex });
		}
	}
	if (!Array.isArray(parsed)) {
		throw new NodeOperationError(context.getNode(), `${label}必须是 JSON 数组`, { itemIndex });
	}
	if (parsed.length === 0) return [];
	return splitCsv(
		parsed.map((entry) => {
			if (typeof entry === 'string' || typeof entry === 'number') return entry;
			if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
				const row = entry as IDataObject;
				for (const key of keys) {
					if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
						return row[key];
					}
				}
			}
			return '';
		}),
	);
}

function parseIntegerCsv(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	limit?: number,
): number[] {
	const flatten = (input: unknown): string[] => {
		if (Array.isArray(input)) return input.flatMap((entry) => flatten(entry));
		return String(input ?? '')
			.split(/[,，|\n\r]+/)
			.map((entry) => entry.trim())
			.filter(Boolean);
	};
	const values = flatten(value);
	const invalid = values.find((item) => !/^\d+$/.test(item));
	if (invalid !== undefined) {
		throw new NodeOperationError(
			context.getNode(),
			`${label}必须是逗号分隔的非负整数，无效值：${invalid}`,
			{ itemIndex },
		);
	}
	const numbers = [...new Set(values.map(Number))];
	return limit === undefined ? numbers : numbers.slice(0, limit);
}

function requireAtLeastOne(
	context: IExecuteFunctions,
	values: string[],
	message: string,
	itemIndex: number,
): void {
	if (!values.some((value) => value.trim())) {
		throw new NodeOperationError(context.getNode(), message, { itemIndex });
	}
}

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
				const userid =
					(this.getNodeParameter('userid', i, '') as string) ||
					(this.getNodeParameter('userid_selected', i, '') as string);
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/user/get', {}, { userid });
			} else if (operation === 'listUsers') {
				const department_id = String(
					this.getNodeParameter('department_id', i, '1') ||
						this.getNodeParameter('department_id_selected', i, '') ||
						'1',
				).trim();
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
				const department_id = String(
					this.getNodeParameter('department_id', i, '1') ||
						this.getNodeParameter('department_id_selected', i, '') ||
						'1',
				).trim();
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
				const id = String(
					this.getNodeParameter('id', i, '') || this.getNodeParameter('id_selected', i, ''),
				).trim();
				const qs: IDataObject = {};
				if (id) {
					qs.id = id;
				}

				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/department/list', {}, qs);
			} else if (operation === 'convertToOpenid') {
				const userid =
					(this.getNodeParameter('userid', i, '') as string) ||
					(this.getNodeParameter('userid_selected', i, '') as string);
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
				const userid =
					(this.getNodeParameter('userid', i, '') as string) ||
					(this.getNodeParameter('userid_selected', i, '') as string);
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/user/authsucc', {}, { userid });
			} else if (operation === 'getTagList') {
				const tag_type = this.getNodeParameter('tag_type', i, '') as string;
				const qs: IDataObject = {};
				if (tag_type) {
					qs.tag_type = tag_type;
				}
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/tag/list', {}, qs);
			} else if (operation === 'getTag') {
				const tagid = String(this.getNodeParameter('tagid', i, '') || this.getNodeParameter('tagid_selected', i, '')).trim();
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/tag/get', {}, { tagid });
			} else if (operation === 'createUser') {
				const userid =
					(this.getNodeParameter('userid', i, '') as string) ||
					(this.getNodeParameter('userid_selected', i, '') as string);
				const name = this.getNodeParameter('name', i) as string;
				const mobile = this.getNodeParameter('mobile', i, '') as string;
				const email = this.getNodeParameter('email', i, '') as string;
				const departmentArray = parseIntegerCsv(
					this,
					[
						this.getNodeParameter('department', i, ''),
						this.getNodeParameter('department_selected', i, []),
					],
					'所属部门 ID',
					i,
					100,
				);
				requireAtLeastOne(this, [mobile, email], '请至少填写手机号或邮箱', i);

				const body: IDataObject = {
					userid,
					name,
				};
				if (departmentArray.length) body.department = departmentArray;

				// 可选字段
				if (mobile) body.mobile = mobile;
				const position = this.getNodeParameter('position', i, '') as string;
				if (position) body.position = position;
				const gender = this.getNodeParameter('gender', i, '') as string;
				if (gender) body.gender = gender;
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
					const orderValues = parseIntegerCsv(this, order, '部门排序值', i, 100);
					if (!departmentArray.length || orderValues.length !== departmentArray.length) {
						throw new NodeOperationError(
							this.getNode(),
							'部门排序值数量必须与所属部门数量一致',
							{ itemIndex: i },
						);
					}
					body.order = orderValues;
				}
				const is_leader_in_dept = this.getNodeParameter('is_leader_in_dept', i, '') as string;
				if (is_leader_in_dept) {
					const leaderValues = parseIntegerCsv(
						this,
						is_leader_in_dept,
						'部门负责人标识',
						i,
						100,
					);
					if (
						leaderValues.some((value) => value !== 0 && value !== 1) ||
						!departmentArray.length ||
						leaderValues.length !== departmentArray.length
					) {
						throw new NodeOperationError(
							this.getNode(),
							'部门负责人标识只能为 0 或 1，且数量必须与所属部门一致',
							{ itemIndex: i },
						);
					}
					body.is_leader_in_dept = leaderValues;
				}
				const direct_leader = String(
					this.getNodeParameter('direct_leader', i, '') ||
						this.getNodeParameter('direct_leader_selected', i, ''),
				).trim();
				if (direct_leader) {
					body.direct_leader = splitCsv(direct_leader, 1);
				}
				const main_department_raw =
					this.getNodeParameter('main_department', i, 0) ||
					this.getNodeParameter('main_department_selected', i, '');
				const main_department = Number(main_department_raw);
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
				const userid =
					(this.getNodeParameter('userid', i, '') as string) ||
					(this.getNodeParameter('userid_selected', i, '') as string);
				const body: IDataObject = { userid };

				const name = this.getNodeParameter('name', i, '') as string;
				if (name) body.name = name;
				const mobile = this.getNodeParameter('mobile', i, '') as string;
				if (mobile) body.mobile = mobile;
				const departmentArray = parseIntegerCsv(
					this,
					[
						this.getNodeParameter('department', i, ''),
						this.getNodeParameter('department_selected', i, []),
					],
					'所属部门 ID',
					i,
					100,
				);
				if (departmentArray.length) {
					body.department = departmentArray;
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
				const enable = this.getNodeParameter('enable', i, -1) as number;
				if (enable === 0 || enable === 1) body.enable = enable;
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
					const orderValues = parseIntegerCsv(this, order, '部门排序值', i, 100);
					if (!departmentArray.length || orderValues.length !== departmentArray.length) {
						throw new NodeOperationError(
							this.getNode(),
							'更新部门排序值时必须同时填写所属部门，且数量一致',
							{ itemIndex: i },
						);
					}
					body.order = orderValues;
				}
				const is_leader_in_dept = this.getNodeParameter('is_leader_in_dept', i, '') as string;
				if (is_leader_in_dept) {
					const leaderValues = parseIntegerCsv(
						this,
						is_leader_in_dept,
						'部门负责人标识',
						i,
						100,
					);
					if (
						leaderValues.some((value) => value !== 0 && value !== 1) ||
						!departmentArray.length ||
						leaderValues.length !== departmentArray.length
					) {
						throw new NodeOperationError(
							this.getNode(),
							'更新部门负责人时必须同时填写所属部门；标识只能为 0 或 1，且数量一致',
							{ itemIndex: i },
						);
					}
					body.is_leader_in_dept = leaderValues;
				}
				const direct_leader = String(
					this.getNodeParameter('direct_leader', i, '') ||
						this.getNodeParameter('direct_leader_selected', i, ''),
				).trim();
				if (direct_leader) {
					body.direct_leader = splitCsv(direct_leader, 1);
				}
				const main_department_raw =
					this.getNodeParameter('main_department', i, 0) ||
					this.getNodeParameter('main_department_selected', i, '');
				const main_department = Number(main_department_raw);
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
				const aliases = splitCsv(biz_mail_alias_list, 5);
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
				const userid =
					(this.getNodeParameter('userid', i, '') as string) ||
					(this.getNodeParameter('userid_selected', i, '') as string);
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/user/delete', {}, { userid });
			} else if (operation === 'batchDeleteUser') {
				const useridArray = splitCsv(
					[
						this.getNodeParameter('useridlist', i, ''),
						...(this.getNodeParameter('useridlist_selected', i, []) as string[]),
						...parseUserIdJson(
							this,
							this.getNodeParameter('useridlistJson', i, '[]'),
							'成员列表 JSON',
							i,
						),
					],
					200,
				);
				if (!useridArray.length) {
					throw new NodeOperationError(this.getNode(), '请至少填写 1 个成员 UserID', {
						itemIndex: i,
					});
				}
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
				const users = splitCsv(
					[
						this.getNodeParameter('user', i, ''),
						...(this.getNodeParameter('user_selected', i, []) as string[]),
						...parseUserIdJson(this, this.getNodeParameter('userJson', i, '[]'), '成员列表 JSON', i),
					],
					1000,
				);
				const parties = parseIntegerCsv(
					this,
					[
						this.getNodeParameter('party', i, ''),
						...(this.getNodeParameter('party_selected', i, []) as Array<string | number>),
						...parseIdJson(this, this.getNodeParameter('partyJson', i, '[]'), '部门列表 JSON', i, [
							'partyid',
							'party_id',
							'departmentid',
							'id',
						]),
					].join(','),
					'部门 ID',
					i,
					100,
				);
				const tags = parseIntegerCsv(
					this,
					[
						this.getNodeParameter('tag', i, ''),
						...(this.getNodeParameter('tag_selected', i, []) as Array<string | number>),
						...parseIdJson(this, this.getNodeParameter('tagJson', i, '[]'), '标签列表 JSON', i, [
							'tagid',
							'tag_id',
							'id',
						]),
					].join(','),
					'标签 ID',
					i,
					100,
				);

				const body: IDataObject = {};
				if (users.length) body.user = users;
				if (parties.length) body.party = parties;
				if (tags.length) body.tag = tags;

				// user、party、tag三者不能同时为空
				if (!users.length && !parties.length && !tags.length) {
					throw new NodeOperationError(
						this.getNode(),
						'请至少填写 1 个成员、部门或标签 ID',
						{ itemIndex: i },
					);
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
				const parentid = String(
					this.getNodeParameter('parentid', i, '1') ||
						this.getNodeParameter('parentid_selected', i, '') ||
						'1',
				).trim();

				const body: IDataObject = {
					name,
					parentid: parseInt(parentid, 10),
				};

				const name_en = this.getNodeParameter('name_en', i, '') as string;
				if (name_en) body.name_en = name_en;
				const order = this.getNodeParameter('order', i, 0) as number;
				if (order) body.order = order;
				const id = this.getNodeParameter('id', i, '') as string;
				if (id) body.id = parseInt(id, 10);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/department/create', body);
			} else if (operation === 'updateDepartment') {
				const id = String(
					this.getNodeParameter('id', i, '') || this.getNodeParameter('id_selected', i, ''),
				).trim();
				const body: IDataObject = { id: parseInt(id, 10) };

				const name = this.getNodeParameter('name', i, '') as string;
				if (name) body.name = name;
				const name_en = this.getNodeParameter('name_en', i, '') as string;
				if (name_en) body.name_en = name_en;
				const parentid = String(
					this.getNodeParameter('parentid', i, '') ||
						this.getNodeParameter('parentid_selected', i, ''),
				).trim();
				if (parentid) body.parentid = parseInt(parentid, 10);
				const update_order = this.getNodeParameter('update_order', i, false) as boolean;
				if (update_order) {
					body.order = this.getNodeParameter('order', i, 1) as number;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/department/update', body);
			} else if (operation === 'deleteDepartment') {
				const id = String(
					this.getNodeParameter('id', i, '') || this.getNodeParameter('id_selected', i, ''),
				).trim();
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/department/delete', {}, { id });
			} else if (operation === 'getSubDepartmentIds') {
				const id = String(
					this.getNodeParameter('id', i, '') || this.getNodeParameter('id_selected', i, ''),
				).trim();
				const qs: IDataObject = {};
				if (id) qs.id = id;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/department/simplelist', {}, qs);
			} else if (operation === 'getDepartmentDetail') {
				const id = String(
					this.getNodeParameter('id', i, '') || this.getNodeParameter('id_selected', i, ''),
				).trim();
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/department/get', {}, { id });
			} else if (operation === 'createTag') {
				const tagname = this.getNodeParameter('tagname', i) as string;
				const body: IDataObject = { tagname };

				const tagid = String(this.getNodeParameter('tagid', i, '') || this.getNodeParameter('tagid_selected', i, '')).trim();
				if (tagid) body.tagid = parseInt(tagid, 10);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/tag/create', body);
			} else if (operation === 'updateTag') {
				const tagid = String(this.getNodeParameter('tagid', i, '') || this.getNodeParameter('tagid_selected', i, '')).trim();
				const tagname = this.getNodeParameter('tagname', i) as string;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/tag/update', {
					tagid: parseInt(tagid, 10),
					tagname,
				});
			} else if (operation === 'deleteTag') {
				const tagid = String(this.getNodeParameter('tagid', i, '') || this.getNodeParameter('tagid_selected', i, '')).trim();
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/tag/delete', {}, { tagid });
			} else if (operation === 'addTagUsers') {
				const tagid = String(this.getNodeParameter('tagid', i, '') || this.getNodeParameter('tagid_selected', i, '')).trim();
				const users = splitCsv(
					[
						this.getNodeParameter('userlist', i, ''),
						...(this.getNodeParameter('userlist_selected', i, []) as string[]),
						...parseUserIdJson(
							this,
							this.getNodeParameter('userlistJson', i, '[]'),
							'成员列表 JSON',
							i,
						),
					],
					1000,
				);
				const parties = parseIntegerCsv(
					this,
					[
						this.getNodeParameter('partylist', i, ''),
						...(this.getNodeParameter('partylist_selected', i, []) as Array<string | number>),
						...parseIdJson(
							this,
							this.getNodeParameter('partylistJson', i, '[]'),
							'部门列表 JSON',
							i,
							['partyid', 'party_id', 'departmentid', 'id'],
						),
					].join(','),
					'部门 ID',
					i,
					100,
				);

				// userlist、partylist不能同时为空
				if (!users.length && !parties.length) {
					throw new NodeOperationError(
						this.getNode(),
						'请至少填写 1 个成员 UserID 或部门 ID',
						{ itemIndex: i },
					);
				}

				const body: IDataObject = { tagid: parseInt(tagid, 10) };
				if (users.length) body.userlist = users;
				if (parties.length) body.partylist = parties;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/tag/addtagusers', body);
			} else if (operation === 'delTagUsers') {
				const tagid = String(this.getNodeParameter('tagid', i, '') || this.getNodeParameter('tagid_selected', i, '')).trim();
				const users = splitCsv(
					[
						this.getNodeParameter('userlist', i, ''),
						...(this.getNodeParameter('userlist_selected', i, []) as string[]),
						...parseUserIdJson(
							this,
							this.getNodeParameter('userlistJson', i, '[]'),
							'成员列表 JSON',
							i,
						),
					],
					1000,
				);
				const parties = parseIntegerCsv(
					this,
					[
						this.getNodeParameter('partylist', i, ''),
						...(this.getNodeParameter('partylist_selected', i, []) as Array<string | number>),
						...parseIdJson(
							this,
							this.getNodeParameter('partylistJson', i, '[]'),
							'部门列表 JSON',
							i,
							['partyid', 'party_id', 'departmentid', 'id'],
						),
					].join(','),
					'部门 ID',
					i,
					100,
				);

				// userlist、partylist不能同时为空
				if (!users.length && !parties.length) {
					throw new NodeOperationError(
						this.getNode(),
						'请至少填写 1 个成员 UserID 或部门 ID',
						{ itemIndex: i },
					);
				}

				const body: IDataObject = { tagid: parseInt(tagid, 10) };
				if (users.length) body.userlist = users;
				if (parties.length) body.partylist = parties;

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
				const block_size = this.getNodeParameter('block_size', i, 1000000) as number;
				const body: IDataObject = { encoding_aeskey };
				if (block_size) body.block_size = block_size;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/export/simple_user', body);
			} else if (operation === 'exportUser') {
				const encoding_aeskey = this.getNodeParameter('encoding_aeskey', i) as string;
				const block_size = this.getNodeParameter('block_size', i, 1000000) as number;
				const body: IDataObject = { encoding_aeskey };
				if (block_size) body.block_size = block_size;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/export/user', body);
			} else if (operation === 'exportDepartment') {
				const encoding_aeskey = this.getNodeParameter('encoding_aeskey', i) as string;
				const block_size = this.getNodeParameter('block_size', i, 1000000) as number;
				const body: IDataObject = { encoding_aeskey };
				if (block_size) body.block_size = block_size;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/export/department', body);
			} else if (operation === 'exportTagUser') {
				const tagid = String(this.getNodeParameter('tagid', i, '') || this.getNodeParameter('tagid_selected', i, '')).trim();
				const encoding_aeskey = this.getNodeParameter('encoding_aeskey', i) as string;
				const block_size = this.getNodeParameter('block_size', i, 1000000) as number;
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
