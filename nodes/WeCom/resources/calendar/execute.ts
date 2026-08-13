import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const LIST_SEPARATOR = /[,，|\n\r]+/;
const MAX_UINT32 = 4294967295;
const REPEAT_TYPES = new Set([0, 1, 2, 5, 7]);
const REMIND_BEFORE = new Set([0, 300, 900, 3600, 86400]);
const REMIND_DIFFS = new Set([0, -300, -900, -3600, -86400, 32400, -172800, -604800]);

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

function unixTimestamp(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	required = true,
): number {
	if (value === undefined || value === null || String(value).trim() === '') {
		if (required) fail(context, `${label}不能为空`, itemIndex);
		return 0;
	}
	const raw = String(value).trim();
	const timestamp = /^\d+$/.test(raw) ? Number(raw) : Math.floor(Date.parse(raw) / 1000);
	if (!Number.isSafeInteger(timestamp) || timestamp < 1 || timestamp > MAX_UINT32) {
		fail(context, `${label}不是有效的日期时间`, itemIndex);
	}
	return timestamp;
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
	min: number,
	max: number,
): string[] {
	const unique = [...new Set(listValues(value))];
	if (unique.length < min || unique.length > max) {
		fail(context, `${label}数量必须为 ${min}–${max} 个`, itemIndex);
	}
	return unique;
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

/** 解析用户 ID 列表 JSON：支持 ["u1"] / [{"userid":"u1"}]；空数组表示未使用 */
function normalizeUserIdSources(
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
			fail(context, `${label}不是有效的 JSON`, itemIndex);
		}
	}
	if (!Array.isArray(parsed)) fail(context, `${label}必须是 JSON 数组`, itemIndex);
	if (parsed.length === 0) return [];
	return parsed.map((entry, index) => {
		if (typeof entry === 'string' || typeof entry === 'number') {
			return text(context, entry, `${label}第 ${index + 1} 项`, itemIndex, 64);
		}
		if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
			const row = entry as IDataObject;
			return text(
				context,
				row.userid || row.userid_selected || row.user_id,
				`${label}第 ${index + 1} 项 UserID`,
				itemIndex,
				64,
			);
		}
		fail(context, `${label}第 ${index + 1} 项必须是字符串或含 userid 的对象`, itemIndex);
	});
}

function parseSharesJson(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject[] {
	if (value === undefined || value === null || String(value).trim() === '') return [];
	let parsed: unknown = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch {
			fail(context, `${label}不是有效的 JSON`, itemIndex);
		}
	}
	if (!Array.isArray(parsed)) fail(context, `${label}必须是 JSON 数组`, itemIndex);
	const rows: IDataObject[] = [];
	for (const [index, entry] of parsed.entries()) {
		if (typeof entry === 'string' || typeof entry === 'number') {
			const userid = text(context, entry, `${label}第 ${index + 1} 项`, itemIndex, 64);
			rows.push({ userid, permission: 1 });
			continue;
		}
		if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
			const row = entry as IDataObject;
			const userid = text(
				context,
				row.userid || row.userid_selected || row.user_id,
				`${label}第 ${index + 1} 项 UserID`,
				itemIndex,
				64,
			);
			const permission = integer(
				context,
				row.permission ?? 1,
				`${label}第 ${index + 1} 项权限`,
				itemIndex,
				1,
				3,
			);
			if (permission !== 1 && permission !== 3) fail(context, '通知成员权限只能是 1 或 3', itemIndex);
			rows.push({ userid, permission });
			continue;
		}
		fail(context, `${label}第 ${index + 1} 项必须是字符串或含 userid 的对象`, itemIndex);
	}
	return rows;
}

function calendarShares(
	context: IExecuteFunctions,
	collection: IDataObject,
	itemIndex: number,
	extraUserids: unknown = '',
	sharesJson: unknown = '[]',
): IDataObject[] {
	const shares = new Map<string, IDataObject>();
	for (const userid of stringList(context, extraUserids, '通知成员', itemIndex, 0, 2000)) {
		const id = text(context, userid, '通知成员 UserID', itemIndex, 64);
		shares.set(id, { userid: id, permission: 1 });
	}
	for (const share of parseSharesJson(context, sharesJson, '通知范围 JSON', itemIndex)) {
		shares.set(String(share.userid), share);
	}
	const rawShares = (collection.shares as IDataObject[]) || [];
	for (const [index, rawShare] of rawShares.entries()) {
		const userid = text(
			context,
			rawShare.userid || rawShare.userid_selected,
			`第 ${index + 1} 个通知成员 UserID`,
			itemIndex,
			64,
		);
		const permission = integer(context, rawShare.permission ?? 1, '通知成员权限', itemIndex, 1, 3);
		if (permission !== 1 && permission !== 3) fail(context, '通知成员权限只能是 1 或 3', itemIndex);
		shares.set(userid, { userid, permission });
	}
	if (shares.size > 2000) fail(context, '日历通知范围最多支持 2000 人', itemIndex);
	return [...shares.values()];
}

function publicRange(
	context: IExecuteFunctions,
	value: IDataObject,
	itemIndex: number,
	extraUserids: unknown = '',
	extraPartyids: unknown = '',
): IDataObject | undefined {
	const userSources: unknown[] = [extraUserids];
	if (Array.isArray(value.userids)) userSources.push(...value.userids);
	else if (value.userids !== undefined && value.userids !== null) userSources.push(value.userids);
	const partySources: unknown[] = [extraPartyids];
	if (Array.isArray(value.partyids)) partySources.push(...value.partyids);
	else if (value.partyids !== undefined && value.partyids !== null) partySources.push(value.partyids);
	const userids = stringList(context, userSources, '公开成员', itemIndex, 0, 1000).map((userid) =>
		text(context, userid, '公开成员 UserID', itemIndex, 64),
	);
	const partyids = stringList(context, partySources, '公开部门', itemIndex, 0, 100).map((partyId) =>
		integer(context, partyId, '公开部门 ID', itemIndex, 1, MAX_UINT32),
	);
	if (!userids.length && !partyids.length) return undefined;
	const range: IDataObject = {};
	if (userids.length) range.userids = userids;
	if (partyids.length) range.partyids = partyids;
	return range;
}

function scheduleReminders(
	context: IExecuteFunctions,
	collection: IDataObject,
	wholeDay: boolean,
	itemIndex: number,
): IDataObject | undefined {
	const raw = collection.reminders;
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;
	const data = raw as IDataObject;
	const isRemind = Boolean(data.is_remind);
	const isRepeat = Boolean(data.is_repeat);
	const reminders: IDataObject = {
		is_remind: isRemind ? 1 : 0,
		is_repeat: isRepeat ? 1 : 0,
	};
	if (isRemind) {
		const rawDiffs = Array.isArray(data.remind_time_diffs) ? data.remind_time_diffs : [];
		if (rawDiffs.length) {
			const diffs = [...new Set(rawDiffs.map(Number))];
			for (const diff of diffs) {
				if (!REMIND_DIFFS.has(diff) || (!wholeDay && [32400, -172800, -604800].includes(diff))) {
					fail(context, '提醒时间差包含不支持的值', itemIndex);
				}
			}
			reminders.remind_time_diffs = diffs;
		} else {
			const remindBefore = integer(
				context,
				data.remind_before_event_secs ?? 3600,
				'提前提醒时间',
				itemIndex,
				0,
				86400,
			);
			if (!REMIND_BEFORE.has(remindBefore)) fail(context, '提前提醒时间不受支持', itemIndex);
			reminders.remind_before_event_secs = remindBefore;
		}
	}
	if (isRepeat) {
		const repeatType = integer(context, data.repeat_type ?? 0, '重复类型', itemIndex, 0, 7);
		if (!REPEAT_TYPES.has(repeatType)) fail(context, '重复类型不受支持', itemIndex);
		reminders.repeat_type = repeatType;
		const repeatUntil = unixTimestamp(context, data.repeat_until, '重复结束时间', itemIndex, false);
		if (repeatUntil) reminders.repeat_until = repeatUntil;
		const custom = Boolean(data.is_custom_repeat);
		reminders.is_custom_repeat = custom ? 1 : 0;
		reminders.timezone = integer(context, data.timezone ?? 8, '时区', itemIndex, -12, 12);
		if (custom) {
			reminders.repeat_interval = integer(
				context,
				data.repeat_interval ?? 1,
				'重复间隔',
				itemIndex,
				1,
				MAX_UINT32,
			);
			if (repeatType === 1) {
				const days = stringList(
					context,
					data.repeat_day_of_week,
					'每周重复日期',
					itemIndex,
					1,
					7,
				).map((day) => integer(context, day, '每周重复日期', itemIndex, 1, 7));
				reminders.repeat_day_of_week = [...new Set(days)];
			} else if (repeatType === 2) {
				const days = stringList(
					context,
					data.repeat_day_of_month,
					'每月重复日期',
					itemIndex,
					1,
					31,
				).map((day) => integer(context, day, '每月重复日期', itemIndex, 1, 31));
				reminders.repeat_day_of_month = [...new Set(days)];
			}
		}
	}
	return reminders;
}

function timeWindow(
	context: IExecuteFunctions,
	startValue: unknown,
	endValue: unknown,
	itemIndex: number,
): { start: number; end: number } {
	const start = unixTimestamp(context, startValue, '日程开始时间', itemIndex);
	const end = unixTimestamp(context, endValue, '日程结束时间', itemIndex);
	if (end <= start) fail(context, '日程结束时间必须晚于开始时间', itemIndex);
	return { start, end };
}

function operationScope(
	context: IExecuteFunctions,
	opModeValue: unknown,
	opStartValue: unknown,
	itemIndex: number,
): { opMode: number; opStart: number } {
	const opMode = integer(context, opModeValue ?? 0, '操作模式', itemIndex, 0, 2);
	const opStart = unixTimestamp(context, opStartValue, '操作起始时间', itemIndex, opMode !== 0);
	return { opMode, opStart };
}

export async function executeCalendar(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			if (operation === 'createCalendar') {
				const admins = stringList(
					this,
					[
						this.getNodeParameter('admin_userids', i, ''),
						...(this.getNodeParameter('admins', i, []) as string[]),
						...normalizeUserIdSources(
							this,
							this.getNodeParameter('adminsJson', i, '[]'),
							'管理员列表 JSON',
							i,
						),
					],
					'日历管理员',
					i,
					0,
					3,
				);
				const isCorpCalendar = this.getNodeParameter('isCorpCalendar', i, false) as boolean;
				const isPublicCalendar = this.getNodeParameter('isPublicCalendar', i, false) as boolean;
				const advanced = this.getNodeParameter('advancedSettings', i, {}) as IDataObject;
				const range = publicRange(
					this,
					(advanced.publicRange as IDataObject) || {},
					i,
					[
						this.getNodeParameter('public_userids', i, ''),
						this.getNodeParameter('public_userids_selected', i, []),
						...normalizeUserIdSources(
							this,
							this.getNodeParameter('publicUseridsJson', i, '[]'),
							'公开成员 JSON',
							i,
						),
					],
					[
						this.getNodeParameter('public_partyids', i, ''),
						this.getNodeParameter('public_partyids_selected', i, []),
					],
				);
				if (isCorpCalendar && !range) fail(this, '创建全员日历时必须指定公开范围', i);
				const shares = calendarShares(
					this,
					this.getNodeParameter('sharesCollection', i, {}) as IDataObject,
					i,
					[
						this.getNodeParameter('share_userids', i, ''),
						this.getNodeParameter('share_userids_selected', i, []),
					],
					this.getNodeParameter('sharesJson', i, '[]'),
				);
				if (admins.length) {
					const shareUserids = new Set(shares.map((share) => String(share.userid)));
					const missing = admins.filter((admin) => !shareUserids.has(admin));
					if (missing.length) fail(this, `管理员必须在通知范围中：${missing.join(', ')}`, i);
				}
				const calendar: IDataObject = {
					summary: textWithLimits(
						this,
						this.getNodeParameter('summary', i),
						'日历标题',
						i,
						128,
						512,
					),
				};
				if (admins.length) calendar.admins = admins;
				if (shares.length) calendar.shares = shares;
				const description = textWithLimits(
					this,
					this.getNodeParameter('description', i, ''),
					'日历描述',
					i,
					512,
					2048,
					false,
				);
				if (description) calendar.description = description;
				if (isCorpCalendar) {
					calendar.is_corp_calendar = 1;
					calendar.public_range = range;
				} else {
					const color = text(this, this.getNodeParameter('color', i), '日历颜色', i, 7);
					if (!/^#[0-9A-Fa-f]{6}$/.test(color)) fail(this, '日历颜色必须是 #RRGGBB 格式', i);
					calendar.color = color.toUpperCase();
					if (isPublicCalendar) calendar.is_public = 1;
					if (range) calendar.public_range = range;
				}
				const body: IDataObject = { calendar };
				if (!isCorpCalendar) {
					body.set_as_default = this.getNodeParameter('set_as_default', i, false) ? 1 : 0;
				}
				const agentId = integer(
					this,
					advanced.agentid || advanced.agentid_selected || 0,
					'应用 AgentID',
					i,
					0,
					MAX_UINT32,
				);
				if (agentId) body.agentid = agentId;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/add', body);
			} else if (operation === 'updateCalendar') {
				const calendar: IDataObject = {
					cal_id: text(this, this.getNodeParameter('cal_id', i), '日历 ID', i, 64),
					summary: textWithLimits(
						this,
						this.getNodeParameter('summary', i),
						'日历标题',
						i,
						128,
						512,
					),
					description: textWithLimits(
						this,
						this.getNodeParameter('description', i, ''),
						'日历描述',
						i,
						512,
						2048,
						false,
					),
				};
				const color = text(this, this.getNodeParameter('color', i), '日历颜色', i, 7);
				if (!/^#[0-9A-Fa-f]{6}$/.test(color)) fail(this, '日历颜色必须是 #RRGGBB 格式', i);
				calendar.color = color.toUpperCase();
				const admins = stringList(
					this,
					[
						this.getNodeParameter('admin_userids', i, ''),
						...(this.getNodeParameter('admins', i, []) as string[]),
						...normalizeUserIdSources(
							this,
							this.getNodeParameter('adminsJson', i, '[]'),
							'管理员列表 JSON',
							i,
						),
					],
					'日历管理员',
					i,
					0,
					3,
				);
				if (admins.length) calendar.admins = admins;
				const shares = calendarShares(
					this,
					this.getNodeParameter('sharesCollection', i, {}) as IDataObject,
					i,
					[
						this.getNodeParameter('share_userids', i, ''),
						this.getNodeParameter('share_userids_selected', i, []),
					],
					this.getNodeParameter('sharesJson', i, '[]'),
				);
				if (shares.length) calendar.shares = shares;
				const skipRange = this.getNodeParameter('skip_public_range', i, false) as boolean;
				if (!skipRange) {
					const range = publicRange(
						this,
						this.getNodeParameter('publicRange', i, {}) as IDataObject,
						i,
						[
							this.getNodeParameter('public_userids', i, ''),
							this.getNodeParameter('public_userids_selected', i, []),
							...normalizeUserIdSources(
								this,
								this.getNodeParameter('publicUseridsJson', i, '[]'),
								'公开成员 JSON',
								i,
							),
						],
						[
							this.getNodeParameter('public_partyids', i, ''),
							this.getNodeParameter('public_partyids_selected', i, []),
						],
					);
					if (range) calendar.public_range = range;
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/update', {
					calendar,
					skip_public_range: skipRange ? 1 : 0,
				});
			} else if (operation === 'getCalendar') {
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/get', {
					cal_id_list: stringList(
						this,
						this.getNodeParameter('cal_id_list', i),
						'日历 ID',
						i,
						1,
						1000,
					).map((id) => text(this, id, '日历 ID', i, 64)),
				});
			} else if (operation === 'deleteCalendar') {
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/del', {
					cal_id: text(this, this.getNodeParameter('cal_id', i), '日历 ID', i, 64),
				});
			} else if (operation === 'createSchedule') {
				const { start, end } = timeWindow(
					this,
					this.getNodeParameter('start_time', i),
					this.getNodeParameter('end_time', i),
					i,
				);
				const wholeDay = this.getNodeParameter('is_whole_day', i, false) as boolean;
				const admins = stringList(
					this,
					[
						this.getNodeParameter('admin_userids', i, ''),
						...(this.getNodeParameter('admins', i, []) as string[]),
						...normalizeUserIdSources(
							this,
							this.getNodeParameter('adminsJson', i, '[]'),
							'管理员列表 JSON',
							i,
						),
					],
					'日程管理员',
					i,
					0,
					3,
				);
				const attendees = stringList(
					this,
					[
						this.getNodeParameter('attendee_userids', i, ''),
						...(this.getNodeParameter('attendees', i, []) as string[]),
						...normalizeUserIdSources(
							this,
							this.getNodeParameter('attendeesJson', i, '[]'),
							'参与者列表 JSON',
							i,
						),
						...admins,
					],
					'日程参与者',
					i,
					0,
					1000,
				);
				const schedule: IDataObject = {
					start_time: start,
					end_time: end,
					is_whole_day: wholeDay ? 1 : 0,
				};
				if (admins.length) schedule.admins = admins;
				if (attendees.length)
					schedule.attendees = attendees.map((userid) => ({
						userid: text(this, userid, '参与者 UserID', i, 64),
					}));
				const summary = textWithLimits(
					this,
					this.getNodeParameter('summary', i, ''),
					'日程标题',
					i,
					128,
					512,
					false,
				);
				const description = textWithLimits(
					this,
					this.getNodeParameter('description', i, ''),
					'日程描述',
					i,
					1000,
					4000,
					false,
				);
				const location = textWithLimits(
					this,
					this.getNodeParameter('location', i, ''),
					'日程地点',
					i,
					128,
					512,
					false,
				);
				if (summary) schedule.summary = summary;
				if (description) schedule.description = description;
				if (location) schedule.location = location;
				const advanced = this.getNodeParameter('advancedSettings', i, {}) as IDataObject;
				const calendarId = text(this, advanced.cal_id, '所属日历 ID', i, 64, false);
				if (calendarId) schedule.cal_id = calendarId;
				const reminders = scheduleReminders(
					this,
					this.getNodeParameter('remindersCollection', i, {}) as IDataObject,
					wholeDay,
					i,
				);
				if (reminders) schedule.reminders = reminders;
				const body: IDataObject = { schedule };
				const agentId = integer(
					this,
					advanced.agentid || advanced.agentid_selected || 0,
					'应用 AgentID',
					i,
					0,
					MAX_UINT32,
				);
				if (agentId) body.agentid = agentId;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/add', body);
			} else if (operation === 'updateSchedule') {
				const { start, end } = timeWindow(
					this,
					this.getNodeParameter('start_time', i),
					this.getNodeParameter('end_time', i),
					i,
				);
				const wholeDay = this.getNodeParameter('is_whole_day', i, false) as boolean;
				const skipAttendees = this.getNodeParameter('skip_attendees', i, false) as boolean;
				const admins = stringList(
					this,
					[
						this.getNodeParameter('admin_userids', i, ''),
						...(this.getNodeParameter('admins', i, []) as string[]),
						...normalizeUserIdSources(
							this,
							this.getNodeParameter('adminsJson', i, '[]'),
							'管理员列表 JSON',
							i,
						),
					],
					'日程管理员',
					i,
					0,
					3,
				);
				const attendees = stringList(
					this,
					[
						this.getNodeParameter('attendee_userids', i, ''),
						...(this.getNodeParameter('attendees', i, []) as string[]),
						...normalizeUserIdSources(
							this,
							this.getNodeParameter('attendeesJson', i, '[]'),
							'参与者列表 JSON',
							i,
						),
					],
					'日程参与者',
					i,
					0,
					1000,
				);
				const schedule: IDataObject = {
					schedule_id: text(this, this.getNodeParameter('schedule_id', i), '日程 ID', i, 128),
					start_time: start,
					end_time: end,
					is_whole_day: wholeDay ? 1 : 0,
					summary: textWithLimits(
						this,
						this.getNodeParameter('summary', i, ''),
						'日程标题',
						i,
						128,
						512,
						false,
					),
					description: textWithLimits(
						this,
						this.getNodeParameter('description', i, ''),
						'日程描述',
						i,
						1000,
						4000,
						false,
					),
					location: textWithLimits(
						this,
						this.getNodeParameter('location', i, ''),
						'日程地点',
						i,
						128,
						512,
						false,
					),
				};
				if (admins.length) schedule.admins = admins;
				if (!skipAttendees) {
					const merged = stringList(this, [...attendees, ...admins], '日程参与者', i, 0, 1000);
					schedule.attendees = merged.map((userid) => ({
						userid: text(this, userid, '参与者 UserID', i, 64),
					}));
				}
				const reminders = scheduleReminders(
					this,
					this.getNodeParameter('remindersCollection', i, {}) as IDataObject,
					wholeDay,
					i,
				);
				if (reminders) schedule.reminders = reminders;
				const { opMode, opStart } = operationScope(
					this,
					this.getNodeParameter('op_mode', i, 0),
					this.getNodeParameter('op_start_time', i, ''),
					i,
				);
				const body: IDataObject = {
					schedule,
					skip_attendees: skipAttendees ? 1 : 0,
					op_mode: opMode,
				};
				if (opStart) body.op_start_time = opStart;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/update', body);
			} else if (operation === 'updateRecurringSchedule') {
				const scheduleBody: IDataObject = {
					...jsonObject(this, this.getNodeParameter('schedule', i, '{}'), '日程扩展 JSON', i),
				};
				const summary = textWithLimits(
					this,
					this.getNodeParameter('schedule_summary', i, ''),
					'日程标题',
					i,
					128,
					512,
					false,
				);
				const description = textWithLimits(
					this,
					this.getNodeParameter('schedule_description', i, ''),
					'日程描述',
					i,
					1000,
					4000,
					false,
				);
				const location = textWithLimits(
					this,
					this.getNodeParameter('schedule_location', i, ''),
					'日程地点',
					i,
					128,
					512,
					false,
				);
				if (summary && scheduleBody.summary === undefined) scheduleBody.summary = summary;
				if (description && scheduleBody.description === undefined)
					scheduleBody.description = description;
				if (location && scheduleBody.location === undefined) scheduleBody.location = location;
				if (scheduleBody.is_whole_day === undefined) {
					scheduleBody.is_whole_day = this.getNodeParameter('schedule_is_whole_day', i, false)
						? 1
						: 0;
				}
				const formStart = unixTimestamp(
					this,
					this.getNodeParameter('schedule_start_time', i, ''),
					'日程开始时间',
					i,
					false,
				);
				const formEnd = unixTimestamp(
					this,
					this.getNodeParameter('schedule_end_time', i, ''),
					'日程结束时间',
					i,
					false,
				);
				if (formStart && scheduleBody.start_time === undefined) scheduleBody.start_time = formStart;
				if (formEnd && scheduleBody.end_time === undefined) scheduleBody.end_time = formEnd;
				const start = unixTimestamp(this, scheduleBody.start_time, '日程开始时间', i);
				const end = unixTimestamp(this, scheduleBody.end_time, '日程结束时间', i);
				if (end <= start) fail(this, '日程结束时间必须晚于开始时间', i);
				scheduleBody.start_time = start;
				scheduleBody.end_time = end;
				scheduleBody.schedule_id = text(
					this,
					this.getNodeParameter('schedule_id', i),
					'日程 ID',
					i,
					128,
				);
				const skipAttendees = this.getNodeParameter('skip_attendees', i, false) as boolean;
				const admins = stringList(
					this,
					[
						this.getNodeParameter('admin_userids', i, ''),
						...(this.getNodeParameter('admins', i, []) as string[]),
						...normalizeUserIdSources(
							this,
							this.getNodeParameter('adminsJson', i, '[]'),
							'管理员列表 JSON',
							i,
						),
					],
					'日程管理员',
					i,
					0,
					3,
				);
				if (admins.length && scheduleBody.admins === undefined) scheduleBody.admins = admins;
				if (!skipAttendees && scheduleBody.attendees === undefined) {
					const attendees = stringList(
						this,
						[
							this.getNodeParameter('attendee_userids', i, ''),
							...(this.getNodeParameter('attendees', i, []) as string[]),
							...normalizeUserIdSources(
								this,
								this.getNodeParameter('attendeesJson', i, '[]'),
								'参与者列表 JSON',
								i,
							),
							...admins,
						],
						'日程参与者',
						i,
						0,
						1000,
					);
					if (attendees.length) {
						scheduleBody.attendees = attendees.map((userid) => ({
							userid: text(this, userid, '参与者 UserID', i, 64),
						}));
					}
				}
				const { opMode, opStart } = operationScope(
					this,
					this.getNodeParameter('op_mode', i, 1),
					this.getNodeParameter('op_start_time', i, ''),
					i,
				);
				const body: IDataObject = {
					schedule: scheduleBody,
					skip_attendees: this.getNodeParameter('skip_attendees', i, false) ? 1 : 0,
					op_mode: opMode,
				};
				if (opStart) body.op_start_time = opStart;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/update', body);
			} else if (operation === 'addScheduleAttendees' || operation === 'deleteScheduleAttendees') {
				const collection = this.getNodeParameter('attendeesCollection', i, {}) as IDataObject;
				const rawAttendees = (collection.attendees as IDataObject[]) || [];
				const fromJson = normalizeUserIdSources(
					this,
					this.getNodeParameter('attendeesJson', i, '[]'),
					'参与者列表 JSON',
					i,
				);
				const attendeeIds = stringList(
					this,
					[
						this.getNodeParameter('attendee_userids', i, ''),
						this.getNodeParameter('attendee_userids_selected', i, []),
						...rawAttendees.map((attendee) => attendee.userid || attendee.userid_selected),
						...fromJson,
					],
					'日程参与者',
					i,
					1,
					1000,
				);
				response = await weComApiRequest.call(
					this,
					'POST',
					operation === 'addScheduleAttendees'
						? '/cgi-bin/oa/schedule/add_attendees'
						: '/cgi-bin/oa/schedule/del_attendees',
					{
						schedule_id: text(this, this.getNodeParameter('schedule_id', i), '日程 ID', i, 128),
						attendees: attendeeIds.map((userid) => ({
							userid: text(this, userid, '参与者 UserID', i, 64),
						})),
					},
				);
			} else if (operation === 'listCalendarSchedules') {
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/schedule/get_by_calendar',
					{
						cal_id: text(this, this.getNodeParameter('cal_id', i), '日历 ID', i, 64),
						offset: integer(
							this,
							this.getNodeParameter('offset', i, 0),
							'偏移量',
							i,
							0,
							MAX_UINT32,
						),
						limit: integer(this, this.getNodeParameter('limit', i, 500), '限制数量', i, 1, 1000),
					},
				);
			} else if (operation === 'getSchedule') {
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/get', {
					schedule_id_list: stringList(
						this,
						this.getNodeParameter('schedule_id_list', i),
						'日程 ID',
						i,
						1,
						1000,
					).map((id) => text(this, id, '日程 ID', i, 128)),
				});
			} else if (operation === 'cancelSchedule') {
				const { opMode, opStart } = operationScope(
					this,
					this.getNodeParameter('op_mode', i, 0),
					this.getNodeParameter('op_start_time', i, ''),
					i,
				);
				const body: IDataObject = {
					schedule_id: text(this, this.getNodeParameter('schedule_id', i), '日程 ID', i, 128),
					op_mode: opMode,
				};
				if (opStart) body.op_start_time = opStart;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/del', body);
			} else {
				fail(this, `不支持的日历操作：${operation}`, i);
			}

			returnData.push({ json: response, pairedItem: { item: i } });
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			if (this.continueOnFail()) {
				returnData.push({ json: { error: message }, pairedItem: { item: i } });
				continue;
			}
			if (error instanceof NodeOperationError) throw error;
			throw new NodeOperationError(this.getNode(), message, { itemIndex: i });
		}
	}

	return returnData;
}
