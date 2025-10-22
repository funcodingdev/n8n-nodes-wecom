import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeMail(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 发送邮件
			if (operation === 'sendMail') {
				const sender = this.getNodeParameter('sender', i) as string;
				const receiver = this.getNodeParameter('receiver', i) as string;
				const subject = this.getNodeParameter('subject', i) as string;
				const doc_content = this.getNodeParameter('doc_content', i) as string;
				const attachment_list = this.getNodeParameter('attachment_list', i, '[]') as string;

				const body: IDataObject = {
					sender,
					receiver: JSON.parse(receiver),
					subject,
					doc_content: JSON.parse(doc_content),
				};

				if (attachment_list && attachment_list !== '[]') {
					body.attachment_list = JSON.parse(attachment_list);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			} else if (operation === 'sendScheduleMail') {
				const sender = this.getNodeParameter('sender', i) as string;
				const receiver = this.getNodeParameter('receiver', i) as string;
				const subject = this.getNodeParameter('subject', i) as string;
				const cal_content = this.getNodeParameter('cal_content', i) as string;
				const attachment_list = this.getNodeParameter('attachment_list', i, '[]') as string;

				const body: IDataObject = {
					sender,
					receiver: JSON.parse(receiver),
					subject,
					cal_content: JSON.parse(cal_content),
				};

				if (attachment_list && attachment_list !== '[]') {
					body.attachment_list = JSON.parse(attachment_list);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			} else if (operation === 'sendMeetingMail') {
				const sender = this.getNodeParameter('sender', i) as string;
				const receiver = this.getNodeParameter('receiver', i) as string;
				const subject = this.getNodeParameter('subject', i) as string;
				const meeting_content = this.getNodeParameter('meeting_content', i) as string;
				const attachment_list = this.getNodeParameter('attachment_list', i, '[]') as string;

				const body: IDataObject = {
					sender,
					receiver: JSON.parse(receiver),
					subject,
					meeting_content: JSON.parse(meeting_content),
				};

				if (attachment_list && attachment_list !== '[]') {
					body.attachment_list = JSON.parse(attachment_list);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			}
			// 获取接收的邮件
			else if (operation === 'getMailList') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const begin_time = this.getNodeParameter('begin_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = {
					mailbox,
					begin_time,
					end_time,
					limit,
				};

				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/mail/getlist', body);
			} else if (operation === 'getMailContent') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const mailid = this.getNodeParameter('mailid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/mail/get', {
					mailbox,
					mailid,
				});
			}
			// 管理应用邮箱账号
			else if (operation === 'updateAppMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const name = this.getNodeParameter('name', i, '') as string;
				const remark = this.getNodeParameter('remark', i, '') as string;

				const body: IDataObject = { mailbox };
				if (name) body.name = name;
				if (remark) body.remark = remark;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/update', body);
			} else if (operation === 'getAppMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/get', { mailbox });
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
					body.userlist = userlist.split(',').map((email) => email.trim());
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
					body.userlist = userlist.split(',').map((email) => email.trim());
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/update', body);
			} else if (operation === 'deleteMailGroup') {
				const groupid = this.getNodeParameter('groupid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/delete', { groupid });
			} else if (operation === 'getMailGroup') {
				const groupid = this.getNodeParameter('groupid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/get', { groupid });
			} else if (operation === 'searchMailGroup') {
				const fuzzy_groupid = this.getNodeParameter('fuzzy_groupid', i) as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = {
					fuzzy_groupid,
					limit,
				};

				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/search', body);
			}
			// 管理公共邮箱
			else if (operation === 'createPublicMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const name = this.getNodeParameter('name', i) as string;
				const admin_list = this.getNodeParameter('admin_list', i, '') as string;
				const member_list = this.getNodeParameter('member_list', i, '') as string;

				const body: IDataObject = {
					mailbox,
					name,
				};

				if (admin_list) {
					body.admin_list = admin_list.split(',').map((email) => email.trim());
				}
				if (member_list) {
					body.member_list = member_list.split(',').map((email) => email.trim());
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmailbox/create', body);
			} else if (operation === 'updatePublicMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const name = this.getNodeParameter('name', i, '') as string;
				const admin_list = this.getNodeParameter('admin_list', i, '') as string;
				const member_list = this.getNodeParameter('member_list', i, '') as string;

				const body: IDataObject = { mailbox };

				if (name) body.name = name;
				if (admin_list) {
					body.admin_list = admin_list.split(',').map((email) => email.trim());
				}
				if (member_list) {
					body.member_list = member_list.split(',').map((email) => email.trim());
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmailbox/update', body);
			} else if (operation === 'deletePublicMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmailbox/delete', { mailbox });
			} else if (operation === 'getPublicMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmailbox/get', { mailbox });
			} else if (operation === 'searchPublicMailbox') {
				const fuzzy_mailbox = this.getNodeParameter('fuzzy_mailbox', i) as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = {
					fuzzy_mailbox,
					limit,
				};

				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmailbox/search', body);
			}
			// 客户端专用密码
			else if (operation === 'getClientPasswordList') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/useroption/list', { mailbox });
			} else if (operation === 'deleteClientPassword') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const password_id = this.getNodeParameter('password_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/useroption/delete', {
					mailbox,
					password_id,
				});
			}
			// 高级功能账号管理
			else if (operation === 'allocateMailAdvancedAccount') {
				const mailbox_list = this.getNodeParameter('mailbox_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/vip/batchadd', {
					mailbox: mailbox_list.split(',').map((email) => email.trim()),
				});
			} else if (operation === 'deallocateMailAdvancedAccount') {
				const mailbox_list = this.getNodeParameter('mailbox_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/vip/batchdel', {
					mailbox: mailbox_list.split(',').map((email) => email.trim()),
				});
			} else if (operation === 'getMailAdvancedAccountList') {
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/vip/list', body);
			} else if (operation === 'toggleMailboxStatus') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const operation_type = this.getNodeParameter('operation_type', i) as number;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/user/option', {
					mailbox,
					operation: operation_type,
				});
			}
			// 其他邮件客户端登录设置
			else if (operation === 'getUserMailAttribute') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/user/get', { mailbox });
			} else if (operation === 'updateUserMailAttribute') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const attribute = this.getNodeParameter('attribute', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/user/update', {
					mailbox,
					...JSON.parse(attribute),
				});
			} else if (operation === 'getMailUnreadCount') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/mail/unread', { mailbox });
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

