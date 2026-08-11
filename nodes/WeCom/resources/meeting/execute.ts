import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { executeExtraHttpOp } from '../../shared/extraHttpOp';
import { meetingExtraHttpOpsById } from './extraHttpOps';
import type { MeetingExtraHttpOp } from './extraHttpOps';

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

export async function executeMeeting(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 预约会议基础管理
			if (operation === 'createMeeting') {
				const subject = this.getNodeParameter('subject', i) as string;
				const start_time = dateTimeToUnixTimestamp(this.getNodeParameter('start_time', i) as string | number);
				const end_time = dateTimeToUnixTimestamp(this.getNodeParameter('end_time', i) as string | number);
				const type = this.getNodeParameter('type', i) as number;
				const attendeesCollection = this.getNodeParameter('attendeesCollection', i, {}) as IDataObject;

				const body: IDataObject = {
					subject,
					start_time,
					end_time,
					type,
				};

				// 处理参会人员
				if (attendeesCollection.attendees) {
					const attendeesList = attendeesCollection.attendees as IDataObject[];
					if (attendeesList.length > 0) {
						body.attendees = attendeesList.map((a) => ({ userid: a.userid }));
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/create', body);
			} else if (operation === 'updateMeeting') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const subject = this.getNodeParameter('subject', i, '') as string;
				const start_time_raw = this.getNodeParameter('start_time', i, '') as string | number;
				const end_time_raw = this.getNodeParameter('end_time', i, '') as string | number;

				const body: IDataObject = { meetingid };
				if (subject) body.subject = subject;
				if (start_time_raw) {
					const start_time = dateTimeToUnixTimestamp(start_time_raw);
					if (start_time > 0) body.start_time = start_time;
				}
				if (end_time_raw) {
					const end_time = dateTimeToUnixTimestamp(end_time_raw);
					if (end_time > 0) body.end_time = end_time;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update', body);
			} else if (operation === 'cancelMeeting') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/cancel', {
					meetingid,
				});
			} else if (operation === 'getMeetingInfo') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_info', {
					meetingid,
				});
			} else if (operation === 'getUserMeetings') {
				const userid = this.getNodeParameter('userid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;

				const body: IDataObject = { userid, limit };
				if (cursor) body.cursor = cursor;

				// 官方路径：get_user_meetingid
				// https://developer.work.weixin.qq.com/document/path/98150
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_user_meetingid', body);
			}
			// 会议统计管理
			else if (operation === 'getMeetingRecords') {
				// 获取会议发起记录
				// https://developer.work.weixin.qq.com/document/path/99651
				const type = this.getNodeParameter('record_type', i, 1) as number;
				const start_time_raw = this.getNodeParameter('start_time', i, '') as string | number;
				const end_time_raw = this.getNodeParameter('end_time', i, '') as string | number;
				const begin_time =
					dateTimeToUnixTimestamp(start_time_raw) ||
					(this.getNodeParameter('begin_time', i, 0) as number);
				const end_time =
					dateTimeToUnixTimestamp(end_time_raw) ||
					(this.getNodeParameter('end_time_ts', i, 0) as number);
				const limit = this.getNodeParameter('limit', i, 200) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = {
					type,
					begin_time,
					end_time,
					limit,
				};
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/statistics/get_start_list',
					body,
				);
			}
			// 预约会议高级管理
			else if (operation === 'createAdvancedMeeting') {
				const subject = this.getNodeParameter('subject', i) as string;
				const start_time = dateTimeToUnixTimestamp(this.getNodeParameter('start_time', i) as string | number);
				const end_time = dateTimeToUnixTimestamp(this.getNodeParameter('end_time', i) as string | number);
				const admin_userid = this.getNodeParameter('admin_userid', i) as string;
				const inviteesCollection = this.getNodeParameter('inviteesCollection', i, {}) as IDataObject;
				const advancedSettings = this.getNodeParameter('advancedSettings', i, {}) as IDataObject;

				const body: IDataObject = {
					subject,
					start_time,
					end_time,
					admin_userid,
				};

				// 处理受邀成员
				if (inviteesCollection.invitees) {
					const inviteesList = inviteesCollection.invitees as IDataObject[];
					if (inviteesList.length > 0) {
						body.invitees = inviteesList.map((inv) => ({ userid: inv.userid }));
					}
				}

				// 处理高级设置
				if (advancedSettings.description) body.description = advancedSettings.description;
				if (advancedSettings.password) body.password = advancedSettings.password;
				if (advancedSettings.enable_mute_on_entry !== undefined) {
					body.enable_mute_on_entry = advancedSettings.enable_mute_on_entry;
				}
				if (advancedSettings.allow_enter_before_host !== undefined) {
					body.allow_enter_before_host = advancedSettings.allow_enter_before_host;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/create', body);
			} else if (operation === 'updateAdvancedMeeting') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const subject = this.getNodeParameter('subject', i, '') as string;
				const start_time_raw = this.getNodeParameter('start_time', i, '') as string | number;
				const end_time_raw = this.getNodeParameter('end_time', i, '') as string | number;
				const advancedSettings = this.getNodeParameter('advancedSettings', i, {}) as IDataObject;

				const body: IDataObject = { meetingid };
				if (subject) body.subject = subject;
				if (start_time_raw) {
					const start_time = dateTimeToUnixTimestamp(start_time_raw);
					if (start_time > 0) body.start_time = start_time;
				}
				if (end_time_raw) {
					const end_time = dateTimeToUnixTimestamp(end_time_raw);
					if (end_time > 0) body.end_time = end_time;
				}

				// 处理高级设置
				if (advancedSettings.description) body.description = advancedSettings.description;
				if (advancedSettings.password) body.password = advancedSettings.password;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update', body);
			} else if (operation === 'getMeetingInvitees') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;

				const body: IDataObject = { meetingid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_invitees', body);
			} else if (operation === 'updateMeetingInvitees') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const addInviteesCollection = this.getNodeParameter('addInviteesCollection', i, {}) as IDataObject;
				const delInviteesCollection = this.getNodeParameter('delInviteesCollection', i, {}) as IDataObject;

				const body: IDataObject = { meetingid };

				// 处理添加的成员
				if (addInviteesCollection.invitees) {
					const addList = addInviteesCollection.invitees as IDataObject[];
					if (addList.length > 0) {
						body.add_invitees = addList.map((inv) => ({ userid: inv.userid }));
					}
				}

				// 处理删除的成员
				if (delInviteesCollection.invitees) {
					const delList = delInviteesCollection.invitees as IDataObject[];
					if (delList.length > 0) {
						body.del_invitees = delList.map((inv) => ({ userid: inv.userid }));
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update_invitees', body);
			} else if (operation === 'getLiveParticipants') {
				// 获取实时会中成员列表
				// https://developer.work.weixin.qq.com/document/path/98153
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const size = this.getNodeParameter('size', i, 100) as number;

				const body: IDataObject = { meetingid, limit: size };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/get_realtime_attendee_list',
					body,
				);
			} else if (operation === 'getParticipants') {
				// 获取已参会成员列表
				// https://developer.work.weixin.qq.com/document/path/98154
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const size = this.getNodeParameter('size', i, 100) as number;

				const body: IDataObject = { meetingid, limit: size };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/get_attendee_list',
					body,
				);
			}
			// 会中控制管理
			else if (operation === 'muteMember') {
				// https://developer.work.weixin.qq.com/document/path/98184
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const mute_action = this.getNodeParameter('mute_action', i) as number;
				const membersCollection = this.getNodeParameter('membersCollection', i, {}) as IDataObject;

				const operated_user: IDataObject[] = [];
				if (membersCollection.members) {
					const membersList = membersCollection.members as IDataObject[];
					membersList.forEach((m) => {
						if (m.userid) operated_user.push({ userid: m.userid });
					});
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/realcontrol/mute_user',
					{
						meetingid,
						// true 静音，false 解除静音
						option: mute_action === 1,
						operated_user,
					},
				);
			} else if (operation === 'removeMember') {
				// https://developer.work.weixin.qq.com/document/path/98181
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const membersCollection = this.getNodeParameter('membersCollection', i, {}) as IDataObject;
				const allow_rejoin = this.getNodeParameter('allow_rejoin', i, true) as boolean;

				const operated_user: IDataObject[] = [];
				if (membersCollection.members) {
					const membersList = membersCollection.members as IDataObject[];
					membersList.forEach((m) => {
						if (m.userid) operated_user.push({ userid: m.userid });
					});
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/realcontrol/kickout_users',
					{
						meetingid,
						allow_rejoin,
						operated_user,
					},
				);
			} else if (operation === 'endMeeting') {
				// https://developer.work.weixin.qq.com/document/path/98180
				const meetingid = this.getNodeParameter('meetingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/realcontrol/dismiss', {
					meetingid,
				});
			}
			// 录制管理
			else if (operation === 'listRecordings') {
				// https://developer.work.weixin.qq.com/document/path/98192
				const meetingid = this.getNodeParameter('meetingid', i, '') as string;
				const userid = this.getNodeParameter('userid', i, '') as string;
				const start_time_raw = this.getNodeParameter('start_time', i, '') as string | number;
				const end_time_raw = this.getNodeParameter('end_time', i, '') as string | number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const size = this.getNodeParameter('size', i, 10) as number;

				const body: IDataObject = {
					start_time: dateTimeToUnixTimestamp(start_time_raw),
					end_time: dateTimeToUnixTimestamp(end_time_raw),
					limit: Math.min(size || 10, 20),
				};
				if (meetingid) body.meetingid = meetingid;
				if (userid) body.userid = userid;
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/record/list', body);
			} else if (operation === 'getRecordingAddress') {
				// https://developer.work.weixin.qq.com/document/path/98193
				const meetingid = this.getNodeParameter('meetingid', i, '') as string;
				const record_file_id = this.getNodeParameter('record_file_id', i) as string;

				const body: IDataObject = { record_file_id };
				if (meetingid) body.meetingid = meetingid;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/record/get_file', body);
			}
			// 高级功能账号管理
			else if (operation === 'allocateMeetingAdvancedAccount') {
				const useridCollection = this.getNodeParameter('useridCollection', i, {}) as IDataObject;

				const userid_list: string[] = [];
				if (useridCollection.users) {
					const usersList = useridCollection.users as IDataObject[];
					usersList.forEach((u) => {
						if (u.userid) userid_list.push(u.userid as string);
					});
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/vip/submit_batch_add_job',
					{ userid_list },
				);
			} else if (operation === 'deallocateMeetingAdvancedAccount') {
				const useridCollection = this.getNodeParameter('useridCollection', i, {}) as IDataObject;

				const userid_list: string[] = [];
				if (useridCollection.users) {
					const usersList = useridCollection.users as IDataObject[];
					usersList.forEach((u) => {
						if (u.userid) userid_list.push(u.userid as string);
					});
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/vip/submit_batch_del_job',
					{ userid_list },
				);
			} else if (operation === 'getMeetingAdvancedAccountList') {
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/vip/list', body);
			}
			// 报名管理
			// https://developer.work.weixin.qq.com/document/path/98800
			else if (operation === 'getEnrollConfig') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/enroll/get_config', {
					meetingid,
				});
			} else if (operation === 'setEnrollConfig') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const enrollConfigJson = this.getNodeParameter('enrollConfigJson', i, '{}') as string;
				const enroll_approve_type = this.getNodeParameter('enroll_approve_type', i, 1) as number;
				const enroll_is_collect_question = this.getNodeParameter(
					'enroll_is_collect_question',
					i,
					1,
				) as number;
				const enroll_no_registration_needed_for_staff = this.getNodeParameter(
					'enroll_no_registration_needed_for_staff',
					i,
					true,
				) as boolean;
				const body: IDataObject = {
					meetingid,
					approve_type: enroll_approve_type,
					is_collect_question: enroll_is_collect_question,
					no_registration_needed_for_staff: enroll_no_registration_needed_for_staff,
				};
				try {
					Object.assign(body, JSON.parse(enrollConfigJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore invalid json
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/enroll/set_config', body);
			} else if (operation === 'listEnroll') {
				// https://developer.work.weixin.qq.com/document/path/98810
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const enroll_status = this.getNodeParameter('enroll_status', i, 0) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;
				const body: IDataObject = { meetingid, limit };
				if (enroll_status) body.status = enroll_status;
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/enroll/list', body);
			} else if (operation === 'approveEnroll') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const enroll_id_list = this.getNodeParameter('enroll_id_list', i, '') as string;
				const enroll_approve_status = this.getNodeParameter('enroll_approve_status', i, 1) as number;
				const approveJson = this.getNodeParameter('approveJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					status: enroll_approve_status,
				};
				const ids = enroll_id_list.split(',').map((s) => s.trim()).filter(Boolean);
				if (ids.length) body.enroll_id_list = ids;
				try {
					Object.assign(body, JSON.parse(approveJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/enroll/approve', body);
			}
			// Rooms 会议室
			// https://developer.work.weixin.qq.com/document/path/98795
			else if (operation === 'listRooms') {
				const meeting_room_name = this.getNodeParameter('meeting_room_name', i, '') as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;
				const body: IDataObject = { limit };
				if (meeting_room_name) body.meeting_room_name = meeting_room_name;
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/rooms/list', body);
			} else if (operation === 'getRoomInfo') {
				const meeting_room_id = this.getNodeParameter('meeting_room_id', i) as string;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/rooms/get_info', {
					meeting_room_id,
				});
			} else if (operation === 'bookRooms') {
				// https://developer.work.weixin.qq.com/document/path/98791
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const meeting_room_id_list_raw = this.getNodeParameter('meeting_room_id_list', i) as string;
				const meeting_room_id_list = meeting_room_id_list_raw
					.split(',')
					.map((id) => id.trim())
					.filter(Boolean);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/rooms/book', {
					meetingid,
					meeting_room_id_list,
				});
			} else if (operation === 'releaseRooms') {
				// https://developer.work.weixin.qq.com/document/path/98792
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const meeting_room_id_list_raw =
					(this.getNodeParameter('meeting_room_id_list', i, '') as string) ||
					(this.getNodeParameter('meeting_room_id', i, '') as string);
				const meeting_room_id_list = meeting_room_id_list_raw
					.split(',')
					.map((id) => id.trim())
					.filter(Boolean);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/rooms/release', {
					meetingid,
					meeting_room_id_list,
				});
			} else if (operation === 'setCohost') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cohost_userids = this.getNodeParameter('cohost_userids', i, '') as string;
				const userid_list = cohost_userids
					.split(',')
					.map((id) => id.trim())
					.filter(Boolean);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/realcontrol/set_cohost', {
					meetingid,
					userid_list,
				});
			} else if (operation === 'realcontrolSet') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const realcontrolJson = this.getNodeParameter('realcontrolJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					mute_all: this.getNodeParameter('rc_mute_all', i, false) as boolean,
					allow_unmute_self: this.getNodeParameter('rc_allow_unmute_self', i, true) as boolean,
					enable_enter_mute: this.getNodeParameter('rc_enable_enter_mute', i, 0) as number,
					meeting_locked: this.getNodeParameter('rc_meeting_locked', i, false) as boolean,
					hide_meeting_code_password: this.getNodeParameter(
						'rc_hide_meeting_code_password',
						i,
						false,
					) as boolean,
					allow_chat: this.getNodeParameter('rc_allow_chat', i, 0) as number,
					allow_share_screen: this.getNodeParameter('rc_allow_share_screen', i, true) as boolean,
					allow_external_user: this.getNodeParameter('rc_allow_external_user', i, false) as boolean,
					play_ivr_on_join: this.getNodeParameter('rc_play_ivr_on_join', i, false) as boolean,
					enable_waiting_room: this.getNodeParameter('rc_enable_waiting_room', i, false) as boolean,
				};
				try {
					Object.assign(body, JSON.parse(realcontrolJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/realcontrol/set', body);
			} else if (operation === 'listLayoutTemplate') {
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				let body: IDataObject = {};
				try {
					body = JSON.parse(extraJson || '{}') as IDataObject;
				} catch {
					body = {};
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/layout/list_template',
					body,
				);
			} else if (operation === 'setDefaultLayout') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				try {
					Object.assign(body, JSON.parse(extraJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/layout/set_default',
					body,
				);
			} else if (operation === 'phoneCallout') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const phoneCollection = this.getNodeParameter('phoneCalloutCollection', i, {}) as IDataObject;
				const phone_numbers = ((phoneCollection?.numbers as IDataObject[]) || [])
					.filter((n) => n.phone)
					.map((n) => {
						const item: IDataObject = {
							area: n.area ?? 86,
							phone: n.phone,
						};
						if (n.extension_number) item.extension_number = n.extension_number;
						return item;
					});
				const body: IDataObject = { meetingid };
				if (phone_numbers.length) body.phone_numbers = phone_numbers;
				try {
					Object.assign(body, JSON.parse(extraJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/phone/callout', body);
			} else if (operation === 'phoneGetCalloutStatus') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				try {
					Object.assign(body, JSON.parse(extraJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/phone/get_callout_status',
					body,
				);
			} else if (operation === 'getPollList') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				try {
					Object.assign(body, JSON.parse(extraJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/poll/get_poll_list',
					body,
				);
			} else if (operation === 'getPollDetail') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				try {
					Object.assign(body, JSON.parse(extraJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/poll/get_poll_detail',
					body,
				);
			}
			// --- 网络研讨会（结构化） ---
			else if (operation === 'webinarCreate') {
				const admin_userid = this.getNodeParameter('admin_userid', i) as string;
				const title = this.getNodeParameter('title', i) as string;
				const start_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('start_time', i) as string | number,
				);
				const end_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('end_time', i) as string | number,
				);
				const admission_type = this.getNodeParameter('admission_type', i, 0) as number;
				const playback_for_audience = this.getNodeParameter(
					'playback_for_audience',
					i,
					false,
				) as boolean;
				const sponsor = this.getNodeParameter('sponsor', i, '') as string;
				const password = this.getNodeParameter('password', i, '') as string;
				const host_userids = this.getNodeParameter('host_userids', i, '') as string;
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;

				const body: IDataObject = {
					admin_userid,
					title,
					start_time: String(start_time),
					end_time: String(end_time),
					admission_type,
					playback_for_audience,
				};
				if (sponsor) body.sponsor = sponsor;
				if (password) body.password = password;
				if (host_userids) {
					body.hosts = host_userids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean)
						.map((userid) => ({ userid }));
				}
				try {
					Object.assign(body, JSON.parse(webinarExtraJson || '{}') as IDataObject);
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/webinar/create', body);
			} else if (operation === 'webinarGet') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i, '') as string;
				const meeting_code = this.getNodeParameter('meeting_code', i, '') as string;
				const body: IDataObject = {};
				if (meetingid) body.meetingid = meetingid;
				if (meeting_code) body.meeting_code = meeting_code;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/webinar/get', body);
			} else if (operation === 'webinarCancel') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/webinar/cancel', {
					meetingid,
				});
			} else if (operation === 'webinarUpdate') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const title = this.getNodeParameter('title', i, '') as string;
				const sponsor = this.getNodeParameter('sponsor', i, '') as string;
				const host_userids = this.getNodeParameter('host_userids', i, '') as string;
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				if (title) body.title = title;
				if (sponsor) body.sponsor = sponsor;
				if (host_userids) {
					body.hosts = host_userids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean)
						.map((userid) => ({ userid }));
				}
				try {
					Object.assign(body, JSON.parse(webinarExtraJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/webinar/update', body);
			} else if (operation === 'webinarListGuest') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const cursor = this.getNodeParameter('webinar_cursor', i, '') as string;
				const limit = this.getNodeParameter('webinar_limit', i, 10) as number;
				const body: IDataObject = { meetingid, limit };
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/webinar/list_guest',
					body,
				);
			} else if (operation === 'webinarUpdateGuestList') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const guestsJson = this.getNodeParameter('guestsJson', i, '[]') as string;
				const body: IDataObject = { meetingid };
				try {
					const guests = JSON.parse(guestsJson || '[]');
					body.guests = guests;
				} catch {
					body.guests = [];
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/webinar/update_guest_list',
					body,
				);
			} else if (operation === 'webinarUpdateWarmUp') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				try {
					Object.assign(body, JSON.parse(webinarExtraJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/webinar/update_warm_up',
					body,
				);
			} else if (operation === 'webinarEnrollGetConfig') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/webinar/enroll/get_config',
					{ meetingid },
				);
			} else if (
				operation === 'webinarEnrollSetConfig' ||
				operation === 'webinarEnrollApprove' ||
				operation === 'webinarEnrollImport' ||
				operation === 'webinarEnrollDelete' ||
				operation === 'webinarEnrollQueryByTmpOpenid'
			) {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const webinarEnrollJson = this.getNodeParameter('webinarEnrollJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				if (operation === 'webinarEnrollSetConfig') {
					body.approve_type = this.getNodeParameter('webinar_approve_type', i, 1) as number;
					body.is_collect_question = this.getNodeParameter(
						'webinar_is_collect_question',
						i,
						1,
					) as number;
					body.no_registration_needed_for_staff = this.getNodeParameter(
						'webinar_no_registration_needed_for_staff',
						i,
						false,
					) as boolean;
				}
				if (operation === 'webinarEnrollApprove' || operation === 'webinarEnrollDelete') {
					const enroll_ids = (
						this.getNodeParameter('webinar_enroll_id_list', i, '') as string
					)
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean);
					if (enroll_ids.length) body.enroll_id_list = enroll_ids;
				}
				if (operation === 'webinarEnrollApprove') {
					body.action = this.getNodeParameter('webinar_enroll_action', i, 3) as number;
				}
				try {
					Object.assign(body, JSON.parse(webinarEnrollJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				const pathMap: Record<string, string> = {
					webinarEnrollSetConfig: '/cgi-bin/meeting/webinar/enroll/set_config',
					webinarEnrollApprove: '/cgi-bin/meeting/webinar/enroll/approve',
					webinarEnrollImport: '/cgi-bin/meeting/webinar/enroll/import',
					webinarEnrollDelete: '/cgi-bin/meeting/webinar/enroll/delete',
					webinarEnrollQueryByTmpOpenid: '/cgi-bin/meeting/webinar/enroll/query_by_tmp_openid',
				};
				response = await weComApiRequest.call(this, 'POST', pathMap[operation], body);
			} else if (operation === 'webinarEnrollList') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const cursor = this.getNodeParameter('webinar_cursor', i, '') as string;
				const limit = this.getNodeParameter('webinar_limit', i, 10) as number;
				const webinarEnrollJson = this.getNodeParameter('webinarEnrollJson', i, '{}') as string;
				const body: IDataObject = { meetingid, limit };
				if (cursor) body.cursor = cursor;
				try {
					Object.assign(body, JSON.parse(webinarEnrollJson || '{}') as IDataObject);
					body.meetingid = meetingid;
					if (limit) body.limit = limit;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/webinar/enroll/list',
					body,
				);
			}
			// --- 录制扩展 / 转写 ---
			else if (operation === 'recordDelete') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				try {
					Object.assign(body, JSON.parse(webinarExtraJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/record/delete', body);
			} else if (operation === 'recordDeleteFile') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const record_file_id = this.getNodeParameter('webinar_record_file_id', i) as string;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/delete_file',
					{ meetingid, record_file_id },
				);
			} else if (operation === 'recordGetFileList') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i, '') as string;
				const meeting_code = this.getNodeParameter('meeting_code', i, '') as string;
				const userid = this.getNodeParameter('record_userid', i, '') as string;
				const start_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('record_start_time', i, '') as string | number,
				);
				const end_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('record_end_time', i, '') as string | number,
				);
				const cursor = this.getNodeParameter('webinar_cursor', i, '') as string;
				const limit = this.getNodeParameter('webinar_limit', i, 10) as number;
				const body: IDataObject = {
					start_time,
					end_time,
					limit: Math.min(limit || 10, 20),
				};
				if (meetingid) body.meetingid = meetingid;
				if (meeting_code) body.meeting_code = meeting_code;
				if (userid) body.userid = userid;
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/get_file_list',
					body,
				);
			} else if (operation === 'recordGetStatistics') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				try {
					Object.assign(body, JSON.parse(webinarExtraJson || '{}') as IDataObject);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/get_statistics',
					body,
				);
			} else if (operation === 'recordUpdateSharingConfig') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const record_file_id = this.getNodeParameter('webinar_record_file_id', i) as string;
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const body: IDataObject = { meetingid, record_file_id };
				try {
					Object.assign(body, JSON.parse(webinarExtraJson || '{}') as IDataObject);
					body.meetingid = meetingid;
					body.record_file_id = record_file_id;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/update_sharing_config',
					body,
				);
			} else if (operation === 'recordTranscriptGetDetail') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const record_file_id = this.getNodeParameter('webinar_record_file_id', i) as string;
				const pid = this.getNodeParameter('transcript_pid', i, '') as string;
				const limit = this.getNodeParameter('webinar_limit', i, 10) as number;
				const body: IDataObject = { meetingid, record_file_id };
				if (pid) body.pid = pid;
				if (limit) body.limit = limit;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/transcript/get_detail',
					body,
				);
			} else if (operation === 'recordTranscriptGetParagraphList') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const record_file_id = this.getNodeParameter('webinar_record_file_id', i) as string;
				const pid = this.getNodeParameter('transcript_pid', i, '') as string;
				const limit = this.getNodeParameter('webinar_limit', i, 10) as number;
				const body: IDataObject = { meetingid, record_file_id };
				if (pid) body.pid = pid;
				if (limit) body.limit = limit;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/transcript/get_paragraph_list',
					body,
				);
			} else if (operation === 'recordTranscriptSearch') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const record_file_id = this.getNodeParameter('webinar_record_file_id', i) as string;
				const text = this.getNodeParameter('transcript_text', i) as string;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/transcript/search',
					{ meetingid, record_file_id, text },
				);
			}
			// --- Rooms / MRA / 投票 / 会中扩展等（结构化） ---
			else if (
				[
					'roomsCall',
					'roomsCancelCall',
					'roomsGetResponseStatus',
					'roomsListMeetings',
					'roomsGetConfig',
					'roomsGetInventory',
					'roomsListDevices',
					'roomsListControllers',
					'mraHangup',
					'mraQueryStatus',
					'mraSetDefaultLayout',
					'mraSetRaiseHand',
					'pollCreateTheme',
					'pollUpdateTheme',
					'pollGetThemeInfo',
					'pollStart',
					'pollFinish',
					'pollDelete',
					'rcCloseScreenShare',
					'rcManageWaitingRoom',
					'rcSetNicknames',
					'rcSwitchUserVideo',
					'waitingroomCurrentUsers',
					'waitingroomUserList',
					'enrollDelete',
					'enrollImport',
					'enrollQueryByTmpOpenid',
					'setGuests',
					'setInvitees',
					'getGuests',
					'getQuality',
					'checkDeviceInMeeting',
					'createCustomerShortUrl',
					'getCustomerShortUrl',
					'phoneGetTmpOpenid',
					'vipBatchDelJobResult',
				].includes(operation)
			) {
				const meetingid = this.getNodeParameter('cr_meetingid', i, '') as string;
				const operator_userid = this.getNodeParameter('operator_userid', i, '') as string;
				const instance_id = this.getNodeParameter('instance_id', i, 1) as number;
				const poll_theme_id = this.getNodeParameter('poll_theme_id', i, '') as string;
				const poll_topic = this.getNodeParameter('poll_topic', i, '') as string;
				const poll_desc = this.getNodeParameter('poll_desc', i, '') as string;
				const is_anony = this.getNodeParameter('is_anony', i, 0) as number;
				const poll_questions_json = this.getNodeParameter(
					'poll_questions_json',
					i,
					'[]',
				) as string;
				const meeting_room_id = this.getNodeParameter('cr_meeting_room_id', i, '') as string;
				const mra_tmp_openid = this.getNodeParameter('mra_tmp_openid', i, '') as string;
				const vip_jobid = this.getNodeParameter('vip_jobid', i, '') as string;
				const operated_users_json = this.getNodeParameter(
					'operated_users_json',
					i,
					'[]',
				) as string;
				const list_data_json = this.getNodeParameter('list_data_json', i, '[]') as string;
				const cursor = this.getNodeParameter('cr_cursor', i, '') as string;
				const limit = this.getNodeParameter('cr_limit', i, 20) as number;
				const cr_extra_json = this.getNodeParameter('cr_extra_json', i, '{}') as string;

				const body: IDataObject = {};
				if (meetingid) body.meetingid = meetingid;
				if (operator_userid) body.operator_userid = operator_userid;
				if (
					[
						'pollCreateTheme',
						'pollUpdateTheme',
						'pollGetThemeInfo',
						'pollStart',
						'pollFinish',
						'pollDelete',
					].includes(operation)
				) {
					body.instance_id = instance_id;
				}
				if (poll_theme_id) body.poll_theme_id = poll_theme_id;
				if (poll_topic) body.poll_topic = poll_topic;
				if (poll_desc) body.poll_desc = poll_desc;
				if (['pollCreateTheme', 'pollUpdateTheme'].includes(operation)) {
					body.is_anony = is_anony;
					try {
						body.poll_questions = JSON.parse(poll_questions_json || '[]');
					} catch {
						body.poll_questions = [];
					}
				}
				if (meeting_room_id) body.meeting_room_id = meeting_room_id;
				if (mra_tmp_openid) {
					body.mra = { tmp_openid: mra_tmp_openid };
				}
				if (vip_jobid) body.jobid = vip_jobid;
				if (
					[
						'rcCloseScreenShare',
						'rcManageWaitingRoom',
						'rcSetNicknames',
						'rcSwitchUserVideo',
					].includes(operation)
				) {
					try {
						const users = JSON.parse(operated_users_json || '[]');
						if (operation === 'rcSetNicknames') body.operated_users = users;
						else body.operated_user = users;
					} catch {
						// ignore
					}
				}
				if (['setGuests', 'setInvitees'].includes(operation)) {
					try {
						const list = JSON.parse(list_data_json || '[]');
						if (operation === 'setGuests') body.guests = list;
						else body.invitees = list;
					} catch {
						// ignore
					}
				}
				if (['enrollImport', 'enrollDelete', 'enrollQueryByTmpOpenid'].includes(operation)) {
					try {
						Object.assign(body, {
							...(Array.isArray(JSON.parse(list_data_json || '[]'))
								? { enroll_list: JSON.parse(list_data_json || '[]') }
								: JSON.parse(list_data_json || '{}')),
						});
					} catch {
						// ignore
					}
				}
				if (cursor) body.cursor = cursor;
				if (
					[
						'roomsListDevices',
						'roomsListControllers',
						'roomsListMeetings',
						'waitingroomUserList',
						'getGuests',
					].includes(operation)
				) {
					body.limit = limit;
				}
				try {
					Object.assign(body, JSON.parse(cr_extra_json || '{}') as IDataObject);
				} catch {
					// ignore
				}
				if (meetingid) body.meetingid = meetingid;

				const pathMap: Record<string, string> = {
					roomsCall: '/cgi-bin/meeting/rooms/call',
					roomsCancelCall: '/cgi-bin/meeting/rooms/cancel_call',
					roomsGetResponseStatus: '/cgi-bin/meeting/rooms/get_response_status',
					roomsListMeetings: '/cgi-bin/meeting/rooms/list_meetings',
					roomsGetConfig: '/cgi-bin/meeting/rooms/get_config',
					roomsGetInventory: '/cgi-bin/meeting/rooms/get_inventory',
					roomsListDevices: '/cgi-bin/meeting/rooms/list_devices',
					roomsListControllers: '/cgi-bin/meeting/rooms/list_controllers',
					mraHangup: '/cgi-bin/meeting/mra/hangup',
					mraQueryStatus: '/cgi-bin/meeting/mra/query_status',
					mraSetDefaultLayout: '/cgi-bin/meeting/mra/set_default_layout',
					mraSetRaiseHand: '/cgi-bin/meeting/mra/set_raise_hand',
					pollCreateTheme: '/cgi-bin/meeting/poll/create_theme',
					pollUpdateTheme: '/cgi-bin/meeting/poll/update_theme',
					pollGetThemeInfo: '/cgi-bin/meeting/poll/get_theme_info',
					pollStart: '/cgi-bin/meeting/poll/start',
					pollFinish: '/cgi-bin/meeting/poll/finish',
					pollDelete: '/cgi-bin/meeting/poll/delete',
					rcCloseScreenShare: '/cgi-bin/meeting/realcontrol/close_screen_share',
					rcManageWaitingRoom: '/cgi-bin/meeting/realcontrol/manage_waiting_room_users',
					rcSetNicknames: '/cgi-bin/meeting/realcontrol/set_nicknames',
					rcSwitchUserVideo: '/cgi-bin/meeting/realcontrol/switch_user_video',
					waitingroomCurrentUsers: '/cgi-bin/meeting/waitingroom/get_current_user_list',
					waitingroomUserList: '/cgi-bin/meeting/waitingroom/get_user_list',
					enrollDelete: '/cgi-bin/meeting/enroll/delete',
					enrollImport: '/cgi-bin/meeting/enroll/import',
					enrollQueryByTmpOpenid: '/cgi-bin/meeting/enroll/query_by_tmp_openid',
					setGuests: '/cgi-bin/meeting/set_guests',
					setInvitees: '/cgi-bin/meeting/set_invitees',
					getGuests: '/cgi-bin/meeting/get_guests',
					getQuality: '/cgi-bin/meeting/get_quality',
					checkDeviceInMeeting: '/cgi-bin/meeting/check_device_in_meeting',
					createCustomerShortUrl: '/cgi-bin/meeting/create_customer_short_url',
					getCustomerShortUrl: '/cgi-bin/meeting/get_customer_short_url',
					phoneGetTmpOpenid: '/cgi-bin/meeting/phone/get_tmp_openid',
					vipBatchDelJobResult: '/cgi-bin/meeting/vip/batch_del_job_result',
				};
				response = await weComApiRequest.call(this, 'POST', pathMap[operation], body);
			}
			// --- 布局 / 高级布局 / 背景（结构化） ---
			else if (
				operation === 'advLayoutAdd' ||
				operation === 'advLayoutUpdate' ||
				operation === 'advLayoutApply' ||
				operation === 'advLayoutList' ||
				operation === 'advLayoutGetUserLayout' ||
				operation === 'advLayoutBatchDelete' ||
				operation === 'basicLayoutAdd' ||
				operation === 'basicLayoutUpdate' ||
				operation === 'layoutAddBackground' ||
				operation === 'layoutSetDefaultBackground' ||
				operation === 'layoutListBackground' ||
				operation === 'layoutDeleteBackground' ||
				operation === 'layoutBatchDeleteBackground'
			) {
				const meetingid = this.getNodeParameter('layout_meetingid', i) as string;
				const layout_id = this.getNodeParameter('layout_id', i, '') as string;
				const layout_id_list_raw = this.getNodeParameter('layout_id_list', i, '') as string;
				const background_id = this.getNodeParameter('background_id', i, '') as string;
				const background_id_list_raw = this.getNodeParameter(
					'background_id_list',
					i,
					'',
				) as string;
				const layout_userid = this.getNodeParameter('layout_userid', i, '') as string;
				const layoutConfigJson = this.getNodeParameter('layoutConfigJson', i, '{}') as string;
				const layoutExtraJson = this.getNodeParameter('layoutExtraJson', i, '{}') as string;

				const body: IDataObject = { meetingid };
				if (layout_id !== undefined && layout_id !== null && [
					'advLayoutApply',
					'advLayoutUpdate',
					'basicLayoutUpdate',
				].includes(operation)) {
					// apply 允许空字符串恢复默认
					body.layout_id = layout_id;
				}
				if (operation === 'advLayoutBatchDelete' && layout_id_list_raw) {
					body.layout_id_list = layout_id_list_raw
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean);
				}
				if (
					(operation === 'layoutDeleteBackground' ||
						operation === 'layoutSetDefaultBackground') &&
					background_id !== undefined
				) {
					if (operation === 'layoutDeleteBackground') {
						body.background_id = background_id;
					} else {
						body.selected_background_id = background_id;
					}
				}
				if (operation === 'layoutBatchDeleteBackground' && background_id_list_raw) {
					body.background_id_list = background_id_list_raw
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean);
				}
				if (operation === 'advLayoutGetUserLayout' && layout_userid) {
					body.userid = layout_userid;
				}
				try {
					Object.assign(body, JSON.parse(layoutConfigJson || '{}') as IDataObject);
				} catch {
					// ignore
				}
				try {
					Object.assign(body, JSON.parse(layoutExtraJson || '{}') as IDataObject);
				} catch {
					// ignore
				}
				body.meetingid = meetingid;

				const pathMap: Record<string, string> = {
					advLayoutAdd: '/cgi-bin/meeting/advanced_layout/add',
					advLayoutUpdate: '/cgi-bin/meeting/advanced_layout/update',
					advLayoutApply: '/cgi-bin/meeting/advanced_layout/apply',
					advLayoutList: '/cgi-bin/meeting/advanced_layout/list',
					advLayoutGetUserLayout: '/cgi-bin/meeting/advanced_layout/get_user_layout',
					advLayoutBatchDelete: '/cgi-bin/meeting/advanced_layout/batch_delete',
					basicLayoutAdd: '/cgi-bin/meeting/layout/add',
					basicLayoutUpdate: '/cgi-bin/meeting/layout/update',
					layoutAddBackground: '/cgi-bin/meeting/layout/add_background',
					layoutSetDefaultBackground: '/cgi-bin/meeting/layout/set_default_background',
					layoutListBackground: '/cgi-bin/meeting/layout/list_background',
					layoutDeleteBackground: '/cgi-bin/meeting/layout/delete_background',
					layoutBatchDeleteBackground: '/cgi-bin/meeting/layout/batch_delete_background',
				};
				response = await weComApiRequest.call(this, 'POST', pathMap[operation], body);
			} else if (meetingExtraHttpOpsById[operation]) {
				const op = meetingExtraHttpOpsById[operation] as MeetingExtraHttpOp;
				const bodyDefaults: IDataObject = {};
				if (op.needsMeetingId) {
					const meetingid = this.getNodeParameter('meetingid', i, '') as string;
					if (meetingid) bodyDefaults.meetingid = meetingid;
				}
				if (op.needsRecordFileId) {
					const record_file_id = this.getNodeParameter('record_file_id', i, '') as string;
					if (record_file_id) bodyDefaults.record_file_id = record_file_id;
				}
				response = await executeExtraHttpOp.call(this, op, i, bodyDefaults);
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
