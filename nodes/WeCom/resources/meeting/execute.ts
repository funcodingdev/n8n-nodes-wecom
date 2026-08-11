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
			if (operation === 'createMeeting' || operation === 'createAdvancedMeeting') {
				// https://developer.work.weixin.qq.com/document/path/98148
				const admin_userid = this.getNodeParameter('admin_userid', i, '') as string;
				// 新字段 title；兼容旧 subject
				const title =
					(this.getNodeParameter('title', i, '') as string) ||
					(this.getNodeParameter('subject', i, '') as string);
				// 新字段 meeting_start；兼容旧 start_time
				let meeting_start = dateTimeToUnixTimestamp(
					this.getNodeParameter('meeting_start', i, '') as string | number,
				);
				if (!meeting_start) {
					meeting_start = dateTimeToUnixTimestamp(
						this.getNodeParameter('start_time', i, '') as string | number,
					);
				}
				// 新字段 meeting_duration；兼容旧 end_time 差值
				let meeting_duration = this.getNodeParameter('meeting_duration', i, 0) as number;
				if (!meeting_duration) {
					const end_time = dateTimeToUnixTimestamp(
						this.getNodeParameter('end_time', i, '') as string | number,
					);
					if (end_time && meeting_start && end_time > meeting_start) {
						meeting_duration = end_time - meeting_start;
					} else {
						meeting_duration = 3600;
					}
				}
				const description = this.getNodeParameter('description', i, '') as string;
				const location = this.getNodeParameter('location', i, '') as string;
				const invitee_userids = this.getNodeParameter('invitee_userids', i, '') as string;
				const cal_id = this.getNodeParameter('cal_id', i, '') as string;
				const agentid = this.getNodeParameter('agentid', i, 0) as number;
				const createMeetingExtraJson = this.getNodeParameter(
					'createMeetingExtraJson',
					i,
					'{}',
				) as string;

				const body: IDataObject = {
					admin_userid,
					title,
					meeting_start,
					meeting_duration,
				};
				if (description) body.description = description;
				if (location) body.location = location;
				if (cal_id) body.cal_id = cal_id;
				if (agentid) body.agentid = agentid;

				// invitees
				let inviteeIds = invitee_userids
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
				// 兼容旧 attendeesCollection / inviteesCollection
				if (!inviteeIds.length) {
					const attendeesCollection = this.getNodeParameter(
						'attendeesCollection',
						i,
						{},
					) as IDataObject;
					const inviteesCollection = this.getNodeParameter(
						'inviteesCollection',
						i,
						{},
					) as IDataObject;
					const fromAttendees = ((attendeesCollection?.attendees as IDataObject[]) || [])
						.map((a) => String(a.userid || '').trim())
						.filter(Boolean);
					const fromInvitees = ((inviteesCollection?.invitees as IDataObject[]) || [])
						.map((a) => String(a.userid || '').trim())
						.filter(Boolean);
					inviteeIds = [...fromAttendees, ...fromInvitees];
				}
				if (inviteeIds.length) body.invitees = { userid: inviteeIds };

				// guests（普通/高级创建均支持）
				{
					const guestsCollection = this.getNodeParameter(
						'guestsCollection',
						i,
						{},
					) as IDataObject;
					const guests = ((guestsCollection?.guests as IDataObject[]) || [])
						.filter((g) => g.phone_number)
						.map((g) => {
							const item: IDataObject = {
								area: g.area || '86',
								phone_number: g.phone_number,
							};
							if (g.guest_name) item.guest_name = g.guest_name;
							return item;
						});
					if (guests.length) body.guests = guests;
				}

				// settings
				const settings: IDataObject = {};
				const settings_password = this.getNodeParameter('settings_password', i, '') as string;
				const settings_enable_waiting_room = this.getNodeParameter(
					'settings_enable_waiting_room',
					i,
					false,
				) as boolean;
				const settings_allow_enter_before_host = this.getNodeParameter(
					'settings_allow_enter_before_host',
					i,
					true,
				) as boolean;
				const settings_enable_enter_mute = this.getNodeParameter(
					'settings_enable_enter_mute',
					i,
					2,
				) as number;
				const settings_remind_scope = this.getNodeParameter(
					'settings_remind_scope',
					i,
					2,
				) as number;
				const settings_host_userids = this.getNodeParameter(
					'settings_host_userids',
					i,
					'',
				) as string;
				if (settings_password) settings.password = settings_password;
				settings.enable_waiting_room = settings_enable_waiting_room;
				settings.allow_enter_before_host = settings_allow_enter_before_host;
				settings.enable_enter_mute = settings_enable_enter_mute;
				settings.remind_scope = settings_remind_scope;
				const settings_enable_screen_watermark = this.getNodeParameter(
					'settings_enable_screen_watermark',
					i,
					false,
				) as boolean;
				settings.enable_screen_watermark = settings_enable_screen_watermark;
				const hostIds = settings_host_userids
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
				if (hostIds.length) settings.hosts = { userid: hostIds };
				if (settings_remind_scope === 4) {
					const ringIds = (this.getNodeParameter('settings_ring_userids', i, '') as string)
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean);
					if (ringIds.length) settings.ring_users = { userid: ringIds };
				}

				// 普通创建 / 高级创建共用 settings 与周期会议
				settings.allow_unmute_self = this.getNodeParameter(
					'settings_allow_unmute_self',
					i,
					true,
				) as boolean;
				settings.allow_external_user = this.getNodeParameter(
					'settings_allow_external_user',
					i,
					true,
				) as boolean;
				settings.enable_enroll = this.getNodeParameter(
					'settings_enable_enroll',
					i,
					false,
				) as boolean;
				settings.auto_record_type = this.getNodeParameter(
					'settings_auto_record_type',
					i,
					'none',
				) as string;
				const reminders_is_repeat = this.getNodeParameter(
					'reminders_is_repeat',
					i,
					false,
				) as boolean;
				const remind_before = this.getNodeParameter(
					'reminders_remind_before',
					i,
					[],
				) as number[];
				const reminders: IDataObject = {};
				if (reminders_is_repeat) {
					const reminders_repeat_type = this.getNodeParameter(
						'reminders_repeat_type',
						i,
						0,
					) as number;
					reminders.is_repeat = 1;
					reminders.repeat_type = reminders_repeat_type;
					if (reminders_repeat_type === 1) {
						const interval = this.getNodeParameter(
							'reminders_repeat_interval',
							i,
							1,
						) as number;
						if (interval) reminders.repeat_interval = Math.min(Math.max(interval, 1), 2);
					}
					const until = dateTimeToUnixTimestamp(
						this.getNodeParameter('reminders_repeat_until', i, '') as string | number,
					);
					if (until) reminders.repeat_until = until;
				}
				if (Array.isArray(remind_before) && remind_before.length) {
					reminders.remind_before = remind_before;
				}
				if (Object.keys(reminders).length) body.reminders = reminders;

				// 兼容旧 advancedSettings collection
				const advancedSettings = this.getNodeParameter(
					'advancedSettings',
					i,
					{},
				) as IDataObject;
				if (advancedSettings?.description && !body.description) {
					body.description = advancedSettings.description;
				}
				if (advancedSettings?.password) settings.password = advancedSettings.password;
				if (advancedSettings?.enable_mute_on_entry !== undefined) {
					settings.enable_enter_mute = advancedSettings.enable_mute_on_entry ? 1 : 0;
				}
				if (advancedSettings?.allow_enter_before_host !== undefined) {
					settings.allow_enter_before_host = advancedSettings.allow_enter_before_host;
				}

				if (Object.keys(settings).length) body.settings = settings;

				try {
					const extra = JSON.parse(createMeetingExtraJson || '{}') as IDataObject;
					if (extra.settings && typeof extra.settings === 'object') {
						body.settings = {
							...((body.settings as IDataObject) || {}),
							...(extra.settings as IDataObject),
						};
						delete extra.settings;
					}
					if (extra.reminders && typeof extra.reminders === 'object') {
						body.reminders = {
							...((body.reminders as IDataObject) || {}),
							...(extra.reminders as IDataObject),
						};
						delete extra.reminders;
					}
					Object.assign(body, extra);
					if (admin_userid) body.admin_userid = admin_userid;
					if (title) body.title = title;
				} catch {
					// ignore
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/create', body);
			} else if (operation === 'updateMeeting') {
				// https://developer.work.weixin.qq.com/document/path/98154
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const title =
					(this.getNodeParameter('title', i, '') as string) ||
					(this.getNodeParameter('subject', i, '') as string);
				const start_raw =
					(this.getNodeParameter('meeting_start', i, '') as string | number) ||
					(this.getNodeParameter('start_time', i, '') as string | number);
				const meeting_duration = this.getNodeParameter('meeting_duration', i, 0) as number;
				const end_time_raw = this.getNodeParameter('end_time', i, '') as string | number;
				const description = this.getNodeParameter('description', i, '') as string;
				const location = this.getNodeParameter('location', i, '') as string;
				const invitee_userids = this.getNodeParameter('invitee_userids', i, '') as string;
				const settings_password = this.getNodeParameter('settings_password', i, '') as string;
				const settings_enable_enter_mute = this.getNodeParameter(
					'settings_enable_enter_mute',
					i,
					-1,
				) as number;
				const settings_remind_scope = this.getNodeParameter(
					'settings_remind_scope',
					i,
					0,
				) as number;
				const settings_host_userids = this.getNodeParameter(
					'settings_host_userids',
					i,
					'',
				) as string;
				const settings_auto_record_type = this.getNodeParameter(
					'settings_auto_record_type',
					i,
					'',
				) as string;
				const update_write_settings = this.getNodeParameter(
					'update_write_settings',
					i,
					false,
				) as boolean;
				const updateMeetingExtraJson = this.getNodeParameter(
					'updateMeetingExtraJson',
					i,
					'{}',
				) as string;

				const body: IDataObject = { meetingid };
				if (title) body.title = title;
				const meeting_start = dateTimeToUnixTimestamp(start_raw);
				if (meeting_start > 0) {
					body.meeting_start = meeting_start;
					if (meeting_duration > 0) body.meeting_duration = meeting_duration;
					else {
						const end_time = dateTimeToUnixTimestamp(end_time_raw);
						if (end_time > meeting_start) body.meeting_duration = end_time - meeting_start;
					}
				} else if (meeting_duration > 0) {
					body.meeting_duration = meeting_duration;
				}
				if (description) body.description = description;
				if (location) body.location = location;
				const inviteeIds = invitee_userids
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
				if (inviteeIds.length) body.invitees = { userid: inviteeIds };

				const settings: IDataObject = {};
				if (settings_password) settings.password = settings_password;
				if (settings_enable_enter_mute !== -1) {
					settings.enable_enter_mute = settings_enable_enter_mute;
				}
				if (settings_remind_scope > 0) settings.remind_scope = settings_remind_scope;
				const hostIds = settings_host_userids
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
				if (hostIds.length) settings.hosts = { userid: hostIds };
				if (settings_remind_scope === 4) {
					const ringIds = (this.getNodeParameter('settings_ring_userids', i, '') as string)
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean);
					if (ringIds.length) settings.ring_users = { userid: ringIds };
				}
				if (settings_auto_record_type) {
					settings.auto_record_type = settings_auto_record_type;
				}
				if (update_write_settings) {
					settings.enable_waiting_room = this.getNodeParameter(
						'settings_enable_waiting_room',
						i,
						false,
					) as boolean;
					settings.allow_enter_before_host = this.getNodeParameter(
						'settings_allow_enter_before_host',
						i,
						true,
					) as boolean;
					settings.enable_screen_watermark = this.getNodeParameter(
						'settings_enable_screen_watermark',
						i,
						false,
					) as boolean;
					settings.allow_unmute_self = this.getNodeParameter(
						'settings_allow_unmute_self',
						i,
						true,
					) as boolean;
					settings.allow_external_user = this.getNodeParameter(
						'settings_allow_external_user',
						i,
						true,
					) as boolean;
					settings.enable_enroll = this.getNodeParameter(
						'settings_enable_enroll',
						i,
						false,
					) as boolean;
				}
				if (Object.keys(settings).length) body.settings = settings;

				try {
					const extra = JSON.parse(updateMeetingExtraJson || '{}') as IDataObject;
					if (extra.settings && typeof extra.settings === 'object') {
						body.settings = {
							...((body.settings as IDataObject) || {}),
							...(extra.settings as IDataObject),
						};
						delete extra.settings;
					}
					Object.assign(body, extra);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update', body);
			} else if (operation === 'cancelMeeting') {
				// https://developer.work.weixin.qq.com/document/path/98153
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const sub_meetingid = this.getNodeParameter('sub_meetingid', i, '') as string;
				const body: IDataObject = { meetingid };
				if (sub_meetingid) body.sub_meetingid = sub_meetingid;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/cancel', body);
			} else if (operation === 'getMeetingInfo') {
				// https://developer.work.weixin.qq.com/document/path/98149
				const meetingid = this.getNodeParameter('meetingid', i, '') as string;
				const meeting_code = this.getNodeParameter('meeting_code', i, '') as string;
				const sub_meetingid = this.getNodeParameter('sub_meetingid', i, '') as string;
				const body: IDataObject = {};
				if (meetingid) body.meetingid = meetingid;
				if (meeting_code) body.meeting_code = meeting_code;
				if (sub_meetingid) body.sub_meetingid = sub_meetingid;
				if (!body.meetingid && !body.meeting_code) {
					throw new Error('meetingid 与 meeting_code 至少填写一个');
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_info', body);
			} else if (operation === 'getUserMeetings') {
				// https://developer.work.weixin.qq.com/document/path/98150
				const userid = this.getNodeParameter('userid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 50) as number;
				const begin_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('begin_time', i, '') as string | number,
				);
				const end_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('end_time', i, '') as string | number,
				);

				const body: IDataObject = { userid, limit: Math.min(limit || 50, 100) };
				if (cursor) body.cursor = cursor;
				if (begin_time) body.begin_time = begin_time;
				if (end_time) body.end_time = end_time;

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
			else if (operation === 'updateAdvancedMeeting') {
				// https://developer.work.weixin.qq.com/document/path/98154
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const title =
					(this.getNodeParameter('title', i, '') as string) ||
					(this.getNodeParameter('subject', i, '') as string);
				const start_raw =
					(this.getNodeParameter('meeting_start', i, '') as string | number) ||
					(this.getNodeParameter('start_time', i, '') as string | number);
				const meeting_duration = this.getNodeParameter('meeting_duration', i, 0) as number;
				const end_time_raw = this.getNodeParameter('end_time', i, '') as string | number;
				const description = this.getNodeParameter('description', i, '') as string;
				const location = this.getNodeParameter('location', i, '') as string;
				const invitee_userids = this.getNodeParameter('invitee_userids', i, '') as string;
				const advancedSettings = this.getNodeParameter('advancedSettings', i, {}) as IDataObject;
				const settings_password = this.getNodeParameter('settings_password', i, '') as string;
				const settings_enable_enter_mute = this.getNodeParameter(
					'settings_enable_enter_mute',
					i,
					-1,
				) as number;
				const settings_remind_scope = this.getNodeParameter(
					'settings_remind_scope',
					i,
					0,
				) as number;
				const settings_host_userids = this.getNodeParameter(
					'settings_host_userids',
					i,
					'',
				) as string;
				const settings_auto_record_type = this.getNodeParameter(
					'settings_auto_record_type',
					i,
					'',
				) as string;
				const update_write_settings = this.getNodeParameter(
					'update_write_settings',
					i,
					false,
				) as boolean;

				const body: IDataObject = { meetingid };
				if (title) body.title = title;
				const meeting_start = dateTimeToUnixTimestamp(start_raw);
				if (meeting_start > 0) {
					body.meeting_start = meeting_start;
					if (meeting_duration > 0) body.meeting_duration = meeting_duration;
					else {
						const end_time = dateTimeToUnixTimestamp(end_time_raw);
						if (end_time > meeting_start) body.meeting_duration = end_time - meeting_start;
					}
				} else if (meeting_duration > 0) {
					body.meeting_duration = meeting_duration;
				}
				if (description) body.description = description;
				if (location) body.location = location;
				const inviteeIds = invitee_userids
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
				if (inviteeIds.length) body.invitees = { userid: inviteeIds };

				const guestsCollection = this.getNodeParameter(
					'guestsCollection',
					i,
					{},
				) as IDataObject;
				const guests = ((guestsCollection?.guests as IDataObject[]) || [])
					.filter((g) => g.phone_number)
					.map((g) => {
						const item: IDataObject = {
							area: g.area || '86',
							phone_number: g.phone_number,
						};
						if (g.guest_name) item.guest_name = g.guest_name;
						return item;
					});
				if (guests.length) body.guests = guests;

				const settings: IDataObject = {};
				if (settings_password) settings.password = settings_password;
				if (settings_enable_enter_mute !== -1) {
					settings.enable_enter_mute = settings_enable_enter_mute;
				}
				if (settings_remind_scope > 0) settings.remind_scope = settings_remind_scope;
				const hostIds = settings_host_userids
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
				if (hostIds.length) settings.hosts = { userid: hostIds };
				if (settings_remind_scope === 4) {
					const ringIds = (this.getNodeParameter('settings_ring_userids', i, '') as string)
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean);
					if (ringIds.length) settings.ring_users = { userid: ringIds };
				}
				if (settings_auto_record_type) {
					settings.auto_record_type = settings_auto_record_type;
				}
				if (update_write_settings) {
					settings.enable_waiting_room = this.getNodeParameter(
						'settings_enable_waiting_room',
						i,
						false,
					) as boolean;
					settings.allow_enter_before_host = this.getNodeParameter(
						'settings_allow_enter_before_host',
						i,
						true,
					) as boolean;
					settings.enable_screen_watermark = this.getNodeParameter(
						'settings_enable_screen_watermark',
						i,
						false,
					) as boolean;
					settings.allow_unmute_self = this.getNodeParameter(
						'settings_allow_unmute_self',
						i,
						true,
					) as boolean;
					settings.allow_external_user = this.getNodeParameter(
						'settings_allow_external_user',
						i,
						true,
					) as boolean;
					settings.enable_enroll = this.getNodeParameter(
						'settings_enable_enroll',
						i,
						false,
					) as boolean;
				}
				// 兼容旧 advancedSettings 扁平字段 → settings
				if (advancedSettings.description && !body.description) {
					body.description = advancedSettings.description;
				}
				if (advancedSettings.password) settings.password = advancedSettings.password;
				if (advancedSettings.enable_mute_on_entry !== undefined) {
					settings.enable_enter_mute = advancedSettings.enable_mute_on_entry ? 1 : 0;
				}
				if (advancedSettings.allow_enter_before_host !== undefined) {
					settings.allow_enter_before_host = advancedSettings.allow_enter_before_host;
				}
				if (Object.keys(settings).length) body.settings = settings;
				try {
					const updateMeetingExtraJson = this.getNodeParameter(
						'updateMeetingExtraJson',
						i,
						'{}',
					) as string;
					const extra = JSON.parse(updateMeetingExtraJson || '{}') as IDataObject;
					if (extra.settings && typeof extra.settings === 'object') {
						body.settings = {
							...((body.settings as IDataObject) || {}),
							...(extra.settings as IDataObject),
						};
						delete extra.settings;
					}
					Object.assign(body, extra);
					body.meetingid = meetingid;
				} catch {
					// ignore
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update', body);
			} else if (operation === 'getMeetingInvitees') {
				// https://developer.work.weixin.qq.com/document/path/98160
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { meetingid };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_invitees', body);
			} else if (operation === 'updateMeetingInvitees') {
				// https://developer.work.weixin.qq.com/document/path/98162
				// 路径为 set_invitees，覆盖式完整列表
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const invitee_userids = this.getNodeParameter('invitee_userids', i, '') as string;
				const inviteesCollection = this.getNodeParameter(
					'inviteesCollection',
					i,
					{},
				) as IDataObject;
				// 兼容旧 add/del 表单：仅取 add 列表作为完整列表（官方不支持增量）
				const addInviteesCollection = this.getNodeParameter(
					'addInviteesCollection',
					i,
					{},
				) as IDataObject;

				const ids = new Set<string>();
				invitee_userids
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean)
					.forEach((id) => ids.add(id));
				((inviteesCollection?.invitees as IDataObject[]) || []).forEach((inv) => {
					if (inv.userid) ids.add(String(inv.userid).trim());
				});
				((addInviteesCollection?.invitees as IDataObject[]) || []).forEach((inv) => {
					if (inv.userid) ids.add(String(inv.userid).trim());
				});

				const body: IDataObject = {
					meetingid,
					invitees: Array.from(ids).map((userid) => ({ userid })),
				};

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/set_invitees', body);
			} else if (operation === 'getLiveParticipants') {
				// 获取实时会中成员列表
				// https://developer.work.weixin.qq.com/document/path/98157
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const size = this.getNodeParameter('size', i, 50) as number;
				const sub_meetingid = this.getNodeParameter('sub_meetingid', i, '') as string;

				const body: IDataObject = { meetingid, limit: Math.min(size || 50, 50) };
				if (cursor) body.cursor = cursor;
				if (sub_meetingid) body.sub_meetingid = sub_meetingid;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/get_realtime_attendee_list',
					body,
				);
			} else if (operation === 'getParticipants') {
				// 获取已参会成员列表
				// https://developer.work.weixin.qq.com/document/path/98156
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const size = this.getNodeParameter('size', i, 100) as number;
				const sub_meetingid = this.getNodeParameter('sub_meetingid', i, '') as string;
				const start_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('attendee_start_time', i, '') as string | number,
				);
				const end_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('attendee_end_time', i, '') as string | number,
				);

				const body: IDataObject = { meetingid, limit: Math.min(size || 100, 100) };
				if (cursor) body.cursor = cursor;
				if (sub_meetingid) body.sub_meetingid = sub_meetingid;
				if (start_time) body.start_time = start_time;
				if (end_time) body.end_time = end_time;

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

				const users = ((membersCollection.members as IDataObject[]) || [])
					.map((m) => {
						const item: IDataObject = {
							instance_id: m.instance_id ?? 1,
						};
						// 官方字段为 tmp_openid；兼容旧表单 userid 字段
						if (m.tmp_openid) item.tmp_openid = m.tmp_openid;
						else if (m.userid) item.tmp_openid = m.userid;
						return item;
					})
					.filter((u) => u.tmp_openid);
				// 示例为单对象；参数表为数组 —— 单人用对象，多人用数组
				const operated_user = users.length === 1 ? users[0] : users;

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

				const operated_users = ((membersCollection.members as IDataObject[]) || [])
					.map((m) => {
						const item: IDataObject = {
							instance_id: m.instance_id ?? 1,
						};
						if (m.tmp_openid) item.tmp_openid = m.tmp_openid;
						else if (m.userid) item.tmp_openid = m.userid;
						return item;
					})
					.filter((u) => u.tmp_openid);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/realcontrol/kickout_users',
					{
						meetingid,
						allow_rejoin,
						operated_users,
					},
				);
			} else if (operation === 'endMeeting') {
				// https://developer.work.weixin.qq.com/document/path/98187
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const force_dismiss = this.getNodeParameter('force_dismiss', i, 1) as number;
				const retrieve_code = this.getNodeParameter('retrieve_code', i, 0) as number;
				const body: IDataObject = {
					meetingid,
					force_dismiss,
					retrieve_code,
				};

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/realcontrol/dismiss',
					body,
				);
			}
			// 录制管理
			else if (operation === 'listRecordings') {
				// https://developer.work.weixin.qq.com/document/path/98192
				const meetingid = this.getNodeParameter('meetingid', i, '') as string;
				const meeting_code = this.getNodeParameter('meeting_code', i, '') as string;
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
				else if (meeting_code) body.meeting_code = meeting_code;
				if (userid) body.userid = userid;
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/record/list', body);
			} else if (operation === 'getRecordingAddress') {
				// get_file：单文件详情；get_file_list：会议录制地址（meeting_record_id）
				// https://developer.work.weixin.qq.com/document/path/98205
				// https://developer.work.weixin.qq.com/document/path/98196
				const meetingid = this.getNodeParameter('meetingid', i, '') as string;
				const record_file_id = this.getNodeParameter('record_file_id', i, '') as string;
				const meeting_record_id = this.getNodeParameter(
					'meeting_record_id',
					i,
					'',
				) as string;

				if (meeting_record_id) {
					const body: IDataObject = { meeting_record_id };
					if (meetingid) body.meetingid = meetingid;
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/meeting/record/get_file_list',
						body,
					);
				} else if (record_file_id) {
					const body: IDataObject = { record_file_id };
					if (meetingid) body.meetingid = meetingid;
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/meeting/record/get_file',
						body,
					);
				} else {
					throw new Error('请填写会议录制ID或录制文件ID');
				}
			}
			// 高级功能账号管理
			else if (operation === 'allocateMeetingAdvancedAccount') {
				const vip_userids = this.getNodeParameter('vip_userids', i, '') as string;
				const useridCollection = this.getNodeParameter('useridCollection', i, {}) as IDataObject;

				const userid_list: string[] = vip_userids
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
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
					{ userid_list: [...new Set(userid_list)] },
				);
			} else if (operation === 'deallocateMeetingAdvancedAccount') {
				const vip_userids = this.getNodeParameter('vip_userids', i, '') as string;
				const useridCollection = this.getNodeParameter('useridCollection', i, {}) as IDataObject;

				const userid_list: string[] = vip_userids
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean);
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
					{ userid_list: [...new Set(userid_list)] },
				);
			} else if (operation === 'getMeetingAdvancedAccountList') {
				// https://developer.work.weixin.qq.com/document/path/99510
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit: Math.min(limit || 100, 200) };
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
				const enrollQuestionsCollection = this.getNodeParameter(
					'enrollQuestionsCollection',
					i,
					{},
				) as IDataObject;
				const body: IDataObject = {
					meetingid,
					approve_type: enroll_approve_type,
					is_collect_question: enroll_is_collect_question,
					no_registration_needed_for_staff: enroll_no_registration_needed_for_staff,
				};
				const formQuestions = ((enrollQuestionsCollection?.questions as IDataObject[]) || [])
					.map((q) => {
						const item: IDataObject = {
							is_required: q.is_required ?? 1,
						};
						if (q.special_type && Number(q.special_type) !== 1) {
							item.special_type = q.special_type;
						} else {
							item.special_type = 1;
							if (q.question_type) item.question_type = q.question_type;
							if (q.question_title) item.question_title = q.question_title;
							const opts = String(q.option_contents || '')
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean)
								.slice(0, 8)
								.map((content) => ({ content }));
							if (opts.length) item.option_list = opts;
						}
						return item;
					});
				if (formQuestions.length) body.question_list = formQuestions;
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
				const body: IDataObject = { meetingid, limit, status: enroll_status };
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/enroll/list', body);
			} else if (operation === 'approveEnroll') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const enroll_id_list = this.getNodeParameter('enroll_id_list', i, '') as string;
				// 兼容旧字段 enroll_approve_status；官方为 action：1取消批准 2拒绝 3批准
				let enroll_approve_action = this.getNodeParameter(
					'enroll_approve_action',
					i,
					0,
				) as number;
				if (!enroll_approve_action) {
					const legacy = this.getNodeParameter('enroll_approve_status', i, 0) as number;
					// 旧枚举 1=通过→3, 2=驳回→2
					if (legacy === 1) enroll_approve_action = 3;
					else if (legacy === 2) enroll_approve_action = 2;
					else enroll_approve_action = 3;
				}
				const approveJson = this.getNodeParameter('approveJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					action: enroll_approve_action,
				};
				const ids = enroll_id_list.split(',').map((s) => s.trim()).filter(Boolean);
				if (ids.length) body.enroll_id_list = ids;
				try {
					Object.assign(body, JSON.parse(approveJson || '{}') as IDataObject);
					body.meetingid = meetingid;
					if (!body.action) body.action = enroll_approve_action;
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
				// https://developer.work.weixin.qq.com/document/path/98180
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cohost_action = this.getNodeParameter('cohost_action', i, true) as boolean;
				const cohost_tmp_openid = this.getNodeParameter('cohost_tmp_openid', i, '') as string;
				const cohost_instance_id = this.getNodeParameter('cohost_instance_id', i, 1) as number;
				// 兼容：若仅有旧 cohost_userids，取其首个作为 tmp_openid（语义可能不正确）
				const cohost_userids = this.getNodeParameter('cohost_userids', i, '') as string;
				const legacyFirst = cohost_userids
					.split(',')
					.map((id) => id.trim())
					.filter(Boolean)[0];
				const tmp_openid = cohost_tmp_openid || legacyFirst || '';
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/realcontrol/set_cohost', {
					meetingid,
					action: cohost_action,
					operated_user: {
						tmp_openid,
						instance_id: cohost_instance_id,
					},
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
				// https://developer.work.weixin.qq.com/document/path/98844
				// GET，无请求体
				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/meeting/layout/list_template',
					{},
				);
			} else if (operation === 'setDefaultLayout') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const selected_layout_id = this.getNodeParameter('selected_layout_id', i, '') as string;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					selected_layout_id,
				};
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
				// https://developer.work.weixin.qq.com/document/path/98824
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const phone_status_cursor = this.getNodeParameter(
					'phone_status_cursor',
					i,
					'',
				) as string;
				const phone_status_limit = this.getNodeParameter(
					'phone_status_limit',
					i,
					50,
				) as number;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					limit: Math.min(phone_status_limit || 50, 100),
				};
				if (phone_status_cursor) body.cursor = phone_status_cursor;
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
				const poll_operator_userid = this.getNodeParameter(
					'poll_operator_userid',
					i,
					'',
				) as string;
				const poll_instance_id = this.getNodeParameter('poll_instance_id', i, 1) as number;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = { meetingid, instance_id: poll_instance_id };
				if (poll_operator_userid) body.operator_userid = poll_operator_userid;
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
				const poll_id_adv = this.getNodeParameter('poll_id_adv', i, '') as string;
				const poll_operator_userid = this.getNodeParameter(
					'poll_operator_userid',
					i,
					'',
				) as string;
				const poll_instance_id = this.getNodeParameter('poll_instance_id', i, 1) as number;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					instance_id: poll_instance_id,
				};
				if (poll_id_adv) body.poll_id = poll_id_adv;
				if (poll_operator_userid) body.operator_userid = poll_operator_userid;
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
				const cover_url = this.getNodeParameter('cover_url', i, '') as string;
				const webinar_description = this.getNodeParameter(
					'webinar_description',
					i,
					'',
				) as string;
				if (cover_url) body.cover_url = cover_url;
				if (webinar_description) body.description = webinar_description;
				if (host_userids) {
					body.hosts = host_userids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean)
						.map((userid) => ({ userid }));
				}
				// 活动页 / 互动
				body.enable_guest_invite_link = this.getNodeParameter(
					'enable_guest_invite_link',
					i,
					false,
				) as boolean;
				body.enable_qa = this.getNodeParameter('enable_qa', i, true) as boolean;
				body.enable_manual_check = this.getNodeParameter(
					'enable_manual_check',
					i,
					false,
				) as boolean;
				body.activity_page = this.getNodeParameter('activity_page', i, true) as boolean;
				body.display_number_of_attendees = this.getNodeParameter(
					'display_number_of_attendees',
					i,
					1,
				) as number;
				body.preparation_mode = this.getNodeParameter(
					'preparation_mode',
					i,
					false,
				) as boolean;
				const sensitive_words = (this.getNodeParameter('sensitive_words', i, '') as string)
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean)
					.slice(0, 50);
				if (sensitive_words.length) body.sensitive_words = sensitive_words;
				// media_setting
				const media_setting: IDataObject = {
					enable_enter_mute: this.getNodeParameter(
						'media_enable_enter_mute',
						i,
						true,
					) as boolean,
					allow_unmute_self: this.getNodeParameter(
						'media_allow_unmute_self',
						i,
						true,
					) as boolean,
					allow_enter_before_host: this.getNodeParameter(
						'media_allow_enter_before_host',
						i,
						true,
					) as boolean,
					enable_screen_watermark: this.getNodeParameter(
						'media_enable_screen_watermark',
						i,
						false,
					) as boolean,
					allow_external_user: this.getNodeParameter(
						'media_allow_external_user',
						i,
						true,
					) as boolean,
					auto_record_type: this.getNodeParameter(
						'media_auto_record_type',
						i,
						'none',
					) as string,
				};
				if (media_setting.enable_screen_watermark) {
					media_setting.watermark_type = this.getNodeParameter(
						'media_watermark_type',
						i,
						0,
					) as number;
				}
				if (media_setting.auto_record_type === 'cloud') {
					media_setting.attendee_join_auto_record = this.getNodeParameter(
						'media_attendee_join_auto_record',
						i,
						false,
					) as boolean;
					media_setting.enable_host_pause_auto_record = this.getNodeParameter(
						'media_enable_host_pause_auto_record',
						i,
						true,
					) as boolean;
				}
				body.media_setting = media_setting;
				try {
					const extra = JSON.parse(webinarExtraJson || '{}') as IDataObject;
					if (extra.media_setting && typeof extra.media_setting === 'object') {
						body.media_setting = {
							...((body.media_setting as IDataObject) || {}),
							...(extra.media_setting as IDataObject),
						};
						delete extra.media_setting;
					}
					Object.assign(body, extra);
					if (admin_userid) body.admin_userid = admin_userid;
					if (title) body.title = title;
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
				// https://developer.work.weixin.qq.com/document/path/98843
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const title = this.getNodeParameter('title', i, '') as string;
				const start_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('start_time', i, '') as string | number,
				);
				const end_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('end_time', i, '') as string | number,
				);
				const admission_type = this.getNodeParameter('admission_type', i, 0) as number;
				const playback_for_audience = this.getNodeParameter(
					'playback_for_audience',
					i,
					false,
				) as boolean;
				const sponsor = this.getNodeParameter('sponsor', i, '') as string;
				const password = this.getNodeParameter('password', i, '') as string;
				const cover_url = this.getNodeParameter('cover_url', i, '') as string;
				const webinar_description = this.getNodeParameter(
					'webinar_description',
					i,
					'',
				) as string;
				const host_userids = this.getNodeParameter('host_userids', i, '') as string;
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				if (title) body.title = title;
				if (start_time) body.start_time = String(start_time);
				if (end_time) body.end_time = String(end_time);
				body.admission_type = admission_type;
				body.playback_for_audience = playback_for_audience;
				if (sponsor) body.sponsor = sponsor;
				if (password) body.password = password;
				if (cover_url) body.cover_url = cover_url;
				if (webinar_description) body.description = webinar_description;
				if (host_userids) {
					body.hosts = host_userids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean)
						.map((userid) => ({ userid }));
				}
				body.enable_guest_invite_link = this.getNodeParameter(
					'enable_guest_invite_link',
					i,
					false,
				) as boolean;
				body.enable_qa = this.getNodeParameter('enable_qa', i, true) as boolean;
				body.enable_manual_check = this.getNodeParameter(
					'enable_manual_check',
					i,
					false,
				) as boolean;
				body.activity_page = this.getNodeParameter('activity_page', i, true) as boolean;
				body.display_number_of_attendees = this.getNodeParameter(
					'display_number_of_attendees',
					i,
					1,
				) as number;
				body.preparation_mode = this.getNodeParameter(
					'preparation_mode',
					i,
					false,
				) as boolean;
				const sensitive_words = (this.getNodeParameter('sensitive_words', i, '') as string)
					.split(',')
					.map((s) => s.trim())
					.filter(Boolean)
					.slice(0, 50);
				if (sensitive_words.length) body.sensitive_words = sensitive_words;
				const media_setting: IDataObject = {
					enable_enter_mute: this.getNodeParameter(
						'media_enable_enter_mute',
						i,
						true,
					) as boolean,
					allow_unmute_self: this.getNodeParameter(
						'media_allow_unmute_self',
						i,
						true,
					) as boolean,
					allow_enter_before_host: this.getNodeParameter(
						'media_allow_enter_before_host',
						i,
						true,
					) as boolean,
					enable_screen_watermark: this.getNodeParameter(
						'media_enable_screen_watermark',
						i,
						false,
					) as boolean,
					allow_external_user: this.getNodeParameter(
						'media_allow_external_user',
						i,
						true,
					) as boolean,
					auto_record_type: this.getNodeParameter(
						'media_auto_record_type',
						i,
						'none',
					) as string,
				};
				if (media_setting.enable_screen_watermark) {
					media_setting.watermark_type = this.getNodeParameter(
						'media_watermark_type',
						i,
						0,
					) as number;
				}
				if (media_setting.auto_record_type === 'cloud') {
					media_setting.attendee_join_auto_record = this.getNodeParameter(
						'media_attendee_join_auto_record',
						i,
						false,
					) as boolean;
					media_setting.enable_host_pause_auto_record = this.getNodeParameter(
						'media_enable_host_pause_auto_record',
						i,
						true,
					) as boolean;
				}
				body.media_setting = media_setting;
				try {
					const extra = JSON.parse(webinarExtraJson || '{}') as IDataObject;
					if (extra.media_setting && typeof extra.media_setting === 'object') {
						body.media_setting = {
							...((body.media_setting as IDataObject) || {}),
							...(extra.media_setting as IDataObject),
						};
						delete extra.media_setting;
					}
					Object.assign(body, extra);
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
				const guestsCollection = this.getNodeParameter(
					'webinarGuestsCollection',
					i,
					{},
				) as IDataObject;
				const body: IDataObject = { meetingid };
				let guests: IDataObject[] = ((guestsCollection?.guests as IDataObject[]) || [])
					.map((g) => {
						const item: IDataObject = { guest_type: g.guest_type ?? 1 };
						if (g.userid) item.userid = g.userid;
						if (g.area) item.area = g.area;
						if (g.phone_number) item.phone_number = g.phone_number;
						if (g.guest_name) item.guest_name = g.guest_name;
						if (g.email) item.email = g.email;
						return item;
					})
					.filter((g) => g.userid || g.phone_number);
				try {
					const fromJson = JSON.parse(guestsJson || '[]');
					if (Array.isArray(fromJson) && fromJson.length) guests = fromJson as IDataObject[];
				} catch {
					// ignore
				}
				body.guests = guests;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/webinar/update_guest_list',
					body,
				);
			} else if (operation === 'webinarUpdateWarmUp') {
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const warm_up_picture = this.getNodeParameter('warm_up_picture', i, '') as string;
				const warm_up_video = this.getNodeParameter('warm_up_video', i, '') as string;
				const allow_attendees_invite_others = this.getNodeParameter(
					'allow_attendees_invite_others',
					i,
					true,
				) as boolean;
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					allow_attendees_invite_others,
				};
				if (warm_up_picture) body.warm_up_picture = warm_up_picture;
				if (warm_up_video) body.warm_up_video = warm_up_video;
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
					const webinarQCollection = this.getNodeParameter(
						'webinarEnrollQuestionsCollection',
						i,
						{},
					) as IDataObject;
					const formQuestions = ((webinarQCollection?.questions as IDataObject[]) || []).map(
						(q) => {
							const item: IDataObject = {
								is_required: q.is_required ?? 1,
							};
							if (q.special_type && Number(q.special_type) !== 1) {
								item.special_type = q.special_type;
							} else {
								item.special_type = 1;
								if (q.question_type) item.question_type = q.question_type;
								if (q.question_title) item.question_title = q.question_title;
								const opts = String(q.option_contents || '')
									.split(',')
									.map((s) => s.trim())
									.filter(Boolean)
									.slice(0, 8)
									.map((content) => ({ content }));
								if (opts.length) item.option_list = opts;
							}
							return item;
						},
					);
					if (formQuestions.length) body.question_list = formQuestions;
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
				if (operation === 'webinarEnrollImport') {
					const importCollection = this.getNodeParameter(
						'webinarEnrollImportCollection',
						i,
						{},
					) as IDataObject;
					const formList = ((importCollection?.members as IDataObject[]) || [])
						.filter((m) => m.userid || m.phone_number)
						.map((m) => {
							const item: IDataObject = {};
							if (m.userid) item.userid = m.userid;
							if (m.phone_number) {
								item.phone_number = m.phone_number;
								item.area = m.area || '86';
							}
							if (m.nick_name) item.nick_name = m.nick_name;
							return item;
						});
					if (formList.length) body.enroll_list = formList;
				}
				if (operation === 'webinarEnrollQueryByTmpOpenid') {
					const tmp_openid = this.getNodeParameter(
						'webinar_enroll_tmp_openid',
						i,
						'',
					) as string;
					if (tmp_openid) body.tmp_openid = tmp_openid;
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
				// https://developer.work.weixin.qq.com/document/path/98206
				const meetingid = this.getNodeParameter('webinar_meetingid', i) as string;
				const meeting_record_id = this.getNodeParameter('meeting_record_id', i) as string;
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const body: IDataObject = { meetingid, meeting_record_id };
				try {
					Object.assign(body, JSON.parse(webinarExtraJson || '{}') as IDataObject);
					body.meetingid = meetingid;
					body.meeting_record_id = meeting_record_id;
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
				const meeting_record_id = this.getNodeParameter('meeting_record_id', i, '') as string;
				const record_stat_start_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('record_stat_start_time', i, '') as string | number,
				);
				const record_stat_end_time = dateTimeToUnixTimestamp(
					this.getNodeParameter('record_stat_end_time', i, '') as string | number,
				);
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				if (meeting_record_id) body.meeting_record_id = meeting_record_id;
				if (record_stat_start_time) body.start_time = record_stat_start_time;
				if (record_stat_end_time) body.end_time = record_stat_end_time;
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
				const record_file_id = this.getNodeParameter('webinar_record_file_id', i, '') as string;
				const meeting_record_id = this.getNodeParameter('meeting_record_id', i, '') as string;
				const sharing_enable_sharing = this.getNodeParameter(
					'sharing_enable_sharing',
					i,
					true,
				) as boolean;
				const sharing_auth_type = this.getNodeParameter('sharing_auth_type', i, 0) as number;
				const sharing_enable_password = this.getNodeParameter(
					'sharing_enable_password',
					i,
					false,
				) as boolean;
				const sharing_password = this.getNodeParameter('sharing_password', i, '') as string;
				const sharing_allow_download = this.getNodeParameter(
					'sharing_allow_download',
					i,
					false,
				) as boolean;
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const sharing_config: IDataObject = {
					enable_sharing: sharing_enable_sharing,
					sharing_auth_type,
					enable_password: sharing_enable_password,
					allow_download: sharing_allow_download,
				};
				if (sharing_enable_password && sharing_password) {
					sharing_config.password = sharing_password;
				}
				const body: IDataObject = {
					meetingid,
					sharing_config,
				};
				// 官方字段 meeting_record_id；兼容历史 record_file_id 入参
				const recordId = meeting_record_id || record_file_id;
				if (recordId) {
					body.meeting_record_id = recordId;
				}
				try {
					const extra = JSON.parse(webinarExtraJson || '{}') as IDataObject;
					if (extra.sharing_config && typeof extra.sharing_config === 'object') {
						Object.assign(sharing_config, extra.sharing_config as IDataObject);
						delete extra.sharing_config;
					}
					Object.assign(body, extra);
					body.meetingid = meetingid;
					body.sharing_config = sharing_config;
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
				const poll_id = this.getNodeParameter('poll_id', i, '') as string;
				if (poll_id) body.poll_id = poll_id;
				if (poll_topic) body.poll_topic = poll_topic;
				if (poll_desc) body.poll_desc = poll_desc;
				if (['pollCreateTheme', 'pollUpdateTheme'].includes(operation)) {
					body.is_anony = is_anony;
					const questionsCollection = this.getNodeParameter(
						'pollQuestionsCollection',
						i,
						{},
					) as IDataObject;
					let questions: IDataObject[] = ((questionsCollection?.questions as IDataObject[]) || [])
						.filter((q) => q.question_desc)
						.map((q) => ({
							question_type: q.question_type ?? 0,
							question_desc: q.question_desc,
							poll_option: String(q.poll_option || '')
								.split(',')
								.map((s) => s.trim())
								.filter(Boolean),
						}));
					try {
						const fromJson = JSON.parse(poll_questions_json || '[]');
						if (Array.isArray(fromJson) && fromJson.length) {
							questions = fromJson as IDataObject[];
						}
					} catch {
						// ignore
					}
					body.poll_questions = questions;
				}
				if (meeting_room_id) body.meeting_room_id = meeting_room_id;
				if (mra_tmp_openid) {
					body.mra = { tmp_openid: mra_tmp_openid };
				}
				if (['roomsCall', 'roomsCancelCall', 'roomsGetResponseStatus'].includes(operation)) {
					const rooms_invite_id = this.getNodeParameter('rooms_invite_id', i, '') as string;
					const mra_protocol = this.getNodeParameter('mra_protocol', i, 0) as number;
					const mra_dial_string = this.getNodeParameter('mra_dial_string', i, '') as string;
					if (rooms_invite_id) body.invite_id = rooms_invite_id;
					if (mra_protocol && mra_dial_string) {
						body.mra_address = {
							protocol: mra_protocol,
							dial_string: mra_dial_string,
						};
					}
				}
				if (operation === 'roomsListDevices') {
					const rooms_meeting_room_name = this.getNodeParameter(
						'rooms_meeting_room_name',
						i,
						'',
					) as string;
					if (rooms_meeting_room_name) body.meeting_room_name = rooms_meeting_room_name;
					delete body.meetingid;
					delete body.meeting_room_id;
				}
				if (operation === 'roomsListControllers') {
					// https://developer.work.weixin.qq.com/document/path/98799
					const rooms_controller_name = this.getNodeParameter(
						'rooms_controller_name',
						i,
						'',
					) as string;
					if (rooms_controller_name) body.controller_name = rooms_controller_name;
					delete body.meetingid;
					delete body.meeting_room_id;
					delete body.meeting_room_name;
				}
				if (operation === 'roomsListMeetings') {
					// https://developer.work.weixin.qq.com/document/path/98796
					// meeting_room_id 与 rooms_id 二选一；无 meetingid
					delete body.meetingid;
					const rooms_id = this.getNodeParameter('rooms_id', i, '') as string;
					const rooms_list_start_time = dateTimeToUnixTimestamp(
						this.getNodeParameter('rooms_list_start_time', i, '') as string | number,
					);
					const rooms_list_end_time = dateTimeToUnixTimestamp(
						this.getNodeParameter('rooms_list_end_time', i, '') as string | number,
					);
					if (rooms_id) {
						body.rooms_id = rooms_id;
						// 与 meeting_room_id 二选一优先 rooms_id 时仍可保留 meeting_room_id
					}
					if (rooms_list_start_time) body.start_time = rooms_list_start_time;
					if (rooms_list_end_time) body.end_time = rooms_list_end_time;
				}
				// roomsGetConfig 只需 meeting_room_id，不需要 meetingid
				if (operation === 'roomsGetConfig') {
					delete body.meetingid;
				}
				// get_inventory 无请求体字段
				if (operation === 'roomsGetInventory') {
					delete body.meetingid;
					delete body.meeting_room_id;
				}
				if (operation === 'mraSetDefaultLayout') {
					body.default_layout = this.getNodeParameter('mra_default_layout', i, 2) as number;
					body.default_novideo_user = this.getNodeParameter(
						'mra_default_novideo_user',
						i,
						1,
					) as number;
				}
				if (operation === 'mraSetRaiseHand') {
					// 官方字段以文档为准；常见 raise_hand / status 布尔
					const mra_raise_hand = this.getNodeParameter('mra_raise_hand', i, true) as boolean;
					body.raise_hand = mra_raise_hand;
				}
				if (operation === 'rcManageWaitingRoom') {
					body.operate_type = this.getNodeParameter('waiting_operate_type', i, 1) as number;
					if (body.operate_type === 3) {
						body.allow_rejoin = this.getNodeParameter(
							'waiting_allow_rejoin',
							i,
							true,
						) as boolean;
					}
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
					const usersCollection = this.getNodeParameter(
						'operatedUsersCollection',
						i,
						{},
					) as IDataObject;
					let users: IDataObject[] = ((usersCollection?.users as IDataObject[]) || [])
						.filter((u) => u.tmp_openid)
						.map((u) => {
							const item: IDataObject = {
								tmp_openid: u.tmp_openid,
								instance_id: u.instance_id ?? 1,
							};
							if (u.nickname) item.nickname = u.nickname;
							return item;
						});
					try {
						const fromJson = JSON.parse(operated_users_json || '[]');
						if (Array.isArray(fromJson) && fromJson.length) users = fromJson as IDataObject[];
					} catch {
						// ignore
					}
					// set_nicknames / manage_waiting_room_users：operated_users 数组
					// close_screen_share / switch_user_video：operated_user 单对象
					if (operation === 'rcSetNicknames' || operation === 'rcManageWaitingRoom') {
						body.operated_users = users;
					} else if (users.length) {
						body.operated_user = users[0];
					}
				}
				if (operation === 'rcSwitchUserVideo') {
					body.video = this.getNodeParameter('rc_video_on', i, false) as boolean;
				}
				if (operation === 'createCustomerShortUrl') {
					// https://developer.work.weixin.qq.com/document/path/98818
					const customer_data_raw = this.getNodeParameter('customer_data_raw', i, '') as string;
					const customer_user_data = this.getNodeParameter('customer_user_data', i, '') as string;
					if (customer_data_raw) {
						body.customer_data = customer_data_raw;
					} else if (customer_user_data) {
						const payload = JSON.stringify({ ver: '1.0', userData: customer_user_data });
						body.customer_data = Buffer.from(payload, 'utf8').toString('base64');
					} else {
						throw new Error('请填写客户专属字段 userData 或 Base64 customer_data');
					}
				}
				if (operation === 'getQuality') {
					// https://developer.work.weixin.qq.com/document/path/98821
					const quality_start_time = dateTimeToUnixTimestamp(
						this.getNodeParameter('quality_start_time', i, '') as string | number,
					);
					const sub_meetingid = this.getNodeParameter('sub_meetingid', i, '') as string;
					// start_time 必填：默认取近 1 小时起点
					body.start_time =
						quality_start_time || Math.floor(Date.now() / 1000) - 3600;
					if (sub_meetingid) body.sub_meetingid = sub_meetingid;
				}
				if (operation === 'checkDeviceInMeeting') {
					delete body.meetingid;
					const device_check_userid = this.getNodeParameter(
						'device_check_userid',
						i,
						'',
					) as string;
					const device_meetingid_list = this.getNodeParameter(
						'device_meetingid_list',
						i,
						'',
					) as string;
					const device_instance_id_list = this.getNodeParameter(
						'device_instance_id_list',
						i,
						'',
					) as string;
					if (device_check_userid) body.userid = device_check_userid;
					const midList = device_meetingid_list
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean);
					if (midList.length) body.meetingid_list = midList;
					const instList = device_instance_id_list
						.split(',')
						.map((s) => Number(s.trim()))
						.filter((n) => !Number.isNaN(n));
					if (instList.length) body.instance_id_list = instList;
				}
				if (operation === 'phoneGetTmpOpenid') {
					const phoneCollection = this.getNodeParameter(
						'phoneGetTmpOpenidCollection',
						i,
						{},
					) as IDataObject;
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
					if (phone_numbers.length) body.phone_numbers = phone_numbers;
				}
				if (operation === 'setGuests') {
					const guestsCollection = this.getNodeParameter(
						'meetingGuestsCollection',
						i,
						{},
					) as IDataObject;
					let guests: IDataObject[] = ((guestsCollection?.guests as IDataObject[]) || [])
						.filter((g) => g.phone_number)
						.map((g) => {
							const item: IDataObject = {
								area: g.area || '86',
								phone_number: g.phone_number,
							};
							if (g.guest_name) item.guest_name = g.guest_name;
							return item;
						});
					try {
						const list = JSON.parse(list_data_json || '[]');
						if (Array.isArray(list) && list.length) guests = list as IDataObject[];
					} catch {
						// ignore
					}
					body.guests = guests;
				}
				if (operation === 'setInvitees') {
					const invitee_userids = this.getNodeParameter('invitee_userids', i, '') as string;
					let invitees: IDataObject[] = invitee_userids
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean)
						.map((userid) => ({ userid }));
					try {
						const list = JSON.parse(list_data_json || '[]');
						if (Array.isArray(list) && list.length) invitees = list as IDataObject[];
					} catch {
						// ignore
					}
					body.invitees = invitees;
				}
				if (['enrollImport', 'enrollDelete', 'enrollQueryByTmpOpenid'].includes(operation)) {
					if (operation === 'enrollDelete') {
						const enroll_id_list_cr = this.getNodeParameter('enroll_id_list_cr', i, '') as string;
						const ids = enroll_id_list_cr.split(',').map((s) => s.trim()).filter(Boolean);
						if (ids.length) body.enroll_id_list = ids;
					}
					if (operation === 'enrollQueryByTmpOpenid') {
						const enroll_tmp_openid = this.getNodeParameter('enroll_tmp_openid', i, '') as string;
						if (enroll_tmp_openid) body.tmp_openid = enroll_tmp_openid;
					}
					if (operation === 'enrollImport') {
						const enrollImportCollection = this.getNodeParameter(
							'enrollImportCollection',
							i,
							{},
						) as IDataObject;
						const formList = ((enrollImportCollection?.members as IDataObject[]) || [])
							.filter((m) => m.userid || m.phone_number)
							.map((m) => {
								const item: IDataObject = {};
								if (m.userid) item.userid = m.userid;
								if (m.phone_number) {
									item.phone_number = m.phone_number;
									item.area = m.area || '86';
								}
								if (m.nick_name) item.nick_name = m.nick_name;
								return item;
							});
						if (formList.length) body.enroll_list = formList;
					}
					try {
						const parsed = JSON.parse(list_data_json || '[]');
						if (Array.isArray(parsed) && parsed.length) {
							if (operation === 'enrollImport') body.enroll_list = parsed;
							else if (operation === 'enrollDelete' && !body.enroll_id_list) {
								body.enroll_id_list = parsed;
							}
						} else if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
							Object.assign(body, parsed as IDataObject);
						}
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
						'waitingroomCurrentUsers',
						'getQuality',
					].includes(operation)
				) {
					// list_meetings 最大 20；其余最大 50
					const maxLimit = operation === 'roomsListMeetings' ? 20 : 50;
					body.limit = Math.min(limit || 20, maxLimit);
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
				if (operation === 'layoutAddBackground') {
					const imgCollection = this.getNodeParameter(
						'layoutBackgroundImages',
						i,
						{},
					) as IDataObject;
					const image_list = ((imgCollection?.images as IDataObject[]) || [])
						.filter((im) => im.image_md5 && im.image_url)
						.map((im) => ({
							image_md5: im.image_md5,
							image_url: im.image_url,
						}));
					if (image_list.length) body.image_list = image_list;
					const default_image_order = this.getNodeParameter(
						'default_image_order',
						i,
						1,
					) as number;
					if (default_image_order) body.default_image_order = default_image_order;
				}
				if (
					['advLayoutAdd', 'advLayoutUpdate', 'basicLayoutAdd', 'basicLayoutUpdate'].includes(
						operation,
					)
				) {
					const layout_name = this.getNodeParameter('layout_name', i, '') as string;
					const default_layout_order = this.getNodeParameter(
						'default_layout_order',
						i,
						1,
					) as number;
					const pagesCollection = this.getNodeParameter(
						'layoutPagesCollection',
						i,
						{},
					) as IDataObject;
					const page_list = ((pagesCollection?.pages as IDataObject[]) || [])
						.filter((p) => p.layout_template_id)
						.map((p) => {
							const page: IDataObject = {
								layout_template_id: p.layout_template_id,
							};
							if (p.enable_polling) {
								page.enable_polling = true;
								page.polling_setting = {
									polling_interval_unit: p.polling_interval_unit ?? 1,
									polling_interval: p.polling_interval ?? 10,
									ignore_user_novideo: p.ignore_user_novideo ?? false,
									ignore_user_absence: p.ignore_user_absence ?? false,
								};
							}
							const seatsCol = (p.userSeats as IDataObject) || {};
							const seats = ((seatsCol.seats as IDataObject[]) || [])
								.filter((s) => s.grid_id)
								.map((s) => {
									const seat: IDataObject = {
										grid_id: String(s.grid_id),
										grid_type: s.grid_type ?? 1,
									};
									// 高级布局 user_list 嵌套；基础布局扁平字段
									if (
										operation === 'advLayoutAdd' ||
										operation === 'advLayoutUpdate'
									) {
										const user: IDataObject = {};
										if (s.userid) user.userid = s.userid;
										if (s.tmp_openid) user.tmp_openid = s.tmp_openid;
										if (s.nick_name) user.nick_name = s.nick_name;
										if (Object.keys(user).length) {
											seat.user_list = [user];
											seat.video_type = 3;
										}
										if (s.tool_sdkid) seat.tool_sdkid = s.tool_sdkid;
									} else {
										if (s.userid) seat.userid = s.userid;
										if (s.tmp_openid) seat.tmp_openid = s.tmp_openid;
										if (s.nick_name) seat.nick_name = s.nick_name;
										if (s.tool_sdkid) seat.tool_sdkid = s.tool_sdkid;
									}
									return seat;
								});
							if (seats.length) page.user_seat_list = seats;
							return page;
						});
					if (page_list.length) {
						const layoutItem: IDataObject = { page_list };
						if (layout_name) layoutItem.layout_name = layout_name;
						if (operation === 'advLayoutUpdate' || operation === 'basicLayoutUpdate') {
							if (layout_id) layoutItem.layout_id = layout_id;
						}
						body.layout_list = [layoutItem];
					}
					if (
						(operation === 'basicLayoutAdd' || operation === 'advLayoutAdd') &&
						default_layout_order
					) {
						body.default_layout_order = default_layout_order;
					}
				}
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
