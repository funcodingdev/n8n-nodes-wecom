import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { parseQueryJson, parseRequestJson } from '../../shared/extraHttpOp';
import { weComApiRequest } from '../../shared/transport';

const LIST_SEPARATOR = /[,，|\n\r]+/;
const MAX_UINT32 = 4294967295;
const DAY_SECONDS = 86400;
const APPLICATION_CONTROLS = new Set([
	'Text',
	'Textarea',
	'Number',
	'Money',
	'Date',
	'DateRange',
	'Selector',
	'Contact',
	'File',
	'PhoneNumber',
	'Tips',
	'RelatedApproval',
	'Location',
	'Vacation',
	'Attendance',
	'Table',
	'Formula',
]);
const TEMPLATE_CONTROLS = new Set([
	'Text',
	'Textarea',
	'Number',
	'Money',
	'Date',
	'Selector',
	'Contact',
	'Tips',
	'File',
	'Table',
	'Location',
	'RelatedApproval',
	'DateRange',
	'PhoneNumber',
	'Vacation',
	'Attendance',
	'BankAccount',
]);

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

function characters(
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

function isNonEmptyObject(value: unknown): value is IDataObject {
	return Boolean(
		value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length,
	);
}

function timeRange(
	context: IExecuteFunctions,
	startValue: unknown,
	endValue: unknown,
	label: string,
	itemIndex: number,
	maxDays: number,
): { starttime: number; endtime: number } {
	const starttime = timestamp(context, startValue, `${label}开始时间`, itemIndex);
	const endtime = timestamp(context, endValue, `${label}结束时间`, itemIndex);
	if (endtime <= starttime) fail(context, `${label}结束时间必须晚于开始时间`, itemIndex);
	if (endtime - starttime > maxDays * DAY_SECONDS) {
		fail(context, `${label}时间跨度不能超过 ${maxDays} 天`, itemIndex);
	}
	return { starttime, endtime };
}

function httpUrl(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string {
	const raw = text(context, value, label, itemIndex, 2048);
	let parsed: URL;
	try {
		parsed = new URL(raw);
	} catch {
		fail(context, `${label}必须是完整的 HTTP 或 HTTPS 地址`, itemIndex);
	}
	if (!['http:', 'https:'].includes(parsed.protocol)) {
		fail(context, `${label}必须以 http:// 或 https:// 开头`, itemIndex);
	}
	return raw;
}

function buildApplicationContents(
	context: IExecuteFunctions,
	collection: IDataObject,
	itemIndex: number,
): IDataObject[] {
	const rawContents = (collection.contents as IDataObject[]) || [];
	const contents: IDataObject[] = [];
	const ids = new Set<string>();
	let totalFiles = 0;
	for (const [index, raw] of rawContents.entries()) {
		const control = String(raw.control ?? 'Text');
		if (!APPLICATION_CONTROLS.has(control)) {
			fail(
				context,
				`第 ${index + 1} 个申请控件类型不受表单支持，请改用申请表单数据 JSON`,
				itemIndex,
			);
		}
		const id = text(context, raw.id, `第 ${index + 1} 个申请控件 ID`, itemIndex, 128);
		if (ids.has(id)) fail(context, `申请控件 ID 重复：${id}`, itemIndex);
		ids.add(id);
		const value: IDataObject = {};
		if (control === 'Text' || control === 'Textarea' || control === 'PhoneNumber') {
			const input = String(raw.text ?? '');
			if (control === 'Text' && /[\r\n]/.test(input))
				fail(context, '文本控件内容不能包含换行', itemIndex);
			value.text = input;
		} else if (control === 'Number' || control === 'Money') {
			const input = String(control === 'Money' ? (raw.new_money ?? '') : (raw.text ?? '')).trim();
			if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(input)) {
				fail(
					context,
					`第 ${index + 1} 个${control === 'Money' ? '金额' : '数字'}控件值不是有效数字`,
					itemIndex,
				);
			}
			value[control === 'Money' ? 'new_money' : 'new_number'] = input;
		} else if (control === 'Date') {
			const type = String(raw.date_type ?? 'day');
			if (!['day', 'hour'].includes(type))
				fail(context, '日期控件类型只能是 day 或 hour', itemIndex);
			value.date = {
				type,
				s_timestamp: String(
					timestamp(context, raw.date_s, `第 ${index + 1} 个日期控件时间`, itemIndex),
				),
			};
		} else if (control === 'DateRange') {
			const type = String(raw.date_range_type ?? 'halfday');
			if (!['halfday', 'hour'].includes(type))
				fail(context, '时长控件类型只能是 halfday 或 hour', itemIndex);
			const begin = timestamp(
				context,
				raw.date_range_begin,
				`第 ${index + 1} 个时长控件开始时间`,
				itemIndex,
			);
			const end = timestamp(
				context,
				raw.date_range_end,
				`第 ${index + 1} 个时长控件结束时间`,
				itemIndex,
			);
			if (end <= begin)
				fail(context, `第 ${index + 1} 个时长控件结束时间必须晚于开始时间`, itemIndex);
			value.date_range = {
				type,
				new_begin: begin,
				new_end: end,
				new_duration: integer(
					context,
					raw.date_range_duration,
					`第 ${index + 1} 个时长控件时长`,
					itemIndex,
					1,
					MAX_UINT32,
				),
			};
		} else if (control === 'Selector') {
			const type = String(raw.selector_type ?? 'single');
			if (!['single', 'multi'].includes(type))
				fail(context, '选择控件类型只能是 single 或 multi', itemIndex);
			const keys = stringList(
				context,
				raw.selector_keys,
				`第 ${index + 1} 个选择控件选项`,
				itemIndex,
				1,
				100,
			);
			if (type === 'single' && keys.length !== 1)
				fail(context, '单选控件只能选择一个选项', itemIndex);
			value.selector = { type, options: keys.map((key) => ({ key })) };
		} else if (control === 'Contact') {
			const kind = String(raw.contact_kind ?? 'members');
			if (kind === 'members') {
				value.members = stringList(
					context,
					[raw.contact_userids, raw.contact_userids_selected],
					`第 ${index + 1} 个成员控件`,
					itemIndex,
					1,
					1000,
				).map((userid) => ({ userid: text(context, userid, '成员 UserID', itemIndex, 64) }));
			} else if (kind === 'departments') {
				value.departments = stringList(
					context,
					[raw.contact_partyids, raw.contact_partyids_selected],
					`第 ${index + 1} 个部门控件`,
					itemIndex,
					1,
					1000,
				).map((openapiId) => ({ openapi_id: text(context, openapiId, '部门 ID', itemIndex, 64) }));
			} else {
				fail(context, '联系人类型只能是成员或部门', itemIndex);
			}
		} else if (control === 'File') {
			const files = stringList(
				context,
				raw.file_mediaids,
				`第 ${index + 1} 个附件控件`,
				itemIndex,
				1,
				6,
			);
			totalFiles += files.length;
			if (totalFiles > 6) fail(context, '一个审批申请单全局最多上传 6 个附件', itemIndex);
			value.files = files.map((fileId) => ({
				file_id: text(context, fileId, '附件 MediaID', itemIndex),
			}));
		} else if (control === 'RelatedApproval') {
			const spNos = stringList(
				context,
				raw.related_sp_nos,
				`第 ${index + 1} 个关联审批单号`,
				itemIndex,
				1,
				100,
			);
			value.related_approval = spNos.map((spNo) => ({
				sp_no: text(context, spNo, '关联审批单号', itemIndex, 64),
			}));
		} else if (control === 'Location') {
			value.location = {
				latitude: text(context, raw.location_latitude, '纬度', itemIndex, 32),
				longitude: text(context, raw.location_longitude, '经度', itemIndex, 32),
				title: text(context, raw.location_title, '地点标题', itemIndex, 128),
				address: text(context, raw.location_address, '地点详情', itemIndex, 256, false),
				time: timestamp(context, raw.location_time, `第 ${index + 1} 个位置控件时间`, itemIndex),
			};
		} else if (control === 'Vacation' || control === 'Attendance') {
			const rangeType = String(raw.attendance_range_type ?? 'hour');
			if (!['halfday', 'hour'].includes(rangeType)) {
				fail(context, '假勤时长类型只能是 halfday 或 hour', itemIndex);
			}
			const begin = timestamp(
				context,
				raw.attendance_begin,
				`第 ${index + 1} 个假勤开始时间`,
				itemIndex,
			);
			const end = timestamp(
				context,
				raw.attendance_end,
				`第 ${index + 1} 个假勤结束时间`,
				itemIndex,
			);
			if (end <= begin) fail(context, `第 ${index + 1} 个假勤结束时间必须晚于开始时间`, itemIndex);
			const duration = integer(
				context,
				raw.attendance_duration ?? 0,
				`第 ${index + 1} 个假勤时长`,
				itemIndex,
				0,
				MAX_UINT32,
			);
			const attendanceType =
				control === 'Vacation'
					? 1
					: integer(context, raw.attendance_type ?? 3, '假勤类型', itemIndex, 1, 5);
			if (control === 'Attendance' && ![3, 4, 5].includes(attendanceType)) {
				fail(context, 'Attendance 控件类型只能是 3(出差)/4(外出)/5(加班)', itemIndex);
			}
			const attendance: IDataObject = {
				date_range: {
					type: rangeType,
					new_begin: begin,
					new_end: end,
					new_duration: duration,
				},
				type: attendanceType,
			};
			if (control === 'Attendance') {
				const sliceInfo = jsonObject(
					context,
					raw.attendance_slice_info_json ?? '{}',
					`第 ${index + 1} 个假勤分片`,
					itemIndex,
				);
				if (isNonEmptyObject(sliceInfo)) attendance.slice_info = sliceInfo;
			}
			if (control === 'Vacation') {
				const selectorKey = text(
					context,
					raw.vacation_selector_key,
					`第 ${index + 1} 个请假类型 Key`,
					itemIndex,
					64,
				);
				value.vacation = {
					selector: {
						type: 'single',
						options: [{ key: selectorKey }],
						exp_type: 0,
					},
					attendance,
				};
			} else {
				value.attendance = attendance;
			}
		} else if (control === 'Table') {
			const children = jsonValue(
				context,
				raw.table_children_json ?? '[]',
				`第 ${index + 1} 个明细控件 children`,
				itemIndex,
			);
			if (!Array.isArray(children) || children.length < 1) {
				fail(context, `第 ${index + 1} 个明细控件至少需要一行子明细`, itemIndex);
			}
			for (const [rowIndex, row] of children.entries()) {
				if (!row || typeof row !== 'object' || Array.isArray(row)) {
					fail(context, `明细第 ${rowIndex + 1} 行必须是包含 list 的对象`, itemIndex);
				}
				const list = (row as IDataObject).list;
				if (!Array.isArray(list) || list.length < 1) {
					fail(context, `明细第 ${rowIndex + 1} 行 list 不能为空`, itemIndex);
				}
			}
			value.children = children as IDataObject[];
		} else if (control === 'Formula') {
			value.formula = {
				value: text(context, raw.formula_value, `第 ${index + 1} 个公式结果`, itemIndex, 128),
			};
		}
		contents.push({ control, id, value });
	}
	return contents;
}

function buildTemplateControls(
	context: IExecuteFunctions,
	collection: IDataObject,
	language: string,
	itemIndex: number,
): IDataObject[] {
	const rawControls = (collection.controls as IDataObject[]) || [];
	const ids = new Set<string>();
	const titles = new Set<string>();
	let hasAttendanceControl = false;
	return rawControls.map((raw, index) => {
		const control = String(raw.control ?? 'Text');
		if (!TEMPLATE_CONTROLS.has(control))
			fail(context, `第 ${index + 1} 个模板控件类型不受支持`, itemIndex);
		const id = text(context, raw.id, `第 ${index + 1} 个模板控件 ID`, itemIndex, 128);
		if (!new RegExp(`^${control}-\\d+$`).test(id)) {
			fail(context, `模板控件 ID 必须使用 ${control}-数字 格式`, itemIndex);
		}
		if (ids.has(id)) fail(context, `模板控件 ID 重复：${id}`, itemIndex);
		ids.add(id);
		const title = characters(context, raw.title, `第 ${index + 1} 个模板控件标题`, itemIndex, 40);
		if (titles.has(title)) fail(context, `模板控件标题重复：${title}`, itemIndex);
		titles.add(title);
		const property: IDataObject = {
			control,
			id,
			title: [{ text: title, lang: language }],
			require: raw.require ? 1 : 0,
			un_print: raw.un_print ? 1 : 0,
		};
		const placeholder = characters(
			context,
			raw.placeholder,
			`第 ${index + 1} 个模板控件占位说明`,
			itemIndex,
			80,
			false,
		);
		if (placeholder) {
			if (['Vacation', 'Attendance'].includes(control))
				fail(context, '假勤控件不支持占位说明', itemIndex);
			property.placeholder = [{ text: placeholder, lang: language }];
		}
		if (['Vacation', 'Attendance'].includes(control)) {
			if (hasAttendanceControl) fail(context, '一个模板中只能有一类假勤控件', itemIndex);
			hasAttendanceControl = true;
			property.require = 1;
			property.un_print = 0;
		}

		const customConfig = jsonObject(
			context,
			raw.control_config_json ?? '{}',
			`第 ${index + 1} 个模板控件配置`,
			itemIndex,
		);
		let config: IDataObject = {};
		if (isNonEmptyObject(customConfig)) {
			config = customConfig;
		} else if (control === 'Selector') {
			const type = String(raw.selector_type ?? 'single');
			if (!['single', 'multi'].includes(type))
				fail(context, '选择器类型只能是 single 或 multi', itemIndex);
			const options = stringList(
				context,
				raw.selector_options,
				`第 ${index + 1} 个选择器选项`,
				itemIndex,
				1,
				100,
			).map((optionText, optionIndex) => ({
				key: `option-${optionIndex + 1}`,
				value: { text: optionText, lang: language },
			}));
			config.selector = { type, options };
		} else if (control === 'Date') {
			const type = String(raw.date_type ?? 'day');
			if (!['day', 'hour'].includes(type))
				fail(context, '日期控件类型只能是 day 或 hour', itemIndex);
			config.date = { type };
		} else if (control === 'Contact') {
			const type = String(raw.contact_type ?? 'single');
			const mode = String(raw.contact_mode ?? 'user');
			if (!['single', 'multi'].includes(type))
				fail(context, '联系人选择类型只能是 single 或 multi', itemIndex);
			if (!['user', 'department'].includes(mode))
				fail(context, '联系人模式只能是 user 或 department', itemIndex);
			config.contact = { type, mode };
		} else if (control === 'File') {
			config.file = { is_only_photo: raw.file_is_only_photo ? 1 : 0 };
		} else if (control === 'DateRange') {
			const type = String(raw.date_range_type ?? 'halfday');
			if (!['halfday', 'hour'].includes(type))
				fail(context, '时长粒度只能是 halfday 或 hour', itemIndex);
			config.date_range = {
				type,
				official_holiday: raw.date_range_official_holiday ? 1 : 0,
				perday_duration: integer(
					context,
					raw.date_range_perday_duration ?? 86400,
					'每天时长',
					itemIndex,
					1,
					86400,
				),
			};
		} else if (control === 'Location') {
			const distance = integer(
				context,
				raw.location_distance ?? 100,
				'位置距离',
				itemIndex,
				100,
				300,
			);
			if (![100, 200, 300].includes(distance))
				fail(context, '位置距离只能是 100、200 或 300 米', itemIndex);
			config.location = { distance };
		} else if (control === 'RelatedApproval') {
			config.related_approval = {
				template_id: stringList(
					context,
					raw.related_template_ids,
					'可关联模板 ID',
					itemIndex,
					0,
					100,
				),
			};
		} else if (['Table', 'Tips', 'Attendance'].includes(control)) {
			fail(context, `${control} 控件必须填写完整的控件配置 JSON`, itemIndex);
		}
		return { property, config };
	});
}

function validateTemplateBody(
	context: IExecuteFunctions,
	body: IDataObject,
	itemIndex: number,
): void {
	if (!Array.isArray(body.template_name) || !body.template_name.length) {
		fail(context, '模板名称不能为空', itemIndex);
	}
	for (const name of body.template_name as IDataObject[]) {
		characters(context, name.text, '模板名称', itemIndex, 40);
		if (!['zh_CN', 'en'].includes(String(name.lang)))
			fail(context, '模板名称语言只能是 zh_CN 或 en', itemIndex);
	}
	const content = body.template_content;
	if (!content || typeof content !== 'object' || Array.isArray(content)) {
		fail(context, '模板控件内容必须是对象', itemIndex);
	}
	const controls = (content as IDataObject).controls;
	if (!Array.isArray(controls) || !controls.length)
		fail(context, '模板至少需要一个控件', itemIndex);
}

function normalizeAdvancedNodes(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject[] {
	if (!Array.isArray(value) || !value.length) fail(context, '审批节点必须是非空数组', itemIndex);
	return value.map((raw, index) => {
		if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
			fail(context, `第 ${index + 1} 个审批节点必须是对象`, itemIndex);
		}
		const node = raw as IDataObject;
		const current = stringList(
			context,
			node.current_approvers,
			'当前审批人',
			itemIndex,
			0,
			100,
		).map((id) => text(context, id, '当前审批人 UserID', itemIndex, 64));
		const completed = stringList(
			context,
			node.completed_approvers,
			'已处理审批人',
			itemIndex,
			0,
			100,
		).map((id) => text(context, id, '已处理审批人 UserID', itemIndex, 64));
		if (!current.length && !completed.length)
			fail(context, `第 ${index + 1} 个审批节点的审批人不能为空`, itemIndex);
		const normalized: IDataObject = {
			node_apv_status: integer(context, node.node_apv_status, '审批节点状态', itemIndex, 1, 102),
			node_apv_rel: integer(context, node.node_apv_rel, '多人审批方式', itemIndex, 1, 3),
		};
		if (![1, 2, 3, 101, 102].includes(Number(normalized.node_apv_status))) {
			fail(context, '审批节点状态不受支持', itemIndex);
		}
		if (current.length) normalized.current_approvers = current;
		if (completed.length) normalized.completed_approvers = completed;
		if (node.apv_update_time !== undefined && String(node.apv_update_time).trim()) {
			normalized.apv_update_time = timestamp(
				context,
				node.apv_update_time,
				'审批节点更新时间',
				itemIndex,
			);
		}
		return normalized;
	});
}

export async function executeApproval(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			if (operation === 'getTemplateDetail') {
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/gettemplatedetail', {
					template_id: text(this, this.getNodeParameter('template_id', i), '模板 ID', i, 128),
				});
			} else if (operation === 'submitApproval') {
				const useTemplateApprover = integer(
					this,
					this.getNodeParameter('use_template_approver', i, 1),
					'审批人模式',
					i,
					0,
					1,
				);
				const body: IDataObject = {
					creator_userid: text(
						this,
						this.getNodeParameter('creator_userid', i),
						'申请人 UserID',
						i,
						64,
					),
					template_id: text(this, this.getNodeParameter('template_id', i), '模板 ID', i, 128),
					use_template_approver: useTemplateApprover,
				};
				const department = integer(
					this,
					this.getNodeParameter('choose_department', i, 0),
					'提单部门 ID',
					i,
					0,
					MAX_UINT32,
				);
				if (department) body.choose_department = department;

				const applyDataJson = jsonObject(
					this,
					this.getNodeParameter('apply_data_json', i, '{}'),
					'申请表单数据',
					i,
				);
				if (isNonEmptyObject(applyDataJson)) {
					body.apply_data = applyDataJson;
				} else {
					const contents = buildApplicationContents(
						this,
						this.getNodeParameter('applyContentsCollection', i, {}) as IDataObject,
						i,
					);
					if (!contents.length) fail(this, '请填写申请表单控件值或申请表单数据 JSON', i);
					body.apply_data = { contents };
				}

				const summaryCollection = this.getNodeParameter('summaryLines', i, {}) as IDataObject;
				const rawLines = (summaryCollection.lines as IDataObject[]) || [];
				if (rawLines.length < 1 || rawLines.length > 3) fail(this, '摘要必须填写 1–3 行', i);
				body.summary_list = rawLines.map((line, index) => {
					const lang = String(line.lang ?? 'zh_CN');
					if (!['zh_CN', 'en'].includes(lang)) fail(this, '摘要语言只能是 zh_CN 或 en', i);
					return {
						summary_info: [
							{
								text: characters(this, line.text, `第 ${index + 1} 行摘要`, i, 20),
								lang,
							},
						],
					};
				});

				if (useTemplateApprover === 0) {
					const processCollection = this.getNodeParameter(
						'processNodeCollection',
						i,
						{},
					) as IDataObject;
					const rawNodes = (processCollection.nodes as IDataObject[]) || [];
					if (!rawNodes.length) fail(this, '接口指定审批人时必须添加审批流程节点', i);
					body.process = {
						node_list: rawNodes.map((raw, index) => {
							const type = integer(this, raw.type ?? 1, '流程节点类型', i, 1, 3);
							const node: IDataObject = {
								type,
								userid: stringList(
									this,
									[raw.userid_list, raw.userid_list_selected],
									`第 ${index + 1} 个节点成员`,
									i,
									1,
									100,
								).map((userid) => text(this, userid, '节点成员 UserID', i, 64)),
							};
							if (type === 1 || type === 3) {
								node.apv_rel = integer(this, raw.apv_rel ?? 1, '多人审批方式', i, 1, 3);
							}
							return node;
						}),
					};
				}
				Object.assign(
					body,
					jsonObject(this, this.getNodeParameter('approvalExtraJson', i, '{}'), '扩展请求', i),
				);
				if (!isNonEmptyObject(body.apply_data)) fail(this, '申请表单数据不能为空', i);
				if (!Array.isArray(body.summary_list) || !body.summary_list.length)
					fail(this, '摘要信息不能为空', i);
				const finalApproverMode = integer(this, body.use_template_approver, '审批人模式', i, 0, 1);
				if (finalApproverMode === 0 && !isNonEmptyObject(body.process)) {
					fail(this, '接口指定审批人时 process 必填', i);
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/applyevent', body);
			} else if (operation === 'getApprovalSpNoList') {
				const body: IDataObject = {
					...timeRange(
						this,
						this.getNodeParameter('starttime', i),
						this.getNodeParameter('endtime', i),
						'审批单查询',
						i,
						31,
					),
					new_cursor: text(
						this,
						this.getNodeParameter('new_cursor', i, ''),
						'新游标',
						i,
						4096,
						false,
					),
					size: integer(this, this.getNodeParameter('size', i, 100), '拉取数量', i, 1, 100),
				};
				if (this.getNodeParameter('enableFilters', i, false) as boolean) {
					const collection = this.getNodeParameter('filtersCollection', i, {}) as IDataObject;
					const rawFilters = (collection.filters as IDataObject[]) || [];
					if (!rawFilters.length) fail(this, '启用筛选后至少添加一个筛选条件', i);
					const seen = new Set<string>();
					body.filters = rawFilters.map((raw) => {
						const key = String(raw.key ?? '');
						if (
							!['template_id', 'creator', 'department', 'sp_status', 'record_type'].includes(key)
						) {
							fail(this, '审批筛选类型不受支持', i);
						}
						if (key !== 'department' && seen.has(key)) {
							fail(this, '只有部门筛选条件允许重复配置', i);
						}
						seen.add(key);
						return { key, value: text(this, raw.value, '审批筛选值', i, 256) };
					});
				}
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/getapprovalinfo', body);
			} else if (operation === 'getApprovalDetail') {
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/getapprovaldetail', {
					sp_no: text(this, this.getNodeParameter('sp_no', i), '审批单号', i, 128),
				});
			} else if (operation === 'getOpenApprovalData') {
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/corp/getopenapprovaldata', {
					thirdNo: text(this, this.getNodeParameter('thirdNo', i), '第三方审批单号', i, 128),
				});
			} else if (operation === 'getVacationConfig') {
				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/oa/vacation/getcorpconf', {});
			} else if (operation === 'getVacationQuota') {
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/vacation/getuservacationquota',
					{
						userid: text(
							this,
							this.getNodeParameter('userid', i, '') ||
								this.getNodeParameter('userid_selected', i, ''),
							'成员 UserID',
							i,
							64,
						),
					},
				);
			} else if (operation === 'setVacationQuota') {
				const timeAttr = integer(
					this,
					this.getNodeParameter('time_attr', i, 0),
					'假期时间刻度',
					i,
					0,
					1,
				);
				const leftduration = integer(
					this,
					this.getNodeParameter('leftduration', i),
					'剩余假期时长',
					i,
					0,
					86400000,
				);
				const step = timeAttr === 0 ? 8640 : 360;
				if (leftduration % step !== 0) {
					fail(this, `剩余假期时长必须是 ${step} 秒的整数倍`, i);
				}
				const body: IDataObject = {
					userid: text(
						this,
						this.getNodeParameter('userid', i, '') ||
							this.getNodeParameter('userid_selected', i, ''),
						'成员 UserID',
						i,
						64,
					),
					vacation_id: integer(
						this,
						this.getNodeParameter('vacation_id', i),
						'假期配置 ID',
						i,
						1,
						MAX_UINT32,
					),
					leftduration,
					time_attr: timeAttr,
				};
				const remarks = characters(
					this,
					this.getNodeParameter('remarks', i, ''),
					'备注',
					i,
					200,
					false,
				);
				if (remarks) body.remarks = remarks;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/oa/vacation/setoneuserquota',
					body,
				);
			} else if (operation === 'createApprovalTemplate' || operation === 'updateApprovalTemplate') {
				const language = String(this.getNodeParameter('template_name_lang', i, 'zh_CN'));
				if (!['zh_CN', 'en'].includes(language)) fail(this, '模板名称语言只能是 zh_CN 或 en', i);
				const body: IDataObject = {
					template_name: [
						{
							text: characters(
								this,
								this.getNodeParameter('template_name_text', i),
								'模板名称',
								i,
								40,
							),
							lang: language,
						},
					],
				};
				if (operation === 'updateApprovalTemplate') {
					body.template_id = text(this, this.getNodeParameter('template_id', i), '模板 ID', i, 128);
				}
				const contentJson = jsonObject(
					this,
					this.getNodeParameter('template_content_json', i, '{}'),
					'模板控件内容',
					i,
				);
				if (isNonEmptyObject(contentJson)) {
					body.template_content = contentJson;
				} else {
					const controls = buildTemplateControls(
						this,
						this.getNodeParameter('templateControlsCollection', i, {}) as IDataObject,
						language,
						i,
					);
					if (!controls.length) fail(this, '模板至少需要一个控件', i);
					body.template_content = { controls };
				}
				Object.assign(
					body,
					jsonObject(this, this.getNodeParameter('templateExtraJson', i, '{}'), '模板扩展请求', i),
				);
				validateTemplateBody(this, body, i);
				response = await weComApiRequest.call(
					this,
					'POST',
					operation === 'createApprovalTemplate'
						? '/cgi-bin/oa/approval/create_template'
						: '/cgi-bin/oa/approval/update_template',
					body,
				);
			} else if (operation === 'getapprovaldata') {
				const requestBody = parseRequestJson.call(this, i);
				const requestQuery = parseQueryJson.call(this, i);
				const body: IDataObject = {
					...requestBody,
					...timeRange(
						this,
						requestBody.starttime ?? this.getNodeParameter('appr_starttime', i),
						requestBody.endtime ?? this.getNodeParameter('appr_endtime', i),
						'旧版审批数据',
						i,
						30,
					),
				};
				const nextSpnum = text(
					this,
					requestBody.next_spnum ?? this.getNodeParameter('next_spnum', i, ''),
					'下一条审批单号',
					i,
					128,
					false,
				);
				if (nextSpnum) body.next_spnum = nextSpnum;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/corp/getapprovaldata',
					body,
					requestQuery,
				);
			} else if (operation === 'advancedFeatureGetApplyIdList') {
				const requestBody = parseRequestJson.call(this, i);
				const requestQuery = parseQueryJson.call(this, i);
				const body: IDataObject = {
					...requestBody,
					business_type: integer(
						this,
						requestBody.business_type ?? this.getNodeParameter('af_business_type', i, 1),
						'高级账号类型',
						i,
						1,
						4,
					),
					userid: text(
						this,
						requestBody.userid ?? this.getNodeParameter('af_userid', i),
						'申请人 UserID',
						i,
						64,
					),
					limit: integer(
						this,
						requestBody.limit ?? this.getNodeParameter('af_limit', i, 100),
						'分页条数',
						i,
						1,
						200,
					),
					req_type: integer(
						this,
						requestBody.req_type ?? this.getNodeParameter('af_req_type', i, 0),
						'申请单类型',
						i,
						0,
						2,
					),
				};
				const cursor = text(
					this,
					requestBody.cursor ?? this.getNodeParameter('af_cursor', i, ''),
					'游标',
					i,
					4096,
					false,
				);
				if (cursor) body.cursor = cursor;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/advanced_feature/get_apply_id_list',
					body,
					requestQuery,
				);
			} else if (operation === 'advancedFeatureSetApprovalDetail') {
				const requestBody = parseRequestJson.call(this, i);
				const requestQuery = parseQueryJson.call(this, i);
				const formCollection = this.getNodeParameter(
					'afProcessNodesCollection',
					i,
					{},
				) as IDataObject;
				let rawNodes: unknown = (formCollection.nodes as IDataObject[]) || [];
				const nodeJson = jsonValue(
					this,
					this.getNodeParameter('af_process_node_list_json', i, '[]'),
					'审批节点扩展',
					i,
				);
				if (!Array.isArray(nodeJson)) fail(this, '审批节点扩展 JSON 必须是数组', i);
				if (nodeJson.length) rawNodes = nodeJson;
				if (isNonEmptyObject(requestBody.process_list)) {
					rawNodes = (requestBody.process_list as IDataObject).node_list;
				}
				const body: IDataObject = {
					...requestBody,
					apply_id: text(
						this,
						requestBody.apply_id ?? this.getNodeParameter('af_apply_id', i),
						'申请 ID',
						i,
						128,
					),
					approval_id: text(
						this,
						requestBody.approval_id ?? this.getNodeParameter('af_approval_id', i),
						'审批 ID',
						i,
						128,
					),
					approval_status: integer(
						this,
						requestBody.approval_status ?? this.getNodeParameter('af_approval_status', i, 1),
						'审批状态',
						i,
						1,
						101,
					),
					approval_url: httpUrl(
						this,
						requestBody.approval_url ?? this.getNodeParameter('af_approval_url', i),
						'审批跳转链接',
						i,
					),
					process_list: { node_list: normalizeAdvancedNodes(this, rawNodes, i) },
				};
				if (![1, 2, 3, 101].includes(Number(body.approval_status))) {
					fail(this, '审批状态不受支持', i);
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/advanced_feature/set_approval_detail',
					body,
					requestQuery,
				);
			} else {
				fail(this, `不支持的审批操作：${operation}`, i);
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
