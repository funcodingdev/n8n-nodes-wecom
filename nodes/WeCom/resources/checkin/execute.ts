import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { parseQueryJson, parseRequestJson } from '../../shared/extraHttpOp';
import { weComApiRequest } from '../../shared/transport';

const LIST_SEPARATOR = /[,，|\n\r]+/;
const MAX_UINT32 = 4294967295;
const DAY_SECONDS = 86400;
const WIFI_MAC = /^[A-Fa-f0-9]{2}(?::[A-Fa-f0-9]{2}){5}$/;

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

function characterText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxCharacters: number,
	required = true,
): string {
	const normalized = String(value ?? '').trim();
	if (required && !normalized) fail(context, `${label}不能为空`, itemIndex);
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

function timestamp(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	if (value === undefined || value === null || String(value).trim() === '') {
		fail(context, `${label}不能为空`, itemIndex);
	}
	const raw = String(value).trim();
	const normalized = /^\d+$/.test(raw) ? Number(raw) : Math.floor(Date.parse(raw) / 1000);
	if (!Number.isSafeInteger(normalized) || normalized < 1 || normalized > MAX_UINT32) {
		fail(context, `${label}不是有效的日期时间`, itemIndex);
	}
	return normalized;
}

function stringList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min: number,
	max: number,
): string[] {
	const source = Array.isArray(value) ? value : [value];
	const values = source
		.flatMap((entry) => String(entry ?? '').split(LIST_SEPARATOR))
		.map((entry) => entry.trim())
		.filter(Boolean);
	const unique = [...new Set(values)];
	if (unique.length < min || unique.length > max) {
		fail(context, `${label}数量必须为 ${min}–${max} 个`, itemIndex);
	}
	return unique;
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
	return parsed.map((entry, index) => {
		if (typeof entry === 'string' || typeof entry === 'number') {
			return String(entry).trim();
		}
		if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
			const row = entry as IDataObject;
			for (const key of keys) {
				if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
					return String(row[key]).trim();
				}
			}
			fail(context, `${label}第 ${index + 1} 项缺少 ${keys.join('/')}`, itemIndex);
		}
		fail(context, `${label}第 ${index + 1} 项必须是标量或含 ${keys.join('/')} 的对象`, itemIndex);
	});
}

function userids(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string[] {
	return stringList(context, value, label, itemIndex, 1, 100).map((userid) =>
		text(context, userid, `${label} UserID`, itemIndex, 64),
	);
}

function useridlistParameter(context: IExecuteFunctions, itemIndex: number): string[] {
	return userids(
		context,
		[
			context.getNodeParameter('useridlist', itemIndex, ''),
			context.getNodeParameter('useridlist_selected', itemIndex, []),
			...parseIdJson(
				context,
				context.getNodeParameter('useridlistJson', itemIndex, '[]'),
				'成员列表 JSON',
				itemIndex,
				['userid', 'userid_selected', 'user_id'],
			),
		],
		'成员列表',
		itemIndex,
	);
}

function timeRange(
	context: IExecuteFunctions,
	startValue: unknown,
	endValue: unknown,
	label: string,
	itemIndex: number,
	maxSpanSeconds?: number,
): { starttime: number; endtime: number } {
	const starttime = timestamp(context, startValue, `${label}开始时间`, itemIndex);
	const endtime = timestamp(context, endValue, `${label}结束时间`, itemIndex);
	if (endtime < starttime) fail(context, `${label}结束时间不能早于开始时间`, itemIndex);
	if (maxSpanSeconds !== undefined && endtime - starttime > maxSpanSeconds) {
		fail(
			context,
			`${label}时间跨度不能超过 ${Math.floor(maxSpanSeconds / DAY_SECONDS)} 天`,
			itemIndex,
		);
	}
	return { starttime, endtime };
}

function jsonValue(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): unknown {
	try {
		return JSON.parse(String(value));
	} catch {
		fail(context, `${label}不是有效的 JSON`, itemIndex);
	}
}

function jsonObject(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject {
	const parsed = jsonValue(context, value, label, itemIndex);
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		fail(context, `${label}必须是 JSON 对象`, itemIndex);
	}
	return parsed as IDataObject;
}

function parseJsonArray(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject[] {
	const parsed = jsonValue(context, value, label, itemIndex);
	if (!Array.isArray(parsed)) fail(context, `${label}必须是 JSON 数组`, itemIndex);
	if (
		!parsed.every(
			(entry) => entry !== null && typeof entry === 'object' && !Array.isArray(entry),
		)
	) {
		fail(context, `${label}的每一项必须是对象`, itemIndex);
	}
	return parsed as IDataObject[];
}

function normalizeRecord(
	context: IExecuteFunctions,
	raw: IDataObject,
	itemIndex: number,
	recordIndex: number,
): IDataObject {
	const prefix = `第 ${recordIndex + 1} 条打卡记录`;
	const record: IDataObject = {
		userid: text(context, raw.userid, `${prefix}成员 UserID`, itemIndex, 64),
		checkin_time: timestamp(context, raw.checkin_time, `${prefix}打卡时间`, itemIndex),
		location_title: characterText(
			context,
			raw.location_title,
			`${prefix}地点标题`,
			itemIndex,
			1024,
		),
		location_detail: characterText(
			context,
			raw.location_detail,
			`${prefix}地点详情`,
			itemIndex,
			1024,
		),
		device_type: integer(context, raw.device_type, `${prefix}设备类型`, itemIndex, 1, 3),
		device_detail: characterText(context, raw.device_detail, `${prefix}设备详情`, itemIndex, 40),
	};
	const notes = characterText(context, raw.notes, `${prefix}备注`, itemIndex, 1024, false);
	if (notes) record.notes = notes;
	if (raw.lng !== undefined) {
		record.lng = integer(context, raw.lng, `${prefix}经度`, itemIndex, -180000000, 180000000);
	}
	if (raw.lat !== undefined) {
		record.lat = integer(context, raw.lat, `${prefix}纬度`, itemIndex, -90000000, 90000000);
	}
	const wifiname = characterText(
		context,
		raw.wifiname,
		`${prefix}WiFi 名称`,
		itemIndex,
		1024,
		false,
	);
	const wifimac = text(context, raw.wifimac, `${prefix}WiFi MAC`, itemIndex, 17, false);
	if (wifiname && !wifimac) fail(context, `${prefix}填写 WiFi 名称时必须填写 MAC 地址`, itemIndex);
	if (wifimac && !WIFI_MAC.test(wifimac)) fail(context, `${prefix}WiFi MAC 格式不正确`, itemIndex);
	if (wifiname) record.wifiname = wifiname;
	if (wifimac) record.wifimac = wifimac;
	const mediaids = stringList(context, raw.mediaids, `${prefix}附件 MediaID`, itemIndex, 0, 1);
	if (mediaids.length)
		record.mediaids = mediaids.map((id) => text(context, id, '附件 MediaID', itemIndex));
	return record;
}

function normalizeBase64(context: IExecuteFunctions, value: unknown, itemIndex: number): string {
	const encoded = String(value ?? '').replace(/\s+/g, '');
	if (!encoded) fail(context, '人脸图片 Base64 不能为空', itemIndex);
	if (encoded.startsWith('data:'))
		fail(context, '人脸图片 Base64 不要包含 data URL 前缀', itemIndex);
	if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(encoded)) {
		fail(context, '人脸图片不是有效的 Base64', itemIndex);
	}
	const buffer = Buffer.from(encoded, 'base64');
	if (!buffer.length) fail(context, '人脸图片不能为空', itemIndex);
	if (buffer.length > 1024 * 1024) fail(context, '人脸图片不能超过 1 MiB', itemIndex);
	return encoded;
}

function minuteSecond(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	const normalized = integer(context, value, label, itemIndex, 0, 172740);
	if (normalized % 60 !== 0) fail(context, `${label}必须是 60 的倍数`, itemIndex);
	return normalized;
}

function buildRuleGroup(
	context: IExecuteFunctions,
	action: 'create' | 'update',
	itemIndex: number,
): IDataObject {
	const includeBasic =
		action === 'create' ||
		(context.getNodeParameter('includeBasicFields', itemIndex, false) as boolean);
	const group: IDataObject = {};
	if (includeBasic) {
		if (action === 'create') {
			group.grouptype = integer(
				context,
				context.getNodeParameter('grouptype', itemIndex, 1),
				'规则类型',
				itemIndex,
				1,
				3,
			);
		}
		const groupname = characterText(
			context,
			context.getNodeParameter('groupname', itemIndex, ''),
			'规则名称',
			itemIndex,
			40,
			action === 'create',
		);
		if (groupname) group.groupname = groupname;
		const checkinType = integer(
			context,
			context.getNodeParameter('checkin_type', itemIndex, 0),
			'打卡方式',
			itemIndex,
			0,
			3,
		);
		if (![0, 2, 3].includes(checkinType)) fail(context, '打卡方式只能是 0、2 或 3', itemIndex);
		group.type = checkinType;
		group.sync_holidays = context.getNodeParameter('sync_holidays', itemIndex, true) as boolean;
		group.need_photo = context.getNodeParameter('need_photo', itemIndex, false) as boolean;
		group.note_can_use_local_pic = context.getNodeParameter(
			'note_can_use_local_pic',
			itemIndex,
			false,
		) as boolean;
		group.allow_checkin_offworkday = context.getNodeParameter(
			'allow_checkin_offworkday',
			itemIndex,
			false,
		) as boolean;
		group.allow_apply_offworkday = context.getNodeParameter(
			'allow_apply_offworkday',
			itemIndex,
			false,
		) as boolean;
		group.use_face_detect = context.getNodeParameter(
			'use_face_detect',
			itemIndex,
			false,
		) as boolean;
		group.open_face_live_detect = context.getNodeParameter(
			'open_face_live_detect',
			itemIndex,
			false,
		) as boolean;
		group.sync_out_checkin = context.getNodeParameter(
			'sync_out_checkin',
			itemIndex,
			false,
		) as boolean;
		group.checkin_method_type = integer(
			context,
			context.getNodeParameter('checkin_method_type', itemIndex, 0),
			'打卡交替方式',
			itemIndex,
			0,
			2,
		);

		const range: IDataObject = {};
		const rangeUsers = stringList(
			context,
			[
				context.getNodeParameter('range_userids', itemIndex, ''),
				context.getNodeParameter('range_userids_selected', itemIndex, []),
				...parseIdJson(
					context,
					context.getNodeParameter('rangeUseridsJson', itemIndex, '[]'),
					'应用范围成员 JSON',
					itemIndex,
					['userid', 'userid_selected', 'user_id'],
				),
			],
			'应用范围成员',
			itemIndex,
			0,
			1000,
		).map((userid) => text(context, userid, '应用范围成员 UserID', itemIndex, 64));
		const rangeParties = stringList(
			context,
			[
				context.getNodeParameter('range_partyids', itemIndex, ''),
				context.getNodeParameter('range_partyids_selected', itemIndex, []),
				...parseIdJson(
					context,
					context.getNodeParameter('rangePartyidsJson', itemIndex, '[]'),
					'应用范围部门 JSON',
					itemIndex,
					['partyid', 'party_id', 'departmentid', 'id'],
				),
			],
			'应用范围部门',
			itemIndex,
			0,
			1000,
		).map((id) => integer(context, id, '应用范围部门 ID', itemIndex, 1, MAX_UINT32));
		const rangeTags = stringList(
			context,
			[
				context.getNodeParameter('range_tagids', itemIndex, ''),
				context.getNodeParameter('range_tagids_selected', itemIndex, []),
				...parseIdJson(
					context,
					context.getNodeParameter('rangeTagidsJson', itemIndex, '[]'),
					'应用范围标签 JSON',
					itemIndex,
					['tagid', 'tag_id', 'id'],
				),
			],
			'应用范围标签',
			itemIndex,
			0,
			1000,
		).map((id) => integer(context, id, '应用范围标签 ID', itemIndex, 1, MAX_UINT32));
		if (rangeUsers.length) range.userid = rangeUsers;
		if (rangeParties.length) range.party_id = rangeParties;
		if (rangeTags.length) range.tagid = rangeTags;
		if (Object.keys(range).length) group.range = range;
		const whiteUsers = stringList(
			context,
			[
				context.getNodeParameter('white_users', itemIndex, ''),
				context.getNodeParameter('white_users_selected', itemIndex, []),
				...parseIdJson(
					context,
					context.getNodeParameter('whiteUsersJson', itemIndex, '[]'),
					'白名单成员 JSON',
					itemIndex,
					['userid', 'userid_selected', 'user_id'],
				),
			],
			'白名单成员',
			itemIndex,
			0,
			1000,
		).map((userid) => text(context, userid, '白名单成员 UserID', itemIndex, 64));
		if (whiteUsers.length) group.white_users = whiteUsers;

		const groupType = Number(group.grouptype ?? 1);
		if (groupType === 1) {
			const workdays = stringList(
				context,
				context.getNodeParameter('workdays', itemIndex, '1,2,3,4,5'),
				'工作日',
				itemIndex,
				1,
				7,
			).map((day) => integer(context, day, '工作日', itemIndex, 0, 6));
			const workSec = minuteSecond(
				context,
				context.getNodeParameter('work_sec', itemIndex, 32400),
				'上班时间',
				itemIndex,
			);
			const offWorkSec = minuteSecond(
				context,
				context.getNodeParameter('off_work_sec', itemIndex, 64800),
				'下班时间',
				itemIndex,
			);
			const earliestWork = minuteSecond(
				context,
				context.getNodeParameter('earliest_work_sec', itemIndex, 28800),
				'最早上班打卡时间',
				itemIndex,
			);
			const latestWork = minuteSecond(
				context,
				context.getNodeParameter('latest_work_sec', itemIndex, 36000),
				'最晚上班打卡时间',
				itemIndex,
			);
			const earliestOff = minuteSecond(
				context,
				context.getNodeParameter('earliest_off_work_sec', itemIndex, 61200),
				'最早下班打卡时间',
				itemIndex,
			);
			const latestOff = minuteSecond(
				context,
				context.getNodeParameter('latest_off_work_sec', itemIndex, 68400),
				'最晚下班打卡时间',
				itemIndex,
			);
			if (earliestWork > workSec || workSec > latestWork) {
				fail(context, '上班时间必须位于最早和最晚打卡时间之间', itemIndex);
			}
			if (earliestOff > offWorkSec || offWorkSec > latestOff) {
				fail(context, '下班时间必须位于最早和最晚打卡时间之间', itemIndex);
			}
			group.checkindate = [
				{
					workdays: [...new Set(workdays)],
					checkintime: [
						{
							time_id: 1,
							work_sec: workSec,
							off_work_sec: offWorkSec,
							remind_work_sec: Math.max(0, workSec - 600),
							remind_off_work_sec: offWorkSec,
							earliest_work_sec: earliestWork,
							latest_work_sec: latestWork,
							earliest_off_work_sec: earliestOff,
							latest_off_work_sec: latestOff,
						},
					],
				},
			];
		}

		const locJsonRaw = context.getNodeParameter('locInfosJson', itemIndex, '[]');
		let rawLocations: IDataObject[] = [];
		if (locJsonRaw !== undefined && locJsonRaw !== null && String(locJsonRaw).trim() !== '') {
			let parsed: unknown = locJsonRaw;
			if (typeof locJsonRaw === 'string') {
				try {
					parsed = JSON.parse(locJsonRaw);
				} catch {
					fail(context, '位置打卡点 JSON 不是有效的 JSON', itemIndex);
				}
			}
			if (!Array.isArray(parsed)) fail(context, '位置打卡点 JSON 必须是数组', itemIndex);
			if (parsed.length > 0) rawLocations = parsed as IDataObject[];
		}
		if (rawLocations.length === 0) {
			const locCollection = context.getNodeParameter(
				'locInfosCollection',
				itemIndex,
				{},
			) as IDataObject;
			rawLocations = (locCollection.locs as IDataObject[]) || [];
		}
		if (rawLocations.length) {
			group.loc_infos = rawLocations.map((location, index) => ({
				lat: integer(
					context,
					location.lat,
					`第 ${index + 1} 个位置纬度`,
					itemIndex,
					-90000000,
					90000000,
				),
				lng: integer(
					context,
					location.lng,
					`第 ${index + 1} 个位置经度`,
					itemIndex,
					-180000000,
					180000000,
				),
				loc_title: characterText(
					context,
					location.loc_title,
					`第 ${index + 1} 个位置名称`,
					itemIndex,
					128,
					false,
				),
				loc_detail: characterText(
					context,
					location.loc_detail,
					`第 ${index + 1} 个详细地址`,
					itemIndex,
					512,
					false,
				),
				distance: integer(
					context,
					location.distance ?? 300,
					`第 ${index + 1} 个打卡范围`,
					itemIndex,
					1,
					100000,
				),
			}));
		}
		const wifiJsonRaw = context.getNodeParameter('wifiInfosJson', itemIndex, '[]');
		let rawWifis: IDataObject[] = [];
		if (wifiJsonRaw !== undefined && wifiJsonRaw !== null && String(wifiJsonRaw).trim() !== '') {
			let parsed: unknown = wifiJsonRaw;
			if (typeof wifiJsonRaw === 'string') {
				try {
					parsed = JSON.parse(wifiJsonRaw);
				} catch {
					fail(context, 'WiFi打卡点 JSON 不是有效的 JSON', itemIndex);
				}
			}
			if (!Array.isArray(parsed)) fail(context, 'WiFi打卡点 JSON 必须是数组', itemIndex);
			if (parsed.length > 0) rawWifis = parsed as IDataObject[];
		}
		if (rawWifis.length === 0) {
			const wifiCollection = context.getNodeParameter(
				'wifiInfosCollection',
				itemIndex,
				{},
			) as IDataObject;
			rawWifis = (wifiCollection.wifis as IDataObject[]) || [];
		}
		if (rawWifis.length) {
			group.wifimac_infos = rawWifis.map((wifi, index) => {
				const mac = text(context, wifi.wifimac, `第 ${index + 1} 个 WiFi MAC`, itemIndex, 17);
				if (!WIFI_MAC.test(mac)) fail(context, `第 ${index + 1} 个 WiFi MAC 格式不正确`, itemIndex);
				return {
					wifiname: characterText(
						context,
						wifi.wifiname,
						`第 ${index + 1} 个 WiFi 名称`,
						itemIndex,
						128,
						false,
					),
					wifimac: mac,
				};
			});
		}
	}

	if (context.getNodeParameter('useAdvancedConfig', itemIndex, false) as boolean) {
		const config = jsonObject(
			context,
			context.getNodeParameter('advancedConfig', itemIndex, '{}'),
			'高级配置',
			itemIndex,
		);
		if (config.group !== undefined) {
			if (!config.group || typeof config.group !== 'object' || Array.isArray(config.group)) {
				fail(context, '高级配置中的 group 必须是对象', itemIndex);
			}
			Object.assign(group, config.group as IDataObject);
		} else {
			Object.assign(group, config);
		}
	}

	if (action === 'update') {
		group.groupid = integer(
			context,
			context.getNodeParameter('groupid', itemIndex),
			'规则 ID',
			itemIndex,
			1,
			MAX_UINT32,
		);
		if (Object.keys(group).length === 1)
			fail(context, '更新规则时至少提供一个要修改的字段', itemIndex);
	} else {
		group.grouptype = integer(context, group.grouptype, '规则类型', itemIndex, 1, 3);
		group.groupname = characterText(context, group.groupname, '规则名称', itemIndex, 40);
		const range = group.range as IDataObject | undefined;
		const hasRange =
			range &&
			['userid', 'party_id', 'tagid'].some(
				(key) => Array.isArray(range[key]) && (range[key] as unknown[]).length > 0,
			);
		if (!hasRange) fail(context, '创建规则时应用范围至少要包含成员、部门或标签中的一种', itemIndex);
		const hasLocations = Array.isArray(group.loc_infos) && group.loc_infos.length > 0;
		const hasWifis = Array.isArray(group.wifimac_infos) && group.wifimac_infos.length > 0;
		if (!hasLocations && !hasWifis)
			fail(context, '创建规则时位置和 WiFi 打卡点不能同时为空', itemIndex);
		if (group.grouptype === 1 && (!Array.isArray(group.checkindate) || !group.checkindate.length)) {
			fail(context, '固定时间上下班规则必须提供 checkindate', itemIndex);
		}
		if (
			group.grouptype === 2 &&
			(!Array.isArray(group.schedulelist) || !group.schedulelist.length)
		) {
			fail(context, '按班次上下班规则必须通过高级配置提供 schedulelist', itemIndex);
		}
	}
	if (group.type !== undefined && ![0, 2, 3].includes(Number(group.type))) {
		fail(context, 'group.type 只能是 0、2 或 3', itemIndex);
	}
	if (group.open_face_live_detect === true && group.use_face_detect === false) {
		fail(context, '开启人脸活体检测时必须同时开启人脸识别', itemIndex);
	}
	return group;
}

export async function executeCheckin(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			if (operation === 'getCorporationRules') {
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/checkin/getcorpcheckinoption',
					{},
				);
			} else if (operation === 'getUserRules') {
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/getcheckinoption', {
					datetime: timestamp(this, this.getNodeParameter('datetime', i), '规则日期', i),
					useridlist: useridlistParameter(this, i),
				});
			} else if (operation === 'getCheckinData') {
				const range = timeRange(
					this,
					this.getNodeParameter('starttime', i),
					this.getNodeParameter('endtime', i),
					'打卡记录',
					i,
					30 * DAY_SECONDS,
				);
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/getcheckindata', {
					opencheckindatatype: integer(
						this,
						this.getNodeParameter('opencheckindatatype', i, 3),
						'打卡类型',
						i,
						1,
						3,
					),
					...range,
					useridlist: useridlistParameter(this, i),
				});
			} else if (operation === 'getDailyReport' || operation === 'getMonthlyReport') {
				const label = operation === 'getDailyReport' ? '打卡日报' : '打卡月报';
				const endpoint =
					operation === 'getDailyReport'
						? '/cgi-bin/checkin/getcheckin_daydata'
						: '/cgi-bin/checkin/getcheckin_monthdata';
				response = await weComApiRequest.call(this, 'POST', endpoint, {
					...timeRange(
						this,
						this.getNodeParameter('starttime', i),
						this.getNodeParameter('endtime', i),
						label,
						i,
					),
					useridlist: useridlistParameter(this, i),
				});
			} else if (operation === 'getScheduleList') {
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/checkin/getcheckinschedulist',
					{
						...timeRange(
							this,
							this.getNodeParameter('starttime', i),
							this.getNodeParameter('endtime', i),
							'排班',
							i,
							31 * DAY_SECONDS,
						),
						useridlist: useridlistParameter(this, i),
					},
				);
			} else if (operation === 'setScheduleList') {
				const groupid = integer(
					this,
					this.getNodeParameter('groupid', i),
					'打卡规则 ID',
					i,
					1,
					MAX_UINT32,
				);
				const yearmonth = integer(
					this,
					this.getNodeParameter('yearmonth', i),
					'年月',
					i,
					197001,
					999912,
				);
				const year = Math.floor(yearmonth / 100);
				const month = yearmonth % 100;
				if (month < 1 || month > 12) fail(this, '年月必须使用有效的 YYYYMM 格式', i);
				const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
				const inputMode = String(this.getNodeParameter('scheduleInputMode', i, 'form'));
				const collection = this.getNodeParameter('scheduleCollection', i, {}) as IDataObject;
				let rawSchedules: IDataObject[] = (collection.schedules as IDataObject[]) || [];
				if (inputMode === 'json' || (!rawSchedules.length && inputMode !== 'form')) {
					const parsed = parseJsonArray(
						this,
						this.getNodeParameter('scheduleListJson', i, '[]'),
						'排班信息 JSON',
						i,
					);
					if (parsed.length) rawSchedules = parsed;
				}
				if (!rawSchedules.length) fail(this, '至少添加一条排班信息', i);
				const schedules = new Map<string, IDataObject>();
				for (const [index, raw] of rawSchedules.entries()) {
					const userid = text(
						this,
						raw.userid || raw.userid_selected,
						`第 ${index + 1} 条排班成员 UserID`,
						i,
						64,
					);
					const day = integer(this, raw.day, `第 ${index + 1} 条排班日期`, i, 1, daysInMonth);
					const scheduleId = integer(
						this,
						raw.schedule_id,
						`第 ${index + 1} 条排班班次 ID`,
						i,
						0,
						MAX_UINT32,
					);
					schedules.set(`${userid}:${day}`, { userid, day, schedule_id: scheduleId });
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/checkin/setcheckinschedulist',
					{
						groupid,
						items: [...schedules.values()],
						yearmonth,
					},
				);
			} else if (operation === 'addCheckin') {
				const body: IDataObject = {
					userid: text(
						this,
						this.getNodeParameter('userid', i, '') ||
							this.getNodeParameter('userid_selected', i, ''),
						'成员 UserID',
						i,
						64,
					),
					schedule_date_time: timestamp(
						this,
						this.getNodeParameter('schedule_date_time', i),
						'应打卡日期',
						i,
					),
					checkin_time: timestamp(
						this,
						this.getNodeParameter('checkin_time', i),
						'实际打卡时间',
						i,
					),
				};
				if (this.getNodeParameter('include_schedule_checkin_time', i, false) as boolean) {
					body.schedule_checkin_time = integer(
						this,
						this.getNodeParameter('schedule_checkin_time', i, 0),
						'应打卡时间点偏移',
						i,
						0,
						MAX_UINT32,
					);
				}
				const remark = text(this, this.getNodeParameter('remark', i, ''), '备注', i, 512, false);
				if (remark) body.remark = remark;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/checkin/punch_correction',
					body,
				);
			} else if (operation === 'addCheckinRecord') {
				let records: IDataObject[];
				const inputMode = this.getNodeParameter('recordInputMode', i, 'single') as string;
				if (inputMode === 'single') {
					const raw: IDataObject = {
						userid:
							this.getNodeParameter('userid', i, '') ||
							this.getNodeParameter('userid_selected', i, ''),
						checkin_time: this.getNodeParameter('checkin_time', i),
						location_title: this.getNodeParameter('location_title', i),
						location_detail: this.getNodeParameter('location_detail', i),
						device_type: this.getNodeParameter('device_type', i),
						device_detail: this.getNodeParameter('device_detail', i),
						notes: this.getNodeParameter('notes', i, ''),
						wifiname: this.getNodeParameter('wifiname', i, ''),
						wifimac: this.getNodeParameter('wifimac', i, ''),
						mediaids: [
							this.getNodeParameter('mediaids', i, ''),
							...(() => {
								const raw = this.getNodeParameter('mediaidsJson', i, '[]');
								if (raw === undefined || raw === null || String(raw).trim() === '') {
									return [] as string[];
								}
								let parsed: unknown = raw;
								if (typeof raw === 'string') {
									try {
										parsed = JSON.parse(raw);
									} catch {
										fail(this, '附件 MediaID JSON 不是有效的 JSON', i);
									}
								}
								if (!Array.isArray(parsed)) fail(this, '附件 MediaID JSON 必须是数组', i);
								return (parsed as unknown[]).map((entry) => {
									if (typeof entry === 'string') return entry;
									if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
										const row = entry as IDataObject;
										return String(row.media_id ?? row.mediaid ?? row.id ?? '');
									}
									return '';
								});
							})(),
						],
					};
					if (this.getNodeParameter('includeCoordinates', i, false) as boolean) {
						raw.lng = this.getNodeParameter('lng', i);
						raw.lat = this.getNodeParameter('lat', i);
					}
					records = [normalizeRecord(this, raw, i, 0)];
				} else if (inputMode === 'json') {
					const parsed = jsonValue(
						this,
						this.getNodeParameter('recordsJson', i, '[]'),
						'打卡记录',
						i,
					);
					if (!Array.isArray(parsed) || parsed.length < 1 || parsed.length > 200) {
						fail(this, '打卡记录 JSON 必须是包含 1–200 个对象的数组', i);
					}
					records = parsed.map((raw, index) => {
						if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
							fail(this, `第 ${index + 1} 条打卡记录必须是对象`, i);
						}
						return normalizeRecord(this, raw as IDataObject, i, index);
					});
				} else {
					fail(this, '打卡记录输入方式只能是单条表单或批量 JSON', i);
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/add_checkin_record', {
					records,
				});
			} else if (operation === 'addFaceInfo') {
				// face image + userid dual track
				const source = this.getNodeParameter('faceSource', i, 'binary') as string;
				let userface: string;
				if (source === 'binary') {
					const binaryProperty = text(
						this,
						this.getNodeParameter('binaryProperty', i, 'data'),
						'二进制数据属性',
						i,
					);
					this.helpers.assertBinaryData(i, binaryProperty);
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryProperty);
					if (!buffer.length) fail(this, '人脸图片不能为空', i);
					if (buffer.length > 1024 * 1024) fail(this, '人脸图片不能超过 1 MiB', i);
					userface = buffer.toString('base64');
				} else if (source === 'base64') {
					userface = normalizeBase64(this, this.getNodeParameter('mediaid', i), i);
				} else {
					fail(this, '图片来源只能是 Base64 或二进制数据', i);
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/checkin/addcheckinuserface', {
					userid: text(
						this,
						this.getNodeParameter('userid', i, '') ||
							this.getNodeParameter('userid_selected', i, ''),
						'成员 UserID',
						i,
						64,
					),
					userface,
				});
			} else if (operation === 'getDeviceCheckinData') {
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/hardware/get_hardware_checkin_data',
					{
						filter_type: integer(
							this,
							this.getNodeParameter('filter_type', i, 1),
							'过滤时间类型',
							i,
							1,
							2,
						),
						...timeRange(
							this,
							this.getNodeParameter('starttime', i),
							this.getNodeParameter('endtime', i),
							'设备打卡记录',
							i,
							31 * DAY_SECONDS,
						),
						useridlist: useridlistParameter(this, i),
					},
				);
			} else if (operation === 'manageRules') {
				const action = this.getNodeParameter('action', i) as string;
				if (!['create', 'update', 'delete'].includes(action)) {
					fail(this, '规则操作类型只能是创建、更新或删除', i);
				}
				const effectiveNow = this.getNodeParameter('effective_now', i, false) as boolean;
				if (action === 'delete') {
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/checkin/del_checkin_option',
						{
							groupid: integer(
								this,
								this.getNodeParameter('groupid', i),
								'规则 ID',
								i,
								1,
								MAX_UINT32,
							),
							effective_now: effectiveNow,
						},
					);
				} else {
					const typedAction = action as 'create' | 'update';
					response = await weComApiRequest.call(
						this,
						'POST',
						typedAction === 'create'
							? '/cgi-bin/checkin/add_checkin_option'
							: '/cgi-bin/checkin/update_checkin_option',
						{ effective_now: effectiveNow, group: buildRuleGroup(this, typedAction, i) },
					);
				}
			} else if (operation === 'clearCheckinOptionArrayField') {
				const requestBody = parseRequestJson.call(this, i);
				const requestQuery = parseQueryJson.call(this, i);
				const clearFields = stringList(
					this,
					requestBody.clear_field ?? this.getNodeParameter('clear_field_ids', i, []),
					'要清空的字段',
					i,
					1,
					4,
				).map((field) => integer(this, field, '要清空的字段标识', i, 1, 4));
				const body: IDataObject = {
					...requestBody,
					groupid: integer(
						this,
						requestBody.groupid ?? this.getNodeParameter('checkin_groupid', i),
						'规则 ID',
						i,
						1,
						MAX_UINT32,
					),
					clear_field: [...new Set(clearFields)],
					effective_now: Boolean(
						requestBody.effective_now ?? this.getNodeParameter('clear_effective_now', i, false),
					),
				};
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/checkin/clear_checkin_option_array_field',
					body,
					requestQuery,
				);
			} else {
				fail(this, `不支持的打卡操作：${operation}`, i);
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
