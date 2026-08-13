import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { executeExtraHttpOp } from '../../shared/extraHttpOp';
import { meetingExtraHttpOpsById } from './extraHttpOps';
import type { MeetingExtraHttpOp } from './extraHttpOps';

const LIST_SEPARATOR = /[,，|\n\r]+/;
const MAX_UINT32 = 4294967295;
const ALLOWED_REMIND_BEFORE = new Set([0, 300, 900, 3600, 86400]);

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function text(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxBytes = 4096,
	required = true,
): string {
	const normalized = String(value ?? '').trim();
	if (required && !normalized) fail(context, `${label}不能为空`, itemIndex);
	if (Buffer.byteLength(normalized, 'utf8') > maxBytes) {
		fail(context, `${label}不能超过 ${maxBytes} 字节`, itemIndex);
	}
	return normalized;
}

function textWithLimits(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxCharacters: number,
	maxBytes: number,
	required = true,
): string {
	const normalized = text(context, value, label, itemIndex, maxBytes, required);
	if ([...normalized].length > maxCharacters) {
		fail(context, `${label}不能超过 ${maxCharacters} 个字符`, itemIndex);
	}
	return normalized;
}

function integer(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min: number,
	max: number,
): number {
	const normalized = Number(value);
	if (!Number.isSafeInteger(normalized) || normalized < min || normalized > max) {
		fail(context, `${label}必须是 ${min}–${max} 之间的整数`, itemIndex);
	}
	return normalized;
}

function listValues(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.flatMap((entry) => listValues(entry));
	}
	return String(value ?? '')
		.split(LIST_SEPARATOR)
		.map((entry) => entry.trim())
		.filter(Boolean);
}

function stringList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min = 0,
	max = 1000,
): string[] {
	const unique = [...new Set(listValues(value))];
	if (unique.length < min || unique.length > max) {
		fail(context, `${label}数量必须为 ${min}–${max} 个`, itemIndex);
	}
	return unique;
}

function dateTimeToUnixTimestamp(
	contextOrValue: IExecuteFunctions | unknown,
	value?: unknown,
	label = '日期时间',
	itemIndex = 0,
	required = false,
): number {
	const hasContext = arguments.length > 1;
	const context = hasContext ? (contextOrValue as IExecuteFunctions) : undefined;
	const raw = hasContext ? value : contextOrValue;
	const invalid = (message: string): never => {
		if (context) fail(context, message, itemIndex);
		throw new Error(message);
	};
	if (raw === undefined || raw === null || String(raw).trim() === '') {
		if (required) invalid(`${label}不能为空`);
		return 0;
	}
	const seconds =
		typeof raw === 'number' || /^\d+$/.test(String(raw).trim())
			? Number(raw)
			: Math.floor(Date.parse(String(raw)) / 1000);
	if (!Number.isSafeInteger(seconds) || seconds < 1 || seconds > MAX_UINT32) {
		invalid(`${label}不是有效的日期时间`);
	}
	return seconds;
}

function dateTimeToUnixMilliseconds(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	required = false,
): number {
	if (value === undefined || value === null || String(value).trim() === '') {
		if (required) fail(context, `${label}不能为空`, itemIndex);
		return 0;
	}
	const raw = String(value).trim();
	const milliseconds = /^\d+$/.test(raw) ? Number(raw) : Date.parse(raw);
	if (!Number.isSafeInteger(milliseconds) || milliseconds < 1) {
		fail(context, `${label}不是有效的日期时间`, itemIndex);
	}
	return milliseconds;
}

function jsonObject(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject {
	let parsed: unknown;
	try {
		parsed = JSON.parse(String(value || '{}'));
	} catch {
		fail(context, `${label}不是有效的 JSON`, itemIndex);
	}
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		fail(context, `${label}必须是 JSON 对象`, itemIndex);
	}
	return parsed as IDataObject;
}

function jsonArray(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): unknown[] {
	let parsed: unknown;
	try {
		parsed = JSON.parse(String(value || '[]'));
	} catch {
		fail(context, `${label}不是有效的 JSON`, itemIndex);
	}
	if (!Array.isArray(parsed)) fail(context, `${label}必须是 JSON 数组`, itemIndex);
	return parsed;
}

function validateTimeWindow(
	context: IExecuteFunctions,
	start: number,
	end: number,
	label: string,
	itemIndex: number,
	maxSpanSeconds?: number,
): void {
	if (!start && !end) return;
	if (!start || !end) fail(context, `${label}的开始时间与结束时间必须同时填写`, itemIndex);
	if (end <= start) fail(context, `${label}的结束时间必须晚于开始时间`, itemIndex);
	if (maxSpanSeconds !== undefined && end - start > maxSpanSeconds) {
		fail(context, `${label}跨度不能超过 ${Math.floor(maxSpanSeconds / 86400)} 天`, itemIndex);
	}
}

function httpUrl(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	required = false,
): string {
	const normalized = text(context, value, label, itemIndex, 4096, required);
	if (!normalized) return '';
	let parsed: URL;
	try {
		parsed = new URL(normalized);
	} catch {
		fail(context, `${label}不是有效的 URL`, itemIndex);
	}
	if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
		fail(context, `${label}必须是无内嵌凭据的 HTTP(S) URL`, itemIndex);
	}
	return parsed.toString();
}

function meetingGuests(
	context: IExecuteFunctions,
	collection: IDataObject,
	itemIndex: number,
): IDataObject[] {
	return ((collection?.guests as IDataObject[]) || []).map((guest, index) => {
		const phoneNumber = text(
			context,
			guest.phone_number,
			`第 ${index + 1} 个嘉宾的手机号`,
			itemIndex,
			32,
		);
		const area = text(
			context,
			guest.area || '86',
			`第 ${index + 1} 个嘉宾的地区代码`,
			itemIndex,
			8,
		);
		if (!/^\d+$/.test(area) || !/^\d+$/.test(phoneNumber)) {
			fail(context, `第 ${index + 1} 个嘉宾的地区代码与手机号只能包含数字`, itemIndex);
		}
		const result: IDataObject = { area, phone_number: phoneNumber };
		const guestName = textWithLimits(
			context,
			guest.guest_name,
			'嘉宾名称',
			itemIndex,
			16,
			64,
			false,
		);
		if (guestName) result.guest_name = guestName;
		return result;
	});
}

function webinarGuests(
	context: IExecuteFunctions,
	value: unknown[],
	itemIndex: number,
): IDataObject[] {
	return value.map((rawGuest, index) => {
		if (!rawGuest || typeof rawGuest !== 'object' || Array.isArray(rawGuest)) {
			fail(context, `第 ${index + 1} 个研讨会嘉宾必须是对象`, itemIndex);
		}
		const guest = rawGuest as IDataObject;
		const guestType = integer(context, guest.guest_type ?? 1, '嘉宾类型', itemIndex, 1, 2);
		const result: IDataObject = { guest_type: guestType };
		if (guestType === 1) {
			result.userid = text(
				context,
				guest.userid || guest.userid_selected,
				`第 ${index + 1} 个内部嘉宾 UserID`,
				itemIndex,
				64,
			);
		} else {
			const area = text(context, guest.area, `第 ${index + 1} 个外部嘉宾地区代码`, itemIndex, 8);
			const phoneNumber = text(
				context,
				guest.phone_number,
				`第 ${index + 1} 个外部嘉宾手机号`,
				itemIndex,
				32,
			);
			if (!/^\d+$/.test(area) || !/^\d+$/.test(phoneNumber)) {
				fail(context, `第 ${index + 1} 个外部嘉宾的地区代码与手机号只能包含数字`, itemIndex);
			}
			result.area = area;
			result.phone_number = phoneNumber;
			result.guest_name = textWithLimits(
				context,
				guest.guest_name,
				`第 ${index + 1} 个外部嘉宾名称`,
				itemIndex,
				16,
				64,
			);
			const email = text(context, guest.email, '嘉宾邮箱', itemIndex, 320, false);
			if (email) {
				if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(context, '嘉宾邮箱格式无效', itemIndex);
				result.email = email;
			}
		}
		return result;
	});
}

function pollQuestions(
	context: IExecuteFunctions,
	value: unknown[],
	itemIndex: number,
	operation: 'create' | 'update',
): IDataObject[] {
	if (value.length < 1 || value.length > 10) {
		fail(context, '投票问题数量必须为 1–10 个', itemIndex);
	}
	return value.map((rawQuestion, questionIndex) => {
		if (!rawQuestion || typeof rawQuestion !== 'object' || Array.isArray(rawQuestion)) {
			fail(context, `第 ${questionIndex + 1} 个投票问题必须是对象`, itemIndex);
		}
		const question = rawQuestion as IDataObject;
		const questionType = integer(
			context,
			question.question_type,
			`第 ${questionIndex + 1} 个问题的类型`,
			itemIndex,
			0,
			1,
		);
		const questionDesc = textWithLimits(
			context,
			question.question_desc,
			`第 ${questionIndex + 1} 个问题的描述`,
			itemIndex,
			50,
			200,
		);
		const options = stringList(
			context,
			question.poll_option,
			`第 ${questionIndex + 1} 个问题的选项`,
			itemIndex,
			operation === 'create' ? 2 : 1,
			10,
		).map((option, optionIndex) =>
			textWithLimits(
				context,
				option,
				`第 ${questionIndex + 1} 个问题的第 ${optionIndex + 1} 个选项`,
				itemIndex,
				36,
				144,
			),
		);
		return {
			question_type: questionType,
			question_desc: questionDesc,
			poll_option: options,
		};
	});
}

function controlUsers(
	context: IExecuteFunctions,
	value: unknown[],
	itemIndex: number,
	withNickname: boolean,
	singular: boolean,
): IDataObject[] {
	if (value.length < 1 || value.length > 1000 || (singular && value.length !== 1)) {
		fail(
			context,
			singular ? '被操作用户必须且只能填写 1 个' : '被操作用户数量必须为 1–1000 个',
			itemIndex,
		);
	}
	return value.map((rawUser, userIndex) => {
		if (!rawUser || typeof rawUser !== 'object' || Array.isArray(rawUser)) {
			fail(context, `第 ${userIndex + 1} 个被操作用户必须是对象`, itemIndex);
		}
		const user = rawUser as IDataObject;
		const normalized: IDataObject = {
			tmp_openid: text(
				context,
				user.tmp_openid,
				`第 ${userIndex + 1} 个用户的临时 OpenID`,
				itemIndex,
				128,
			),
			instance_id: integer(
				context,
				user.instance_id,
				`第 ${userIndex + 1} 个用户的设备实例 ID`,
				itemIndex,
				0,
				MAX_UINT32,
			),
		};
		if (withNickname) {
			normalized.nickname = textWithLimits(
				context,
				user.nickname,
				`第 ${userIndex + 1} 个用户的昵称`,
				itemIndex,
				20,
				80,
				false,
			);
		}
		return normalized;
	});
}

function customerData(
	context: IExecuteFunctions,
	rawBase64: unknown,
	userData: unknown,
	itemIndex: number,
): string {
	const raw = text(context, rawBase64, '客户专属字段 Base64', itemIndex, 256, false);
	let encoded = raw;
	if (!encoded) {
		const userValue = text(context, userData, '客户专属字段 userData', itemIndex, 256);
		encoded = Buffer.from(JSON.stringify({ ver: '1.0', userData: userValue }), 'utf8').toString(
			'base64',
		);
	}
	if (Buffer.byteLength(encoded, 'utf8') > 256) {
		fail(context, 'customer_data 不能超过 256 字节', itemIndex);
	}
	if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) {
		fail(context, '客户专属字段不是有效的 Base64', itemIndex);
	}
	let decoded: unknown;
	try {
		decoded = JSON.parse(Buffer.from(encoded, 'base64').toString('utf8'));
	} catch {
		fail(context, '客户专属字段 Base64 解码后必须是有效的 JSON', itemIndex);
	}
	if (
		!decoded ||
		typeof decoded !== 'object' ||
		Array.isArray(decoded) ||
		(decoded as IDataObject).ver !== '1.0' ||
		typeof (decoded as IDataObject).userData !== 'string'
	) {
		fail(context, '客户专属字段必须编码自 {"ver":"1.0","userData":"..."}', itemIndex);
	}
	return encoded;
}

function base64Text(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	required = false,
): string {
	const normalized = text(context, value, label, itemIndex, 4096, required);
	if (!normalized) return '';
	if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(normalized)) {
		fail(context, `${label}必须是有效的 Base64`, itemIndex);
	}
	return normalized;
}

function normalizeLayoutPages(
	context: IExecuteFunctions,
	value: unknown[],
	itemIndex: number,
	advanced: boolean,
	requireSeats: boolean,
	requireAdvancedNickname: boolean,
): IDataObject[] {
	if (value.length < 1 || value.length > 100) {
		fail(context, '布局页面数量必须为 1–100 个', itemIndex);
	}
	return value.map((rawPage, pageIndex) => {
		if (!rawPage || typeof rawPage !== 'object' || Array.isArray(rawPage)) {
			fail(context, `第 ${pageIndex + 1} 个布局页面必须是对象`, itemIndex);
		}
		const page = rawPage as IDataObject;
		const normalized: IDataObject = {
			layout_template_id: text(
				context,
				page.layout_template_id,
				`第 ${pageIndex + 1} 个页面的布局模板 ID`,
				itemIndex,
				128,
			),
		};
		const rawSeats = Array.isArray(page.user_seat_list)
			? page.user_seat_list
			: Array.isArray((page.userSeats as IDataObject | undefined)?.seats)
				? ((page.userSeats as IDataObject).seats as unknown[])
				: [];
		if (requireSeats && rawSeats.length < 1) {
			fail(context, `第 ${pageIndex + 1} 个高级布局页面至少需要一个座次`, itemIndex);
		}
		if (rawSeats.length > 1000) {
			fail(context, `第 ${pageIndex + 1} 个页面的座次不能超过 1000 个`, itemIndex);
		}
		const seats = rawSeats.map((rawSeat, seatIndex) => {
			if (!rawSeat || typeof rawSeat !== 'object' || Array.isArray(rawSeat)) {
				fail(context, `第 ${pageIndex + 1} 页第 ${seatIndex + 1} 个座次必须是对象`, itemIndex);
			}
			const seat = rawSeat as IDataObject;
			const gridType = integer(
				context,
				seat.grid_type,
				`第 ${pageIndex + 1} 页第 ${seatIndex + 1} 个宫格的类型`,
				itemIndex,
				1,
				advanced ? 2 : 3,
			);
			const normalizedSeat: IDataObject = {
				grid_id: text(
					context,
					seat.grid_id,
					`第 ${pageIndex + 1} 页第 ${seatIndex + 1} 个宫格 ID`,
					itemIndex,
					128,
				),
				grid_type: gridType,
			};
			if (advanced) {
				const inlineUser =
					seat.userid || seat.tmp_openid || seat.nick_name
						? [{ userid: seat.userid, tmp_openid: seat.tmp_openid, nick_name: seat.nick_name }]
						: [];
				const rawUsers = Array.isArray(seat.user_list) ? seat.user_list : inlineUser;
				if (rawUsers.length > 1000) {
					fail(
						context,
						`第 ${pageIndex + 1} 页第 ${seatIndex + 1} 个宫格用户不能超过 1000 人`,
						itemIndex,
					);
				}
				const videoType = integer(
					context,
					seat.video_type ?? (rawUsers.length ? 3 : 2),
					`第 ${pageIndex + 1} 页第 ${seatIndex + 1} 个宫格的视频来源`,
					itemIndex,
					1,
					3,
				);
				if (gridType === 1) normalizedSeat.video_type = videoType;
				if (videoType === 3 && rawUsers.length < 1) {
					fail(context, '视频来源为指定人员时必须填写 user_list', itemIndex);
				}
				if (rawUsers.length) {
					const users = rawUsers.map((rawUser, userIndex) => {
						if (!rawUser || typeof rawUser !== 'object' || Array.isArray(rawUser)) {
							fail(context, `第 ${userIndex + 1} 个宫格用户必须是对象`, itemIndex);
						}
						const user = rawUser as IDataObject;
						const userid = text(
							context,
							user.userid || user.userid_selected,
							'宫格用户 UserID',
							itemIndex,
							64,
							false,
						);
						const tmpOpenid = text(
							context,
							user.tmp_openid,
							'宫格用户临时 OpenID',
							itemIndex,
							128,
							false,
						);
						if (Boolean(userid) === Boolean(tmpOpenid)) {
							fail(
								context,
								'高级布局宫格用户的 UserID 与临时 OpenID 必须且只能填写一个',
								itemIndex,
							);
						}
						const normalizedUser: IDataObject = {};
						if (userid) normalizedUser.userid = userid;
						if (tmpOpenid) normalizedUser.tmp_openid = tmpOpenid;
						const nickname = base64Text(
							context,
							user.nick_name,
							'高级布局宫格昵称',
							itemIndex,
							requireAdvancedNickname && videoType === 3,
						);
						if (nickname) normalizedUser.nick_name = nickname;
						return normalizedUser;
					});
					normalizedSeat.user_list = users;
				}
			} else {
				const userid = text(
					context,
					seat.userid || seat.userid_selected,
					'宫格用户 UserID',
					itemIndex,
					64,
					false,
				);
				const tmpOpenid = text(
					context,
					seat.tmp_openid,
					'宫格用户临时 OpenID',
					itemIndex,
					128,
					false,
				);
				const toolSdkid = text(context, seat.tool_sdkid, '拓展应用 ID', itemIndex, 128, false);
				if ([userid, tmpOpenid, toolSdkid].filter(Boolean).length !== 1) {
					fail(
						context,
						'基础布局座次的 UserID、临时 OpenID、拓展应用 ID 必须且只能填写一个',
						itemIndex,
					);
				}
				if (gridType === 3 && !toolSdkid)
					fail(context, '拓展应用宫格必须填写拓展应用 ID', itemIndex);
				if (gridType !== 3 && toolSdkid)
					fail(context, '只有拓展应用宫格可填写拓展应用 ID', itemIndex);
				if (userid) normalizedSeat.userid = userid;
				if (tmpOpenid) normalizedSeat.tmp_openid = tmpOpenid;
				if (toolSdkid) normalizedSeat.tool_sdkid = toolSdkid;
				const nickname = textWithLimits(
					context,
					seat.nick_name,
					'宫格昵称',
					itemIndex,
					64,
					256,
					gridType === 1,
				);
				if (nickname) normalizedSeat.nick_name = nickname;
			}
			return normalizedSeat;
		});
		if (seats.length) normalized.user_seat_list = seats;
		if (advanced) {
			const enablePolling = Boolean(page.enable_polling);
			normalized.enable_polling = enablePolling;
			if (enablePolling) {
				const setting =
					page.polling_setting &&
					typeof page.polling_setting === 'object' &&
					!Array.isArray(page.polling_setting)
						? (page.polling_setting as IDataObject)
						: page;
				normalized.polling_setting = {
					polling_interval_unit: integer(
						context,
						setting.polling_interval_unit,
						'轮询间隔单位',
						itemIndex,
						1,
						2,
					),
					polling_interval: integer(
						context,
						setting.polling_interval,
						'轮询间隔',
						itemIndex,
						1,
						999999,
					),
					ignore_user_novideo: Boolean(setting.ignore_user_novideo),
					ignore_user_absence: Boolean(setting.ignore_user_absence),
				};
			}
		}
		return normalized;
	});
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
				const admin_userid = text(
					this,
					this.getNodeParameter('admin_userid', i, '') ||
						this.getNodeParameter('admin_userid_selected', i, ''),
					'管理员 UserID',
					i,
					64,
				);
				// 新字段 title；兼容旧 subject
				const title = textWithLimits(
					this,
					(this.getNodeParameter('title', i, '') as string) ||
						(this.getNodeParameter('subject', i, '') as string),
					'会议标题',
					i,
					20,
					40,
				);
				// 新字段 meeting_start；兼容旧 start_time
				let meeting_start = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('meeting_start', i, '') as string | number,
					'会议开始时间',
					i,
				);
				if (!meeting_start) {
					meeting_start = dateTimeToUnixTimestamp(
						this,
						this.getNodeParameter('start_time', i, '') as string | number,
						'会议开始时间',
						i,
						true,
					);
				}
				if (meeting_start <= Math.floor(Date.now() / 1000)) {
					fail(this, '会议开始时间必须晚于当前时间', i);
				}
				// 新字段 meeting_duration；兼容旧 end_time 差值
				let meeting_duration = this.getNodeParameter('meeting_duration', i, 0) as number;
				if (!meeting_duration) {
					const end_time = dateTimeToUnixTimestamp(
						this,
						this.getNodeParameter('end_time', i, '') as string | number,
						'会议结束时间',
						i,
					);
					if (end_time && meeting_start && end_time > meeting_start) {
						meeting_duration = end_time - meeting_start;
					} else {
						fail(this, '会议时长不能为空；旧版工作流需同时提供有效的结束时间', i);
					}
				}
				meeting_duration = integer(this, meeting_duration, '会议时长', i, 300, 86399);
				const description = textWithLimits(
					this,
					this.getNodeParameter('description', i, ''),
					'会议描述',
					i,
					500,
					500,
					false,
				);
				const location = textWithLimits(
					this,
					this.getNodeParameter('location', i, ''),
					'会议地点',
					i,
					128,
					512,
					false,
				);
				const cal_id = text(this, this.getNodeParameter('cal_id', i, ''), '日历 ID', i, 64, false);
				const agentid = Number(this.getNodeParameter('agentid', i, 0));
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
				if (agentid) body.agentid = integer(this, agentid, '应用 AgentID', i, 1, MAX_UINT32);

				// invitees：文本 + 选择器 + 兼容旧 collection
				let inviteeIds = stringList(
					this,
					[
						this.getNodeParameter('invitee_userids', i, ''),
						this.getNodeParameter('invitee_userids_selected', i, []),
					],
					'受邀成员',
					i,
					0,
					300,
				);
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
					inviteeIds = stringList(this, [...fromAttendees, ...fromInvitees], '受邀成员', i, 0, 300);
				}
				if (inviteeIds.length) body.invitees = { userid: inviteeIds };

				// guests（普通/高级创建均支持）
				{
					const guestsCollection = this.getNodeParameter('guestsCollection', i, {}) as IDataObject;
					const guests = meetingGuests(this, guestsCollection, i);
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
				if (settings_password) {
					if (!/^\d{4,6}$/.test(settings_password)) {
						fail(this, '入会密码必须是 4–6 位数字', i);
					}
					settings.password = settings_password;
				}
				integer(this, settings_enable_enter_mute, '入会静音设置', i, 0, 2);
				integer(this, settings_remind_scope, '来电提醒范围', i, 1, 4);
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
				const hostIds = stringList(
					this,
					[
						settings_host_userids,
						this.getNodeParameter('settings_host_userids_selected', i, []),
					],
					'主持人',
					i,
					0,
					10,
				);
				if (hostIds.length) settings.hosts = { userid: hostIds };
				if (settings_remind_scope === 4) {
					const ringIds = stringList(
						this,
						[
							this.getNodeParameter('settings_ring_userids', i, ''),
							this.getNodeParameter('settings_ring_userids_selected', i, []),
						],
						'指定响铃成员',
						i,
						0,
						300,
					);
					settings.ring_users = { userid: ringIds };
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
				const autoRecordType = this.getNodeParameter(
					'settings_auto_record_type',
					i,
					'none',
				) as string;
				if (!['none', 'local', 'cloud'].includes(autoRecordType)) {
					fail(this, '自动录制类型不受支持', i);
				}
				settings.auto_record_type = autoRecordType;
				const reminders_is_repeat = this.getNodeParameter(
					'reminders_is_repeat',
					i,
					false,
				) as boolean;
				const remind_before = this.getNodeParameter('reminders_remind_before', i, []) as number[];
				const reminders: IDataObject = {};
				if (reminders_is_repeat) {
					const reminders_repeat_type = Number(
						this.getNodeParameter('reminders_repeat_type', i, 0),
					);
					if (![0, 1, 2, 7].includes(reminders_repeat_type)) {
						fail(this, '周期类型不受支持', i);
					}
					reminders.is_repeat = 1;
					reminders.repeat_type = reminders_repeat_type;
					if (reminders_repeat_type === 1) {
						const interval = this.getNodeParameter('reminders_repeat_interval', i, 1) as number;
						reminders.repeat_interval = integer(this, interval, '重复间隔', i, 1, 2);
					}
					const until = dateTimeToUnixTimestamp(
						this,
						this.getNodeParameter('reminders_repeat_until', i, '') as string | number,
						'重复结束时间',
						i,
					);
					if (until && until <= meeting_start) {
						fail(this, '重复结束时间必须晚于会议开始时间', i);
					}
					if (until) reminders.repeat_until = until;
				}
				if (Array.isArray(remind_before) && remind_before.length) {
					const values = [...new Set(remind_before.map((value) => Number(value)))];
					if (values.some((value) => !ALLOWED_REMIND_BEFORE.has(value))) {
						fail(this, '会前提醒包含不受支持的时间值', i);
					}
					reminders.remind_before = values;
				}
				if (Object.keys(reminders).length) body.reminders = reminders;

				// 兼容旧 advancedSettings collection
				const advancedSettings = this.getNodeParameter('advancedSettings', i, {}) as IDataObject;
				if (advancedSettings?.description && !body.description) {
					body.description = textWithLimits(
						this,
						advancedSettings.description,
						'会议描述',
						i,
						500,
						500,
					);
				}
				if (advancedSettings?.password) {
					const legacyPassword = String(advancedSettings.password);
					if (!/^\d{4,6}$/.test(legacyPassword)) fail(this, '入会密码必须是 4–6 位数字', i);
					settings.password = legacyPassword;
				}
				if (advancedSettings?.enable_mute_on_entry !== undefined) {
					settings.enable_enter_mute = advancedSettings.enable_mute_on_entry ? 1 : 0;
				}
				if (advancedSettings?.allow_enter_before_host !== undefined) {
					settings.allow_enter_before_host = advancedSettings.allow_enter_before_host;
				}

				if (Object.keys(settings).length) body.settings = settings;

				{
					const extra = { ...jsonObject(this, createMeetingExtraJson, '扩展请求 JSON', i) };
					if (extra.settings && typeof extra.settings === 'object') {
						if (Array.isArray(extra.settings))
							fail(this, '扩展请求 JSON 的 settings 必须是对象', i);
						body.settings = {
							...((body.settings as IDataObject) || {}),
							...(extra.settings as IDataObject),
						};
						delete extra.settings;
					}
					if (extra.reminders && typeof extra.reminders === 'object') {
						if (Array.isArray(extra.reminders))
							fail(this, '扩展请求 JSON 的 reminders 必须是对象', i);
						body.reminders = {
							...((body.reminders as IDataObject) || {}),
							...(extra.reminders as IDataObject),
						};
						delete extra.reminders;
					}
					Object.assign(body, extra);
					body.admin_userid = admin_userid;
					body.title = title;
					body.meeting_start = meeting_start;
					body.meeting_duration = meeting_duration;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/create', body);
			} else if (operation === 'updateMeeting') {
				// https://developer.work.weixin.qq.com/document/path/98154
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
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
				const invitee_userids_selected = this.getNodeParameter(
					'invitee_userids_selected',
					i,
					[],
				);
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
				const settings_host_userids_selected = this.getNodeParameter(
					'settings_host_userids_selected',
					i,
					[],
				);
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
				const updateTitle = this.getNodeParameter('update_title', i, false) as boolean;
				const updateTime = this.getNodeParameter('update_time', i, false) as boolean;
				const updateDescription = this.getNodeParameter('update_description', i, false) as boolean;
				const updateLocation = this.getNodeParameter('update_location', i, false) as boolean;
				const updateInvitees = this.getNodeParameter('update_invitees', i, false) as boolean;
				const updatePassword = this.getNodeParameter('update_password', i, false) as boolean;
				const updateHosts = this.getNodeParameter('update_hosts', i, false) as boolean;

				const body: IDataObject = { meetingid };
				if (updateTitle || title) {
					body.title = textWithLimits(this, title, '会议标题', i, 20, 40);
				}
				if (updateTime || start_raw || meeting_duration || end_time_raw) {
					const meeting_start = dateTimeToUnixTimestamp(this, start_raw, '会议开始时间', i, true);
					if (meeting_start <= Math.floor(Date.now() / 1000)) {
						fail(this, '会议开始时间必须晚于当前时间', i);
					}
					let duration = Number(meeting_duration);
					if (!duration && end_time_raw) {
						const endTime = dateTimeToUnixTimestamp(this, end_time_raw, '会议结束时间', i, true);
						if (endTime <= meeting_start) fail(this, '会议结束时间必须晚于开始时间', i);
						duration = endTime - meeting_start;
					}
					body.meeting_start = meeting_start;
					body.meeting_duration = integer(this, duration, '会议时长', i, 300, 86399);
				}
				if (updateDescription || description) {
					body.description = textWithLimits(this, description, '会议描述', i, 500, 500, false);
				}
				if (updateLocation || location) {
					body.location = textWithLimits(this, location, '会议地点', i, 128, 512, false);
				}
				const inviteeIds = stringList(
					this,
					[invitee_userids, invitee_userids_selected],
					'受邀成员',
					i,
					0,
					300,
				);
				if (updateInvitees || inviteeIds.length) {
					body.invitees = { userid: inviteeIds };
				}

				const settings: IDataObject = {};
				if (updatePassword || settings_password) {
					if (settings_password && !/^\d{4,6}$/.test(settings_password)) {
						fail(this, '入会密码必须是 4–6 位数字，留空可清除密码', i);
					}
					settings.password = settings_password;
				}
				if (settings_enable_enter_mute !== -1) {
					settings.enable_enter_mute = integer(
						this,
						settings_enable_enter_mute,
						'入会静音设置',
						i,
						0,
						2,
					);
				}
				if (settings_remind_scope > 0) {
					settings.remind_scope = integer(this, settings_remind_scope, '来电提醒范围', i, 1, 4);
				}
				const hostIds = stringList(
					this,
					[settings_host_userids, settings_host_userids_selected],
					'主持人',
					i,
					0,
					10,
				);
				if (updateHosts || hostIds.length || settings_host_userids) {
					settings.hosts = { userid: hostIds };
				}
				if (settings_remind_scope === 4) {
					const ringIds = stringList(
						this,
						[
							this.getNodeParameter('settings_ring_userids', i, ''),
							this.getNodeParameter('settings_ring_userids_selected', i, []),
						],
						'指定响铃成员',
						i,
						0,
						300,
					);
					settings.ring_users = { userid: ringIds };
				}
				if (settings_auto_record_type) {
					if (!['none', 'local', 'cloud'].includes(settings_auto_record_type)) {
						fail(this, '自动录制类型不受支持', i);
					}
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

				{
					const extra = { ...jsonObject(this, updateMeetingExtraJson, '扩展请求 JSON', i) };
					if (extra.settings && typeof extra.settings === 'object') {
						if (Array.isArray(extra.settings))
							fail(this, '扩展请求 JSON 的 settings 必须是对象', i);
						body.settings = {
							...((body.settings as IDataObject) || {}),
							...(extra.settings as IDataObject),
						};
						delete extra.settings;
					}
					Object.assign(body, extra);
					body.meetingid = meetingid;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update', body);
			} else if (operation === 'cancelMeeting') {
				// https://developer.work.weixin.qq.com/document/path/98153
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const sub_meetingid = text(
					this,
					this.getNodeParameter('sub_meetingid', i, ''),
					'子会议 ID',
					i,
					128,
					false,
				);
				const body: IDataObject = { meetingid };
				if (sub_meetingid) body.sub_meetingid = sub_meetingid;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/cancel', body);
			} else if (operation === 'getMeetingInfo') {
				// https://developer.work.weixin.qq.com/document/path/98149
				const meetingid = text(
					this,
					this.getNodeParameter('meetingid', i, ''),
					'会议 ID',
					i,
					128,
					false,
				);
				const meeting_code = text(
					this,
					this.getNodeParameter('meeting_code', i, ''),
					'会议 Code',
					i,
					64,
					false,
				);
				const sub_meetingid = text(
					this,
					this.getNodeParameter('sub_meetingid', i, ''),
					'子会议 ID',
					i,
					128,
					false,
				);
				const body: IDataObject = {};
				if (meetingid) body.meetingid = meetingid;
				if (meeting_code) body.meeting_code = meeting_code;
				if (sub_meetingid) body.sub_meetingid = sub_meetingid;
				if (Boolean(meetingid) === Boolean(meeting_code)) {
					fail(this, '会议 ID 与会议 Code 必须且只能填写一个', i);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_info', body);
			} else if (operation === 'getUserMeetings') {
				// https://developer.work.weixin.qq.com/document/path/98150
				const userid = text(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, ''),
					'成员 UserID',
					i,
					64,
				);
				const cursor = text(this, this.getNodeParameter('cursor', i, ''), '游标', i, 4096, false);
				const limit = this.getNodeParameter('limit', i, 50) as number;
				const begin_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('begin_time', i, '') as string | number,
					'开始时间',
					i,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('end_time', i, '') as string | number,
					'结束时间',
					i,
				);
				if (begin_time && end_time) {
					if (end_time <= begin_time) fail(this, '结束时间必须晚于开始时间', i);
					if (end_time - begin_time > 180 * 86400) fail(this, '查询时间跨度不能超过 180 天', i);
				}

				const body: IDataObject = { userid, limit: integer(this, limit, '每页数量', i, 1, 100) };
				if (cursor) body.cursor = cursor;
				if (begin_time) body.begin_time = begin_time;
				if (end_time) body.end_time = end_time;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/get_user_meetingid',
					body,
				);
			}
			// 会议统计管理
			else if (operation === 'getMeetingRecords') {
				// 获取会议发起记录
				// https://developer.work.weixin.qq.com/document/path/99651
				const type = integer(this, this.getNodeParameter('record_type', i, 1), '查询类型', i, 1, 2);
				const start_time_raw = this.getNodeParameter('start_time', i, '') as string | number;
				const end_time_raw = this.getNodeParameter('end_time', i, '') as string | number;
				const begin_time = dateTimeToUnixTimestamp(
					this,
					start_time_raw || this.getNodeParameter('begin_time', i, 0),
					'开始时间',
					i,
					true,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					end_time_raw || this.getNodeParameter('end_time_ts', i, 0),
					'结束时间',
					i,
					true,
				);
				if (end_time <= begin_time) fail(this, '结束时间必须晚于开始时间', i);
				const limit = this.getNodeParameter('limit', i, 200) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = {
					type,
					begin_time,
					end_time,
					limit: integer(this, limit, '每页数量', i, 1, 1000),
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
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
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
				const invitee_userids_selected = this.getNodeParameter(
					'invitee_userids_selected',
					i,
					[],
				);
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
				const settings_host_userids_selected = this.getNodeParameter(
					'settings_host_userids_selected',
					i,
					[],
				);
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
				const updateTitle = this.getNodeParameter('update_title', i, false) as boolean;
				const updateTime = this.getNodeParameter('update_time', i, false) as boolean;
				const updateDescription = this.getNodeParameter('update_description', i, false) as boolean;
				const updateLocation = this.getNodeParameter('update_location', i, false) as boolean;
				const updateInvitees = this.getNodeParameter('update_invitees', i, false) as boolean;
				const updateGuests = this.getNodeParameter('update_guests', i, false) as boolean;
				const updatePassword = this.getNodeParameter('update_password', i, false) as boolean;
				const updateHosts = this.getNodeParameter('update_hosts', i, false) as boolean;

				const body: IDataObject = { meetingid };
				if (updateTitle || title) {
					body.title = textWithLimits(this, title, '会议标题', i, 20, 40);
				}
				if (updateTime || start_raw || meeting_duration || end_time_raw) {
					const meeting_start = dateTimeToUnixTimestamp(this, start_raw, '会议开始时间', i, true);
					if (meeting_start <= Math.floor(Date.now() / 1000)) {
						fail(this, '会议开始时间必须晚于当前时间', i);
					}
					let duration = Number(meeting_duration);
					if (!duration && end_time_raw) {
						const endTime = dateTimeToUnixTimestamp(this, end_time_raw, '会议结束时间', i, true);
						if (endTime <= meeting_start) fail(this, '会议结束时间必须晚于开始时间', i);
						duration = endTime - meeting_start;
					}
					body.meeting_start = meeting_start;
					body.meeting_duration = integer(this, duration, '会议时长', i, 300, 86399);
				}
				if (updateDescription || description) {
					body.description = textWithLimits(this, description, '会议描述', i, 500, 500, false);
				}
				if (updateLocation || location) {
					body.location = textWithLimits(this, location, '会议地点', i, 128, 512, false);
				}
				const inviteeIds = stringList(
					this,
					[invitee_userids, invitee_userids_selected],
					'受邀成员',
					i,
					0,
					300,
				);
				if (updateInvitees || inviteeIds.length) {
					body.invitees = { userid: inviteeIds };
				}

				const guestsCollection = this.getNodeParameter('guestsCollection', i, {}) as IDataObject;
				const guests = meetingGuests(this, guestsCollection, i);
				if (updateGuests || guests.length) body.guests = guests;

				const settings: IDataObject = {};
				if (updatePassword || settings_password) {
					if (settings_password && !/^\d{4,6}$/.test(settings_password)) {
						fail(this, '入会密码必须是 4–6 位数字，留空可清除密码', i);
					}
					settings.password = settings_password;
				}
				if (settings_enable_enter_mute !== -1) {
					settings.enable_enter_mute = integer(
						this,
						settings_enable_enter_mute,
						'入会静音设置',
						i,
						0,
						2,
					);
				}
				if (settings_remind_scope > 0) {
					settings.remind_scope = integer(this, settings_remind_scope, '来电提醒范围', i, 1, 4);
				}
				const hostIds = stringList(
					this,
					[settings_host_userids, settings_host_userids_selected],
					'主持人',
					i,
					0,
					10,
				);
				if (updateHosts || hostIds.length || settings_host_userids) {
					settings.hosts = { userid: hostIds };
				}
				if (settings_remind_scope === 4) {
					const ringIds = stringList(
						this,
						[
							this.getNodeParameter('settings_ring_userids', i, ''),
							this.getNodeParameter('settings_ring_userids_selected', i, []),
						],
						'指定响铃成员',
						i,
						0,
						300,
					);
					settings.ring_users = { userid: ringIds };
				}
				if (settings_auto_record_type) {
					if (!['none', 'local', 'cloud'].includes(settings_auto_record_type)) {
						fail(this, '自动录制类型不受支持', i);
					}
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
					body.description = textWithLimits(
						this,
						advancedSettings.description,
						'会议描述',
						i,
						500,
						500,
					);
				}
				if (advancedSettings.password) {
					const legacyPassword = String(advancedSettings.password);
					if (!/^\d{4,6}$/.test(legacyPassword)) fail(this, '入会密码必须是 4–6 位数字', i);
					settings.password = legacyPassword;
				}
				if (advancedSettings.enable_mute_on_entry !== undefined) {
					settings.enable_enter_mute = advancedSettings.enable_mute_on_entry ? 1 : 0;
				}
				if (advancedSettings.allow_enter_before_host !== undefined) {
					settings.allow_enter_before_host = advancedSettings.allow_enter_before_host;
				}
				if (Object.keys(settings).length) body.settings = settings;
				{
					const updateMeetingExtraJson = this.getNodeParameter(
						'updateMeetingExtraJson',
						i,
						'{}',
					) as string;
					const extra = { ...jsonObject(this, updateMeetingExtraJson, '扩展请求 JSON', i) };
					if (extra.settings && typeof extra.settings === 'object') {
						if (Array.isArray(extra.settings))
							fail(this, '扩展请求 JSON 的 settings 必须是对象', i);
						body.settings = {
							...((body.settings as IDataObject) || {}),
							...(extra.settings as IDataObject),
						};
						delete extra.settings;
					}
					Object.assign(body, extra);
					body.meetingid = meetingid;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update', body);
			} else if (operation === 'getMeetingInvitees') {
				// https://developer.work.weixin.qq.com/document/path/98160
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const cursor = text(this, this.getNodeParameter('cursor', i, ''), '游标', i, 4096, false);

				const body: IDataObject = { meetingid };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_invitees', body);
			} else if (operation === 'updateMeetingInvitees') {
				// https://developer.work.weixin.qq.com/document/path/98162
				// 路径为 set_invitees，覆盖式完整列表
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
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

				const rawIds: unknown[] = [
					invitee_userids,
					this.getNodeParameter('invitee_userids_selected', i, []),
				];
				((inviteesCollection?.invitees as IDataObject[]) || []).forEach((inv) => {
					if (inv.userid || inv.userid_selected) rawIds.push(inv.userid || inv.userid_selected);
				});
				((addInviteesCollection?.invitees as IDataObject[]) || []).forEach((inv) => {
					if (inv.userid || inv.userid_selected) rawIds.push(inv.userid || inv.userid_selected);
				});
				const ids = stringList(this, rawIds, '受邀成员', i, 0, 2000);

				const body: IDataObject = {
					meetingid,
					invitees: ids.map((userid) => ({ userid })),
				};

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/set_invitees', body);
			} else if (operation === 'getLiveParticipants') {
				// 获取实时会中成员列表
				// https://developer.work.weixin.qq.com/document/path/98157
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const cursor = text(this, this.getNodeParameter('cursor', i, ''), '游标', i, 4096, false);
				const size = this.getNodeParameter('size', i, 50) as number;
				const sub_meetingid = text(
					this,
					this.getNodeParameter('sub_meetingid', i, ''),
					'子会议 ID',
					i,
					128,
					false,
				);

				const body: IDataObject = { meetingid, limit: integer(this, size, '每页数量', i, 1, 50) };
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
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const cursor = text(this, this.getNodeParameter('cursor', i, ''), '游标', i, 4096, false);
				const size = this.getNodeParameter('size', i, 100) as number;
				const sub_meetingid = text(
					this,
					this.getNodeParameter('sub_meetingid', i, ''),
					'子会议 ID',
					i,
					128,
					false,
				);
				const start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('attendee_start_time', i, '') as string | number,
					'参会开始时间',
					i,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('attendee_end_time', i, '') as string | number,
					'参会结束时间',
					i,
				);
				if (start_time && end_time) {
					if (end_time <= start_time) fail(this, '参会结束时间必须晚于开始时间', i);
					if (end_time - start_time > 31 * 86400) fail(this, '参会时间跨度不能超过 31 天', i);
				}

				const body: IDataObject = { meetingid, limit: integer(this, size, '每页数量', i, 1, 100) };
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
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const mute_action = integer(
					this,
					this.getNodeParameter('mute_action', i),
					'静音操作',
					i,
					1,
					2,
				);
				const membersCollection = this.getNodeParameter('membersCollection', i, {}) as IDataObject;

				const rawMembers = membersCollection.members;
				const members = Array.isArray(rawMembers)
					? (rawMembers as IDataObject[])
					: rawMembers && typeof rawMembers === 'object'
						? [rawMembers as IDataObject]
						: [];
				if (members.length !== 1) fail(this, '静音操作每次必须且只能指定一个成员', i);
				const member = members[0];
				const operated_user: IDataObject = {
					tmp_openid: text(this, member.tmp_openid || member.userid, '成员临时 OpenID', i, 128),
					instance_id: integer(this, member.instance_id ?? 1, '设备实例 ID', i, 0, 84),
				};

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
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const membersCollection = this.getNodeParameter('membersCollection', i, {}) as IDataObject;
				const allow_rejoin = this.getNodeParameter('allow_rejoin', i, true) as boolean;

				const members = (membersCollection.members as IDataObject[]) || [];
				if (members.length < 1 || members.length > 100) {
					fail(this, '被移出成员数量必须为 1–100 个', i);
				}
				const operated_users = members.map((member, index) => ({
					tmp_openid: text(
						this,
						member.tmp_openid || member.userid,
						`第 ${index + 1} 个成员的临时 OpenID`,
						i,
						128,
					),
					instance_id: integer(this, member.instance_id ?? 1, '设备实例 ID', i, 0, 84),
				}));

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
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const force_dismiss = integer(
					this,
					this.getNodeParameter('force_dismiss', i, 1),
					'强制结束选项',
					i,
					0,
					1,
				);
				const retrieve_code = integer(
					this,
					this.getNodeParameter('retrieve_code', i, 0),
					'回收会议号选项',
					i,
					0,
					1,
				);
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
				const meetingid = text(
					this,
					this.getNodeParameter('meetingid', i, ''),
					'会议 ID',
					i,
					128,
					false,
				);
				const meeting_code = text(
					this,
					this.getNodeParameter('meeting_code', i, ''),
					'入会码',
					i,
					64,
					false,
				);
				const userid = text(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, ''),
					'成员 UserID',
					i,
					64,
					false,
				);
				const start_time_raw = this.getNodeParameter('start_time', i, '') as string | number;
				const end_time_raw = this.getNodeParameter('end_time', i, '') as string | number;
				const cursor = text(this, this.getNodeParameter('cursor', i, ''), '游标', i, 4096, false);
				const size = this.getNodeParameter('size', i, 10) as number;
				if ([meetingid, meeting_code, userid].filter(Boolean).length > 1) {
					fail(this, '会议 ID、入会码与成员 UserID 最多填写一个', i);
				}
				const startTime = dateTimeToUnixTimestamp(this, start_time_raw, '开始时间', i, true);
				const endTime = dateTimeToUnixTimestamp(this, end_time_raw, '结束时间', i, true);
				validateTimeWindow(this, startTime, endTime, '录制查询时间', i, 31 * 86400);

				const body: IDataObject = {
					start_time: startTime,
					end_time: endTime,
					limit: integer(this, size, '每页数量', i, 1, 20),
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
				const meetingid = text(this, this.getNodeParameter('meetingid', i, ''), '会议 ID', i, 128);
				const record_file_id = text(
					this,
					this.getNodeParameter('record_file_id', i, ''),
					'录制文件 ID',
					i,
					128,
					false,
				);
				const meeting_record_id = text(
					this,
					this.getNodeParameter('meeting_record_id', i, ''),
					'会议录制 ID',
					i,
					128,
					false,
				);
				let addressType = this.getNodeParameter(
					'recording_address_type',
					i,
					'meetingRecord',
				) as string;
				// 兼容选择器加入前只填写 record_file_id 的工作流。
				if (addressType === 'meetingRecord' && !meeting_record_id && record_file_id) {
					addressType = 'recordFile';
				}
				if (!['meetingRecord', 'recordFile'].includes(addressType)) {
					fail(this, '录制地址查询方式不受支持', i);
				}

				if (addressType === 'meetingRecord') {
					if (!meeting_record_id) fail(this, '会议录制 ID 不能为空', i);
					const body: IDataObject = { meeting_record_id };
					body.meetingid = meetingid;
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/meeting/record/get_file_list',
						body,
					);
				} else {
					if (!record_file_id) fail(this, '录制文件 ID 不能为空', i);
					const body: IDataObject = { record_file_id };
					body.meetingid = meetingid;
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/meeting/record/get_file',
						body,
					);
				}
			}
			// 高级功能账号管理
			else if (operation === 'allocateMeetingAdvancedAccount') {
				const vip_userids = this.getNodeParameter('vip_userids', i, '') as string;
				const useridCollection = this.getNodeParameter('useridCollection', i, {}) as IDataObject;

				const rawUserids: unknown[] = [
					vip_userids,
					this.getNodeParameter('vip_userids_selected', i, []),
				];
				if (useridCollection.users) {
					const usersList = useridCollection.users as IDataObject[];
					usersList.forEach((u) => {
						if (u.userid || u.userid_selected) rawUserids.push(u.userid || u.userid_selected);
					});
				}
				const userid_list = stringList(this, rawUserids, '高级功能账号 UserID', i, 1, 100);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/vip/submit_batch_add_job',
					{ userid_list },
				);
			} else if (operation === 'deallocateMeetingAdvancedAccount') {
				const vip_userids = this.getNodeParameter('vip_userids', i, '') as string;
				const useridCollection = this.getNodeParameter('useridCollection', i, {}) as IDataObject;

				const rawUserids: unknown[] = [
					vip_userids,
					this.getNodeParameter('vip_userids_selected', i, []),
				];
				if (useridCollection.users) {
					const usersList = useridCollection.users as IDataObject[];
					usersList.forEach((u) => {
						if (u.userid || u.userid_selected) rawUserids.push(u.userid || u.userid_selected);
					});
				}
				const userid_list = stringList(this, rawUserids, '高级功能账号 UserID', i, 1, 100);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/vip/submit_batch_del_job',
					{ userid_list },
				);
			} else if (operation === 'getMeetingAdvancedAccountList') {
				// https://developer.work.weixin.qq.com/document/path/99510
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit: integer(this, limit, '每页数量', i, 1, 200) };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/vip/list', body);
			}
			// 报名管理
			// https://developer.work.weixin.qq.com/document/path/98800
			else if (operation === 'getEnrollConfig') {
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/enroll/get_config', {
					meetingid,
				});
			} else if (operation === 'setEnrollConfig') {
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
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
					approve_type: integer(this, enroll_approve_type, '审批类型', i, 1, 2),
					is_collect_question: integer(this, enroll_is_collect_question, '收集问题设置', i, 1, 2),
					no_registration_needed_for_staff: enroll_no_registration_needed_for_staff,
				};
				const formQuestions = ((enrollQuestionsCollection?.questions as IDataObject[]) || []).map(
					(q, questionIndex) => {
						const item: IDataObject = {
							is_required: integer(this, q.is_required ?? 1, '问题必填设置', i, 1, 2),
						};
						const specialType = integer(this, q.special_type ?? 1, '特殊问题类型', i, 1, 5);
						if (specialType !== 1) {
							item.special_type = specialType;
						} else {
							item.special_type = 1;
							const questionType = integer(this, q.question_type, '问题类型', i, 1, 3);
							item.question_type = questionType;
							item.question_title = textWithLimits(
								this,
								q.question_title,
								`第 ${questionIndex + 1} 个问题标题`,
								i,
								40,
								160,
							);
							const options = stringList(this, q.option_contents, '问题选项', i, 0, 8);
							if (questionType !== 3 && !options.length) {
								fail(this, `第 ${questionIndex + 1} 个单选/多选问题至少需要一个选项`, i);
							}
							if (options.some((content) => [...content].length > 40)) {
								fail(this, `第 ${questionIndex + 1} 个问题的选项不能超过 40 个字符`, i);
							}
							if (options.length) item.option_list = options.map((content) => ({ content }));
						}
						return item;
					},
				);
				if (formQuestions.length) body.question_list = formQuestions;
				Object.assign(body, jsonObject(this, enrollConfigJson, '报名配置 JSON', i));
				body.meetingid = meetingid;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/enroll/set_config',
					body,
				);
			} else if (operation === 'listEnroll') {
				// https://developer.work.weixin.qq.com/document/path/98810
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const enroll_status = integer(
					this,
					this.getNodeParameter('enroll_status', i, 0),
					'审批状态',
					i,
					0,
					3,
				);
				const cursor = text(this, this.getNodeParameter('cursor', i, ''), '游标', i, 4096, false);
				const limit = this.getNodeParameter('limit', i, 20) as number;
				const body: IDataObject = {
					meetingid,
					limit: integer(this, limit, '每页数量', i, 1, 50),
					status: enroll_status,
				};
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/enroll/list', body);
			} else if (operation === 'approveEnroll') {
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const enroll_id_list = this.getNodeParameter('enroll_id_list', i, '') as string;
				// 兼容旧字段 enroll_approve_status；官方为 action：1取消批准 2拒绝 3批准
				let enroll_approve_action = this.getNodeParameter('enroll_approve_action', i, 0) as number;
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
					action: integer(this, enroll_approve_action, '审批动作', i, 1, 3),
				};
				body.enroll_id_list = stringList(this, enroll_id_list, '报名 ID', i, 1, 1000);
				Object.assign(body, jsonObject(this, approveJson, '审批扩展 JSON', i));
				body.meetingid = meetingid;
				body.action = integer(this, body.action, '审批动作', i, 1, 3);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/enroll/approve',
					body,
				);
			}
			// Rooms 会议室
			// https://developer.work.weixin.qq.com/document/path/98795
			else if (operation === 'listRooms') {
				const meeting_room_name = text(
					this,
					this.getNodeParameter('meeting_room_name', i, ''),
					'Rooms 名称',
					i,
					256,
					false,
				);
				const cursor = text(this, this.getNodeParameter('cursor', i, ''), '游标', i, 4096, false);
				const limit = this.getNodeParameter('limit', i, 20) as number;
				const body: IDataObject = { limit: integer(this, limit, '每页数量', i, 1, 50) };
				if (meeting_room_name) body.meeting_room_name = meeting_room_name;
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/rooms/list', body);
			} else if (operation === 'getRoomInfo') {
				const meeting_room_id = text(
					this,
					this.getNodeParameter('meeting_room_id', i),
					'Rooms 会议室 ID',
					i,
					128,
				);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/rooms/get_info', {
					meeting_room_id,
				});
			} else if (operation === 'bookRooms') {
				// https://developer.work.weixin.qq.com/document/path/98791
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const meeting_room_id_list = stringList(
					this,
					this.getNodeParameter('meeting_room_id_list', i),
					'Rooms 会议室 ID',
					i,
					1,
					100,
				);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/rooms/book', {
					meetingid,
					meeting_room_id_list,
					subject_visible: this.getNodeParameter('subject_visible', i, true) as boolean,
				});
			} else if (operation === 'releaseRooms') {
				// https://developer.work.weixin.qq.com/document/path/98792
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const meeting_room_id_list_raw =
					(this.getNodeParameter('meeting_room_id_list', i, '') as string) ||
					(this.getNodeParameter('meeting_room_id', i, '') as string);
				const meeting_room_id_list = stringList(
					this,
					meeting_room_id_list_raw,
					'Rooms 会议室 ID',
					i,
					1,
					100,
				);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/rooms/release', {
					meetingid,
					meeting_room_id_list,
				});
			} else if (operation === 'setCohost') {
				// https://developer.work.weixin.qq.com/document/path/98180
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const cohost_action = this.getNodeParameter('cohost_action', i, true) as boolean;
				const cohost_tmp_openid = this.getNodeParameter('cohost_tmp_openid', i, '') as string;
				const cohost_instance_id = this.getNodeParameter('cohost_instance_id', i, 1) as number;
				// 兼容：若仅有旧 cohost_userids，取其首个作为 tmp_openid（语义可能不正确）
				const cohost_userids = this.getNodeParameter('cohost_userids', i, '') as string;
				const legacyFirst = stringList(this, cohost_userids, '旧版联席主持人字段', i, 0, 1)[0];
				const tmp_openid = text(
					this,
					cohost_tmp_openid || legacyFirst,
					'被操作成员临时 OpenID',
					i,
					128,
				);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/realcontrol/set_cohost',
					{
						meetingid,
						action: cohost_action,
						operated_user: {
							tmp_openid,
							instance_id: integer(this, cohost_instance_id, '设备实例 ID', i, 1, 84),
						},
					},
				);
			} else if (operation === 'realcontrolSet') {
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const realcontrolJson = this.getNodeParameter('realcontrolJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				const writeFormFields = this.getNodeParameter(
					'realcontrol_write_form_fields',
					i,
					false,
				) as boolean;
				if (writeFormFields) {
					body.mute_all = this.getNodeParameter('rc_mute_all', i, false) as boolean;
					body.allow_unmute_self = this.getNodeParameter(
						'rc_allow_unmute_self',
						i,
						true,
					) as boolean;
					body.enable_enter_mute = integer(
						this,
						this.getNodeParameter('rc_enable_enter_mute', i, 0),
						'入会静音设置',
						i,
						0,
						2,
					);
					body.meeting_locked = this.getNodeParameter('rc_meeting_locked', i, false) as boolean;
					body.hide_meeting_code_password = this.getNodeParameter(
						'rc_hide_meeting_code_password',
						i,
						false,
					) as boolean;
					body.allow_chat = integer(
						this,
						this.getNodeParameter('rc_allow_chat', i, 0),
						'聊天权限',
						i,
						0,
						2,
					);
					body.allow_share_screen = this.getNodeParameter(
						'rc_allow_share_screen',
						i,
						true,
					) as boolean;
					body.allow_external_user = this.getNodeParameter(
						'rc_allow_external_user',
						i,
						false,
					) as boolean;
					body.play_ivr_on_join = this.getNodeParameter('rc_play_ivr_on_join', i, false) as boolean;
					body.enable_waiting_room = this.getNodeParameter(
						'rc_enable_waiting_room',
						i,
						false,
					) as boolean;
				}
				Object.assign(body, jsonObject(this, realcontrolJson, '会中控制扩展 JSON', i));
				body.meetingid = meetingid;
				if (Object.keys(body).length === 1)
					fail(this, '至少选择写入一组表单字段，或在扩展 JSON 中填写一个设置', i);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/realcontrol/set',
					body,
				);
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
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const selected_layout_id = this.getNodeParameter('selected_layout_id', i, '') as string;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					selected_layout_id,
				};
				Object.assign(body, jsonObject(this, extraJson, '布局扩展 JSON', i));
				body.meetingid = meetingid;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/layout/set_default',
					body,
				);
			} else if (operation === 'phoneCallout') {
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const phoneCollection = this.getNodeParameter(
					'phoneCalloutCollection',
					i,
					{},
				) as IDataObject;
				const rawNumbers = (phoneCollection?.numbers as IDataObject[]) || [];
				const defaultArea = integer(
					this,
					this.getNodeParameter('phone_callout_default_area', i, 86),
					'默认国家/地区代码',
					i,
					1,
					9999,
				);
				const quickPhones = stringList(
					this,
					this.getNodeParameter('phone_callout_phones', i, ''),
					'外呼手机号',
					i,
					0,
					50,
				);
				const phone_numbers: IDataObject[] = quickPhones.map((phone) => ({
					area: defaultArea,
					phone: text(this, phone, '外呼手机号', i, 32),
				}));
				for (const [numberIndex, n] of rawNumbers.entries()) {
					const item: IDataObject = {
						area: integer(this, n.area ?? 86, '国家/地区代码', i, 1, 9999),
						phone: text(this, n.phone, `第 ${numberIndex + 1} 个外呼号码`, i, 32),
					};
					if (n.extension_number) {
						item.extension_number = text(this, n.extension_number, '分机号', i, 16);
					}
					phone_numbers.push(item);
				}
				if (phone_numbers.length < 1 || phone_numbers.length > 50) {
					fail(this, '外呼号码数量必须为 1–50 个', i);
				}
				const body: IDataObject = { meetingid };
				body.phone_numbers = phone_numbers;
				Object.assign(body, jsonObject(this, extraJson, '外呼扩展 JSON', i));
				body.meetingid = meetingid;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/phone/callout', body);
			} else if (operation === 'phoneGetCalloutStatus') {
				// https://developer.work.weixin.qq.com/document/path/98824
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const phone_status_cursor = this.getNodeParameter('phone_status_cursor', i, '') as string;
				const phone_status_limit = this.getNodeParameter('phone_status_limit', i, 50) as number;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					limit: integer(this, phone_status_limit, '每页数量', i, 1, 100),
				};
				if (phone_status_cursor) body.cursor = phone_status_cursor;
				Object.assign(body, jsonObject(this, extraJson, '外呼状态扩展 JSON', i));
				body.meetingid = meetingid;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/phone/get_callout_status',
					body,
				);
			} else if (operation === 'getPollList') {
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const poll_operator_userid = this.getNodeParameter('poll_operator_userid', i, '') as string;
				const poll_instance_id = this.getNodeParameter('poll_instance_id', i, 1) as number;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					instance_id: integer(this, poll_instance_id, '操作者实例 ID', i, 0, 84),
					operator_userid: text(this, poll_operator_userid, '操作者 OpenID', i, 128),
				};
				Object.assign(body, jsonObject(this, extraJson, '投票列表扩展 JSON', i));
				body.meetingid = meetingid;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/poll/get_poll_list',
					body,
				);
			} else if (operation === 'getPollDetail') {
				const meetingid = text(this, this.getNodeParameter('meetingid', i), '会议 ID', i, 128);
				const poll_id_adv = this.getNodeParameter('poll_id_adv', i, '') as string;
				const poll_operator_userid = this.getNodeParameter('poll_operator_userid', i, '') as string;
				const poll_instance_id = this.getNodeParameter('poll_instance_id', i, 1) as number;
				const extraJson = this.getNodeParameter('extraJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					instance_id: integer(this, poll_instance_id, '操作者实例 ID', i, 0, 84),
					poll_id: text(this, poll_id_adv, '投票 ID', i, 128),
					operator_userid: text(this, poll_operator_userid, '操作者 OpenID', i, 128),
				};
				Object.assign(body, jsonObject(this, extraJson, '投票详情扩展 JSON', i));
				body.meetingid = meetingid;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/poll/get_poll_detail',
					body,
				);
			}
			// --- 网络研讨会（结构化） ---
			else if (operation === 'webinarCreate') {
				const admin_userid = text(
					this,
					this.getNodeParameter('admin_userid', i, '') ||
						this.getNodeParameter('admin_userid_selected', i, ''),
					'管理员 UserID',
					i,
					64,
				);
				const title = textWithLimits(
					this,
					this.getNodeParameter('title', i),
					'研讨会主题',
					i,
					255,
					1020,
				);
				const start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('start_time', i) as string | number,
					'研讨会开始时间',
					i,
					true,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('end_time', i) as string | number,
					'研讨会结束时间',
					i,
					true,
				);
				if (start_time < Math.floor(Date.now() / 1000) + 1800) {
					fail(this, '研讨会开始时间至少应晚于当前时间 30 分钟', i);
				}
				if (end_time <= start_time) fail(this, '研讨会结束时间必须晚于开始时间', i);
				const admission_type = integer(
					this,
					this.getNodeParameter('admission_type', i, 0),
					'观众限制类型',
					i,
					0,
					2,
				);
				const playback_for_audience = this.getNodeParameter(
					'playback_for_audience',
					i,
					false,
				) as boolean;
				const sponsor = textWithLimits(
					this,
					this.getNodeParameter('sponsor', i, ''),
					'主办方名称',
					i,
					40,
					160,
					false,
				);
				const password = text(
					this,
					this.getNodeParameter('password', i, ''),
					'观众密码',
					i,
					6,
					false,
				);
				const host_userids = this.getNodeParameter('host_userids', i, '') as string;
				const host_userids_selected = this.getNodeParameter('host_userids_selected', i, []);
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
				if (admission_type === 2) {
					if (!/^\d{4,6}$/.test(password)) fail(this, '密码观看模式必须填写 4–6 位数字密码', i);
					body.password = password;
				}
				const cover_url = httpUrl(
					this,
					this.getNodeParameter('cover_url', i, ''),
					'封面图片 URL',
					i,
				);
				const webinar_description = this.getNodeParameter('webinar_description', i, '') as string;
				if (cover_url) body.cover_url = cover_url;
				if (webinar_description) {
					body.description = textWithLimits(
						this,
						webinar_description,
						'研讨会描述',
						i,
						5000,
						20000,
					);
				}
				const webinarHostIds = stringList(
					this,
					[host_userids, host_userids_selected],
					'主持人',
					i,
					0,
					100,
				);
				if (webinarHostIds.length) {
					body.hosts = webinarHostIds.map((userid) => ({ userid }));
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
				body.display_number_of_attendees = integer(
					this,
					this.getNodeParameter('display_number_of_attendees', i, 1),
					'展示报名人数设置',
					i,
					0,
					1,
				);
				body.preparation_mode = this.getNodeParameter('preparation_mode', i, false) as boolean;
				const sensitive_words = stringList(
					this,
					this.getNodeParameter('sensitive_words', i, ''),
					'聊天敏感词',
					i,
					0,
					50,
				);
				if (sensitive_words.some((word) => [...word].length > 10)) {
					fail(this, '单个聊天敏感词不能超过 10 个字符', i);
				}
				if (sensitive_words.length) body.sensitive_words = sensitive_words;
				// media_setting
				const media_setting: IDataObject = {
					enable_enter_mute: this.getNodeParameter('media_enable_enter_mute', i, true) as boolean,
					allow_unmute_self: this.getNodeParameter('media_allow_unmute_self', i, true) as boolean,
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
					auto_record_type: this.getNodeParameter('media_auto_record_type', i, 'none') as string,
				};
				if (media_setting.enable_screen_watermark) {
					media_setting.watermark_type = integer(
						this,
						this.getNodeParameter('media_watermark_type', i, 0),
						'水印样式',
						i,
						0,
						1,
					);
				}
				if (!['none', 'local', 'cloud'].includes(String(media_setting.auto_record_type))) {
					fail(this, '自动录制类型不受支持', i);
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
				{
					const extra = { ...jsonObject(this, webinarExtraJson, '研讨会扩展 JSON', i) };
					if (extra.media_setting && typeof extra.media_setting === 'object') {
						if (Array.isArray(extra.media_setting)) fail(this, 'media_setting 必须是 JSON 对象', i);
						body.media_setting = {
							...((body.media_setting as IDataObject) || {}),
							...(extra.media_setting as IDataObject),
						};
						delete extra.media_setting;
					}
					Object.assign(body, extra);
					body.admin_userid = admin_userid;
					body.title = title;
					body.start_time = String(start_time);
					body.end_time = String(end_time);
				}
				if (
					playback_for_audience &&
					(body.media_setting as IDataObject)?.auto_record_type !== 'cloud'
				) {
					fail(this, '允许观众观看回放时，自动录制类型必须为 cloud', i);
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/webinar/create',
					body,
				);
			} else if (operation === 'webinarGet') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i, ''),
					'研讨会 ID',
					i,
					128,
					false,
				);
				const meeting_code = text(
					this,
					this.getNodeParameter('meeting_code', i, ''),
					'研讨会 Code',
					i,
					64,
					false,
				);
				if (Boolean(meetingid) === Boolean(meeting_code)) {
					fail(this, '研讨会 ID 与研讨会 Code 必须且只能填写一个', i);
				}
				const body: IDataObject = {};
				if (meetingid) body.meetingid = meetingid;
				if (meeting_code) body.meeting_code = meeting_code;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/webinar/get', body);
			} else if (operation === 'webinarCancel') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'研讨会 ID',
					i,
					128,
				);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/webinar/cancel', {
					meetingid,
				});
			} else if (operation === 'webinarUpdate') {
				// https://developer.work.weixin.qq.com/document/path/98843
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'研讨会 ID',
					i,
					128,
				);
				const title = textWithLimits(
					this,
					this.getNodeParameter('title', i, ''),
					'研讨会主题',
					i,
					255,
					1020,
				);
				const start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('start_time', i, '') as string | number,
					'研讨会开始时间',
					i,
					true,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('end_time', i, '') as string | number,
					'研讨会结束时间',
					i,
					true,
				);
				if (start_time < Math.floor(Date.now() / 1000) + 1800) {
					fail(this, '研讨会开始时间至少应晚于当前时间 30 分钟', i);
				}
				if (end_time <= start_time) fail(this, '研讨会结束时间必须晚于开始时间', i);
				const admission_type = integer(
					this,
					this.getNodeParameter('admission_type', i, 0),
					'观众限制类型',
					i,
					0,
					2,
				);
				const playback_for_audience = this.getNodeParameter(
					'playback_for_audience',
					i,
					false,
				) as boolean;
				const sponsor = textWithLimits(
					this,
					this.getNodeParameter('sponsor', i, ''),
					'主办方名称',
					i,
					40,
					160,
					false,
				);
				const password = text(
					this,
					this.getNodeParameter('password', i, ''),
					'观众密码',
					i,
					6,
					false,
				);
				const cover_url = httpUrl(
					this,
					this.getNodeParameter('cover_url', i, ''),
					'封面图片 URL',
					i,
				);
				const webinar_description = this.getNodeParameter('webinar_description', i, '') as string;
				const host_userids = this.getNodeParameter('host_userids', i, '') as string;
				const host_userids_selected = this.getNodeParameter('host_userids_selected', i, []);
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const updateSponsor = this.getNodeParameter('webinar_update_sponsor', i, false) as boolean;
				const updatePassword = this.getNodeParameter(
					'webinar_update_password',
					i,
					false,
				) as boolean;
				const updateCover = this.getNodeParameter('webinar_update_cover', i, false) as boolean;
				const updateDescription = this.getNodeParameter(
					'webinar_update_description',
					i,
					false,
				) as boolean;
				const updateHosts = this.getNodeParameter('webinar_update_hosts', i, false) as boolean;
				const body: IDataObject = { meetingid };
				body.title = title;
				body.start_time = String(start_time);
				body.end_time = String(end_time);
				body.admission_type = admission_type;
				body.playback_for_audience = playback_for_audience;
				if (updateSponsor || sponsor) body.sponsor = sponsor;
				if (admission_type === 2) {
					if (!/^\d{4,6}$/.test(password)) fail(this, '密码观看模式必须填写 4–6 位数字密码', i);
					body.password = password;
				} else if (updatePassword || password) {
					if (password && !/^\d{4,6}$/.test(password)) fail(this, '观众密码必须是 4–6 位数字', i);
					body.password = password;
				}
				if (updateCover || cover_url) body.cover_url = cover_url;
				if (updateDescription || webinar_description) {
					body.description = textWithLimits(
						this,
						webinar_description,
						'研讨会描述',
						i,
						5000,
						20000,
						false,
					);
				}
				const webinarHostIds = stringList(
					this,
					[host_userids, host_userids_selected],
					'主持人',
					i,
					0,
					100,
				);
				if (updateHosts || webinarHostIds.length) {
					body.hosts = webinarHostIds.map((userid) => ({ userid }));
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
				body.display_number_of_attendees = integer(
					this,
					this.getNodeParameter('display_number_of_attendees', i, 1),
					'展示报名人数设置',
					i,
					0,
					1,
				);
				body.preparation_mode = this.getNodeParameter('preparation_mode', i, false) as boolean;
				const sensitive_words = stringList(
					this,
					this.getNodeParameter('sensitive_words', i, ''),
					'聊天敏感词',
					i,
					0,
					50,
				);
				if (sensitive_words.some((word) => [...word].length > 10)) {
					fail(this, '单个聊天敏感词不能超过 10 个字符', i);
				}
				if (sensitive_words.length) body.sensitive_words = sensitive_words;
				const media_setting: IDataObject = {
					enable_enter_mute: this.getNodeParameter('media_enable_enter_mute', i, true) as boolean,
					allow_unmute_self: this.getNodeParameter('media_allow_unmute_self', i, true) as boolean,
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
					auto_record_type: this.getNodeParameter('media_auto_record_type', i, 'none') as string,
				};
				if (media_setting.enable_screen_watermark) {
					media_setting.watermark_type = integer(
						this,
						this.getNodeParameter('media_watermark_type', i, 0),
						'水印样式',
						i,
						0,
						1,
					);
				}
				if (!['none', 'local', 'cloud'].includes(String(media_setting.auto_record_type))) {
					fail(this, '自动录制类型不受支持', i);
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
				{
					const extra = { ...jsonObject(this, webinarExtraJson, '研讨会扩展 JSON', i) };
					if (extra.media_setting && typeof extra.media_setting === 'object') {
						if (Array.isArray(extra.media_setting)) fail(this, 'media_setting 必须是 JSON 对象', i);
						body.media_setting = {
							...((body.media_setting as IDataObject) || {}),
							...(extra.media_setting as IDataObject),
						};
						delete extra.media_setting;
					}
					Object.assign(body, extra);
					body.meetingid = meetingid;
				}
				if (
					playback_for_audience &&
					(body.media_setting as IDataObject)?.auto_record_type !== 'cloud'
				) {
					fail(this, '允许观众观看回放时，自动录制类型必须为 cloud', i);
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/webinar/update',
					body,
				);
			} else if (operation === 'webinarListGuest') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i, ''),
					'研讨会 ID',
					i,
					128,
					false,
				);
				const meeting_code = text(
					this,
					this.getNodeParameter('meeting_code', i, ''),
					'研讨会 Code',
					i,
					64,
					false,
				);
				if (Boolean(meetingid) === Boolean(meeting_code)) {
					fail(this, '研讨会 ID 与研讨会 Code 必须且只能填写一个', i);
				}
				const body: IDataObject = meetingid ? { meetingid } : { meeting_code };
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/webinar/list_guest',
					body,
				);
			} else if (operation === 'webinarUpdateGuestList') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'研讨会 ID',
					i,
					128,
				);
				const guestsJson = this.getNodeParameter('guestsJson', i, '[]') as string;
				const guestsCollection = this.getNodeParameter(
					'webinarGuestsCollection',
					i,
					{},
				) as IDataObject;
				const body: IDataObject = { meetingid };
				let guests = webinarGuests(this, (guestsCollection?.guests as IDataObject[]) || [], i);
				const fromJson = jsonArray(this, guestsJson, '研讨会嘉宾 JSON', i);
				if (fromJson.length) guests = webinarGuests(this, fromJson, i);
				body.guests = guests;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/webinar/update_guest_list',
					body,
				);
			} else if (operation === 'webinarUpdateWarmUp') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'研讨会 ID',
					i,
					128,
				);
				const warm_up_picture = httpUrl(
					this,
					this.getNodeParameter('warm_up_picture', i, ''),
					'暖场图片 URL',
					i,
				);
				const warm_up_video = httpUrl(
					this,
					this.getNodeParameter('warm_up_video', i, ''),
					'暖场视频 URL',
					i,
				);
				let warmUpType = this.getNodeParameter('warm_up_type', i, 'none') as string;
				if (warmUpType === 'none' && warm_up_picture) warmUpType = 'picture';
				if (warmUpType === 'none' && warm_up_video) warmUpType = 'video';
				if (!['none', 'picture', 'video'].includes(warmUpType))
					fail(this, '暖场素材类型不受支持', i);
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
				if (warmUpType === 'picture') {
					if (!warm_up_picture) fail(this, '暖场图片 URL 不能为空', i);
					body.warm_up_picture = warm_up_picture;
					body.warm_up_video = '';
				} else if (warmUpType === 'video') {
					if (!warm_up_video) fail(this, '暖场视频 URL 不能为空', i);
					body.warm_up_picture = '';
					body.warm_up_video = warm_up_video;
				} else {
					body.warm_up_picture = '';
					body.warm_up_video = '';
				}
				Object.assign(body, jsonObject(this, webinarExtraJson, '暖场扩展 JSON', i));
				body.meetingid = meetingid;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/webinar/update_warm_up',
					body,
				);
			} else if (operation === 'webinarEnrollGetConfig') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'研讨会 ID',
					i,
					128,
				);
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
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'研讨会 ID',
					i,
					128,
				);
				const webinarEnrollJson = this.getNodeParameter('webinarEnrollJson', i, '{}') as string;
				const body: IDataObject = { meetingid };
				if (operation === 'webinarEnrollSetConfig') {
					body.approve_type = integer(
						this,
						this.getNodeParameter('webinar_approve_type', i, 1),
						'审批类型',
						i,
						1,
						2,
					);
					body.is_collect_question = integer(
						this,
						this.getNodeParameter('webinar_is_collect_question', i, 1),
						'收集问题设置',
						i,
						1,
						2,
					);
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
						(q, questionIndex) => {
							const item: IDataObject = {
								is_required: integer(this, q.is_required ?? 1, '问题必填设置', i, 1, 2),
							};
							const specialType = integer(this, q.special_type ?? 1, '特殊问题类型', i, 1, 5);
							if (specialType !== 1) {
								item.special_type = specialType;
							} else {
								item.special_type = 1;
								const questionType = integer(this, q.question_type, '问题类型', i, 1, 3);
								item.question_type = questionType;
								item.question_title = textWithLimits(
									this,
									q.question_title,
									`第 ${questionIndex + 1} 个问题标题`,
									i,
									40,
									160,
								);
								const options = stringList(this, q.option_contents, '问题选项', i, 0, 8);
								if (questionType !== 3 && !options.length) {
									fail(this, `第 ${questionIndex + 1} 个单选/多选问题至少需要一个选项`, i);
								}
								if (options.some((content) => [...content].length > 40)) {
									fail(this, `第 ${questionIndex + 1} 个问题的选项不能超过 40 个字符`, i);
								}
								if (options.length) item.option_list = options.map((content) => ({ content }));
							}
							return item;
						},
					);
					if (formQuestions.length) body.question_list = formQuestions;
				}
				if (operation === 'webinarEnrollApprove' || operation === 'webinarEnrollDelete') {
					const enrollIds = stringList(
						this,
						this.getNodeParameter('webinar_enroll_id_list', i, ''),
						'报名 ID',
						i,
						1,
						1000,
					);
					body.enroll_id_list =
						operation === 'webinarEnrollDelete'
							? enrollIds.map((enroll_id) => ({ enroll_id }))
							: enrollIds;
				}
				if (operation === 'webinarEnrollApprove') {
					body.action = integer(
						this,
						this.getNodeParameter('webinar_enroll_action', i, 3),
						'审批动作',
						i,
						1,
						3,
					);
				}
				if (operation === 'webinarEnrollImport') {
					const importCollection = this.getNodeParameter(
						'webinarEnrollImportCollection',
						i,
						{},
					) as IDataObject;
					const members = (importCollection?.members as IDataObject[]) || [];
					const formList = members.map((m, memberIndex) => {
						const item: IDataObject = {};
						const userid = m.userid || m.userid_selected;
						if (userid) item.userid = text(this, userid, '报名成员 UserID', i, 64);
						if (m.phone_number) {
							item.phone_number = text(this, m.phone_number, '报名成员手机号', i, 32);
							item.area = text(this, m.area || '86', '国家/地区代码', i, 8);
						}
						if (!item.userid && !item.phone_number) {
							fail(this, `第 ${memberIndex + 1} 个报名成员必须填写 UserID 或手机号`, i);
						}
						if (m.nick_name) item.nick_name = text(this, m.nick_name, '报名昵称', i, 256);
						return item;
					});
					if (formList.length) body.enroll_list = formList;
				}
				if (operation === 'webinarEnrollQueryByTmpOpenid') {
					const tmp_openid = this.getNodeParameter('webinar_enroll_tmp_openid', i, '') as string;
					body.tmp_openid = text(this, tmp_openid, '临时 OpenID', i, 128);
				}
				Object.assign(body, jsonObject(this, webinarEnrollJson, '研讨会报名扩展 JSON', i));
				body.meetingid = meetingid;
				if (operation === 'webinarEnrollImport' && !Array.isArray(body.enroll_list)) {
					fail(this, '导入报名必须提供 enroll_list 数组', i);
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
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'研讨会 ID',
					i,
					128,
				);
				const cursor = text(
					this,
					this.getNodeParameter('webinar_cursor', i, ''),
					'游标',
					i,
					4096,
					false,
				);
				const limit = this.getNodeParameter('webinar_limit', i, 10) as number;
				const webinarEnrollJson = this.getNodeParameter('webinarEnrollJson', i, '{}') as string;
				const body: IDataObject = {
					meetingid,
					limit: integer(this, limit, '每页数量', i, 1, 50),
					status: integer(
						this,
						this.getNodeParameter('webinar_enroll_status', i, 0),
						'审批状态',
						i,
						0,
						3,
					),
				};
				if (cursor) body.cursor = cursor;
				Object.assign(body, jsonObject(this, webinarEnrollJson, '研讨会报名扩展 JSON', i));
				body.meetingid = meetingid;
				body.limit = integer(this, body.limit, '每页数量', i, 1, 50);
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
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'会议 ID',
					i,
					128,
				);
				const meeting_record_id = text(
					this,
					this.getNodeParameter('meeting_record_id', i),
					'会议录制 ID',
					i,
					128,
				);
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const body: IDataObject = { meetingid, meeting_record_id };
				Object.assign(body, jsonObject(this, webinarExtraJson, '录制删除扩展 JSON', i));
				body.meetingid = meetingid;
				body.meeting_record_id = meeting_record_id;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/record/delete', body);
			} else if (operation === 'recordDeleteFile') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'会议 ID',
					i,
					128,
				);
				const record_file_id = text(
					this,
					this.getNodeParameter('webinar_record_file_id', i),
					'录制文件 ID',
					i,
					128,
				);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/record/delete_file', {
					meetingid,
					record_file_id,
				});
			} else if (operation === 'recordGetFileList') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i, ''),
					'会议 ID',
					i,
					128,
					false,
				);
				const meeting_code = text(
					this,
					this.getNodeParameter('meeting_code', i, ''),
					'入会码',
					i,
					64,
					false,
				);
				const userid = text(
					this,
					this.getNodeParameter('record_userid', i, '') ||
						this.getNodeParameter('record_userid_selected', i, ''),
					'成员 UserID',
					i,
					64,
					false,
				);
				const start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('record_start_time', i, '') as string | number,
					'开始时间',
					i,
					true,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('record_end_time', i, '') as string | number,
					'结束时间',
					i,
					true,
				);
				validateTimeWindow(this, start_time, end_time, '录制查询时间', i, 31 * 86400);
				if ([meetingid, meeting_code, userid].filter(Boolean).length > 1) {
					fail(this, '会议 ID、入会码与成员 UserID 最多填写一个', i);
				}
				const cursor = text(
					this,
					this.getNodeParameter('webinar_cursor', i, ''),
					'游标',
					i,
					4096,
					false,
				);
				const limit = this.getNodeParameter('webinar_limit', i, 10) as number;
				const body: IDataObject = {
					start_time,
					end_time,
					limit: integer(this, limit, '每页数量', i, 1, 20),
				};
				if (meetingid) body.meetingid = meetingid;
				if (meeting_code) body.meeting_code = meeting_code;
				if (userid) body.userid = userid;
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/record/list', body);
			} else if (operation === 'recordGetStatistics') {
				const meeting_record_id = text(
					this,
					this.getNodeParameter('meeting_record_id', i, ''),
					'会议录制 ID',
					i,
					128,
				);
				const record_stat_start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('record_stat_start_time', i, '') as string | number,
					'统计开始时间',
					i,
				);
				const record_stat_end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('record_stat_end_time', i, '') as string | number,
					'统计结束时间',
					i,
				);
				if (record_stat_start_time && record_stat_end_time) {
					if (record_stat_end_time <= record_stat_start_time)
						fail(this, '统计结束时间必须晚于开始时间', i);
					if (record_stat_end_time - record_stat_start_time > 31 * 86400)
						fail(this, '统计时间跨度不能超过 31 天', i);
				}
				const webinarExtraJson = this.getNodeParameter('webinarExtraJson', i, '{}') as string;
				const body: IDataObject = { meeting_record_id };
				if (record_stat_start_time) body.start_time = record_stat_start_time;
				if (record_stat_end_time) body.end_time = record_stat_end_time;
				Object.assign(body, jsonObject(this, webinarExtraJson, '录制统计扩展 JSON', i));
				body.meeting_record_id = meeting_record_id;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/get_statistics',
					body,
				);
			} else if (operation === 'recordUpdateSharingConfig') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'会议 ID',
					i,
					128,
				);
				const meeting_record_id = text(
					this,
					this.getNodeParameter('meeting_record_id', i, ''),
					'会议录制 ID',
					i,
					128,
				);
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
				const sharing_config: IDataObject = { enable_sharing: sharing_enable_sharing };
				if (sharing_enable_sharing) {
					sharing_config.sharing_auth_type = integer(
						this,
						sharing_auth_type,
						'共享权限类型',
						i,
						0,
						5,
					);
					sharing_config.enable_password = sharing_enable_password;
					sharing_config.allow_download = sharing_allow_download;
					if (sharing_enable_password) {
						sharing_config.password = text(this, sharing_password, '共享密码', i, 128);
					}
					const enableExpire = this.getNodeParameter('sharing_enable_expire', i, false) as boolean;
					sharing_config.enable_sharing_expire = enableExpire;
					if (enableExpire) {
						sharing_config.sharing_expire = dateTimeToUnixMilliseconds(
							this,
							this.getNodeParameter('sharing_expire', i, ''),
							'共享链接有效期',
							i,
							true,
						);
					}
				}
				const body: IDataObject = {
					meetingid,
					meeting_record_id,
					sharing_config,
				};
				{
					const extra = { ...jsonObject(this, webinarExtraJson, '录制共享扩展 JSON', i) };
					if (extra.sharing_config && typeof extra.sharing_config === 'object') {
						if (Array.isArray(extra.sharing_config))
							fail(this, 'sharing_config 必须是 JSON 对象', i);
						Object.assign(sharing_config, extra.sharing_config as IDataObject);
						delete extra.sharing_config;
					}
					Object.assign(body, extra);
					body.meetingid = meetingid;
					body.meeting_record_id = meeting_record_id;
					body.sharing_config = sharing_config;
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/update_sharing_config',
					body,
				);
			} else if (operation === 'recordTranscriptGetDetail') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'会议 ID',
					i,
					128,
				);
				const record_file_id = text(
					this,
					this.getNodeParameter('webinar_record_file_id', i),
					'录制文件 ID',
					i,
					128,
				);
				const pid = this.getNodeParameter('transcript_pid', i, '') as string;
				const limit = this.getNodeParameter('webinar_limit', i, 10) as number;
				const body: IDataObject = { meetingid, record_file_id };
				if (pid) body.pid = pid;
				if (limit) body.limit = integer(this, limit, '段落数量', i, 1, 10000);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/transcript/get_detail',
					body,
				);
			} else if (operation === 'recordTranscriptGetParagraphList') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'会议 ID',
					i,
					128,
				);
				const record_file_id = text(
					this,
					this.getNodeParameter('webinar_record_file_id', i),
					'录制文件 ID',
					i,
					128,
				);
				const body: IDataObject = { meetingid, record_file_id };
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/transcript/get_paragraph_list',
					body,
				);
			} else if (operation === 'recordTranscriptSearch') {
				const meetingid = text(
					this,
					this.getNodeParameter('webinar_meetingid', i),
					'会议 ID',
					i,
					128,
				);
				const record_file_id = text(
					this,
					this.getNodeParameter('webinar_record_file_id', i),
					'录制文件 ID',
					i,
					128,
				);
				const searchText = text(
					this,
					this.getNodeParameter('transcript_text', i),
					'搜索文本',
					i,
					4096,
				);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/meeting/record/transcript/search',
					{ meetingid, record_file_id, text: searchText },
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
				const body: IDataObject = jsonObject(
					this,
					this.getNodeParameter('cr_extra_json', i, '{}'),
					'扩展请求 JSON',
					i,
				);
				const requiredMeetingIdOps = [
					'roomsCall',
					'roomsCancelCall',
					'roomsGetResponseStatus',
					'mraHangup',
					'mraQueryStatus',
					'mraSetDefaultLayout',
					'mraSetRaiseHand',
					'pollCreateTheme',
					'pollUpdateTheme',
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
					'createCustomerShortUrl',
					'getCustomerShortUrl',
					'phoneGetTmpOpenid',
				];
				if (requiredMeetingIdOps.includes(operation)) {
					body.meetingid = text(
						this,
						this.getNodeParameter('cr_meetingid', i, ''),
						'会议 ID',
						i,
						128,
					);
				} else if (operation === 'pollGetThemeInfo') {
					const meetingid = text(
						this,
						this.getNodeParameter('cr_meetingid', i, ''),
						'会议 ID',
						i,
						128,
						false,
					);
					if (meetingid) body.meetingid = meetingid;
				}

				if (['roomsCall', 'roomsCancelCall', 'roomsGetResponseStatus'].includes(operation)) {
					const targetType = this.getNodeParameter('rooms_target_type', i, '') as string;
					let meetingRoomId = text(
						this,
						this.getNodeParameter('cr_meeting_room_id', i, ''),
						'Rooms 会议室 ID',
						i,
						128,
						false,
					);
					let protocolRaw = this.getNodeParameter('mra_protocol', i, 0);
					let dialString = text(
						this,
						this.getNodeParameter('mra_dial_string', i, ''),
						'MRA 信令地址',
						i,
						512,
						false,
					);
					if (targetType === 'room') {
						protocolRaw = 0;
						dialString = '';
					} else if (targetType === 'mra') {
						meetingRoomId = '';
					}
					const hasMraAddress = Number(protocolRaw) !== 0 || Boolean(dialString);
					if (Boolean(meetingRoomId) === hasMraAddress) {
						fail(this, 'Rooms 会议室 ID 与 MRA 信令地址必须且只能填写一种', i);
					}
					if (meetingRoomId) body.meeting_room_id = meetingRoomId;
					else {
						body.mra_address = {
							protocol: integer(this, protocolRaw, 'MRA 信令协议', i, 1, 2),
							dial_string: text(this, dialString, 'MRA 信令地址', i, 512),
						};
					}
					if (operation === 'roomsCancelCall') {
						body.invite_id = text(
							this,
							this.getNodeParameter('rooms_invite_id', i, ''),
							'呼叫 ID',
							i,
							128,
						);
					} else {
						delete body.invite_id;
					}
				} else if (operation === 'roomsListMeetings') {
					const targetType = this.getNodeParameter('rooms_list_target_type', i, '') as string;
					let meetingRoomId = text(
						this,
						this.getNodeParameter('cr_meeting_room_id', i, ''),
						'Rooms 会议室 ID',
						i,
						128,
						false,
					);
					let roomsId = text(
						this,
						this.getNodeParameter('rooms_id', i, ''),
						'Rooms 设备 ID',
						i,
						128,
						false,
					);
					if (targetType === 'meetingRoom') roomsId = '';
					else if (targetType === 'rooms') meetingRoomId = '';
					if (Boolean(meetingRoomId) === Boolean(roomsId)) {
						fail(this, 'Rooms 会议室 ID 与 Rooms 设备 ID 必须且只能填写一个', i);
					}
					if (meetingRoomId) body.meeting_room_id = meetingRoomId;
					if (roomsId) body.rooms_id = roomsId;
					const startTime = dateTimeToUnixTimestamp(
						this,
						this.getNodeParameter('rooms_list_start_time', i, ''),
						'查询开始时间',
						i,
					);
					const endTime = dateTimeToUnixTimestamp(
						this,
						this.getNodeParameter('rooms_list_end_time', i, ''),
						'查询结束时间',
						i,
					);
					validateTimeWindow(this, startTime, endTime, '会议室会议查询时间', i, 90 * 86400);
					if (startTime) body.start_time = startTime;
					if (endTime) body.end_time = endTime;
				} else if (operation === 'roomsGetConfig') {
					body.meeting_room_id = text(
						this,
						this.getNodeParameter('cr_meeting_room_id', i, ''),
						'Rooms 会议室 ID',
						i,
						128,
					);
				} else if (operation === 'roomsGetInventory') {
					for (const key of Object.keys(body)) delete body[key];
				} else if (operation === 'roomsListDevices') {
					const roomName = text(
						this,
						this.getNodeParameter('rooms_meeting_room_name', i, ''),
						'Rooms 会议室名称',
						i,
						256,
						false,
					);
					if (roomName) body.meeting_room_name = roomName;
				} else if (operation === 'roomsListControllers') {
					const controllerName = text(
						this,
						this.getNodeParameter('rooms_controller_name', i, ''),
						'控制器名称',
						i,
						256,
						false,
					);
					if (controllerName) body.controller_name = controllerName;
				}

				if (
					['mraHangup', 'mraQueryStatus', 'mraSetDefaultLayout', 'mraSetRaiseHand'].includes(
						operation,
					)
				) {
					const tmpOpenid = text(
						this,
						this.getNodeParameter('mra_tmp_openid', i, ''),
						'MRA 临时 OpenID',
						i,
						128,
					);
					if (operation === 'mraQueryStatus') body.tmp_openid = tmpOpenid;
					else body.mra = { tmp_openid: tmpOpenid };
					if (operation === 'mraSetDefaultLayout') {
						body.default_layout = integer(
							this,
							this.getNodeParameter('mra_default_layout', i, 2),
							'MRA 默认分屏',
							i,
							1,
							3,
						);
						body.default_novideo_user = integer(
							this,
							this.getNodeParameter('mra_default_novideo_user', i, 1),
							'非视频与会者显示方式',
							i,
							1,
							2,
						);
					}
					if (operation === 'mraSetRaiseHand') {
						body.raise_hand = this.getNodeParameter('mra_raise_hand', i, true) as boolean;
					}
				}

				const pollOps = [
					'pollCreateTheme',
					'pollUpdateTheme',
					'pollGetThemeInfo',
					'pollStart',
					'pollFinish',
					'pollDelete',
				];
				if (pollOps.includes(operation)) {
					body.operator_userid = text(
						this,
						this.getNodeParameter('operator_userid', i, ''),
						'操作者 OpenID',
						i,
						128,
					);
					body.instance_id = integer(
						this,
						this.getNodeParameter('instance_id', i, 1),
						'设备实例 ID',
						i,
						0,
						MAX_UINT32,
					);
					const deleteType = this.getNodeParameter('poll_delete_type', i, '') as string;
					const themeId = text(
						this,
						operation === 'pollDelete' && deleteType === 'poll'
							? ''
							: this.getNodeParameter('poll_theme_id', i, ''),
						'投票主题 ID',
						i,
						128,
						!['pollCreateTheme', 'pollDelete'].includes(operation),
					);
					const pollId = text(
						this,
						operation === 'pollDelete' && deleteType === 'theme'
							? ''
							: this.getNodeParameter('poll_id', i, ''),
						'投票 ID',
						i,
						128,
						operation === 'pollFinish',
					);
					if (operation === 'pollDelete') {
						if (Boolean(themeId) === Boolean(pollId)) {
							fail(this, '删除投票时，投票主题 ID 与投票 ID 必须且只能填写一个', i);
						}
					}
					if (themeId) body.poll_theme_id = themeId;
					if (pollId) body.poll_id = pollId;
					if (operation === 'pollCreateTheme' || operation === 'pollUpdateTheme') {
						body.poll_topic = textWithLimits(
							this,
							this.getNodeParameter('poll_topic', i, ''),
							'投票主题',
							i,
							50,
							200,
						);
						body.poll_desc = textWithLimits(
							this,
							this.getNodeParameter('poll_desc', i, ''),
							'投票描述',
							i,
							100,
							400,
						);
						body.is_anony = integer(
							this,
							this.getNodeParameter('is_anony', i, 0),
							'匿名设置',
							i,
							0,
							1,
						);
						const questionsCollection = this.getNodeParameter(
							'pollQuestionsCollection',
							i,
							{},
						) as IDataObject;
						const formQuestions = (questionsCollection.questions as unknown[]) || [];
						const jsonQuestions = jsonArray(
							this,
							this.getNodeParameter('poll_questions_json', i, '[]'),
							'投票问题 JSON',
							i,
						);
						body.poll_questions = pollQuestions(
							this,
							jsonQuestions.length ? jsonQuestions : formQuestions,
							i,
							operation === 'pollCreateTheme' ? 'create' : 'update',
						);
					}
				}

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
					const rawFormUsers = usersCollection.users;
					const formUsers = Array.isArray(rawFormUsers)
						? rawFormUsers
						: rawFormUsers && typeof rawFormUsers === 'object'
							? [rawFormUsers]
							: [];
					const jsonUsers = jsonArray(
						this,
						this.getNodeParameter('operated_users_json', i, '[]'),
						'被操作用户 JSON',
						i,
					);
					const isSingular =
						operation === 'rcCloseScreenShare' || operation === 'rcSwitchUserVideo';
					const users = controlUsers(
						this,
						jsonUsers.length ? jsonUsers : formUsers,
						i,
						operation === 'rcSetNicknames',
						isSingular,
					);
					if (isSingular) body.operated_user = users[0];
					else body.operated_users = users;
					if (operation === 'rcManageWaitingRoom') {
						body.operate_type = integer(
							this,
							this.getNodeParameter('waiting_operate_type', i, 1),
							'等候室操作类型',
							i,
							1,
							3,
						);
						if (body.operate_type === 3) {
							body.allow_rejoin = this.getNodeParameter('waiting_allow_rejoin', i, true) as boolean;
						} else delete body.allow_rejoin;
					}
					if (operation === 'rcSwitchUserVideo') {
						body.video = this.getNodeParameter('rc_video_on', i, false) as boolean;
					}
				}

				if (operation === 'setGuests') {
					const collection = this.getNodeParameter('meetingGuestsCollection', i, {}) as IDataObject;
					const jsonGuests = jsonArray(
						this,
						this.getNodeParameter('list_data_json', i, '[]'),
						'嘉宾列表 JSON',
						i,
					);
					body.guests = meetingGuests(
						this,
						jsonGuests.length ? { guests: jsonGuests } : collection,
						i,
					);
				} else if (operation === 'setInvitees') {
					const jsonInvitees = jsonArray(
						this,
						this.getNodeParameter('list_data_json', i, '[]'),
						'受邀成员列表 JSON',
						i,
					);
					const rawInvitees: unknown[] = jsonInvitees.length
						? jsonInvitees
						: stringList(
								this,
								[
									this.getNodeParameter('invitee_userids', i, ''),
									this.getNodeParameter('invitee_userids_selected', i, []),
								],
								'受邀成员 UserID',
								i,
								0,
								2000,
							).map((userid) => ({ userid }));
					if (rawInvitees.length > 2000) fail(this, '受邀成员最多支持 2000 人', i);
					body.invitees = rawInvitees.map((rawInvitee, inviteeIndex) => {
						if (!rawInvitee || typeof rawInvitee !== 'object' || Array.isArray(rawInvitee)) {
							fail(this, `第 ${inviteeIndex + 1} 个受邀成员必须是对象`, i);
						}
						return {
							userid: text(
								this,
								(rawInvitee as IDataObject).userid,
								`第 ${inviteeIndex + 1} 个受邀成员 UserID`,
								i,
								64,
							),
						};
					});
				} else if (operation === 'enrollDelete') {
					const formIds = stringList(
						this,
						this.getNodeParameter('enroll_id_list_cr', i, ''),
						'报名 ID',
						i,
						0,
						1000,
					).map((enroll_id) => ({ enroll_id }));
					const jsonIds = jsonArray(
						this,
						this.getNodeParameter('list_data_json', i, '[]'),
						'报名 ID 列表 JSON',
						i,
					);
					const rawIds = jsonIds.length ? jsonIds : formIds;
					if (rawIds.length < 1 || rawIds.length > 1000) {
						fail(this, '报名 ID 数量必须为 1–1000 个', i);
					}
					body.enroll_id_list = rawIds.map((rawId, idIndex) => {
						if (!rawId || typeof rawId !== 'object' || Array.isArray(rawId)) {
							fail(this, `第 ${idIndex + 1} 个报名 ID 必须是对象`, i);
						}
						return {
							enroll_id: text(
								this,
								(rawId as IDataObject).enroll_id,
								`第 ${idIndex + 1} 个报名 ID`,
								i,
								128,
							),
						};
					});
				} else if (operation === 'enrollImport') {
					const collection = this.getNodeParameter('enrollImportCollection', i, {}) as IDataObject;
					const formMembers = (collection.members as unknown[]) || [];
					const jsonMembers = jsonArray(
						this,
						this.getNodeParameter('list_data_json', i, '[]'),
						'导入报名列表 JSON',
						i,
					);
					const members = jsonMembers.length ? jsonMembers : formMembers;
					if (members.length < 1 || members.length > 1000) {
						fail(this, '导入报名成员数量必须为 1–1000 个', i);
					}
					body.enroll_list = members.map((rawMember, memberIndex) => {
						if (!rawMember || typeof rawMember !== 'object' || Array.isArray(rawMember)) {
							fail(this, `第 ${memberIndex + 1} 个报名成员必须是对象`, i);
						}
						const member = rawMember as IDataObject;
						const userid = text(
							this,
							member.userid || member.userid_selected,
							`第 ${memberIndex + 1} 个报名成员 UserID`,
							i,
							64,
							false,
						);
						const phoneNumber = text(
							this,
							member.phone_number,
							`第 ${memberIndex + 1} 个报名成员手机号`,
							i,
							32,
							false,
						);
						if (Boolean(userid) === Boolean(phoneNumber)) {
							fail(this, `第 ${memberIndex + 1} 个报名成员的 UserID 与手机号必须且只能填写一个`, i);
						}
						const normalized: IDataObject = {};
						if (userid) normalized.userid = userid;
						if (phoneNumber) {
							const area = text(
								this,
								member.area,
								`第 ${memberIndex + 1} 个报名成员国家/地区代码`,
								i,
								8,
							);
							if (!/^\d+$/.test(area)) fail(this, '国家/地区代码只能包含数字', i);
							normalized.area = area;
							normalized.phone_number = phoneNumber;
						}
						const nickname = textWithLimits(
							this,
							member.nick_name,
							`第 ${memberIndex + 1} 个报名成员昵称`,
							i,
							64,
							256,
							false,
						);
						if (nickname) normalized.nick_name = nickname;
						return normalized;
					});
				} else if (operation === 'enrollQueryByTmpOpenid') {
					body.tmp_openid = text(
						this,
						this.getNodeParameter('enroll_tmp_openid', i, ''),
						'临时 OpenID',
						i,
						128,
					);
				} else if (operation === 'createCustomerShortUrl') {
					const mode = this.getNodeParameter('customer_data_mode', i, '') as string;
					body.customer_data = customerData(
						this,
						mode === 'userData' ? '' : this.getNodeParameter('customer_data_raw', i, ''),
						mode === 'base64' ? '' : this.getNodeParameter('customer_user_data', i, ''),
						i,
					);
				} else if (operation === 'getQuality') {
					const startTime = dateTimeToUnixTimestamp(
						this,
						this.getNodeParameter('quality_start_time', i, ''),
						'质量查询开始时间',
						i,
						true,
					);
					const now = Math.floor(Date.now() / 1000);
					if (startTime > now || startTime < now - 7 * 86400) {
						fail(this, '质量查询开始时间必须在过去 7 天至当前时间之间', i);
					}
					body.start_time = startTime;
					const subMeetingId = text(
						this,
						this.getNodeParameter('sub_meetingid', i, ''),
						'周期性子会议 ID',
						i,
						128,
						false,
					);
					if (subMeetingId) body.sub_meetingid = subMeetingId;
				} else if (operation === 'checkDeviceInMeeting') {
					body.userid = text(
						this,
						this.getNodeParameter('device_check_userid', i, '') ||
							this.getNodeParameter('device_check_userid_selected', i, ''),
						'成员 UserID',
						i,
						64,
					);
					body.meetingid_list = stringList(
						this,
						this.getNodeParameter('device_meetingid_list', i, ''),
						'会议 ID',
						i,
						1,
						1000,
					).map((meetingId) => text(this, meetingId, '会议 ID', i, 128));
					const instanceIds = stringList(
						this,
						this.getNodeParameter('device_instance_id_list', i, ''),
						'设备类型',
						i,
						0,
						100,
					).map((instanceId) => integer(this, instanceId, '设备类型', i, 0, MAX_UINT32));
					if (instanceIds.length) body.instance_id_list = instanceIds;
				} else if (operation === 'phoneGetTmpOpenid') {
					const collection = this.getNodeParameter(
						'phoneGetTmpOpenidCollection',
						i,
						{},
					) as IDataObject;
					const numbers = (collection.numbers as IDataObject[]) || [];
					if (numbers.length < 1 || numbers.length > 20) {
						fail(this, '查询电话号码数量必须为 1–20 个', i);
					}
					body.phone_numbers = numbers.map((number, numberIndex) => {
						const normalized: IDataObject = {
							area: integer(
								this,
								number.area,
								`第 ${numberIndex + 1} 个号码的国家/地区代码`,
								i,
								1,
								MAX_UINT32,
							),
							phone: text(this, number.phone, `第 ${numberIndex + 1} 个电话号码`, i, 32),
						};
						const extension = text(
							this,
							number.extension_number,
							`第 ${numberIndex + 1} 个分机号`,
							i,
							32,
							false,
						);
						if (extension) normalized.extension_number = extension;
						return normalized;
					});
				} else if (operation === 'vipBatchDelJobResult') {
					body.jobid = text(this, this.getNodeParameter('vip_jobid', i, ''), '任务 ID', i, 128);
				}

				const listOps = [
					'roomsListDevices',
					'roomsListControllers',
					'roomsListMeetings',
					'waitingroomUserList',
					'waitingroomCurrentUsers',
					'getQuality',
				];
				if (listOps.includes(operation)) {
					const cursor = text(
						this,
						this.getNodeParameter('cr_cursor', i, ''),
						'分页游标',
						i,
						1024,
						false,
					);
					if (cursor) body.cursor = cursor;
					body.limit = integer(
						this,
						this.getNodeParameter('cr_limit', i, 20),
						'条数限制',
						i,
						1,
						operation === 'roomsListMeetings' ? 20 : 50,
					);
				}

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
				const meetingid = text(
					this,
					this.getNodeParameter('layout_meetingid', i),
					'会议 ID',
					i,
					128,
				);
				const body: IDataObject = {
					...jsonObject(
						this,
						this.getNodeParameter('layoutConfigJson', i, '{}'),
						'布局/背景配置 JSON',
						i,
					),
					...jsonObject(
						this,
						this.getNodeParameter('layoutExtraJson', i, '{}'),
						'扩展请求 JSON',
						i,
					),
				};
				const pagesCollection = this.getNodeParameter(
					'layoutPagesCollection',
					i,
					{},
				) as IDataObject;
				const formPages = (pagesCollection.pages as unknown[]) || [];

				if (operation === 'advLayoutAdd' || operation === 'basicLayoutAdd') {
					const advanced = operation === 'advLayoutAdd';
					const rawLayouts = Array.isArray(body.layout_list)
						? body.layout_list
						: [
								{
									layout_name: this.getNodeParameter('layout_name', i, ''),
									page_list: formPages,
								},
							];
					if (rawLayouts.length < 1 || rawLayouts.length > 100) {
						fail(this, '布局数量必须为 1–100 个', i);
					}
					body.layout_list = rawLayouts.map((rawLayout, layoutIndex) => {
						if (!rawLayout || typeof rawLayout !== 'object' || Array.isArray(rawLayout)) {
							fail(this, `第 ${layoutIndex + 1} 个布局必须是对象`, i);
						}
						const layout = rawLayout as IDataObject;
						const normalized: IDataObject = {
							page_list: normalizeLayoutPages(
								this,
								Array.isArray(layout.page_list) ? layout.page_list : [],
								i,
								advanced,
								advanced,
								advanced,
							),
						};
						if (advanced) {
							const layoutName = textWithLimits(
								this,
								layout.layout_name,
								`第 ${layoutIndex + 1} 个布局名称`,
								i,
								64,
								256,
								false,
							);
							if (layoutName) normalized.layout_name = layoutName;
						}
						return normalized;
					});
					if (!advanced) {
						body.default_layout_order = integer(
							this,
							body.default_layout_order ?? this.getNodeParameter('default_layout_order', i, 1),
							'默认布局序号',
							i,
							1,
							rawLayouts.length,
						);
					} else delete body.default_layout_order;
				} else if (operation === 'advLayoutUpdate' || operation === 'basicLayoutUpdate') {
					const advanced = operation === 'advLayoutUpdate';
					body.layout_id = text(
						this,
						this.getNodeParameter('layout_id', i, body.layout_id ?? ''),
						'布局 ID',
						i,
						128,
					);
					body.page_list = normalizeLayoutPages(
						this,
						Array.isArray(body.page_list) ? body.page_list : formPages,
						i,
						advanced,
						false,
						false,
					);
					delete body.layout_list;
					if (advanced) {
						const layoutName = textWithLimits(
							this,
							body.layout_name ?? this.getNodeParameter('layout_name', i, ''),
							'布局名称',
							i,
							64,
							256,
							false,
						);
						if (layoutName) body.layout_name = layoutName;
						else delete body.layout_name;
						delete body.enable_set_default;
					} else {
						body.enable_set_default = this.getNodeParameter(
							'enable_set_default',
							i,
							body.enable_set_default ?? false,
						) as boolean;
						delete body.layout_name;
					}
				} else if (operation === 'advLayoutApply') {
					body.layout_id = text(
						this,
						this.getNodeParameter('layout_id', i, body.layout_id ?? ''),
						'布局 ID',
						i,
						128,
						false,
					);
					const formTmpOpenids = stringList(
						this,
						this.getNodeParameter('layout_apply_tmp_openids', i, ''),
						'用户临时 OpenID',
						i,
						0,
						20,
					).map((tmp_openid) => ({ tmp_openid }));
					const rawUsers = Array.isArray(body.user_list) ? body.user_list : formTmpOpenids;
					if (rawUsers.length > 20) fail(this, '个性布局用户最多支持 20 个', i);
					if (rawUsers.length) {
						body.user_list = rawUsers.map((rawUser, userIndex) => {
							if (!rawUser || typeof rawUser !== 'object' || Array.isArray(rawUser)) {
								fail(this, `第 ${userIndex + 1} 个个性布局用户必须是对象`, i);
							}
							return {
								tmp_openid: text(
									this,
									(rawUser as IDataObject).tmp_openid,
									`第 ${userIndex + 1} 个用户临时 OpenID`,
									i,
									128,
								),
							};
						});
					} else delete body.user_list;
				} else if (operation === 'advLayoutGetUserLayout') {
					body.tmp_openid = text(
						this,
						this.getNodeParameter('layout_tmp_openid', i, body.tmp_openid ?? ''),
						'用户临时 OpenID',
						i,
						128,
					);
					body.instance_id = integer(
						this,
						this.getNodeParameter('layout_instance_id', i, body.instance_id ?? 1),
						'设备实例 ID',
						i,
						0,
						MAX_UINT32,
					);
					delete body.userid;
				} else if (operation === 'advLayoutBatchDelete') {
					body.layout_id_list = stringList(
						this,
						this.getNodeParameter('layout_id_list', i, body.layout_id_list ?? ''),
						'布局 ID',
						i,
						1,
						20,
					);
				} else if (operation === 'layoutAddBackground') {
					const collection = this.getNodeParameter('layoutBackgroundImages', i, {}) as IDataObject;
					const rawImages = Array.isArray(body.image_list)
						? body.image_list
						: ((collection.images as unknown[]) ?? []);
					if (rawImages.length < 1 || rawImages.length > 1000) {
						fail(this, '背景图片数量必须为 1–1000 张', i);
					}
					body.image_list = rawImages.map((rawImage, imageIndex) => {
						if (!rawImage || typeof rawImage !== 'object' || Array.isArray(rawImage)) {
							fail(this, `第 ${imageIndex + 1} 张背景图片必须是对象`, i);
						}
						const image = rawImage as IDataObject;
						return {
							image_md5: text(this, image.image_md5, `第 ${imageIndex + 1} 张图片 MD5`, i, 128),
							image_url: httpUrl(this, image.image_url, `第 ${imageIndex + 1} 张图片 URL`, i, true),
						};
					});
					body.default_image_order = integer(
						this,
						body.default_image_order ?? this.getNodeParameter('default_image_order', i, 1),
						'默认图片序号',
						i,
						1,
						rawImages.length,
					);
				} else if (operation === 'layoutSetDefaultBackground') {
					body.selected_background_id = text(
						this,
						this.getNodeParameter('background_id', i, body.selected_background_id ?? ''),
						'背景 ID',
						i,
						128,
						false,
					);
				} else if (operation === 'layoutDeleteBackground') {
					body.background_id = text(
						this,
						this.getNodeParameter('background_id', i, body.background_id ?? ''),
						'背景 ID',
						i,
						128,
					);
				} else if (operation === 'layoutBatchDeleteBackground') {
					body.background_id_list = stringList(
						this,
						this.getNodeParameter('background_id_list', i, body.background_id_list ?? ''),
						'背景 ID',
						i,
						1,
						1000,
					);
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
				fail(this, `不支持的会议操作：${operation}`, i);
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: message,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			if (error instanceof NodeOperationError) throw error;
			throw new NodeOperationError(this.getNode(), message, { itemIndex: i });
		}
	}

	return returnData;
}
