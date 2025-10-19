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
				const external_profile = this.getNodeParameter('external_profile', i, '{}') as string;
				if (external_profile && external_profile !== '{}') {
					body.external_profile = JSON.parse(external_profile);
				}
				const to_invite = this.getNodeParameter('to_invite', i, true) as boolean;
				body.to_invite = to_invite;

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
				const external_profile = this.getNodeParameter('external_profile', i, '') as string;
				if (external_profile && external_profile !== '{}') {
					body.external_profile = JSON.parse(external_profile);
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

				const body: IDataObject = { tagid: parseInt(tagid, 10) };
				if (userlist) body.userlist = userlist.split(',').map((id) => id.trim());
				if (partylist) body.partylist = partylist.split(',').map((id) => parseInt(id.trim(), 10));

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/tag/addtagusers', body);
			} else if (operation === 'delTagUsers') {
				const tagid = this.getNodeParameter('tagid', i) as string;
				const userlist = this.getNodeParameter('userlist', i, '') as string;
				const partylist = this.getNodeParameter('partylist', i, '') as string;

				const body: IDataObject = { tagid: parseInt(tagid, 10) };
				if (userlist) body.userlist = userlist.split(',').map((id) => id.trim());
				if (partylist) body.partylist = partylist.split(',').map((id) => parseInt(id.trim(), 10));

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/tag/deltagusers', body);
			} else if (operation === 'batchSyncUser') {
				const media_ID = this.getNodeParameter('media_ID', i) as string;
				const body: IDataObject = { media_ID };

				const callback = this.getNodeParameter('callback', i, '{}') as string;
				if (callback && callback !== '{}') {
					body.callback = JSON.parse(callback);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/batch/syncuser', body);
			} else if (operation === 'batchReplaceUser') {
				const media_ID = this.getNodeParameter('media_ID', i) as string;
				const body: IDataObject = { media_ID };

				const callback = this.getNodeParameter('callback', i, '{}') as string;
				if (callback && callback !== '{}') {
					body.callback = JSON.parse(callback);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/batch/replaceuser', body);
			} else if (operation === 'batchReplaceDepartment') {
				const media_ID = this.getNodeParameter('media_ID', i) as string;
				const body: IDataObject = { media_ID };

				const callback = this.getNodeParameter('callback', i, '{}') as string;
				if (callback && callback !== '{}') {
					body.callback = JSON.parse(callback);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/batch/replaceparty', body);
			} else if (operation === 'getAsyncResult') {
				const jobid = this.getNodeParameter('jobid', i) as string;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/batch/getresult', {}, { jobid });
			} else if (operation === 'exportSimpleUser') {
				const body: IDataObject = {};

				const encoding_aeskey = this.getNodeParameter('encoding_aeskey', i, '') as string;
				if (encoding_aeskey) body.encoding_aeskey = encoding_aeskey;
				const block_size = this.getNodeParameter('block_size', i, 100000) as number;
				if (block_size) body.block_size = block_size;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/export/simple_user', body);
			} else if (operation === 'exportUser') {
				const body: IDataObject = {};

				const encoding_aeskey = this.getNodeParameter('encoding_aeskey', i, '') as string;
				if (encoding_aeskey) body.encoding_aeskey = encoding_aeskey;
				const block_size = this.getNodeParameter('block_size', i, 100000) as number;
				if (block_size) body.block_size = block_size;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/export/user', body);
			} else if (operation === 'exportDepartment') {
				const body: IDataObject = {};

				const encoding_aeskey = this.getNodeParameter('encoding_aeskey', i, '') as string;
				if (encoding_aeskey) body.encoding_aeskey = encoding_aeskey;
				const block_size = this.getNodeParameter('block_size', i, 100000) as number;
				if (block_size) body.block_size = block_size;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/export/department', body);
			} else if (operation === 'exportTagUser') {
				const tagid = this.getNodeParameter('tagid', i) as string;
				const body: IDataObject = { tagid: parseInt(tagid, 10) };

				const encoding_aeskey = this.getNodeParameter('encoding_aeskey', i, '') as string;
				if (encoding_aeskey) body.encoding_aeskey = encoding_aeskey;
				const block_size = this.getNodeParameter('block_size', i, 100000) as number;
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

