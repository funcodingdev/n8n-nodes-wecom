import type { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const MAIL_OPERATIONS = new Set([
	'sendMail', 'sendScheduleMail', 'sendMeetingMail', 'getMailList', 'getMailContent',
	'updateAppMailbox', 'getAppMailbox', 'createMailGroup', 'updateMailGroup',
	'deleteMailGroup', 'getMailGroup', 'searchMailGroup', 'createPublicMailbox',
	'updatePublicMailbox', 'deletePublicMailbox', 'getPublicMailbox', 'searchPublicMailbox',
	'getClientPasswordList', 'deleteClientPassword', 'allocateMailAdvancedAccount',
	'deallocateMailAdvancedAccount', 'getMailAdvancedAccountList', 'toggleMailboxStatus',
	'getUserMailAttribute', 'updateUserMailAttribute', 'getMailUnreadCount',
]);

const LIST_SEPARATOR = /[,，|\n\r]+/;
const MAX_UINT32 = 4294967295;
const MAX_MAIL_BYTES = 50 * 1024 * 1024;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function hasOwn(value: object, key: PropertyKey): boolean {
	return Object.prototype.hasOwnProperty.call(value, key);
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

function contentText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string {
	const normalized = String(value ?? '');
	if (!normalized.trim()) fail(context, `${label}不能为空`, itemIndex);
	if (Buffer.byteLength(normalized, 'utf8') > MAX_MAIL_BYTES) {
		fail(context, `${label}不能超过 50MiB`, itemIndex);
	}
	return normalized;
}

function weightedLength(value: string): number {
	return [...value].reduce((length, character) => length + (character.charCodeAt(0) > 127 ? 2 : 1), 0);
}

function publicMailboxName(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): string {
	const normalized = text(context, value, '公共邮箱名称', itemIndex, 192);
	if (weightedLength(normalized) > 64) {
		fail(context, '公共邮箱名称换算长度不能超过 64（英文计 1，汉字计 2）', itemIndex);
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
			fail(context, `${label}不是有效的 JSON`, itemIndex);
		}
	}
	if (!Array.isArray(parsed)) fail(context, `${label}必须是 JSON 数组`, itemIndex);
	if (parsed.length === 0) return [];
	return listValues(
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
			fail(context, `${label}不是有效的 JSON`, itemIndex);
		}
	}
	if (!Array.isArray(parsed)) fail(context, `${label}必须是 JSON 数组`, itemIndex);
	if (parsed.length === 0) return [];
	return listValues(
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

function numberList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	minCount = 0,
	maxCount = 1000,
	minValue = 1,
	maxValue = MAX_UINT32,
): number[] {
	const raw = stringList(context, value, label, itemIndex, minCount, maxCount);
	const values = raw.map((entry) => integer(context, entry, label, itemIndex, minValue, maxValue));
	const unique = [...new Set(values)];
	if (unique.length < minCount || unique.length > maxCount) {
		fail(context, `${label}数量必须为 ${minCount}–${maxCount} 个`, itemIndex);
	}
	return unique;
}

function emailAddress(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string {
	const normalized = text(context, value, label, itemIndex, 320).toLowerCase();
	if (!EMAIL_PATTERN.test(normalized)) fail(context, `${label}必须是有效的邮箱地址`, itemIndex);
	return normalized;
}

function emailList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min = 0,
	max = 1000,
): string[] {
	const values = stringList(context, value, label, itemIndex, min, max)
		.map((entry) => emailAddress(context, entry, label, itemIndex));
	return [...new Set(values)];
}

function unixTime(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	if (typeof value === 'number' || /^\d+$/.test(String(value ?? '').trim())) {
		return integer(context, value, label, itemIndex, 1, MAX_UINT32);
	}
	const raw = text(context, value, label, itemIndex);
	const milliseconds = Date.parse(raw);
	if (!Number.isFinite(milliseconds)) fail(context, `${label}不是有效的日期时间`, itemIndex);
	return integer(context, Math.floor(milliseconds / 1000), label, itemIndex, 1, MAX_UINT32);
}

function base64(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): { encoded: string; bytes: number } {
	const raw = text(context, value, label, itemIndex, 75_000_000);
	if (raw.startsWith('data:')) fail(context, `${label}只接受纯 Base64，不能包含 data URL 前缀`, itemIndex);
	const normalized = raw.replace(/\s+/g, '');
	if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized) || normalized.length % 4 === 1) {
		fail(context, `${label}不是有效的 Base64`, itemIndex);
	}
	const buffer = Buffer.from(normalized, 'base64');
	if (!buffer.length || buffer.toString('base64').replace(/=+$/, '') !== normalized.replace(/=+$/, '')) {
		fail(context, `${label}不是有效的 Base64`, itemIndex);
	}
	return { encoded: buffer.toString('base64'), bytes: buffer.length };
}

function collectionEmails(
	context: IExecuteFunctions,
	collection: IDataObject,
	label: string,
	itemIndex: number,
): string[] {
	const recipients = Array.isArray(collection.recipients)
		? (collection.recipients as IDataObject[])
		: [];
	return emailList(context, recipients.map((recipient) => recipient.email), label, itemIndex);
}

function recipients(
	context: IExecuteFunctions,
	emailCollection: IDataObject,
	useridsValue: unknown,
	label: string,
	itemIndex: number,
	required: boolean,
): { recipient?: IDataObject; userids: string[] } {
	const emails = collectionEmails(context, emailCollection, `${label}邮箱`, itemIndex);
	const userids = stringList(context, useridsValue, `${label} UserID`, itemIndex);
	if (required && emails.length + userids.length === 0) {
		fail(context, `${label}邮箱和 UserID 至少填写一类`, itemIndex);
	}
	if (!emails.length && !userids.length) return { userids };
	const recipient: IDataObject = {};
	if (emails.length) recipient.emails = emails;
	if (userids.length) recipient.userids = userids;
	return { recipient, userids };
}

function attachments(
	context: IExecuteFunctions,
	collection: IDataObject,
	content: string,
	itemIndex: number,
): IDataObject[] | undefined {
	const raw = Array.isArray(collection.attachments)
		? (collection.attachments as IDataObject[])
		: [];
	if (raw.length > 200) fail(context, '附件数量不能超过 200 个', itemIndex);
	let totalBytes = Buffer.byteLength(content, 'utf8');
	const result = raw.map((attachment, attachmentIndex) => {
		const fileName = text(context, attachment.file_name, `第 ${attachmentIndex + 1} 个附件文件名`, itemIndex, 255);
		const parsed = base64(context, attachment.content, `第 ${attachmentIndex + 1} 个附件内容`, itemIndex);
		totalBytes += parsed.bytes;
		return { file_name: fileName, content: parsed.encoded };
	});
	if (totalBytes > MAX_MAIL_BYTES) fail(context, '附件与正文总大小不能超过 50MiB', itemIndex);
	return result.length ? result : undefined;
}

function composeBody(
	context: IExecuteFunctions,
	itemIndex: number,
	legacyContentName?: string,
): { body: IDataObject; toUserids: string[] } {
	const subject = text(context, context.getNodeParameter('subject', itemIndex), '邮件主题', itemIndex);
	const contentValue = context.getNodeParameter('content', itemIndex, '') as string;
	const legacyContent = legacyContentName
		? (context.getNodeParameter(legacyContentName, itemIndex, '') as string)
		: '';
	const content = contentText(context, contentValue || legacyContent, '邮件正文', itemIndex);
	const contentType = text(context, context.getNodeParameter('contentType', itemIndex, 'html'), '正文格式', itemIndex);
	if (!['html', 'text'].includes(contentType)) fail(context, '正文格式只能是 html 或 text', itemIndex);

	const to = recipients(
		context,
		context.getNodeParameter('toListCollection', itemIndex, {}) as IDataObject,
		[
			context.getNodeParameter('to_userids', itemIndex, ''),
			context.getNodeParameter('to_userids_selected', itemIndex, []),
			...parseUserIdJson(
				context,
				context.getNodeParameter('toUseridsJson', itemIndex, '[]'),
				'收件人 JSON',
				itemIndex,
			),
		],
		'收件人',
		itemIndex,
		true,
	);
	const cc = recipients(
		context,
		context.getNodeParameter('ccListCollection', itemIndex, {}) as IDataObject,
		[
			context.getNodeParameter('cc_userids', itemIndex, ''),
			context.getNodeParameter('cc_userids_selected', itemIndex, []),
			...parseUserIdJson(
				context,
				context.getNodeParameter('ccUseridsJson', itemIndex, '[]'),
				'抄送人 JSON',
				itemIndex,
			),
		],
		'抄送人',
		itemIndex,
		false,
	);
	const bcc = recipients(
		context,
		context.getNodeParameter('bccListCollection', itemIndex, {}) as IDataObject,
		[
			context.getNodeParameter('bcc_userids', itemIndex, ''),
			context.getNodeParameter('bcc_userids_selected', itemIndex, []),
			...parseUserIdJson(
				context,
				context.getNodeParameter('bccUseridsJson', itemIndex, '[]'),
				'密送人 JSON',
				itemIndex,
			),
		],
		'密送人',
		itemIndex,
		false,
	);

	const body: IDataObject = { to: to.recipient!, subject, content, content_type: contentType };
	if (cc.recipient) body.cc = cc.recipient;
	if (bcc.recipient) body.bcc = bcc.recipient;
	const attachmentList = attachments(
		context,
		context.getNodeParameter('attachmentCollection', itemIndex, {}) as IDataObject,
		content,
		itemIndex,
	);
	if (attachmentList) body.attachment_list = attachmentList;
	if (context.getNodeParameter('enable_id_trans', itemIndex, false) as boolean) body.enable_id_trans = 1;
	return { body, toUserids: to.userids };
}

function reminders(
	context: IExecuteFunctions,
	itemIndex: number,
	startTime: number,
): IDataObject | undefined {
	const raw = context.getNodeParameter('reminderSettings', itemIndex, {}) as IDataObject;
	if (!Object.keys(raw).length) return undefined;
	const result: IDataObject = {};
	if (hasOwn(raw, 'is_remind')) result.is_remind = raw.is_remind ? 1 : 0;
	if (hasOwn(raw, 'remind_before_event_mins')) {
		result.remind_before_event_mins = integer(context, raw.remind_before_event_mins, '提醒分钟数', itemIndex, -MAX_UINT32, MAX_UINT32);
	}
	if (hasOwn(raw, 'timezone')) {
		result.timezone = integer(context, raw.timezone, '时区 UTC 偏移', itemIndex, -12, 12);
	}
	const isRepeat = hasOwn(raw, 'is_repeat') ? Boolean(raw.is_repeat) : false;
	if (hasOwn(raw, 'is_repeat')) result.is_repeat = isRepeat ? 1 : 0;
	if (isRepeat) {
		const isCustom = hasOwn(raw, 'is_custom_repeat') ? Boolean(raw.is_custom_repeat) : false;
		if (hasOwn(raw, 'is_custom_repeat')) result.is_custom_repeat = isCustom ? 1 : 0;
		if (hasOwn(raw, 'repeat_type')) {
			const repeatType = integer(context, raw.repeat_type, '重复类型', itemIndex, 0, 5);
			if (![0, 1, 2, 5].includes(repeatType)) fail(context, '重复类型只能是 0、1、2 或 5', itemIndex);
			result.repeat_type = repeatType;
			if (isCustom && repeatType === 1 && hasOwn(raw, 'repeat_day_of_week')) {
				result.repeat_day_of_week = numberList(context, raw.repeat_day_of_week, '每周重复日', itemIndex, 1, 7, 1, 7);
			}
			if (isCustom && [2, 5].includes(repeatType) && hasOwn(raw, 'repeat_day_of_month')) {
				result.repeat_day_of_month = numberList(context, raw.repeat_day_of_month, '每月重复日', itemIndex, 1, 31, 1, 31);
			}
			if (isCustom && repeatType === 5 && hasOwn(raw, 'repeat_month_of_year')) {
				result.repeat_month_of_year = numberList(context, raw.repeat_month_of_year, '每年重复月份', itemIndex, 1, 12, 1, 12);
			}
		}
		if (hasOwn(raw, 'repeat_interval')) {
			result.repeat_interval = integer(context, raw.repeat_interval, '重复间隔', itemIndex, 1, MAX_UINT32);
		}
		if (hasOwn(raw, 'repeat_until') && String(raw.repeat_until ?? '').trim()) {
			const repeatUntil = String(raw.repeat_until).trim() === '0'
				? 0
				: unixTime(context, raw.repeat_until, '重复结束时间', itemIndex);
			if (repeatUntil !== 0 && repeatUntil < startTime) fail(context, '重复结束时间不能早于开始时间', itemIndex);
			result.repeat_until = repeatUntil;
		}
	}
	return Object.keys(result).length ? result : undefined;
}

function schedule(
	context: IExecuteFunctions,
	itemIndex: number,
	prefix: 'cal' | 'meeting',
): { schedule: IDataObject; method: string } {
	const method = text(context, context.getNodeParameter('scheduleMethod', itemIndex, 'request'), '日程方法', itemIndex);
	if (!['request', 'cancel'].includes(method)) fail(context, '日程方法只能是 request 或 cancel', itemIndex);
	const scheduleId = text(context, context.getNodeParameter('scheduleId', itemIndex, ''), '日程 ID', itemIndex, 4096, false);
	if (method === 'cancel') {
		if (!scheduleId) fail(context, '取消日程或会议时必须填写日程 ID', itemIndex);
		return { schedule: { method, schedule_id: scheduleId }, method };
	}
	const startTime = unixTime(context, context.getNodeParameter(`${prefix}StartTime`, itemIndex), '开始时间', itemIndex);
	const endTime = unixTime(context, context.getNodeParameter(`${prefix}EndTime`, itemIndex), '结束时间', itemIndex);
	if (startTime >= endTime) fail(context, '开始时间必须早于结束时间', itemIndex);
	const result: IDataObject = { method, start_time: startTime, end_time: endTime };
	if (scheduleId) result.schedule_id = scheduleId;
	const location = text(context, context.getNodeParameter(`${prefix}Location`, itemIndex, ''), '地点', itemIndex, 4096, false);
	if (location) result.location = location;
	const reminderSettings = reminders(context, itemIndex, startTime);
	if (reminderSettings) result.reminders = reminderSettings;
	return { schedule: result, method };
}

function requireParticipants(
	context: IExecuteFunctions,
	values: string[],
	toUserids: string[],
	label: string,
	itemIndex: number,
): void {
	const participants = new Set(toUserids);
	const missing = values.filter((value) => !participants.has(value));
	if (missing.length) fail(context, `${label}必须同时在收件人 UserID 中: ${missing.join('、')}`, itemIndex);
}

function meetingOptions(context: IExecuteFunctions, itemIndex: number): IDataObject | undefined {
	const raw = context.getNodeParameter('meetingOptions', itemIndex, {}) as IDataObject;
	if (!Object.keys(raw).length) return undefined;
	const result: IDataObject = {};
	if (hasOwn(raw, 'password')) {
		const password = text(context, raw.password, '入会密码', itemIndex, 6, false);
		if (password && !/^\d{4,6}$/.test(password)) fail(context, '入会密码必须是 4–6 位数字', itemIndex);
		if (password) result.password = password;
	}
	if (hasOwn(raw, 'auto_record')) result.auto_record = integer(context, raw.auto_record, '自动录制', itemIndex, 0, 2);
	if (hasOwn(raw, 'enable_waiting_room')) result.enable_waiting_room = Boolean(raw.enable_waiting_room);
	if (hasOwn(raw, 'allow_enter_before_host')) result.allow_enter_before_host = Boolean(raw.allow_enter_before_host);
	if (hasOwn(raw, 'enter_restraint')) {
		const restraint = integer(context, raw.enter_restraint, '入会限制', itemIndex, 0, 2);
		if (![0, 2].includes(restraint)) fail(context, '入会限制只能是 0 或 2', itemIndex);
		result.enter_restraint = restraint;
	}
	if (hasOwn(raw, 'enable_screen_watermark')) result.enable_screen_watermark = Boolean(raw.enable_screen_watermark);
	if (hasOwn(raw, 'enable_enter_mute')) result.enable_enter_mute = integer(context, raw.enable_enter_mute, '入会静音', itemIndex, 0, 2);
	if (hasOwn(raw, 'remind_scope')) result.remind_scope = integer(context, raw.remind_scope, '会议提醒范围', itemIndex, 1, 3);
	if (hasOwn(raw, 'water_mark_type')) result.water_mark_type = integer(context, raw.water_mark_type, '水印类型', itemIndex, 0, 1);
	return Object.keys(result).length ? result : undefined;
}

function setWrappedList(body: IDataObject, key: string, values: unknown[]): void {
	if (values.length) body[key] = { list: values };
}

function updateWrappedList(
	context: IExecuteFunctions,
	body: IDataObject,
	itemIndex: number,
	switchName: string,
	parameterName: string,
	label: string,
	numeric = false,
	email = false,
): boolean {
	if (!(context.getNodeParameter(switchName, itemIndex, false) as boolean)) return false;
	const selectedName = `${parameterName}_selected`;
	let selected: unknown = [];
	try {
		selected = context.getNodeParameter(selectedName, itemIndex, []);
	} catch {
		selected = [];
	}
	const value: unknown[] = [context.getNodeParameter(parameterName, itemIndex, ''), selected];
	if (!numeric && !email && parameterName === 'userid_list') {
		value.push(
			...parseUserIdJson(
				context,
				context.getNodeParameter('useridListJson', itemIndex, '[]'),
				'成员列表 JSON',
				itemIndex,
			),
		);
	}
	if (numeric && parameterName === 'department_list') {
		value.push(
			...parseIdJson(
				context,
				context.getNodeParameter('departmentListJson', itemIndex, '[]'),
				'部门列表 JSON',
				itemIndex,
				['partyid', 'party_id', 'departmentid', 'id'],
			),
		);
	}
	if (numeric && parameterName === 'tag_list') {
		value.push(
			...parseIdJson(
				context,
				context.getNodeParameter('tagListJson', itemIndex, '[]'),
				'标签列表 JSON',
				itemIndex,
				['tagid', 'tag_id', 'id'],
			),
		);
	}
	if (numeric && parameterName === 'allow_departmentlist') {
		value.push(
			...parseIdJson(
				context,
				context.getNodeParameter('allowDepartmentListJson', itemIndex, '[]'),
				'允许使用的部门 JSON',
				itemIndex,
				['partyid', 'party_id', 'departmentid', 'id'],
			),
		);
	}
	if (numeric && parameterName === 'allow_taglist') {
		value.push(
			...parseIdJson(
				context,
				context.getNodeParameter('allowTagListJson', itemIndex, '[]'),
				'允许使用的标签 JSON',
				itemIndex,
				['tagid', 'tag_id', 'id'],
			),
		);
	}
	if (email && parameterName === 'email_list') {
		value.push(
			...parseIdJson(
				context,
				context.getNodeParameter('emailListJson', itemIndex, '[]'),
				'成员邮箱 JSON',
				itemIndex,
				['email', 'mail', 'address'],
			),
		);
	}
	if (email && parameterName === 'group_list') {
		value.push(
			...parseIdJson(
				context,
				context.getNodeParameter('groupListJson', itemIndex, '[]'),
				'群组邮箱 JSON',
				itemIndex,
				['email', 'mail', 'groupid', 'address'],
			),
		);
	}
	if (email && parameterName === 'allow_emaillist') {
		value.push(
			...parseIdJson(
				context,
				context.getNodeParameter('allowEmailListJson', itemIndex, '[]'),
				'允许使用的成员邮箱 JSON',
				itemIndex,
				['email', 'mail', 'address'],
			),
		);
	}
	body[parameterName] = {
		list: numeric
			? numberList(context, value, label, itemIndex)
			: email
				? emailList(context, value, label, itemIndex)
				: stringList(context, value, label, itemIndex),
	};
	return true;
}

export async function executeMail(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response!: IDataObject;
			if (!MAIL_OPERATIONS.has(operation)) fail(this, `不支持的邮件操作: ${operation}`, i);

			if (operation === 'sendMail') {
				const { body } = composeBody(this, i);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			} else if (operation === 'sendScheduleMail') {
				const { body, toUserids } = composeBody(this, i, 'calDescription');
				const built = schedule(this, i, 'cal');
				if (built.method === 'request') {
					const admins = stringList(
						this,
						[
							this.getNodeParameter('schedule_admin_userids', i, ''),
							this.getNodeParameter('schedule_admin_userids_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('scheduleAdminsJson', i, '[]'),
								'日程管理员 JSON',
								i,
							),
						],
						'日程管理员',
						i,
						0,
						3,
					);
					if (admins.length) {
						requireParticipants(this, admins, toUserids, '日程管理员', i);
						built.schedule.schedule_admins = { userids: admins };
					}
				}
				body.schedule = built.schedule;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			} else if (operation === 'sendMeetingMail') {
				const { body, toUserids } = composeBody(this, i, 'meetingDescription');
				const built = schedule(this, i, 'meeting');
				const meeting: IDataObject = {};
				if (built.method === 'request') {
					const hosts = stringList(
						this,
						[
							this.getNodeParameter('meeting_host_userids', i, ''),
							this.getNodeParameter('meeting_host_userids_selected', i, []),
							...parseUserIdJson(
								this,
								this.getNodeParameter('meetingHostsJson', i, '[]'),
								'会议主持人 JSON',
								i,
							),
						],
						'会议主持人',
						i,
						0,
						10,
					);
					const admin = text(
						this,
						this.getNodeParameter('meeting_admin_userid', i, '') ||
							this.getNodeParameter('meeting_admin_userid_selected', i, ''),
						'会议管理员',
						i,
					);
					requireParticipants(this, hosts, toUserids, '会议主持人', i);
					requireParticipants(this, [admin], toUserids, '会议管理员', i);
					if (hosts.length) meeting.hosts = { userids: hosts };
					meeting.meeting_admins = { userids: [admin] };
					const option = meetingOptions(this, i);
					if (option) meeting.option = option;
				}
				body.schedule = built.schedule;
				body.meeting = meeting;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			} else if (operation === 'getMailList') {
				const beginTime = unixTime(this, this.getNodeParameter('begin_time', i), '开始时间', i);
				const endTime = unixTime(this, this.getNodeParameter('end_time', i), '结束时间', i);
				if (beginTime > endTime) fail(this, '开始时间不能晚于结束时间', i);
				const body: IDataObject = {
					begin_time: beginTime,
					end_time: endTime,
					limit: integer(this, this.getNodeParameter('limit', i, 100), '返回数量', i, 1, 1000),
				};
				const cursor = text(this, this.getNodeParameter('cursor', i, ''), '分页游标', i, 4096, false);
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/get_mail_list', body);
			} else if (operation === 'getMailContent') {
				const mailId = text(this, this.getNodeParameter('mail_id', i, this.getNodeParameter('mailid', i, '')), '邮件 ID', i);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/read_mail', { mail_id: mailId });
			} else if (operation === 'updateAppMailbox') {
				const newEmail = emailAddress(this, this.getNodeParameter('new_email', i, this.getNodeParameter('mailbox', i, '')), '新应用邮箱账号', i);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/update_email_alias', { new_email: newEmail });
			} else if (operation === 'getAppMailbox') {
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/get_email_alias', {});
			} else if (operation === 'createMailGroup') {
				const body: IDataObject = {
					groupid: emailAddress(this, this.getNodeParameter('groupid', i), '群组地址', i),
					groupname: text(this, this.getNodeParameter('groupname', i), '群组名称', i, 200),
				};
				const emailValues = emailList(
					this,
					[
						this.getNodeParameter('email_list', i, this.getNodeParameter('userlist', i, '')),
						...parseIdJson(
							this,
							this.getNodeParameter('emailListJson', i, '[]'),
							'成员邮箱 JSON',
							i,
							['email', 'mail', 'address'],
						),
					],
					'成员邮箱',
					i,
				);
				const groupValues = emailList(
					this,
					[
						this.getNodeParameter('group_list', i, ''),
						...parseIdJson(
							this,
							this.getNodeParameter('groupListJson', i, '[]'),
							'群组邮箱 JSON',
							i,
							['email', 'mail', 'groupid', 'address'],
						),
					],
					'群组邮箱',
					i,
				);
				const departmentValues = numberList(
					this,
					[
						this.getNodeParameter('department_list', i, ''),
						this.getNodeParameter('department_list_selected', i, []),
						...parseIdJson(
							this,
							this.getNodeParameter('departmentListJson', i, '[]'),
							'部门列表 JSON',
							i,
							['partyid', 'party_id', 'departmentid', 'id'],
						),
					],
					'部门 ID',
					i,
				);
				const tagValues = numberList(
					this,
					[
						this.getNodeParameter('tag_list', i, ''),
						this.getNodeParameter('tag_list_selected', i, []),
						...parseIdJson(
							this,
							this.getNodeParameter('tagListJson', i, '[]'),
							'标签列表 JSON',
							i,
							['tagid', 'tag_id', 'id'],
						),
					],
					'标签 ID',
					i,
				);
				if (!emailValues.length && !groupValues.length && !departmentValues.length && !tagValues.length) {
					fail(this, '成员邮箱、群组邮箱、部门和标签至少填一类', i);
				}
				setWrappedList(body, 'email_list', emailValues);
				setWrappedList(body, 'group_list', groupValues);
				setWrappedList(body, 'department_list', departmentValues);
				setWrappedList(body, 'tag_list', tagValues);
				const allowType = integer(this, this.getNodeParameter('allow_type', i, 0), '群组使用权限', i, 0, 3);
				body.allow_type = allowType;
				if (allowType === 3) {
					const allowEmails = emailList(
						this,
						[
							this.getNodeParameter('allow_emaillist', i, ''),
							...parseIdJson(
								this,
								this.getNodeParameter('allowEmailListJson', i, '[]'),
								'允许使用的成员邮箱 JSON',
								i,
								['email', 'mail', 'address'],
							),
						],
						'允许使用的成员邮箱',
						i,
					);
					const allowDepartments = numberList(
						this,
						[
							this.getNodeParameter('allow_departmentlist', i, ''),
							this.getNodeParameter('allow_departmentlist_selected', i, []),
							...parseIdJson(
								this,
								this.getNodeParameter('allowDepartmentListJson', i, '[]'),
								'允许使用的部门 JSON',
								i,
								['partyid', 'party_id', 'departmentid', 'id'],
							),
						],
						'允许使用的部门 ID',
						i,
					);
					const allowTags = numberList(
						this,
						[
							this.getNodeParameter('allow_taglist', i, ''),
							this.getNodeParameter('allow_taglist_selected', i, []),
							...parseIdJson(
								this,
								this.getNodeParameter('allowTagListJson', i, '[]'),
								'允许使用的标签 JSON',
								i,
								['tagid', 'tag_id', 'id'],
							),
						],
						'允许使用的标签 ID',
						i,
					);
					if (!allowEmails.length && !allowDepartments.length && !allowTags.length) fail(this, '自定义群组权限至少需要一类允许范围', i);
					setWrappedList(body, 'allow_emaillist', allowEmails);
					setWrappedList(body, 'allow_departmentlist', allowDepartments);
					setWrappedList(body, 'allow_taglist', allowTags);
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/create', body);
			} else if (operation === 'updateMailGroup') {
				const body: IDataObject = { groupid: emailAddress(this, this.getNodeParameter('groupid', i), '群组地址', i) };
				if (this.getNodeParameter('updateGroupName', i, false) as boolean) {
					body.groupname = text(this, this.getNodeParameter('groupname', i), '群组名称', i, 200);
				}
				const memberUpdates = [
					updateWrappedList(this, body, i, 'updateEmailList', 'email_list', '成员邮箱', false, true),
					updateWrappedList(this, body, i, 'updateGroupList', 'group_list', '群组邮箱', false, true),
					updateWrappedList(this, body, i, 'updateDepartmentList', 'department_list', '部门 ID', true),
					updateWrappedList(this, body, i, 'updateTagList', 'tag_list', '标签 ID', true),
				];
				if (memberUpdates.every(Boolean)) {
					const allEmpty = ['email_list', 'group_list', 'department_list', 'tag_list']
						.every((key) => ((body[key] as IDataObject).list as unknown[]).length === 0);
					if (allEmpty) fail(this, '群组成员不允许全部清空', i);
				}
				let allowType: number | undefined;
				if (this.getNodeParameter('updateAllowType', i, false) as boolean) {
					allowType = integer(this, this.getNodeParameter('allow_type', i), '群组使用权限', i, 0, 3);
					body.allow_type = allowType;
				}
				if (allowType === undefined || allowType === 3) {
					updateWrappedList(this, body, i, 'updateAllowEmailList', 'allow_emaillist', '允许使用的成员邮箱', false, true);
					updateWrappedList(this, body, i, 'updateAllowDepartmentList', 'allow_departmentlist', '允许使用的部门 ID', true);
					updateWrappedList(this, body, i, 'updateAllowTagList', 'allow_taglist', '允许使用的标签 ID', true);
				}
				if (allowType === 3) {
					const hasScope = ['allow_emaillist', 'allow_departmentlist', 'allow_taglist']
						.some((key) => body[key] && ((body[key] as IDataObject).list as unknown[]).length > 0);
					if (!hasScope) fail(this, '自定义群组权限至少需要一类允许范围', i);
				}
				if (Object.keys(body).length === 1) fail(this, '请至少开启一项要更新的邮件群组字段', i);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/update', body);
			} else if (operation === 'deleteMailGroup') {
				const groupid = emailAddress(this, this.getNodeParameter('groupid', i), '群组地址', i);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/delete', { groupid });
			} else if (operation === 'getMailGroup') {
				const groupid = emailAddress(this, this.getNodeParameter('groupid', i), '群组地址', i);
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/exmail/group/get', {}, { groupid });
			} else if (operation === 'searchMailGroup') {
				const fuzzy = integer(this, this.getNodeParameter('fuzzy', i, 1), '模糊搜索开关', i, 0, 1);
				const query = text(this, this.getNodeParameter('fuzzy_groupid', i, ''), '群组搜索词', i, 320, false);
				const qs: IDataObject = { fuzzy };
				if (query) qs.groupid = query;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/exmail/group/search', {}, qs);
			} else if (operation === 'createPublicMailbox') {
				const body: IDataObject = {
					email: emailAddress(this, this.getNodeParameter('email', i, this.getNodeParameter('mailbox', i, '')), '公共邮箱地址', i),
					name: publicMailboxName(this, this.getNodeParameter('name', i), i),
				};
				const users = stringList(
					this,
					[
						this.getNodeParameter(
							'userid_list',
							i,
							this.getNodeParameter('member_list', i, this.getNodeParameter('admin_list', i, '')),
						),
						this.getNodeParameter('userid_list_selected', i, []),
						...parseUserIdJson(
							this,
							this.getNodeParameter('useridListJson', i, '[]'),
							'成员列表 JSON',
							i,
						),
					],
					'成员 UserID',
					i,
				);
				const departments = numberList(
					this,
					[
						this.getNodeParameter('department_list', i, ''),
						this.getNodeParameter('department_list_selected', i, []),
						...parseIdJson(
							this,
							this.getNodeParameter('departmentListJson', i, '[]'),
							'部门列表 JSON',
							i,
							['partyid', 'party_id', 'departmentid', 'id'],
						),
					],
					'部门 ID',
					i,
				);
				const tags = numberList(
					this,
					[
						this.getNodeParameter('tag_list', i, ''),
						this.getNodeParameter('tag_list_selected', i, []),
						...parseIdJson(
							this,
							this.getNodeParameter('tagListJson', i, '[]'),
							'标签列表 JSON',
							i,
							['tagid', 'tag_id', 'id'],
						),
					],
					'标签 ID',
					i,
				);
				if (!users.length && !departments.length && !tags.length) fail(this, '成员、部门和标签至少填写一类', i);
				setWrappedList(body, 'userid_list', users);
				setWrappedList(body, 'department_list', departments);
				setWrappedList(body, 'tag_list', tags);
				const createAuthCode = Number(this.getNodeParameter('create_auth_code', i, 0)) === 1;
				if (createAuthCode) {
					body.create_auth_code = 1;
					const remark = text(this, this.getNodeParameter('auth_code_remark', i, ''), '专用密码备注', i, 128, false);
					if (remark) body.auth_code_info = { remark };
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmail/create', body);
			} else if (operation === 'updatePublicMailbox') {
				const body: IDataObject = { id: integer(this, this.getNodeParameter('id', i, this.getNodeParameter('mailbox', i, 0)), '公共邮箱 ID', i, 1, MAX_UINT32) };
				if (this.getNodeParameter('updateName', i, false) as boolean) body.name = publicMailboxName(this, this.getNodeParameter('name', i), i);
				const membershipUpdates = [
					updateWrappedList(this, body, i, 'updateUseridList', 'userid_list', '成员 UserID'),
					updateWrappedList(this, body, i, 'updateDepartmentList', 'department_list', '部门 ID', true),
					updateWrappedList(this, body, i, 'updateTagList', 'tag_list', '标签 ID', true),
				];
				if (membershipUpdates.every(Boolean)) {
					const allEmpty = ['userid_list', 'department_list', 'tag_list']
						.every((key) => ((body[key] as IDataObject).list as unknown[]).length === 0);
					if (allEmpty) fail(this, '公共邮箱使用成员不允许全部清空', i);
				}
				if (this.getNodeParameter('updateAliasList', i, false) as boolean) {
					const aliases = emailList(
						this,
						[
							this.getNodeParameter('alias_list', i, ''),
							...parseIdJson(
								this,
								this.getNodeParameter('aliasListJson', i, '[]'),
								'邮箱别名 JSON',
								i,
								['email', 'mail', 'alias', 'address'],
							),
						],
						'邮箱别名',
						i,
						0,
						5,
					);
					for (const alias of aliases) {
						const bytes = Buffer.byteLength(alias, 'utf8');
						if (bytes < 6 || bytes > 64) fail(this, '邮箱别名长度必须为 6–64 字节', i);
					}
					body.alias_list = { list: aliases };
				}
				if (this.getNodeParameter('create_auth_code', i, false) as boolean) {
					body.create_auth_code = 1;
					const remark = text(this, this.getNodeParameter('auth_code_remark', i, ''), '专用密码备注', i, 128, false);
					if (remark) body.auth_code_info = { remark };
				}
				if (Object.keys(body).length === 1) fail(this, '请至少开启一项要更新的公共邮箱字段', i);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmail/update', body);
			} else if (operation === 'deletePublicMailbox') {
				const id = integer(this, this.getNodeParameter('id', i, this.getNodeParameter('mailbox', i, 0)), '公共邮箱 ID', i, 1, MAX_UINT32);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmail/delete', { id });
			} else if (operation === 'getPublicMailbox') {
				const idList = numberList(
					this,
					[
						this.getNodeParameter('id_list', i, this.getNodeParameter('mailbox', i, '')),
						...parseIdJson(
							this,
							this.getNodeParameter('idListJson', i, '[]'),
							'公共邮箱ID列表 JSON',
							i,
							['id', 'mailbox_id', 'publicmail_id'],
						),
					],
					'公共邮箱 ID 列表',
					i,
					1,
				);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmail/get', { id_list: idList });
			} else if (operation === 'searchPublicMailbox') {
				const fuzzy = integer(this, this.getNodeParameter('fuzzy', i, 1), '模糊搜索开关', i, 0, 1);
				const query = text(this, this.getNodeParameter('email', i, this.getNodeParameter('fuzzy_mailbox', i, '')), '公共邮箱搜索词', i, 320, false);
				const qs: IDataObject = { fuzzy };
				if (query) qs.email = query;
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/exmail/publicmail/search', {}, qs);
			} else if (operation === 'getClientPasswordList') {
				const id = integer(this, this.getNodeParameter('id', i, this.getNodeParameter('mailbox', i, 0)), '公共邮箱 ID', i, 1, MAX_UINT32);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmail/get_auth_code_list', { id });
			} else if (operation === 'deleteClientPassword') {
				const id = integer(this, this.getNodeParameter('id', i, this.getNodeParameter('mailbox', i, 0)), '公共邮箱 ID', i, 1, MAX_UINT32);
				const authCodeId = integer(this, this.getNodeParameter('auth_code_id', i, this.getNodeParameter('password_id', i, 0)), '客户端专用密码 ID', i, 1, MAX_UINT32);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmail/delete_auth_code', { id, auth_code_id: authCodeId });
			} else if (operation === 'allocateMailAdvancedAccount' || operation === 'deallocateMailAdvancedAccount') {
				const userids = stringList(
					this,
					[
						this.getNodeParameter('userid_list', i, this.getNodeParameter('mailbox_list', i, '')),
						this.getNodeParameter('userid_list_selected', i, []),
						...parseUserIdJson(
							this,
							this.getNodeParameter('useridListJson', i, '[]'),
							'成员列表 JSON',
							i,
						),
					],
					'成员 UserID 列表',
					i,
					1,
					100,
				);
				const path =
					operation === 'allocateMailAdvancedAccount'
						? '/cgi-bin/exmail/vip/batch_add'
						: '/cgi-bin/exmail/vip/batch_del';
				response = await weComApiRequest.call(this, 'POST', path, { userid_list: userids });
			} else if (operation === 'getMailAdvancedAccountList') {
				const body: IDataObject = { limit: integer(this, this.getNodeParameter('limit', i, 100), '每页数量', i, 1, 200) };
				const cursor = text(this, this.getNodeParameter('cursor', i, ''), '分页游标', i, 4096, false);
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/vip/list', body);
			} else if (operation === 'toggleMailboxStatus') {
				const type = integer(this, this.getNodeParameter('operation_type', i), '操作类型', i, 1, 2);
				const targetType = text(this, this.getNodeParameter('mailboxTargetType', i, 'user'), '账号类型', i);
				const body: IDataObject = { type };
				if (targetType === 'user') {
					body.userid = text(
						this,
						this.getNodeParameter('userid', i, '') ||
							this.getNodeParameter('userid_selected', i, '') ||
							this.getNodeParameter('mailbox', i, ''),
						'成员 UserID',
						i,
					);
				}
				else if (targetType === 'public') body.publicemail_id = integer(this, this.getNodeParameter('publicemail_id', i), '公共邮箱 ID', i, 1, MAX_UINT32);
				else fail(this, '账号类型只能是成员邮箱或公共邮箱', i);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/account/act_email', body);
			} else if (operation === 'getUserMailAttribute') {
				const userid = text(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, '') ||
						this.getNodeParameter('mailbox', i, ''),
					'成员 UserID',
					i,
				);
				const types = numberList(this, this.getNodeParameter('type', i, '1,2,3,4'), '功能属性类型', i, 1, 4, 1, 4);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/useroption/get', { userid, type: types });
			} else if (operation === 'updateUserMailAttribute') {
				const userid = text(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, '') ||
						this.getNodeParameter('mailbox', i, ''),
					'成员 UserID',
					i,
				);
				const optionMap = new Map<number, string>();
				const legacy = this.getNodeParameter('imapSmtpSettings', i, {}) as IDataObject;
				if (hasOwn(legacy, 'enable_imap')) optionMap.set(2, legacy.enable_imap ? '1' : '0');
				if (hasOwn(legacy, 'enable_smtp')) optionMap.set(3, legacy.enable_smtp ? '1' : '0');
				const collection = this.getNodeParameter('optionList', i, {}) as IDataObject;
				const formOptions = Array.isArray(collection.options)
					? (collection.options as IDataObject[])
					: [];
				const optionJsonRaw = this.getNodeParameter('optionListJson', i, '[]');
				let options = formOptions;
				if (
					optionJsonRaw !== undefined &&
					optionJsonRaw !== null &&
					String(optionJsonRaw).trim() !== ''
				) {
					let parsed: unknown = optionJsonRaw;
					if (typeof optionJsonRaw === 'string') {
						try {
							parsed = JSON.parse(optionJsonRaw);
						} catch {
							fail(this, '功能属性列表 JSON 不是有效的 JSON', i);
						}
					}
					if (!Array.isArray(parsed)) fail(this, '功能属性列表 JSON 必须是数组', i);
					if (parsed.length > 0) {
						// 先写入表单，再用 JSON 覆盖同 type（JSON 优先）
						options = [...formOptions, ...(parsed as IDataObject[])];
					}
				}
				for (const option of options) {
					const type = integer(this, option.type, '功能属性类型', i, 1, 4);
					const value = text(this, option.value, '功能属性值', i);
					if (!['0', '1'].includes(value)) fail(this, '功能属性值只能是 0 或 1', i);
					optionMap.set(type, value);
				}
				if (!optionMap.size) fail(this, '功能属性列表至少需要 1 项', i);
				const list = [...optionMap].map(([type, value]) => ({ type, value }));
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/useroption/update', { userid, option: { list } });
			} else if (operation === 'getMailUnreadCount') {
				const userid = text(
					this,
					this.getNodeParameter('userid', i, '') ||
						this.getNodeParameter('userid_selected', i, '') ||
						this.getNodeParameter('mailbox', i, ''),
					'成员 UserID',
					i,
				);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/mail/get_newcount', { userid });
			}

			returnData.push({ json: response, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error instanceof Error ? error.message : String(error) },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
