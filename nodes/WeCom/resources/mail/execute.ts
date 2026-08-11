import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

function dateTimeToUnixTimestamp(dateTime: string | number): number {
	if (typeof dateTime === 'number') {
		return dateTime;
	}
	if (!dateTime || dateTime === '') {
		return 0;
	}
	return Math.floor(new Date(dateTime).getTime() / 1000);
}

function collectEmails(collection: IDataObject): string[] {
	const list: string[] = [];
	if (collection.recipients) {
		for (const r of collection.recipients as IDataObject[]) {
			if (r.email) list.push(String(r.email).trim());
		}
	}
	return list;
}

function buildRecipientObj(collection: IDataObject): IDataObject | undefined {
	const emails = collectEmails(collection);
	if (emails.length === 0) return undefined;
	return { emails };
}

function buildAttachmentList(attachmentCollection: IDataObject): IDataObject[] | undefined {
	if (!attachmentCollection.attachments) return undefined;
	const attachments = attachmentCollection.attachments as IDataObject[];
	if (attachments.length === 0) return undefined;
	return attachments
		.filter((a) => a.file_name && a.content)
		.map((a) => ({
			file_name: a.file_name,
			content: a.content,
		}));
}

function mapContentType(contentType: number | string): string {
	if (contentType === 1 || contentType === '1' || contentType === 'text') return 'text';
	return 'html';
}

function splitCsv(value: string): string[] {
	return value
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

function splitCsvNumbers(value: string): number[] {
	return splitCsv(value)
		.map((s) => Number(s))
		.filter((n) => !Number.isNaN(n));
}

export async function executeMail(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 发送邮件（应用邮箱作为发件人，由 access_token 决定）
			// https://developer.work.weixin.qq.com/document/path/97445
			if (operation === 'sendMail') {
				const subject = this.getNodeParameter('subject', i) as string;
				const toListCollection = this.getNodeParameter('toListCollection', i, {}) as IDataObject;
				const ccListCollection = this.getNodeParameter('ccListCollection', i, {}) as IDataObject;
				const bccListCollection = this.getNodeParameter('bccListCollection', i, {}) as IDataObject;
				const contentType = this.getNodeParameter('contentType', i) as number | string;
				const content = this.getNodeParameter('content', i) as string;
				const attachmentCollection = this.getNodeParameter('attachmentCollection', i, {}) as IDataObject;
				const toUserids = this.getNodeParameter('to_userids', i, '') as string;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;

				const body: IDataObject = {
					subject,
					content,
					content_type: mapContentType(contentType),
				};

				const to: IDataObject = {};
				const emails = collectEmails(toListCollection);
				if (emails.length) to.emails = emails;
				if (toUserids) to.userids = splitCsv(toUserids);
				body.to = to;

				const cc = buildRecipientObj(ccListCollection);
				if (cc) body.cc = cc;
				const bcc = buildRecipientObj(bccListCollection);
				if (bcc) body.bcc = bcc;

				const attachment_list = buildAttachmentList(attachmentCollection);
				if (attachment_list) body.attachment_list = attachment_list;
				if (enable_id_trans) body.enable_id_trans = 1;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			} else if (operation === 'sendScheduleMail') {
				// https://developer.work.weixin.qq.com/document/path/97854
				const subject = this.getNodeParameter('subject', i) as string;
				const content = this.getNodeParameter('content', i, '') as string;
				const toListCollection = this.getNodeParameter('toListCollection', i, {}) as IDataObject;
				const ccListCollection = this.getNodeParameter('ccListCollection', i, {}) as IDataObject;
				const bccListCollection = this.getNodeParameter('bccListCollection', i, {}) as IDataObject;
				const calTitle = this.getNodeParameter('calTitle', i, '') as string;
				const calStartTime = dateTimeToUnixTimestamp(
					this.getNodeParameter('calStartTime', i) as string | number,
				);
				const calEndTime = dateTimeToUnixTimestamp(
					this.getNodeParameter('calEndTime', i) as string | number,
				);
				const calLocation = this.getNodeParameter('calLocation', i, '') as string;
				const calDescription = this.getNodeParameter('calDescription', i, '') as string;
				const attachmentCollection = this.getNodeParameter('attachmentCollection', i, {}) as IDataObject;
				const toUserids = this.getNodeParameter('to_userids', i, '') as string;

				const body: IDataObject = {
					subject: subject || calTitle,
					content: content || calDescription || subject || calTitle,
				};

				const to: IDataObject = {};
				const emails = collectEmails(toListCollection);
				if (emails.length) to.emails = emails;
				if (toUserids) to.userids = splitCsv(toUserids);
				body.to = to;

				const cc = buildRecipientObj(ccListCollection);
				if (cc) body.cc = cc;
				const bcc = buildRecipientObj(bccListCollection);
				if (bcc) body.bcc = bcc;

				const schedule: IDataObject = {
					method: 'request',
					start_time: calStartTime,
					end_time: calEndTime,
				};
				if (calLocation) schedule.location = calLocation;
				body.schedule = schedule;

				const attachment_list = buildAttachmentList(attachmentCollection);
				if (attachment_list) body.attachment_list = attachment_list;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			} else if (operation === 'sendMeetingMail') {
				// https://developer.work.weixin.qq.com/document/path/97855
				const subject = this.getNodeParameter('subject', i) as string;
				const content = this.getNodeParameter('content', i, '') as string;
				const toListCollection = this.getNodeParameter('toListCollection', i, {}) as IDataObject;
				const ccListCollection = this.getNodeParameter('ccListCollection', i, {}) as IDataObject;
				const bccListCollection = this.getNodeParameter('bccListCollection', i, {}) as IDataObject;
				const meetingTitle = this.getNodeParameter('meetingTitle', i, '') as string;
				const meetingStartTime = dateTimeToUnixTimestamp(
					this.getNodeParameter('meetingStartTime', i) as string | number,
				);
				const meetingEndTime = dateTimeToUnixTimestamp(
					this.getNodeParameter('meetingEndTime', i) as string | number,
				);
				const meetingLocation = this.getNodeParameter('meetingLocation', i, '') as string;
				const meetingDescription = this.getNodeParameter('meetingDescription', i, '') as string;
				const attachmentCollection = this.getNodeParameter('attachmentCollection', i, {}) as IDataObject;
				const toUserids = this.getNodeParameter('to_userids', i, '') as string;

				const body: IDataObject = {
					subject: subject || meetingTitle,
					content: content || meetingDescription || subject || meetingTitle,
				};

				const to: IDataObject = {};
				const emails = collectEmails(toListCollection);
				if (emails.length) to.emails = emails;
				if (toUserids) to.userids = splitCsv(toUserids);
				body.to = to;

				const cc = buildRecipientObj(ccListCollection);
				if (cc) body.cc = cc;
				const bcc = buildRecipientObj(bccListCollection);
				if (bcc) body.bcc = bcc;

				const schedule: IDataObject = {
					method: 'request',
					start_time: meetingStartTime,
					end_time: meetingEndTime,
				};
				if (meetingLocation) schedule.location = meetingLocation;
				body.schedule = schedule;
				// meeting 可选扩展，基础场景仅带 schedule 即可创建会议邮件
				body.meeting = {};

				const attachment_list = buildAttachmentList(attachmentCollection);
				if (attachment_list) body.attachment_list = attachment_list;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			}
			// 获取接收的邮件（应用收件箱）
			// https://developer.work.weixin.qq.com/document/path/97369
			else if (operation === 'getMailList') {
				const begin_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('begin_time', i) as string | number,
				);
				const end_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('end_time', i) as string | number,
				);
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = {
					begin_time,
					end_time,
					limit,
				};
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/get_mail_list', body);
			} else if (operation === 'getMailContent') {
				// https://developer.work.weixin.qq.com/document/path/97979
				const mail_id =
					(this.getNodeParameter('mail_id', i, '') as string) ||
					(this.getNodeParameter('mailid', i, '') as string);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/read_mail', {
					mail_id,
				});
			}
			// 管理应用邮箱账号
			// https://developer.work.weixin.qq.com/document/path/97373
			else if (operation === 'updateAppMailbox') {
				const new_email =
					(this.getNodeParameter('new_email', i, '') as string) ||
					(this.getNodeParameter('mailbox', i, '') as string);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/update_email_alias', {
					new_email,
				});
			} else if (operation === 'getAppMailbox') {
				// https://developer.work.weixin.qq.com/document/path/97991
				// 无请求包体
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/get_email_alias', {});
			}
			// 管理邮件群组
			else if (operation === 'createMailGroup') {
				const groupid = this.getNodeParameter('groupid', i) as string;
				const groupname = this.getNodeParameter('groupname', i) as string;
				const userlist = this.getNodeParameter('userlist', i, '') as string;
				const allow_type = this.getNodeParameter('allow_type', i, 0) as number;

				const body: IDataObject = {
					groupid,
					groupname,
					allow_type,
				};

				if (userlist) {
					body.userlist = splitCsv(userlist);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/create', body);
			} else if (operation === 'updateMailGroup') {
				const groupid = this.getNodeParameter('groupid', i) as string;
				const groupname = this.getNodeParameter('groupname', i, '') as string;
				const userlist = this.getNodeParameter('userlist', i, '') as string;
				const allow_type = this.getNodeParameter('allow_type', i, 0) as number;

				const body: IDataObject = {
					groupid,
					allow_type,
				};

				if (groupname) body.groupname = groupname;
				if (userlist) {
					body.userlist = splitCsv(userlist);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/update', body);
			} else if (operation === 'deleteMailGroup') {
				const groupid = this.getNodeParameter('groupid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/delete', { groupid });
			} else if (operation === 'getMailGroup') {
				// GET
				const groupid = this.getNodeParameter('groupid', i) as string;

				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/exmail/group/get', {}, { groupid });
			} else if (operation === 'searchMailGroup') {
				// GET fuzzy + optional groupid
				const fuzzy_groupid = this.getNodeParameter('fuzzy_groupid', i, '') as string;
				const fuzzy = this.getNodeParameter('fuzzy', i, 1) as number;

				const qs: IDataObject = { fuzzy: fuzzy ? 1 : 0 };
				if (fuzzy_groupid) qs.groupid = fuzzy_groupid;

				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/exmail/group/search', {}, qs);
			}
			// 管理公共邮箱 publicmail（非 publicmailbox）
			// https://developer.work.weixin.qq.com/document/path/95511
			else if (operation === 'createPublicMailbox') {
				const email =
					(this.getNodeParameter('email', i, '') as string) ||
					(this.getNodeParameter('mailbox', i, '') as string);
				const name = this.getNodeParameter('name', i) as string;
				const userid_list_raw =
					(this.getNodeParameter('userid_list', i, '') as string) ||
					(this.getNodeParameter('member_list', i, '') as string) ||
					(this.getNodeParameter('admin_list', i, '') as string);
				const department_list_raw = this.getNodeParameter('department_list', i, '') as string;
				const tag_list_raw = this.getNodeParameter('tag_list', i, '') as string;
				const create_auth_code = this.getNodeParameter('create_auth_code', i, 0) as number;
				const auth_code_remark = this.getNodeParameter('auth_code_remark', i, '') as string;

				const body: IDataObject = {
					email,
					name,
				};

				if (userid_list_raw) {
					body.userid_list = { list: splitCsv(userid_list_raw) };
				}
				if (department_list_raw) {
					body.department_list = { list: splitCsvNumbers(department_list_raw) };
				}
				if (tag_list_raw) {
					body.tag_list = { list: splitCsvNumbers(tag_list_raw) };
				}
				if (create_auth_code) {
					body.create_auth_code = 1;
					if (auth_code_remark) {
						body.auth_code_info = { remark: auth_code_remark };
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmail/create', body);
			} else if (operation === 'updatePublicMailbox') {
				const id = Number(
					(this.getNodeParameter('id', i, 0) as number) ||
						(this.getNodeParameter('mailbox', i, 0) as string | number),
				);
				const name = this.getNodeParameter('name', i, '') as string;
				const userid_list_raw =
					(this.getNodeParameter('userid_list', i, '') as string) ||
					(this.getNodeParameter('member_list', i, '') as string) ||
					(this.getNodeParameter('admin_list', i, '') as string);
				const department_list_raw = this.getNodeParameter('department_list', i, '') as string;
				const tag_list_raw = this.getNodeParameter('tag_list', i, '') as string;

				const body: IDataObject = { id };
				if (name) body.name = name;
				if (userid_list_raw) {
					body.userid_list = { list: splitCsv(userid_list_raw) };
				}
				if (department_list_raw) {
					body.department_list = { list: splitCsvNumbers(department_list_raw) };
				}
				if (tag_list_raw) {
					body.tag_list = { list: splitCsvNumbers(tag_list_raw) };
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmail/update', body);
			} else if (operation === 'deletePublicMailbox') {
				const id = Number(
					(this.getNodeParameter('id', i, 0) as number) ||
						(this.getNodeParameter('mailbox', i, 0) as string | number),
				);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmail/delete', { id });
			} else if (operation === 'getPublicMailbox') {
				const id_list_raw =
					(this.getNodeParameter('id_list', i, '') as string) ||
					(this.getNodeParameter('mailbox', i, '') as string);
				const id_list = splitCsvNumbers(id_list_raw);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmail/get', {
					id_list,
				});
			} else if (operation === 'searchPublicMailbox') {
				// GET fuzzy + optional email
				const email =
					(this.getNodeParameter('email', i, '') as string) ||
					(this.getNodeParameter('fuzzy_mailbox', i, '') as string);
				const fuzzy = this.getNodeParameter('fuzzy', i, 1) as number;

				const qs: IDataObject = { fuzzy: fuzzy ? 1 : 0 };
				if (email) qs.email = email;

				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/exmail/publicmail/search', {}, qs);
			}
			// 客户端专用密码（公共邮箱）
			// https://developer.work.weixin.qq.com/document/path/100183
			else if (operation === 'getClientPasswordList') {
				const id = Number(
					(this.getNodeParameter('id', i, 0) as number) ||
						(this.getNodeParameter('mailbox', i, 0) as string | number),
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/exmail/publicmail/get_auth_code_list',
					{ id },
				);
			} else if (operation === 'deleteClientPassword') {
				const id = Number(
					(this.getNodeParameter('id', i, 0) as number) ||
						(this.getNodeParameter('mailbox', i, 0) as string | number),
				);
				const auth_code_id = Number(
					(this.getNodeParameter('auth_code_id', i, 0) as number) ||
						(this.getNodeParameter('password_id', i, 0) as string | number),
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/exmail/publicmail/delete_auth_code',
					{ id, auth_code_id },
				);
			}
			// 高级功能账号管理
			// https://developer.work.weixin.qq.com/document/path/99316
			else if (operation === 'allocateMailAdvancedAccount') {
				const userid_list_raw =
					(this.getNodeParameter('userid_list', i, '') as string) ||
					(this.getNodeParameter('mailbox_list', i, '') as string);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/vip/batch_add', {
					userid_list: splitCsv(userid_list_raw),
				});
			} else if (operation === 'deallocateMailAdvancedAccount') {
				const userid_list_raw =
					(this.getNodeParameter('userid_list', i, '') as string) ||
					(this.getNodeParameter('mailbox_list', i, '') as string);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/vip/batch_del', {
					userid_list: splitCsv(userid_list_raw),
				});
			} else if (operation === 'getMailAdvancedAccountList') {
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/vip/list', body);
			} else if (operation === 'toggleMailboxStatus') {
				// https://developer.work.weixin.qq.com/document/path/95512
				const type = this.getNodeParameter('operation_type', i) as number;
				const userid =
					(this.getNodeParameter('userid', i, '') as string) ||
					(this.getNodeParameter('mailbox', i, '') as string);
				const publicemail_id = this.getNodeParameter('publicemail_id', i, 0) as number;

				const body: IDataObject = { type };
				// 若 publicemail_id 有值则优先业务邮箱；否则按 userid
				if (publicemail_id) {
					body.publicemail_id = publicemail_id;
				} else if (userid) {
					body.userid = userid;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/account/act_email', body);
			}
			// 其他邮件客户端登录设置 useroption
			// https://developer.work.weixin.qq.com/document/path/95513
			else if (operation === 'getUserMailAttribute') {
				const userid =
					(this.getNodeParameter('userid', i, '') as string) ||
					(this.getNodeParameter('mailbox', i, '') as string);
				const type_raw = this.getNodeParameter('type', i, '1,2,3,4') as string;
				const type = splitCsvNumbers(type_raw).length
					? splitCsvNumbers(type_raw)
					: [1, 2, 3, 4];

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/useroption/get', {
					userid,
					type,
				});
			} else if (operation === 'updateUserMailAttribute') {
				// https://developer.work.weixin.qq.com/document/path/98008
				const userid =
					(this.getNodeParameter('userid', i, '') as string) ||
					(this.getNodeParameter('mailbox', i, '') as string);
				const optionListRaw = this.getNodeParameter('optionList', i, {}) as IDataObject;
				const imapSmtpSettings = this.getNodeParameter('imapSmtpSettings', i, {}) as IDataObject;

				const list: IDataObject[] = [];

				if (optionListRaw.options) {
					for (const item of optionListRaw.options as IDataObject[]) {
						if (item.type !== undefined && item.value !== undefined) {
							list.push({ type: item.type, value: String(item.value) });
						}
					}
				}

				// 兼容旧 UI：imapSmtpSettings -> type 2/3
				if (imapSmtpSettings.enable_imap !== undefined) {
					list.push({
						type: 2,
						value: imapSmtpSettings.enable_imap ? '1' : '0',
					});
				}
				if (imapSmtpSettings.enable_smtp !== undefined) {
					// POP/SMTP 映射为 type 3
					list.push({
						type: 3,
						value: imapSmtpSettings.enable_smtp ? '1' : '0',
					});
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/useroption/update', {
					userid,
					option: { list },
				});
			} else if (operation === 'getMailUnreadCount') {
				// https://developer.work.weixin.qq.com/document/path/95514
				const userid =
					(this.getNodeParameter('userid', i, '') as string) ||
					(this.getNodeParameter('mailbox', i, '') as string);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/mail/get_newcount', {
					userid,
				});
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
