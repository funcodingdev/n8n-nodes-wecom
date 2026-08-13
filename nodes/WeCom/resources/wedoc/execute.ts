import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const WEDOC_OPERATIONS = new Set([
	'createDoc', 'renameDoc', 'deleteDoc', 'getDocInfo', 'shareDoc', 'modDocContent',
	'getDocData', 'modSheetContent', 'getSheetRange', 'getSheetData', 'addSmartsheetSheet',
	'delSmartsheetSheet', 'updateSmartsheetSheet', 'addSmartsheetView', 'delSmartsheetView',
	'updateSmartsheetView', 'addSmartsheetField', 'delSmartsheetField',
	'updateSmartsheetField', 'addSmartsheetRecord', 'delSmartsheetRecord',
	'updateSmartsheetRecord', 'sendSmartsheetWebhook', 'querySmartsheetSheet',
	'querySmartsheetView', 'querySmartsheetField', 'querySmartsheetRecord',
	'getSmartsheetGroupChatList', 'getSmartsheetGroupChat', 'updateSmartsheetGroupChat',
	'getDocAuth', 'modDocMemberRule', 'modDocShareScope', 'modDocSafeRule',
	'manageSmartsheetAuth', 'getSheetPriv', 'createPrivRule', 'updateSheetPrivFull',
	'modPrivRuleMember', 'deletePrivRule', 'addFieldGroup', 'updateFieldGroup',
	'deleteFieldGroups', 'getFieldGroups', 'createForm', 'modForm', 'getFormInfo',
	'getFormStatistic', 'getFormAnswer', 'allocateAdvancedAccount',
	'deallocateAdvancedAccount', 'getAdvancedAccountList', 'uploadDocImage',
]);

const DOCID_OPERATIONS = new Set([
	'getDocInfo', 'modDocContent', 'getDocData', 'modSheetContent', 'getSheetRange',
	'getSheetData', 'addSmartsheetSheet', 'delSmartsheetSheet', 'updateSmartsheetSheet',
	'addSmartsheetView', 'delSmartsheetView', 'updateSmartsheetView', 'addSmartsheetField',
	'delSmartsheetField', 'updateSmartsheetField', 'addSmartsheetRecord',
	'delSmartsheetRecord', 'updateSmartsheetRecord', 'querySmartsheetSheet',
	'querySmartsheetView', 'querySmartsheetField', 'querySmartsheetRecord',
	'getSmartsheetGroupChatList', 'getSmartsheetGroupChat', 'updateSmartsheetGroupChat',
	'getDocAuth', 'modDocMemberRule', 'modDocShareScope', 'modDocSafeRule',
	'manageSmartsheetAuth', 'getSheetPriv', 'createPrivRule', 'updateSheetPrivFull',
	'modPrivRuleMember', 'deletePrivRule', 'addFieldGroup', 'updateFieldGroup',
	'deleteFieldGroups', 'getFieldGroups', 'uploadDocImage',
]);

const SHEET_ID_OPERATIONS = new Set([
	'getSheetData', 'delSmartsheetSheet', 'updateSmartsheetSheet', 'addSmartsheetView',
	'delSmartsheetView', 'updateSmartsheetView', 'addSmartsheetField', 'delSmartsheetField',
	'updateSmartsheetField', 'addSmartsheetRecord', 'delSmartsheetRecord',
	'updateSmartsheetRecord', 'querySmartsheetView', 'querySmartsheetField',
	'querySmartsheetRecord', 'manageSmartsheetAuth', 'addFieldGroup', 'updateFieldGroup',
	'deleteFieldGroups', 'getFieldGroups',
]);

const LIST_SEPARATOR = /[,，|\n\r]+/;
const SMARTSHEET_FIELD_TYPES = new Set([
	'FIELD_TYPE_TEXT', 'FIELD_TYPE_NUMBER', 'FIELD_TYPE_CHECKBOX', 'FIELD_TYPE_DATE_TIME',
	'FIELD_TYPE_IMAGE', 'FIELD_TYPE_ATTACHMENT', 'FIELD_TYPE_USER', 'FIELD_TYPE_URL',
	'FIELD_TYPE_SELECT', 'FIELD_TYPE_CREATED_USER', 'FIELD_TYPE_MODIFIED_USER',
	'FIELD_TYPE_CREATED_TIME', 'FIELD_TYPE_MODIFIED_TIME', 'FIELD_TYPE_PROGRESS',
	'FIELD_TYPE_PHONE_NUMBER', 'FIELD_TYPE_EMAIL', 'FIELD_TYPE_SINGLE_SELECT',
	'FIELD_TYPE_REFERENCE', 'FIELD_TYPE_LOCATION', 'FIELD_TYPE_CURRENCY', 'FIELD_TYPE_WWGROUP',
	'FIELD_TYPE_AUTONUMBER', 'FIELD_TYPE_PERCENTAGE', 'FIELD_TYPE_BARCODE',
]);
const SMARTSHEET_VIEW_TYPES = new Set([
	'VIEW_TYPE_GRID',
	'VIEW_TYPE_KANBAN',
	'VIEW_TYPE_GALLERY',
	'VIEW_TYPE_GANTT',
	'VIEW_TYPE_CALENDAR',
]);
const FORM_QUESTION_TYPES = new Set([1, 2, 3, 5, 9, 10, 11, 14, 15, 16, 17, 18, 19, 22]);
const SMARTSHEET_VALUE_TYPES = new Set([
	'text',
	'number',
	'checkbox',
	'date_time',
	'image',
	'attachment',
	'user',
	'url',
	'select',
	'multi_select',
	'single_select',
	'progress',
	'phone_number',
	'email',
	'location',
	'currency',
	'percentage',
	'barcode',
]);
const SMARTSHEET_REQUIRED_FIELD_PROPERTY: Record<string, string> = {
	FIELD_TYPE_NUMBER: 'property_number',
	FIELD_TYPE_DATE_TIME: 'property_date_time',
	FIELD_TYPE_URL: 'property_url',
	FIELD_TYPE_SELECT: 'property_select',
	FIELD_TYPE_CREATED_TIME: 'property_created_time',
	FIELD_TYPE_MODIFIED_TIME: 'property_modified_time',
	FIELD_TYPE_PROGRESS: 'property_progress',
	FIELD_TYPE_SINGLE_SELECT: 'property_single_select',
	FIELD_TYPE_REFERENCE: 'property_reference',
	FIELD_TYPE_LOCATION: 'property_location',
	FIELD_TYPE_AUTONUMBER: 'property_auto_number',
	FIELD_TYPE_CURRENCY: 'property_currency',
};

function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function requiredText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxLength = 1024,
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	if (text.length > maxLength) fail(context, `${label}不能超过 ${maxLength} 个字符`, itemIndex);
	return text;
}

function optionalText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maxLength = 1024,
): string {
	const text = String(value ?? '').trim();
	if (text.length > maxLength) fail(context, `${label}不能超过 ${maxLength} 个字符`, itemIndex);
	return text;
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

function integerInRange(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	min: number,
	max: number,
): number {
	const number = Number(value);
	if (!Number.isSafeInteger(number) || number < min || number > max) {
		fail(context, `${label}必须是 ${min}–${max} 之间的整数`, itemIndex);
	}
	return number;
}

function weightedNameLength(value: string): number {
	return [...value].reduce((length, character) => length + (character.charCodeAt(0) > 127 ? 2 : 1), 0);
}

function assertRequiredFieldProperty(
	context: IExecuteFunctions,
	field: IDataObject,
	fieldType: string,
	itemIndex: number,
): void {
	const propertyName = SMARTSHEET_REQUIRED_FIELD_PROPERTY[fieldType];
	if (!propertyName) return;
	const property = field[propertyName];
	if (!property || Array.isArray(property) || typeof property !== 'object') {
		fail(context, `字段类型 ${fieldType} 必须提供 ${propertyName} 对象`, itemIndex);
	}
}

function assertCellValueType(
	context: IExecuteFunctions,
	valueType: unknown,
	itemIndex: number,
): string {
	const normalized = requiredText(context, valueType, '单元格值类型', itemIndex, 64);
	if (!SMARTSHEET_VALUE_TYPES.has(normalized) && !SMARTSHEET_FIELD_TYPES.has(normalized)) {
		fail(context, `不支持的单元格值类型: ${normalized}`, itemIndex);
	}
	return normalized;
}

function validateSmartsheetPrivList(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject[] {
	if (!Array.isArray(value) || value.length < 1 || value.length > 150) {
		fail(context, '子表权限列表数量必须为 1–150 个', itemIndex);
	}
	return value.map((rawItem, index) => {
		if (!rawItem || Array.isArray(rawItem) || typeof rawItem !== 'object') {
			fail(context, `第 ${index + 1} 项子表权限必须是对象`, itemIndex);
		}
		const item = rawItem as IDataObject;
		item.sheet_id = requiredText(context, item.sheet_id, `第 ${index + 1} 项子表 ID`, itemIndex);
		item.priv = integerInRange(
			context,
			item.priv,
			`第 ${index + 1} 项子表权限`,
			itemIndex,
			1,
			4,
		);
		if ([2, 3].includes(item.priv as number)) {
			if (!item.record_priv || Array.isArray(item.record_priv) || typeof item.record_priv !== 'object') {
				fail(context, `第 ${index + 1} 项可编辑/仅浏览权限必须提供 record_priv`, itemIndex);
			}
			const recordPriv = item.record_priv as IDataObject;
			recordPriv.record_range_type = integerInRange(
				context,
				recordPriv.record_range_type,
				`第 ${index + 1} 项记录生效范围`,
				itemIndex,
				1,
				3,
			);
		}
		return item;
	});
}

function dateTimeToUnixSeconds(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number {
	const text = requiredText(context, value, label, itemIndex);
	const seconds = /^\d+$/.test(text) ? Number(text) : Math.floor(Date.parse(text) / 1000);
	if (!Number.isSafeInteger(seconds) || seconds < 1 || seconds > 4294967295) {
		fail(context, `${label}不是有效的日期时间`, itemIndex);
	}
	return seconds;
}

function processFormSetting(
	context: IExecuteFunctions,
	formSetting: IDataObject,
	itemIndex: number,
): IDataObject {
	const processedSetting: IDataObject = {};

	if (formSetting.fill_out_auth !== undefined) {
		const fillOutAuth = integerInRange(
			context,
			formSetting.fill_out_auth,
			'填写权限',
			itemIndex,
			0,
			4,
		);
		if (![0, 1, 4].includes(fillOutAuth)) fail(context, '填写权限只能是 0、1 或 4', itemIndex);
		processedSetting.fill_out_auth = fillOutAuth;
	}

	if (formSetting.fill_out_auth === 1) {
		const fill_in_range: IDataObject = {};
		const userids = stringList(
			context,
			[formSetting.fill_in_range_userids_text, formSetting.fill_in_range_userids],
			'指定填写成员',
			itemIndex,
			0,
			1000,
		);
		if (userids.length > 0) fill_in_range.userids = userids;
		const departmentids = stringList(
			context,
			[formSetting.fill_in_range_departmentids_text, formSetting.fill_in_range_departmentids],
			'指定填写部门',
			itemIndex,
			0,
			1000,
		).map((id) =>
			integerInRange(context, id, '指定填写部门 ID', itemIndex, 1, Number.MAX_SAFE_INTEGER),
		);
		if (departmentids.length > 0) fill_in_range.departmentids = departmentids;
		if (Object.keys(fill_in_range).length > 0) processedSetting.fill_in_range = fill_in_range;
	}

	const managerUserids = stringList(
		context,
		[formSetting.setting_manager_range_text, formSetting.setting_manager_range],
		'收集表管理员',
		itemIndex,
		0,
		1000,
	);
	if (managerUserids.length > 0) processedSetting.setting_manager_range = { userids: managerUserids };

	const timedRepeatInfo: IDataObject = {};
	if (formSetting.timed_repeat_enable) {
		timedRepeatInfo.enable = true;
		if (formSetting.timed_repeat_type !== undefined) {
			timedRepeatInfo.repeat_type = integerInRange(
				context,
				formSetting.timed_repeat_type,
				'定时重复类型',
				itemIndex,
				1,
				5,
			);
		}
		if (
			formSetting.timed_repeat_remind_time !== undefined &&
			formSetting.timed_repeat_remind_time !== null &&
			String(formSetting.timed_repeat_remind_time).trim() !== ''
		) {
			timedRepeatInfo.remind_time = dateTimeToUnixSeconds(
				context,
				formSetting.timed_repeat_remind_time,
				'首次提醒时间',
				itemIndex,
			);
		}
	}
	const rawTimedRepeatInfo = String(formSetting.timed_repeat_info ?? '').trim();
	if (rawTimedRepeatInfo && rawTimedRepeatInfo !== '{}') {
		let parsed: unknown;
		try {
			parsed =
				typeof formSetting.timed_repeat_info === 'string'
					? JSON.parse(rawTimedRepeatInfo)
					: formSetting.timed_repeat_info;
		} catch {
			fail(context, '定时重复设置 JSON 必须是有效的 JSON', itemIndex);
		}
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
			fail(context, '定时重复设置 JSON 必须是 JSON 对象', itemIndex);
		}
		Object.assign(timedRepeatInfo, parsed as IDataObject);
	}
	if (formSetting.timed_repeat_enable) timedRepeatInfo.enable = true;
	if (Object.keys(timedRepeatInfo).length > 0 && timedRepeatInfo.enable) {
		processedSetting.timed_repeat_info = timedRepeatInfo;
	}

	if (formSetting.allow_multi_fill !== undefined) {
		processedSetting.allow_multi_fill = formSetting.allow_multi_fill;
	}
	if (formSetting.timed_finish && !timedRepeatInfo.enable) {
		const finishTime = dateTimeToUnixSeconds(
			context,
			formSetting.timed_finish,
			'定时关闭时间',
			itemIndex,
		);
		if (finishTime < Math.floor(Date.now() / 1000)) {
			fail(context, '定时关闭时间不能早于当前时间', itemIndex);
		}
		processedSetting.timed_finish = finishTime;
	}
	if (formSetting.can_anonymous !== undefined) {
		processedSetting.can_anonymous = formSetting.can_anonymous;
	}
	if (formSetting.can_notify_submit !== undefined) {
		processedSetting.can_notify_submit = formSetting.can_notify_submit;
	}
	return processedSetting;
}

function normalizedBase64(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): string {
	const raw = requiredText(context, value, label, itemIndex, 20_000_000);
	const commaIndex = raw.startsWith('data:') ? raw.indexOf(',') : -1;
	if (raw.startsWith('data:') && (commaIndex < 0 || !raw.slice(0, commaIndex).includes(';base64'))) {
		fail(context, `${label}的数据 URL 必须使用 base64 编码`, itemIndex);
	}
	const content = (commaIndex >= 0 ? raw.slice(commaIndex + 1) : raw).replace(/\s+/g, '');
	if (!content || !/^[A-Za-z0-9+/]*={0,2}$/.test(content) || content.length % 4 === 1) {
		fail(context, `${label}不是有效的 Base64 内容`, itemIndex);
	}
	const buffer = Buffer.from(content, 'base64');
	if (!buffer.length || buffer.toString('base64').replace(/=+$/, '') !== content.replace(/=+$/, '')) {
		fail(context, `${label}不是有效的 Base64 内容`, itemIndex);
	}
	return buffer.toString('base64');
}

// 辅助函数：从字段值对象中提取实际值
function extractFieldValue(cv: IDataObject): string | number | boolean {
	const valueType = cv.value_type as string;

	switch (valueType) {
		case 'text': {
			// 文本类型 - 支持多个文本片段（纯文本和链接）
			const textContentList = cv.text_content_list as IDataObject;
			if (textContentList?.items && Array.isArray(textContentList.items)) {
				return JSON.stringify(
					(textContentList.items as IDataObject[]).map((item: IDataObject) => {
						const result: IDataObject = {
							type: item.type || 'text',
							text: item.text || '',
						};
						if (item.type === 'url' && item.link) {
							result.link = item.link;
						}
						return result;
					}),
				);
			}
			return '[]';
		}

		case 'email':
		case 'phone_number':
		case 'barcode':
			return (cv.simple_text_value as string) || '';

		case 'number':
		case 'progress':
		case 'currency':
		case 'percentage':
			return (cv.number_value as number) || 0;

		case 'checkbox':
			return (cv.checkbox_value as boolean) || false;

		case 'date_time':
			return (cv.date_value as string) || '';

		case 'url': {
			// 链接类型 - 支持多个链接
			const urlList = cv.url_list as IDataObject;
			if (urlList?.items && Array.isArray(urlList.items)) {
				return JSON.stringify(
					(urlList.items as IDataObject[]).map((item: IDataObject) => ({
						link: item.link || '',
						text: item.text || item.link || '',
					})),
				);
			}
			return '[]';
		}

		case 'single_select':
		case 'select': {
			// 选项类型 - 支持多个选项
			const optionList = cv.option_list as IDataObject;
			if (optionList?.items && Array.isArray(optionList.items)) {
				return JSON.stringify(
					(optionList.items as IDataObject[]).map((item: IDataObject) => {
						if (item.mode === 'id') {
							return { id: item.id || '' };
						} else {
							return {
								text: item.text || '',
								style: item.style || 1,
							};
						}
					}),
				);
			}
			return '[]';
		}

		case 'user': {
			// 成员类型 - 支持多个成员
			const userList = cv.user_list as IDataObject;
			if (userList?.items && Array.isArray(userList.items)) {
				return JSON.stringify(
					(userList.items as IDataObject[])
						.map((item: IDataObject) => ({
							user_id: String(item.user_id || item.user_id_selected || '').trim(),
						}))
						.filter((item) => item.user_id),
				);
			}
			return '[]';
		}

		case 'location': {
			// 地点类型 - 支持多个地点
			const locationList = cv.location_list as IDataObject;
			if (locationList?.items && Array.isArray(locationList.items)) {
				return JSON.stringify(
					(locationList.items as IDataObject[]).map((item: IDataObject) => ({
						source_type: item.source_type || 1,
						id: item.id || '',
						latitude: item.latitude || '',
						longitude: item.longitude || '',
						title: item.title || '',
					})),
				);
			}
			return '[]';
		}

		case 'image': {
			// 图片类型 - 表单输入
			const imageList = cv.image_list as IDataObject;
			if (imageList?.images && Array.isArray(imageList.images)) {
				return JSON.stringify(
					(imageList.images as IDataObject[]).map((img: IDataObject) => ({
						id: img.id || '',
						title: img.title || '',
						image_url: img.image_url || '',
						width: img.width || 0,
						height: img.height || 0,
					})),
				);
			}
			return '[]';
		}

		case 'attachment': {
			// 文件类型 - 表单输入
			const attachmentList = cv.attachment_list as IDataObject;
			if (attachmentList?.attachments && Array.isArray(attachmentList.attachments)) {
				return JSON.stringify(
					(attachmentList.attachments as IDataObject[]).map((att: IDataObject) => {
						const docType = att.doc_type as string;
						let fileType = '';
						let fileExt = '';
						let docTypeNum = 2; // 默认为文件

						// 判断是文件夹还是文件
						if (docType === 'folder') {
							// 文件夹
							fileType = 'Folder';
							fileExt = '';
							docTypeNum = 1;
						} else {
							// 文件 - 根据子类型映射
							docTypeNum = 2;
							const subtype = att.file_subtype as string;

							switch (subtype) {
								case 'smartsheet':
									fileType = '70';
									fileExt = 'SMARTSHEET';
									break;
								case 'doc':
									fileType = '50';
									fileExt = 'DOC';
									break;
								case 'sheet':
									fileType = '51';
									fileExt = 'SHEET';
									break;
								case 'slide':
									fileType = '52';
									fileExt = 'SLIDE';
									break;
								case 'mind':
									fileType = '54';
									fileExt = 'MIND';
									break;
								case 'flowchart':
									fileType = '55';
									fileExt = 'FLOWCHART';
									break;
								case 'form':
									fileType = '30';
									fileExt = 'FORM';
									break;
								case 'wedrive':
									fileType = 'Wedrive';
									fileExt = (att.file_ext_custom as string) || '';
									break;
								default:
									fileType = '';
									fileExt = '';
							}
						}

						return {
							file_id: att.file_id || '',
							name: att.name || '',
							file_url: att.file_url || '',
							file_type: fileType,
							file_ext: fileExt,
							doc_type: docTypeNum,
							size: att.size || 0,
						};
					}),
				);
			}
			return '[]';
		}

		default:
			// 默认返回空字符串
			return '';
	}
}

// 辅助函数：构建单元格值 (返回数组格式)
function buildCellValue(valueType: string, value: string): IDataObject[] {
	let cellValueItem: IDataObject;

	switch (valueType) {
		case 'text':
			// 文本类型
			try {
				if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
					const parsed = JSON.parse(value);
					if (Array.isArray(parsed)) {
						// 数组格式：[{"type": "text", "text": "..."}, {"type": "url", "text": "...", "link": "..."}]
						return parsed as IDataObject[];
					} else if (parsed.type && parsed.text !== undefined) {
						// 单个对象格式：{"type": "text", "text": "..."} 或 {"type": "url", "text": "...", "link": "..."}
						return [parsed] as IDataObject[];
					}
				}
			} catch {
				// JSON解析失败，使用简单文本格式
			}
			// 简单文本格式
			cellValueItem = { type: 'text', text: value };
			break;

		case 'number':
			// 数字类型
			cellValueItem = { type: 'double', number: parseFloat(value) || 0 };
			break;

		case 'checkbox':
			// 复选框类型
			cellValueItem = {
				type: 'checkbox',
				checkbox: value.toLowerCase() === 'true' || value === '1',
			};
			break;

		case 'date_time':
			// 日期类型 - 以毫秒为单位的unix时间戳
			cellValueItem = { type: 'date_time', date_time: value };
			break;

		case 'url':
			// 链接类型 - 支持JSON数组格式或对象格式
			try {
				if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
					const parsed = JSON.parse(value);
					if (Array.isArray(parsed)) {
						// 数组格式：[{"link": "...", "text": "..."}]
						return parsed.map((item: IDataObject) => ({
							type: 'url',
							text: item.text || item.link || '',
							link: item.link || '',
						})) as IDataObject[];
					} else if (parsed.link) {
						// 单个对象格式：{"link": "...", "text": "..."}
						cellValueItem = {
							type: 'url',
							text: parsed.text || parsed.link || '',
							link: parsed.link || '',
						};
						break;
					}
				}
			} catch {
				// JSON解析失败，使用简单文本格式
			}
			// 简单字符串格式：直接使用value作为link和text
			cellValueItem = { type: 'url', text: value, link: value };
			break;

		case 'email':
			// 邮箱类型
			cellValueItem = { type: 'email', email: value };
			break;

		case 'phone_number':
			// 电话类型
			cellValueItem = { type: 'phone_number', phone_number: value };
			break;

		case 'single_select':
		case 'select':
			// 单选/多选类型 - 支持JSON数组格式
			try {
				const parsed = typeof value === 'string' ? JSON.parse(value) : value;
				if (Array.isArray(parsed)) {
					// 数组格式：[{"id": "..."}, ...] 或 [{"text": "...", "style": 1}, ...]
					return parsed.map((item: IDataObject) => {
						const option: IDataObject = {};
						if (item.id) {
							option.id = item.id;
						}
						if (item.style !== undefined) {
							option.style = item.style;
						}
						if (item.text) {
							option.text = item.text;
						}
						return { type: valueType, [valueType]: option };
					}) as IDataObject[];
				} else {
					// 单个对象格式：{"id": "..."} 或 {"text": "...", "style": 1}
					const option: IDataObject = {};
					if (parsed.id) {
						option.id = parsed.id;
					}
					if (parsed.style !== undefined) {
						option.style = parsed.style;
					}
					if (parsed.text) {
						option.text = parsed.text;
					}
					cellValueItem = { type: valueType, [valueType]: option };
				}
			} catch (error) {
				throw new Error(`${valueType}类型值格式错误，请提供有效的JSON格式: ${error.message}`);
			}
			break;

		case 'progress':
			// 进度类型 (0-1之间的数值)
			cellValueItem = { type: 'double', progress: parseFloat(value) || 0 };
			break;

		case 'currency':
			// 货币类型
			cellValueItem = { type: 'double', currency: parseFloat(value) || 0 };
			break;

		case 'percentage':
			// 百分数类型
			cellValueItem = { type: 'double', percentage: parseFloat(value) || 0 };
			break;

		case 'barcode':
			// 条码类型
			cellValueItem = { type: 'barcode', barcode: value };
			break;

		case 'location':
			// 地理位置类型 - 支持JSON数组格式
			try {
				const parsed = typeof value === 'string' ? JSON.parse(value) : value;

				const processLocation = (item: IDataObject) => {
					// 必填字段验证
					if (!item.id) {
						throw new Error('地点类型缺少必填字段: id');
					}
					if (!item.latitude) {
						throw new Error('地点类型缺少必填字段: latitude');
					}
					if (!item.longitude) {
						throw new Error('地点类型缺少必填字段: longitude');
					}
					if (!item.title) {
						throw new Error('地点类型缺少必填字段: title');
					}

					const location: IDataObject = {
						id: item.id,
						latitude: item.latitude,
						longitude: item.longitude,
						source_type: item.source_type || 1,
						title: item.title,
					};

					return { type: 'location', location };
				};

				if (Array.isArray(parsed)) {
					// 数组格式：[{"id": "...", "title": "...", ...}]
					return parsed.map(processLocation) as IDataObject[];
				} else {
					// 单个对象格式：{"id": "...", "title": "...", ...}
					cellValueItem = processLocation(parsed);
				}
			} catch (error) {
				throw new Error(`地点类型值格式错误: ${error.message}`);
			}
			break;

		case 'image':
			// 图片类型 - 支持JSON数组或单个对象格式
			try {
				const imageData = typeof value === 'string' ? JSON.parse(value) : value;
				if (Array.isArray(imageData)) {
					cellValueItem = { type: 'image', image: imageData };
				} else if (imageData.image_url) {
					// 单个对象格式：包装成数组
					cellValueItem = { type: 'image', image: [imageData] };
				} else {
					throw new Error('图片类型需要数组格式或包含image_url的对象');
				}
			} catch (error) {
				throw new Error(`图片类型值格式错误: ${error.message}`);
			}
			break;

		case 'attachment':
			// 文件类型 - 支持JSON数组或单个对象格式
			try {
				const attachmentData = typeof value === 'string' ? JSON.parse(value) : value;
				if (Array.isArray(attachmentData)) {
					cellValueItem = { type: 'attachment', attachment: attachmentData };
				} else if (attachmentData.file_id) {
					// 单个对象格式：包装成数组
					cellValueItem = { type: 'attachment', attachment: [attachmentData] };
				} else {
					throw new Error('文件类型需要数组格式或包含file_id的对象');
				}
			} catch (error) {
				throw new Error(`文件类型值格式错误: ${error.message}`);
			}
			break;

		case 'user': {
			// 成员类型 - 支持多种格式
			try {
				let userData: IDataObject[];

				if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
					// JSON格式
					const parsed = JSON.parse(value);
					if (Array.isArray(parsed)) {
						// 数组格式：[{"user_id": "userid1"}, {"user_id": "userid2"}]
						userData = parsed;
					} else if (parsed.user_id) {
						// 单个对象格式：{"user_id": "userid1"}
						userData = [parsed];
					} else {
						throw new Error('成员对象必须包含 user_id 字段');
					}
				} else {
					// 简单字符串格式：直接作为user_id
					userData = [{ user_id: value }];
				}

				cellValueItem = { type: 'user', user: userData };
			} catch (error) {
				throw new Error(`成员类型值格式错误: ${error.message}`);
			}
			break;
		}

		default:
			// 默认为文本类型
			cellValueItem = { type: 'text', text: value };
			break;
	}

	// 根据文档，值应该是数组格式
	return [cellValueItem];
}

// 辅助函数：将值类型（如 'text'）映射到字段类型（如 'FIELD_TYPE_TEXT'）
function mapValueTypeToFieldType(valueType: string): string {
	const valueTypeToFieldTypeMap: IDataObject = {
		text: 'FIELD_TYPE_TEXT',
		number: 'FIELD_TYPE_NUMBER',
		checkbox: 'FIELD_TYPE_CHECKBOX',
		date_time: 'FIELD_TYPE_DATE_TIME',
		image: 'FIELD_TYPE_IMAGE',
		attachment: 'FIELD_TYPE_ATTACHMENT',
		user: 'FIELD_TYPE_USER',
		url: 'FIELD_TYPE_URL',
		select: 'FIELD_TYPE_SELECT',
		multi_select: 'FIELD_TYPE_SELECT',
		single_select: 'FIELD_TYPE_SINGLE_SELECT',
		progress: 'FIELD_TYPE_PROGRESS',
		phone_number: 'FIELD_TYPE_PHONE_NUMBER',
		email: 'FIELD_TYPE_EMAIL',
		location: 'FIELD_TYPE_LOCATION',
		currency: 'FIELD_TYPE_CURRENCY',
		percentage: 'FIELD_TYPE_PERCENTAGE',
		barcode: 'FIELD_TYPE_BARCODE',
	};

	// 如果已经是字段类型格式，直接返回
	if (valueType.startsWith('FIELD_TYPE_')) {
		return valueType;
	}

	// 否则映射到字段类型
	return (valueTypeToFieldTypeMap[valueType.toLowerCase()] as string) || valueType.toUpperCase();
}

// 辅助函数：根据字段类型构建单元格值
// 将字段类型（如 FIELD_TYPE_TEXT）映射到内部值类型（如 text），并构建正确的数据结构
function buildCellValueByFieldType(
	fieldType: string,
	rawValue: string | number | boolean,
): string | number | boolean | IDataObject[] {
	// 将字段类型转换为内部值类型
	const valueTypeMap: IDataObject = {
		FIELD_TYPE_TEXT: 'text',
		FIELD_TYPE_NUMBER: 'number',
		FIELD_TYPE_CHECKBOX: 'checkbox',
		FIELD_TYPE_DATE_TIME: 'date_time',
		FIELD_TYPE_IMAGE: 'image',
		FIELD_TYPE_ATTACHMENT: 'attachment',
		FIELD_TYPE_USER: 'user',
		FIELD_TYPE_URL: 'url',
		FIELD_TYPE_SELECT: 'select',
		FIELD_TYPE_MULTI_SELECT: 'select',
		FIELD_TYPE_PROGRESS: 'progress',
		FIELD_TYPE_PHONE_NUMBER: 'phone_number',
		FIELD_TYPE_EMAIL: 'email',
		FIELD_TYPE_SINGLE_SELECT: 'single_select',
		FIELD_TYPE_LOCATION: 'location',
		FIELD_TYPE_CURRENCY: 'currency',
		FIELD_TYPE_PERCENTAGE: 'percentage',
		FIELD_TYPE_BARCODE: 'barcode',
	};

	// 根据字段类型返回正确的数据结构
	switch (fieldType) {
		case 'FIELD_TYPE_TEXT':
			// 文本类型：Object[](CellTextValue)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					if (Array.isArray(parsed)) {
						return parsed;
					}
					if (parsed && typeof parsed === 'object' && parsed.type) {
						return [parsed];
					}
				} catch {
					// 不是JSON，作为简单文本处理
				}
				return [{ type: 'text', text: rawValue }];
			}
			return [{ type: 'text', text: String(rawValue) }];

		case 'FIELD_TYPE_NUMBER':
		case 'FIELD_TYPE_PROGRESS':
		case 'FIELD_TYPE_CURRENCY':
		case 'FIELD_TYPE_PERCENTAGE':
			// 数字类型：double
			return typeof rawValue === 'number' ? rawValue : parseFloat(String(rawValue)) || 0;

		case 'FIELD_TYPE_CHECKBOX':
			// 复选框类型：bool
			if (typeof rawValue === 'boolean') {
				return rawValue;
			}
			return String(rawValue).toLowerCase() === 'true' || rawValue === 1 || rawValue === '1';

		case 'FIELD_TYPE_DATE_TIME':
			// 日期类型：string(毫秒unix时间戳)
			return String(rawValue);

		case 'FIELD_TYPE_IMAGE':
			// 图片类型：Object[](CellImageValue)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					return Array.isArray(parsed) ? parsed : [parsed];
				} catch {
					throw new Error('图片类型值必须是有效的JSON数组格式');
				}
			}
			if (Array.isArray(rawValue)) {
				return rawValue;
			}
			// extractFieldValue 对于图片类型应该返回字符串，如果不是则抛出错误
			throw new Error('图片类型值格式错误：期望字符串格式的JSON');

		case 'FIELD_TYPE_ATTACHMENT':
			// 文件类型：Object[](CellAttachmentValue)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					return Array.isArray(parsed) ? parsed : [parsed];
				} catch {
					throw new Error('文件类型值必须是有效的JSON数组格式');
				}
			}
			if (Array.isArray(rawValue)) {
				return rawValue;
			}
			// extractFieldValue 对于文件类型应该返回字符串，如果不是则抛出错误
			throw new Error('文件类型值格式错误：期望字符串格式的JSON');

		case 'FIELD_TYPE_USER':
			// 成员类型：Object[](CellUserValue)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					if (Array.isArray(parsed)) {
						return parsed.map((item: IDataObject) => ({
							user_id: item.user_id || String(item),
						}));
					}
					if (parsed && typeof parsed === 'object' && parsed.user_id) {
						return [parsed];
					}
				} catch {
					// 不是JSON，作为user_id字符串处理
				}
				return [{ user_id: String(rawValue) }];
			}
			return Array.isArray(rawValue)
				? rawValue.map((item: IDataObject) => ({
						user_id: typeof item === 'object' && item.user_id ? String(item.user_id) : String(item),
					}))
				: [{ user_id: String(rawValue) }];

		case 'FIELD_TYPE_URL':
			// 链接类型：Object[](CellUrlValue)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					if (Array.isArray(parsed)) {
						return parsed.map((item: IDataObject) => ({
							type: 'url',
							text: item.text || item.link || '',
							link: item.link || '',
						}));
					}
					if (parsed && typeof parsed === 'object' && parsed.link) {
						return [
							{
								type: 'url',
								text: parsed.text || parsed.link || '',
								link: parsed.link || '',
							},
						];
					}
				} catch {
					// 不是JSON，作为链接URL处理
				}
				return [{ type: 'url', text: String(rawValue), link: String(rawValue) }];
			}
			return [{ type: 'url', text: String(rawValue), link: String(rawValue) }];

		case 'FIELD_TYPE_SELECT':
		case 'FIELD_TYPE_MULTI_SELECT':
		case 'FIELD_TYPE_SINGLE_SELECT':
			// 单选/多选类型：Object[](Option)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					return Array.isArray(parsed) ? parsed : [parsed];
				} catch {
					throw new Error('选项类型值必须是有效的JSON数组格式');
				}
			}
			if (Array.isArray(rawValue)) {
				return rawValue;
			}
			// extractFieldValue 对于选项类型应该返回字符串，如果不是则抛出错误
			throw new Error('选项类型值格式错误：期望字符串格式的JSON');

		case 'FIELD_TYPE_PHONE_NUMBER':
		case 'FIELD_TYPE_EMAIL':
		case 'FIELD_TYPE_BARCODE':
			// 电话/邮箱/条码类型：string
			return String(rawValue);

		case 'FIELD_TYPE_LOCATION':
			// 地理位置类型：Object[](CellLocationValue)，长度不大于1的数组
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					const location = Array.isArray(parsed) ? parsed[0] : parsed;
					if (!location || typeof location !== 'object') {
						throw new Error('地理位置类型值格式错误');
					}
					return [
						{
							source_type: location.source_type || 1,
							id: location.id || '',
							latitude: String(location.latitude || ''),
							longitude: String(location.longitude || ''),
							title: location.title || '',
						},
					];
				} catch (error) {
					throw new Error(
						`地理位置类型值格式错误: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}
			if (Array.isArray(rawValue) && rawValue.length > 0) {
				const location = rawValue[0];
				return [
					{
						source_type: location.source_type || 1,
						id: location.id || '',
						latitude: String(location.latitude || ''),
						longitude: String(location.longitude || ''),
						title: location.title || '',
					},
				];
			}
			throw new Error('地理位置类型值格式错误');

		default: {
			// 如果字段类型不在映射中，尝试使用buildCellValue函数
			const mappedValueType = valueTypeMap[fieldType] as string;
			if (mappedValueType) {
				return buildCellValue(mappedValueType, String(rawValue));
			}
			// 如果无法映射，返回原始值的字符串形式
			return String(rawValue);
		}
	}
}

function buildDocMember(
	context: IExecuteFunctions,
	member: IDataObject,
	itemIndex: number,
	includeAuth: boolean,
): IDataObject {
	if (Number(member.type ?? 1) !== 1) {
		fail(context, '文档通知范围仅支持成员类型 1，不支持部门', itemIndex);
	}
	const idType = String(member.id_type ?? 'userid');
	const info: IDataObject = { type: 1 };
	if (idType === 'userid') {
		info.userid = requiredText(
			context,
			member.userid || member.userid_selected,
			'成员 UserID',
			itemIndex,
		);
	} else if (idType === 'tmp_external_userid') {
		info.tmp_external_userid = requiredText(
			context,
			member.tmp_external_userid,
			'外部用户临时 ID',
			itemIndex,
		);
	} else {
		fail(context, `不支持的成员 ID 类型: ${idType}`, itemIndex);
	}
	if (includeAuth) {
		const auth = Number(member.auth);
		if (![1, 2, 7].includes(auth)) fail(context, '文档成员权限只能是 1、2 或 7', itemIndex);
		info.auth = auth;
	}
	return info;
}

export async function executeWedoc(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const parseRequiredJsonObject = (
		value: unknown,
		parameterName: string,
		itemIndex: number,
	): IDataObject => {
		if (value === undefined || value === null) {
			throw new NodeOperationError(this.getNode(), `${parameterName} 不能为空`, { itemIndex });
		}

		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed) {
				throw new NodeOperationError(this.getNode(), `${parameterName} 不能为空`, {
					itemIndex,
				});
			}

			try {
				const parsed = JSON.parse(trimmed) as unknown;
				if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
					throw new NodeOperationError(this.getNode(), `${parameterName} 必须是 JSON 对象`, {
						itemIndex,
					});
				}
				return parsed as IDataObject;
			} catch (error) {
				if (error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeOperationError(
					this.getNode(),
					`${parameterName} 必须是有效的 JSON: ${(error as Error).message}`,
					{ itemIndex },
				);
			}
		}

		if (Array.isArray(value) || typeof value !== 'object') {
			throw new NodeOperationError(this.getNode(), `${parameterName} 必须是 JSON 对象`, {
				itemIndex,
			});
		}

		return value as IDataObject;
	};

	for (let i = 0; i < items.length; i++)
		try {
			let response: IDataObject;
			if (!WEDOC_OPERATIONS.has(operation)) {
				fail(this, `不支持的文档操作: ${operation}`, i);
			}
			if (DOCID_OPERATIONS.has(operation)) {
				requiredText(this, this.getNodeParameter('docid', i, ''), '文档 ID', i);
			}
			if (SHEET_ID_OPERATIONS.has(operation)) {
				requiredText(this, this.getNodeParameter('sheet_id', i, ''), '子表 ID', i);
			}

			// 管理文档
			if (operation === 'createDoc') {
				const doc_type = integerInRange(
					this,
					this.getNodeParameter('doctype', i),
					'文档类型',
					i,
					3,
					11,
				);
				if (![3, 4, 10, 11].includes(doc_type)) {
					fail(this, '文档类型只能是 3、4、10 或 11', i);
				}
				const doc_name = requiredText(
					this,
					this.getNodeParameter('doc_name', i),
					'文档名称',
					i,
					255,
				);
				if (weightedNameLength(doc_name) > 255) {
					fail(this, '文档名称换算长度不能超过 255（英文计 1，汉字计 2）', i);
				}
				const useSpaceId = this.getNodeParameter('useSpaceId', i, false) as boolean;

				const body: IDataObject = { doc_type, doc_name };

				// 处理管理员用户列表 (multiOptions类型,返回string[])
				const adminUsers = stringList(
					this,
					[
						this.getNodeParameter('admin_users_text', i, ''),
						this.getNodeParameter('admin_users', i, []),
					],
					'管理员 UserID 列表',
					i,
					0,
					3,
				);
				if (adminUsers.length > 0) body.admin_users = adminUsers;

				if (useSpaceId) {
					const spaceid = requiredText(this, this.getNodeParameter('spaceid', i), '空间 ID', i);
					const fatherid = requiredText(this, this.getNodeParameter('fatherid', i), '父目录 ID', i);
					body.spaceid = spaceid;
					body.fatherid = fatherid;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/create_doc', body);
			} else if (operation === 'renameDoc') {
				const new_name = requiredText(this, this.getNodeParameter('new_name', i), '新文档名称', i, 255);
				if (weightedNameLength(new_name) > 255) {
					fail(this, '新文档名称换算长度不能超过 255（英文计 1，汉字计 2）', i);
				}
				const docType = this.getNodeParameter('docType', i, 'docid') as string;
				const request: IDataObject = { new_name };

				if (docType === 'formid') {
					request.formid = requiredText(this, this.getNodeParameter('formid', i), '收集表 ID', i);
				} else if (docType === 'docid') {
					request.docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				} else {
					fail(this, `不支持的文档 ID 类型: ${docType}`, i);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/rename_doc', request);
			} else if (operation === 'deleteDoc') {
				const docType = this.getNodeParameter('docType', i, 'docid') as string;
				const request: IDataObject = {};

				if (docType === 'formid') {
					request.formid = requiredText(this, this.getNodeParameter('formid', i), '收集表 ID', i);
				} else if (docType === 'docid') {
					request.docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				} else {
					fail(this, `不支持的文档 ID 类型: ${docType}`, i);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/del_doc', request);
			} else if (operation === 'getDocInfo') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_doc_base_info', {
					docid,
				});
			}
			// 分享文档
			else if (operation === 'shareDoc') {
				const docType = this.getNodeParameter('docType', i, 'docid') as string;
				const request: IDataObject = {};

				if (docType === 'formid') {
					request.formid = requiredText(this, this.getNodeParameter('formid', i), '收集表 ID', i);
				} else if (docType === 'docid') {
					request.docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				} else {
					fail(this, `不支持的文档 ID 类型: ${docType}`, i);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/doc_share', request);
			}
			// 编辑文档
			else if (operation === 'modDocContent') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const version = integerInRange(
					this,
					this.getNodeParameter('version', i, 0),
					'文档版本',
					i,
					0,
					4294967295,
				);
				const requestsCollection = this.getNodeParameter(
					'requestsCollection',
					i,
					{},
				) as IDataObject;

				const requests: IDataObject[] = [];

				if (requestsCollection.requests && Array.isArray(requestsCollection.requests)) {
					for (const [requestIndex, req] of (requestsCollection.requests as IDataObject[]).entries()) {
						const request: IDataObject = {};
						const location = () => ({
							index: integerInRange(
								this,
								req.location_index ?? 0,
								`第 ${requestIndex + 1} 项插入位置`,
								i,
								0,
								4294967295,
							),
						});
						const ranges = (): IDataObject[] => {
							const collection = req.rangesCollection as IDataObject | undefined;
							const rawRanges = Array.isArray(collection?.ranges)
								? (collection.ranges as IDataObject[])
								: [];
							if (rawRanges.length < 1 || rawRanges.length > 10) {
								fail(this, `第 ${requestIndex + 1} 项范围数量必须为 1–10 个`, i);
							}
							return rawRanges.map((range) => ({
								start_index: integerInRange(
									this,
									range.start_index ?? 0,
									'范围开始位置',
									i,
									0,
									4294967295,
								),
								length: integerInRange(this, range.length, '范围长度', i, 1, 4294967295),
							}));
						};

						if (req.request_type === 'insert_text') {
							request.insert_text = {
								text: requiredText(this, req.text, `第 ${requestIndex + 1} 项文本`, i, 100000),
								location: location(),
							};
						} else if (req.request_type === 'insert_paragraph') {
							request.insert_paragraph = { location: location() };
						} else if (req.request_type === 'delete_content') {
							request.delete_content = {
								range: {
									start_index: integerInRange(
										this,
										req.delete_start_index ?? 0,
										'删除开始位置',
										i,
										0,
										4294967295,
									),
									length: integerInRange(this, req.delete_length, '删除长度', i, 1, 4294967295),
								},
							};
						} else if (req.request_type === 'replace_text') {
							request.replace_text = {
								text: String(req.replace_text_value ?? ''),
								ranges: ranges(),
							};
						} else if (req.request_type === 'insert_image') {
							const insertImage: IDataObject = {
								image_id: requiredText(this, req.image_id, '图片 URL', i, 4096),
								location: location(),
							};
							if (Number(req.image_width) > 0) {
								insertImage.width = integerInRange(this, req.image_width, '图片宽度', i, 1, 4294967295);
							}
							if (Number(req.image_height) > 0) {
								insertImage.height = integerInRange(this, req.image_height, '图片高度', i, 1, 4294967295);
							}
							request.insert_image = insertImage;
						} else if (req.request_type === 'insert_page_break') {
							request.insert_page_break = { location: location() };
						} else if (req.request_type === 'insert_table') {
							const rows = integerInRange(this, req.table_rows, '表格行数', i, 1, 100);
							const cols = integerInRange(this, req.table_cols, '表格列数', i, 1, 60);
							if (rows * cols > 1000) fail(this, '插入表格的单元格总数不能超过 1000', i);
							request.insert_table = {
								rows,
								cols,
								location: location(),
							};
						} else if (req.request_type === 'update_text_property') {
							const textProperty: IDataObject = {};
							if (
								req.textPropertyCollection &&
								(req.textPropertyCollection as IDataObject).text_property
							) {
								const prop = (req.textPropertyCollection as IDataObject)
									.text_property as IDataObject;
								if (prop.bold !== undefined) {
									textProperty.bold = prop.bold;
								}
								if (prop.color) {
									const color = String(prop.color).replace(/^#/, '');
									if (!/^[0-9A-Fa-f]{6}$/.test(color)) fail(this, '文字颜色必须是 6 位十六进制 RRGGBB', i);
									textProperty.color = color;
								}
								if (prop.background_color) {
									const backgroundColor = String(prop.background_color).replace(/^#/, '');
									if (!/^[0-9A-Fa-f]{6}$/.test(backgroundColor)) fail(this, '背景颜色必须是 6 位十六进制 RRGGBB', i);
									textProperty.background_color = backgroundColor;
								}
							}
							if (!Object.keys(textProperty).length) fail(this, '更新文本属性至少需要设置一项属性', i);
							request.update_text_property = {
								text_property: textProperty,
								ranges: ranges(),
							};
						} else {
							fail(this, `第 ${requestIndex + 1} 项文档更新类型无效`, i);
						}

						if (Object.keys(request).length > 0) {
							requests.push(request);
						}
					}
				}

				if (requests.length === 0) {
					fail(this, '编辑文档内容至少需要 1 个有效更新请求', i);
				}
				if (requests.length > 30) fail(this, '编辑文档内容单次最多 30 个更新请求', i);
				const body: IDataObject = {
					docid,
					requests,
				};
				if (version > 0) {
					body.version = version;
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/document/batch_update',
					body,
				);
			} else if (operation === 'modSheetContent') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const requestsCollection = this.getNodeParameter(
					'requestsCollection',
					i,
					{},
				) as IDataObject;

				const requests: IDataObject[] = [];

				if (requestsCollection.requests && Array.isArray(requestsCollection.requests)) {
					for (const [requestIndex, req] of (requestsCollection.requests as IDataObject[]).entries()) {
						const request: IDataObject = {};

						if (req.request_type === 'add_sheet') {
							const rowCount = integerInRange(
								this,
								req.add_sheet_row_count,
								'新增工作表行数',
								i,
								1,
								1000,
							);
							const columnCount = integerInRange(
								this,
								req.add_sheet_column_count,
								'新增工作表列数',
								i,
								1,
								200,
							);
							if (rowCount * columnCount > 10000) {
								fail(this, '新增工作表的单元格总数不能超过 10000', i);
							}
							request.add_sheet_request = {
								title: requiredText(this, req.title, '新增工作表名称', i, 255),
								row_count: rowCount,
								column_count: columnCount,
							};
						} else if (req.request_type === 'delete_sheet') {
							request.delete_sheet_request = {
								sheet_id: requiredText(this, req.sheet_id, '工作表 ID', i),
							};
						} else if (req.request_type === 'update_range') {
							const startRow = integerInRange(this, req.start_row, '起始行号', i, 0, 4294967295);
							const startColumn = integerInRange(
								this,
								req.start_column,
								'起始列号',
								i,
								0,
								4294967295,
							);
							const rowCount = integerInRange(this, req.row_count, '更新行数', i, 1, 1000);
							const columnCount = integerInRange(this, req.column_count, '更新列数', i, 1, 200);
							if (rowCount * columnCount > 10000) {
								fail(this, '更新范围的单元格总数不能超过 10000', i);
							}
							const gridDataJson = optionalText(
								this,
								req.grid_data_json,
								'Grid Data JSON',
								i,
								500000,
							);
							let gridData: IDataObject;
							if (gridDataJson && gridDataJson !== '{}') {
								gridData = parseRequiredJsonObject(gridDataJson, 'Grid Data JSON', i);
								gridData.start_row = startRow;
								gridData.start_column = startColumn;
								if (!Array.isArray(gridData.rows) || gridData.rows.length < 1) {
									fail(this, 'Grid Data JSON 必须包含非空 rows 数组', i);
								}
							} else {
								const valuesText = requiredText(this, req.values, '单元格值', i, 500000);
								const parsedRows = valuesText.split(';').map((row) => row.split(',').map((cell) => cell.trim()));
								if (parsedRows.length > rowCount || parsedRows.some((row) => row.length > columnCount)) {
									fail(this, '单元格值的行列数不能超过配置的更新范围', i);
								}
								gridData = {
									start_row: startRow,
									start_column: startColumn,
									rows: parsedRows.map((row) => ({
										values: row.map((cell) => ({ cell_value: { text: cell } })),
									})),
								};
							}

							request.update_range_request = {
								sheet_id: requiredText(this, req.sheet_id, '工作表 ID', i),
								grid_data: gridData,
							};
						} else if (req.request_type === 'delete_dimension') {
							const dimension = requiredText(this, req.dimension ?? 'ROW', '删除维度', i);
							if (!['ROW', 'COLUMN'].includes(dimension)) fail(this, '删除维度只能是 ROW 或 COLUMN', i);
							const startIndex = integerInRange(this, req.start_index, '删除起始序号', i, 1, 4294967295);
							const endIndex = integerInRange(this, req.end_index, '删除终止序号', i, 2, 4294967295);
							if (endIndex <= startIndex) fail(this, '删除终止序号必须大于起始序号', i);
							request.delete_dimension_request = {
								sheet_id: requiredText(this, req.sheet_id, '工作表 ID', i),
								dimension,
								start_index: startIndex,
								end_index: endIndex,
							};
						} else {
							fail(this, `第 ${requestIndex + 1} 项表格更新类型无效`, i);
						}

						if (Object.keys(request).length > 0) {
							requests.push(request);
						}
					}
				}

				if (requests.length === 0) {
					fail(this, '编辑表格内容至少需要 1 个有效更新请求', i);
				}
				if (requests.length > 5) fail(this, '编辑表格内容单次最多 5 个更新请求', i);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/spreadsheet/batch_update',
					{
						docid,
						requests,
					},
				);
			}
			// 智能表格操作 - 子表
			else if (operation === 'addSmartsheetSheet') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const formSetting = this.getNodeParameter('formSetting', i, {}) as IDataObject;

				const properties: IDataObject = {};
				if (formSetting.sheet_title) {
					properties.title = optionalText(this, formSetting.sheet_title, '子表标题', i, 255);
				}
				if (formSetting.sheet_index !== undefined && formSetting.sheet_index !== null) {
					properties.index = integerInRange(
						this,
						formSetting.sheet_index,
						'子表下标',
						i,
						0,
						2147483647,
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/add_sheet', {
					docid,
					properties,
				});
			} else if (operation === 'delSmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/delete_sheet',
					{
						docid,
						sheet_id,
					},
				);
			} else if (operation === 'updateSmartsheetSheet') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const sheet_title = optionalText(
					this,
					this.getNodeParameter('sheet_title', i, ''),
					'子表标题',
					i,
					255,
				);

				const properties: IDataObject = { sheet_id };
				if (!sheet_title) fail(this, '更新子表至少需要填写新的子表标题', i);
				properties.title = sheet_title;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/update_sheet',
					{
						docid,
						properties,
					},
				);
			}
			// 智能表格操作 - 视图
			else if (operation === 'addSmartsheetView') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const view_title = requiredText(
					this,
					this.getNodeParameter('view_title', i),
					'视图标题',
					i,
					255,
				);
				const view_type = requiredText(this, this.getNodeParameter('view_type', i), '视图类型', i);
				if (!SMARTSHEET_VIEW_TYPES.has(view_type)) {
					fail(this, `不支持的智能表格视图类型: ${view_type}`, i);
				}
				const body: IDataObject = { docid, sheet_id, view_title, view_type };
				const propertyJson = optionalText(
					this,
					this.getNodeParameter('viewExtraJson', i, ''),
					'视图属性 JSON',
					i,
					100000,
				);
				if (propertyJson) Object.assign(body, parseRequiredJsonObject(propertyJson, '视图属性 JSON', i));
				body.docid = docid;
				body.sheet_id = sheet_id;
				body.view_title = view_title;
				body.view_type = view_type;
				const requiredProperty =
					view_type === 'VIEW_TYPE_GANTT'
						? 'property_gantt'
						: view_type === 'VIEW_TYPE_CALENDAR'
							? 'property_calendar'
							: '';
				if (requiredProperty) {
					const formStart = optionalText(
						this,
						this.getNodeParameter('start_date_field_id', i, ''),
						'开始日期字段 ID',
						i,
						128,
					);
					const formEnd = optionalText(
						this,
						this.getNodeParameter('end_date_field_id', i, ''),
						'结束日期字段 ID',
						i,
						128,
					);
					const existing =
						body[requiredProperty] &&
						typeof body[requiredProperty] === 'object' &&
						!Array.isArray(body[requiredProperty])
							? (body[requiredProperty] as IDataObject)
							: {};
					const propertyObject: IDataObject = { ...existing };
					if (formStart && propertyObject.start_date_field_id === undefined) {
						propertyObject.start_date_field_id = formStart;
					}
					if (formEnd && propertyObject.end_date_field_id === undefined) {
						propertyObject.end_date_field_id = formEnd;
					}
					body[requiredProperty] = propertyObject;
					requiredText(this, propertyObject.start_date_field_id, '开始日期字段 ID', i);
					requiredText(this, propertyObject.end_date_field_id, '结束日期字段 ID', i);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/add_view',
					body,
				);
			} else if (operation === 'delSmartsheetView') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const view_ids = stringList(
					this,
					this.getNodeParameter('view_ids', i, this.getNodeParameter('view_id', i, '')),
					'视图 ID 列表',
					i,
					1,
					200,
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/delete_views',
					{
						docid,
						sheet_id,
						view_ids,
					},
				);
			} else if (operation === 'updateSmartsheetView') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const view_id = requiredText(this, this.getNodeParameter('view_id', i), '视图 ID', i);
				const view_title = optionalText(
					this,
					this.getNodeParameter('view_title', i, ''),
					'视图标题',
					i,
					255,
				);
				const propertyJson = optionalText(
					this,
					this.getNodeParameter('viewPropertyJson', i, ''),
					'视图配置 JSON',
					i,
					100000,
				);
				const updateViewProperty = this.getNodeParameter('updateViewProperty', i, false) as boolean;
				const formProperty: IDataObject = {};
				if (updateViewProperty) {
					formProperty.auto_sort = Boolean(this.getNodeParameter('auto_sort', i, false));
					formProperty.frozen_field_count = integerInRange(
						this,
						this.getNodeParameter('frozen_field_count', i, 0),
						'冻结列数',
						i,
						0,
						100,
					);
				}

				const body: IDataObject = { docid, sheet_id, view_id };
				if (view_title) body.view_title = view_title;
				const property: IDataObject = { ...formProperty };
				if (propertyJson) {
					Object.assign(property, parseRequiredJsonObject(propertyJson, '视图配置 JSON', i));
				}
				if (Object.keys(property).length) body.property = property;
				if (!view_title && !body.property) fail(this, '更新视图至少需要新的标题或视图配置', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/update_view',
					body,
				);
			}
			// 智能表格操作 - 字段
			else if (operation === 'addSmartsheetField') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const fieldsCollection = this.getNodeParameter('fieldsCollection', i, {}) as IDataObject;

				const fields: IDataObject[] = [];
				if (fieldsCollection.fields && Array.isArray(fieldsCollection.fields)) {
					for (const field of fieldsCollection.fields as IDataObject[]) {
						const fieldType = requiredText(this, field.field_type, '字段类型', i, 64);
						if (!SMARTSHEET_FIELD_TYPES.has(fieldType)) {
							fail(this, `不支持的智能表格字段类型: ${fieldType}`, i);
						}
						const fieldDef: IDataObject = {
							field_title: requiredText(this, field.field_title, '字段标题', i, 255),
							field_type: fieldType,
						};
						const fieldJson = optionalText(this, field.field_json, '字段属性 JSON', i, 100000);
						if (fieldJson) {
							Object.assign(fieldDef, parseRequiredJsonObject(fieldJson, '字段属性 JSON', i));
							fieldDef.field_title = requiredText(this, field.field_title, '字段标题', i, 255);
							fieldDef.field_type = fieldType;
						}

						// 处理单选/多选的选项
						if (
							['FIELD_TYPE_SINGLE_SELECT', 'FIELD_TYPE_SELECT'].includes(fieldType) &&
							field.select_options
						) {
							const options = stringList(
								this,
								field.select_options,
								'选项列表',
								i,
								1,
								1000,
							).map((text, idx) => ({ id: `opt_${idx}`, text }));
							fieldDef[
								fieldType === 'FIELD_TYPE_SINGLE_SELECT'
									? 'property_single_select'
									: 'property_select'
							] = { options };
						}
						assertRequiredFieldProperty(this, fieldDef, fieldType, i);

						fields.push(fieldDef);
					}
				}
				if (fields.length === 0 || fields.length > 150) {
					fail(this, '添加字段数量必须为 1–150 个', i);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/add_fields',
					{
						docid,
						sheet_id,
						fields,
					},
				);
			} else if (operation === 'delSmartsheetField') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const field_ids = stringList(
					this,
					this.getNodeParameter('field_ids', i),
					'字段 ID 列表',
					i,
					1,
					150,
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/delete_fields',
					{
						docid,
						sheet_id,
						field_ids,
					},
				);
			} else if (operation === 'updateSmartsheetField') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const fieldsCollection = this.getNodeParameter('fieldsCollection', i, {}) as IDataObject;

				const fields: IDataObject[] = [];
				if (fieldsCollection.fields && Array.isArray(fieldsCollection.fields)) {
					for (const field of fieldsCollection.fields as IDataObject[]) {
						const fieldType = requiredText(this, field.field_type, '字段类型', i, 64);
						if (!SMARTSHEET_FIELD_TYPES.has(fieldType)) {
							fail(this, `不支持的智能表格字段类型: ${fieldType}`, i);
						}
						const fieldDef: IDataObject = {
							field_id: requiredText(this, field.field_id, '字段 ID', i),
							field_type: fieldType,
						};
						const fieldJson = optionalText(this, field.field_json, '字段属性 JSON', i, 100000);
						if (fieldJson) {
							Object.assign(fieldDef, parseRequiredJsonObject(fieldJson, '字段属性 JSON', i));
							fieldDef.field_id = requiredText(this, field.field_id, '字段 ID', i);
							fieldDef.field_type = fieldType;
						}

						if (field.field_title) {
							fieldDef.field_title = optionalText(this, field.field_title, '字段标题', i, 255);
						}

						// 处理单选/多选的选项更新
						if (
							['FIELD_TYPE_SINGLE_SELECT', 'FIELD_TYPE_SELECT'].includes(fieldType) &&
							field.select_options
						) {
							const options = stringList(
								this,
								field.select_options,
								'选项列表',
								i,
								1,
								1000,
							).map((text, idx) => ({ id: `opt_${idx}`, text }));
							fieldDef[
								fieldType === 'FIELD_TYPE_SINGLE_SELECT'
									? 'property_single_select'
									: 'property_select'
							] = { options };
						}
						if (Object.keys(fieldDef).length === 2) {
							fail(this, '更新字段必须至少提供新标题或字段属性', i);
						}

						fields.push(fieldDef);
					}
				}
				if (fields.length === 0 || fields.length > 150) {
					fail(this, '更新字段数量必须为 1–150 个', i);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/update_fields',
					{
						docid,
						sheet_id,
						fields,
					},
				);
			}
			// 智能表格操作 - 记录
			else if (operation === 'addSmartsheetRecord') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const key_type = this.getNodeParameter(
					'key_type',
					i,
					'CELL_VALUE_KEY_TYPE_FIELD_TITLE',
				) as string;
				if (!['CELL_VALUE_KEY_TYPE_FIELD_TITLE', 'CELL_VALUE_KEY_TYPE_FIELD_ID'].includes(key_type)) {
					fail(this, `不支持的单元格 Key 类型: ${key_type}`, i);
				}
				const recordsCollection = this.getNodeParameter('recordsCollection', i, {}) as IDataObject;

				const records: IDataObject[] = [];
				if (recordsCollection.records && Array.isArray(recordsCollection.records)) {
					for (const record of recordsCollection.records as IDataObject[]) {
						const values: IDataObject = {};
						const cellValues = record.cellValues as IDataObject;

						if (cellValues?.values && Array.isArray(cellValues.values)) {
							for (const cv of cellValues.values as IDataObject[]) {
								const fieldKey = requiredText(this, cv.field_key, '单元格字段 Key', i);
								const valueType = assertCellValueType(this, cv.value_type, i);
								// 使用新的提取函数从结构化字段中获取值
								const value = extractFieldValue(cv);
								if (
									['number', 'progress', 'currency', 'percentage'].includes(valueType) &&
									(typeof value !== 'number' || !Number.isFinite(value))
								) {
									fail(this, `${fieldKey} 的数字值无效`, i);
								}
								if (valueType === 'date_time') {
									integerInRange(this, value, `${fieldKey} 的毫秒时间戳`, i, 0, Number.MAX_SAFE_INTEGER);
								}
								// 将值类型映射到字段类型，然后根据字段类型构建正确的单元格值结构
								const fieldType = mapValueTypeToFieldType(valueType);
								values[fieldKey] = buildCellValueByFieldType(fieldType, value);
							}
						}

						if (!Object.keys(values).length) fail(this, '每条新增记录至少需要 1 个字段值', i);
						records.push({ values });
					}
				}
				if (records.length === 0) fail(this, '添加记录列表不能为空', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/add_records',
					{
						docid,
						sheet_id,
						key_type,
						records,
					},
				);
			} else if (operation === 'delSmartsheetRecord') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const record_ids = stringList(
					this,
					this.getNodeParameter('record_ids', i),
					'记录 ID 列表',
					i,
					1,
					100000,
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/delete_records',
					{
						docid,
						sheet_id,
						record_ids,
					},
				);
			} else if (operation === 'updateSmartsheetRecord') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const key_type = this.getNodeParameter(
					'key_type',
					i,
					'CELL_VALUE_KEY_TYPE_FIELD_TITLE',
				) as string;
				if (!['CELL_VALUE_KEY_TYPE_FIELD_TITLE', 'CELL_VALUE_KEY_TYPE_FIELD_ID'].includes(key_type)) {
					fail(this, `不支持的单元格 Key 类型: ${key_type}`, i);
				}
				const recordsCollection = this.getNodeParameter('recordsCollection', i, {}) as IDataObject;

				const records: IDataObject[] = [];
				if (recordsCollection.records && Array.isArray(recordsCollection.records)) {
					for (const record of recordsCollection.records as IDataObject[]) {
						const values: IDataObject = {};
						const cellValues = record.cellValues as IDataObject;

						if (cellValues?.values && Array.isArray(cellValues.values)) {
							for (const cv of cellValues.values as IDataObject[]) {
								const fieldKey = requiredText(this, cv.field_key, '单元格字段 Key', i);
								const valueType = assertCellValueType(this, cv.value_type, i);
								// 使用新的提取函数从结构化字段中获取值
								const value = extractFieldValue(cv);
								if (
									['number', 'progress', 'currency', 'percentage'].includes(valueType) &&
									(typeof value !== 'number' || !Number.isFinite(value))
								) {
									fail(this, `${fieldKey} 的数字值无效`, i);
								}
								if (valueType === 'date_time') {
									integerInRange(this, value, `${fieldKey} 的毫秒时间戳`, i, 0, Number.MAX_SAFE_INTEGER);
								}
								// 将值类型映射到字段类型，然后根据字段类型构建正确的单元格值结构
								const fieldType = mapValueTypeToFieldType(valueType);
								values[fieldKey] = buildCellValueByFieldType(fieldType, value);
							}
						}

						if (!Object.keys(values).length) fail(this, '每条更新记录至少需要 1 个字段值', i);
						records.push({
							record_id: requiredText(this, record.record_id, '记录 ID', i),
							values,
						});
					}
				}
				if (records.length === 0) fail(this, '更新记录列表不能为空', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/update_records',
					{
						docid,
						sheet_id,
						key_type,
						records,
					},
				);
			} else if (operation === 'sendSmartsheetWebhook') {
				const itemJson = items[i].json as IDataObject;
				const formWebhook = this.getNodeParameter('webhook_url', i, '') as string;
				const webhook_mode = this.getNodeParameter('webhook_mode', i, 'json') as string;
				if (!['add', 'update', 'json'].includes(webhook_mode)) {
					fail(this, `不支持的 Webhook 模式: ${webhook_mode}`, i);
				}
				const webhookUrl =
					formWebhook ||
					(itemJson.webhook_url as string | undefined) ||
					(itemJson.webhookUrl as string | undefined) ||
					(itemJson.url as string | undefined) ||
					'';

				let payload: IDataObject = {};
				if (webhook_mode === 'add' || webhook_mode === 'update') {
					const records_json = this.getNodeParameter('records_json', i, '[]') as string;
					let records: IDataObject[] = [];
					try {
						const parsed = JSON.parse(records_json || '[]');
						if (!Array.isArray(parsed)) {
							fail(this, '记录列表 JSON 必须是数组', i);
						}
						records = parsed as IDataObject[];
					} catch (e) {
						throw new NodeOperationError(
							this.getNode(),
							`记录列表JSON 解析失败: ${(e as Error).message}`,
							{ itemIndex: i },
						);
					}
					if (webhook_mode === 'add') payload = { add_records: records };
					else payload = { update_records: records };
				} else {
					payload = parseRequiredJsonObject(
						this.getNodeParameter('payload_json', i, '{}'),
						'payload_json',
						i,
					);
				}

				delete payload.webhook_url;
				delete payload.webhookUrl;
				delete payload.url;

				const normalizedWebhookUrl = requiredText(this, webhookUrl, 'Webhook 地址', i, 4096);
				let parsedWebhookUrl: URL;
				try {
					parsedWebhookUrl = new URL(normalizedWebhookUrl);
				} catch {
					fail(this, 'Webhook 地址格式无效', i);
				}
				if (
					parsedWebhookUrl.protocol !== 'https:' ||
					parsedWebhookUrl.hostname !== 'qyapi.weixin.qq.com' ||
					parsedWebhookUrl.pathname !== '/cgi-bin/wedoc/smartsheet/webhook' ||
					!parsedWebhookUrl.searchParams.get('key') ||
					parsedWebhookUrl.username ||
					parsedWebhookUrl.password ||
					(parsedWebhookUrl.port && parsedWebhookUrl.port !== '443')
				) {
					fail(
						this,
						'Webhook 地址必须是智能表格“接收外部数据”生成的企业微信 HTTPS 地址',
						i,
					);
				}

				if (!Array.isArray(payload.add_records) && !Array.isArray(payload.update_records)) {
					throw new NodeOperationError(
						this.getNode(),
						'请求体至少需要包含 add_records 或 update_records 数组',
						{ itemIndex: i },
					);
				}
				if (
					(Array.isArray(payload.add_records) && payload.add_records.length === 0) ||
					(Array.isArray(payload.update_records) && payload.update_records.length === 0)
				) {
					fail(this, 'Webhook 记录列表不能为空', i);
				}

				response = (await this.helpers.httpRequest({
					method: 'POST',
					url: parsedWebhookUrl.toString(),
					body: payload,
					json: true,
					disableFollowRedirect: true,
					headers: {
						'Content-Type': 'application/json',
					},
				})) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`智能表格 Webhook 请求失败: ${String(response.errmsg || '')} (错误码: ${String(response.errcode)})`,
						{ itemIndex: i },
					);
				}
			}
			// 获取文档数据
			else if (operation === 'getDocData') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/document/get', {
					docid,
				});
			} else if (operation === 'getSheetRange') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/spreadsheet/get_sheet_properties',
					{ docid },
				);
			} else if (operation === 'getSheetData') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const range = requiredText(this, this.getNodeParameter('range', i), '表格范围', i);

				const body: IDataObject = { docid, sheet_id, range };

				try {
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/wedoc/spreadsheet/get_sheet_range_data',
						body,
					);
				} catch (error) {
					const err = error as Error;
					// 错误码 608668 表示元数据未找到，通常是文档类型不匹配
					if (err.message.includes('608668') || err.message.includes('meta is not found')) {
						throw new NodeOperationError(
							this.getNode(),
							`获取表格数据失败：文档ID "${docid}" 可能不是普通在线表格（spreadsheet），或者文档不存在。此接口仅支持普通在线表格，不支持智能表格（smartsheet）。如果您的文档是智能表格，请使用"查询记录"操作来获取数据。`,
							{ itemIndex: i },
						);
					}
					throw error;
				}
			}
			// 获取智能表格数据
			else if (operation === 'querySmartsheetSheet') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = optionalText(
					this,
					this.getNodeParameter('sheet_id', i, ''),
					'子表 ID',
					i,
				);
				const body: IDataObject = { docid };
				if (sheet_id) body.sheet_id = sheet_id;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/get_sheet',
					body,
				);
			} else if (operation === 'querySmartsheetView') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const view_ids_str = optionalText(
					this,
					this.getNodeParameter('view_ids', i, ''),
					'视图 ID 列表',
					i,
					100000,
				);
				const offset = integerInRange(
					this,
					this.getNodeParameter('offset', i, 0),
					'偏移量',
					i,
					0,
					4294967295,
				);
				const limit = integerInRange(
					this,
					this.getNodeParameter('limit', i, 100),
					'每页数量',
					i,
					0,
					1000,
				);

				const body: IDataObject = { docid, sheet_id, offset, limit };
				if (view_ids_str) {
					body.view_ids = stringList(this, view_ids_str, '视图 ID 列表', i, 1, 1000);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/get_views',
					body,
				);
			} else if (operation === 'querySmartsheetField') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const field_ids_str = optionalText(
					this,
					this.getNodeParameter('field_ids', i, ''),
					'字段 ID 列表',
					i,
					100000,
				);
				const offset = integerInRange(
					this,
					this.getNodeParameter('offset', i, 0),
					'偏移量',
					i,
					0,
					4294967295,
				);
				const limit = integerInRange(
					this,
					this.getNodeParameter('limit', i, 100),
					'每页数量',
					i,
					0,
					1000,
				);

				const body: IDataObject = { docid, sheet_id, offset, limit };
				if (field_ids_str) {
					body.field_ids = stringList(this, field_ids_str, '字段 ID 列表', i, 1, 1000);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/get_fields',
					body,
				);
			} else if (operation === 'querySmartsheetRecord') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const view_id = optionalText(this, this.getNodeParameter('view_id', i, ''), '视图 ID', i);
				const key_type = this.getNodeParameter(
					'key_type',
					i,
					'CELL_VALUE_KEY_TYPE_FIELD_TITLE',
				) as string;
				if (!['CELL_VALUE_KEY_TYPE_FIELD_TITLE', 'CELL_VALUE_KEY_TYPE_FIELD_ID'].includes(key_type)) {
					fail(this, `不支持的单元格 Key 类型: ${key_type}`, i);
				}
				const record_ids_str = optionalText(
					this,
					this.getNodeParameter('record_ids', i, ''),
					'记录 ID 列表',
					i,
					100000,
				);

				const body: IDataObject = { docid, sheet_id, key_type };
				if (view_id) body.view_id = view_id;

				// 处理记录ID
				if (record_ids_str) {
					const record_ids = stringList(this, record_ids_str, '记录 ID 列表', i, 1, 100000);
					if (record_ids.length > 0) {
						body.record_ids = record_ids;
					}
				}

				// 处理筛选条件
				const filterConditions = this.getNodeParameter('filterConditions', i, {}) as IDataObject;
				const conjunction = requiredText(
					this,
					this.getNodeParameter('conjunction', i, 'CONJUNCTION_AND'),
					'筛选条件关系',
					i,
				);
				if (!['CONJUNCTION_AND', 'CONJUNCTION_OR'].includes(conjunction)) {
					fail(this, '筛选条件关系只能是 AND 或 OR', i);
				}

				let hasFilter = false;
				if (filterConditions.conditions && Array.isArray(filterConditions.conditions)) {
					const conditions = filterConditions.conditions as Array<{
						field_id: string;
						field_type: string;
						operator: string;
						value?: string;
					}>;

					if (conditions.length > 0) {
						const apiConditions = conditions.map((condition, conditionIndex) => {
							const fieldId = requiredText(
								this,
								condition.field_id,
								`第 ${conditionIndex + 1} 个筛选字段 ID`,
								i,
							);
							const fieldType = requiredText(
								this,
								condition.field_type,
								`第 ${conditionIndex + 1} 个筛选字段类型`,
								i,
							);
							if (!SMARTSHEET_FIELD_TYPES.has(fieldType)) {
								fail(this, `第 ${conditionIndex + 1} 个筛选字段类型无效`, i);
							}
							const operator = requiredText(
								this,
								condition.operator,
								`第 ${conditionIndex + 1} 个筛选操作符`,
								i,
							);
							if (
								![
									'OPERATOR_IS',
									'OPERATOR_IS_NOT',
									'OPERATOR_CONTAINS',
									'OPERATOR_DOES_NOT_CONTAIN',
									'OPERATOR_IS_GREATER',
									'OPERATOR_IS_GREATER_OR_EQUAL',
									'OPERATOR_IS_LESS',
									'OPERATOR_IS_LESS_OR_EQUAL',
									'OPERATOR_IS_EMPTY',
									'OPERATOR_IS_NOT_EMPTY',
								].includes(operator)
							) {
								fail(this, `第 ${conditionIndex + 1} 个筛选操作符无效`, i);
							}
							const apiCondition: IDataObject = {
								field_id: fieldId,
								field_type: fieldType,
								operator,
							};

							if (
								['OPERATOR_IS_EMPTY', 'OPERATOR_IS_NOT_EMPTY'].includes(operator)
							) {
								return apiCondition;
							}

							// 日期时间类型
							if (
								[
									'FIELD_TYPE_DATE_TIME',
									'FIELD_TYPE_CREATED_TIME',
									'FIELD_TYPE_MODIFIED_TIME',
								].includes(fieldType)
							) {
								const dateTimeType = String(
									(condition as IDataObject).date_time_type || 'DATE_TIME_TYPE_DETAIL_DATE',
								);
								if (
									![
										'DATE_TIME_TYPE_DETAIL_DATE',
										'DATE_TIME_TYPE_TODAY',
										'DATE_TIME_TYPE_TOMORROW',
										'DATE_TIME_TYPE_YESTERDAY',
										'DATE_TIME_TYPE_CURRENT_WEEK',
										'DATE_TIME_TYPE_LAST_WEEK',
										'DATE_TIME_TYPE_CURRENT_MONTH',
										'DATE_TIME_TYPE_THE_PAST_7_DAYS',
										'DATE_TIME_TYPE_THE_NEXT_7_DAYS',
										'DATE_TIME_TYPE_LAST_MONTH',
										'DATE_TIME_TYPE_THE_PAST_30_DAYS',
										'DATE_TIME_TYPE_THE_NEXT_30_DAYS',
									].includes(dateTimeType)
								) {
									fail(this, `第 ${conditionIndex + 1} 个日期筛选类型无效`, i);
								}
								const dateTimeValue: IDataObject = { type: dateTimeType };
								if (dateTimeType === 'DATE_TIME_TYPE_DETAIL_DATE') {
									const dateValue = integerInRange(
										this,
										(condition as IDataObject).date_value,
										`第 ${conditionIndex + 1} 个具体日期毫秒时间戳`,
										i,
										0,
										Number.MAX_SAFE_INTEGER,
									);
									dateTimeValue.value = [
										String(dateValue),
									];
								}
								apiCondition.date_time_value = dateTimeValue;
							}
							// 复选框类型
							else if (fieldType === 'FIELD_TYPE_CHECKBOX') {
								apiCondition.bool_value = {
									value: (condition as IDataObject).bool_value === 'true',
								};
							}
							// 数字、进度类型
							else if (
								fieldType === 'FIELD_TYPE_NUMBER' ||
								fieldType === 'FIELD_TYPE_PROGRESS'
							) {
								const numericValue = Number(condition.value);
								if (!Number.isFinite(numericValue)) {
									fail(this, `第 ${conditionIndex + 1} 个数字筛选值无效`, i);
								}
								apiCondition.number_value = { value: numericValue };
							}
							// 人员类型
							else if (
								[
									'FIELD_TYPE_USER',
									'FIELD_TYPE_CREATED_USER',
									'FIELD_TYPE_MODIFIED_USER',
								].includes(fieldType)
							) {
								const values = stringList(
									this,
									condition.value,
									`第 ${conditionIndex + 1} 个成员筛选值`,
									i,
									1,
									1000,
								);
								apiCondition.user_value = { value: values };
							}
							// 文本、网址、电话、邮箱、地理位置、单选、多选等
							else {
								const values = stringList(
									this,
									condition.value,
									`第 ${conditionIndex + 1} 个筛选值`,
									i,
									1,
									1000,
								);
								apiCondition.string_value = { value: values };
							}

							return apiCondition;
						});

						body.filter_spec = {
							conjunction,
							conditions: apiConditions,
						};
						hasFilter = true;
					}
				}

				// 处理分页
				const pagination = this.getNodeParameter('pagination', i, {}) as IDataObject;
				body.limit = integerInRange(
					this,
					pagination.limit !== undefined ? pagination.limit : 50,
					'每页数量',
					i,
					0,
					1000,
				);
				body.offset = integerInRange(
					this,
					pagination.offset !== undefined ? pagination.offset : 0,
					'偏移量',
					i,
					0,
					4294967295,
				);

				// 处理排序
				const sortConfig = this.getNodeParameter('sort', i, {}) as IDataObject;
				let hasSortRules = false;
				if (sortConfig.rules && Array.isArray(sortConfig.rules) && sortConfig.rules.length > 0) {
					const sortRules = sortConfig.rules as Array<{
						sort_key_type?: string;
						field_id?: string;
						field_title?: string;
						desc: boolean;
					}>;

					body.sort = sortRules.map((rule) => {
						const sortItem: IDataObject = { desc: rule.desc };

						sortItem.field_title = requiredText(
								this,
								rule.field_title,
								'排序字段标题',
								i,
							);

						return sortItem;
					});
					hasSortRules = true;
				}

				// 检查筛选和排序的冲突
				if (hasSortRules && hasFilter) {
					throw new NodeOperationError(
						this.getNode(),
						'排序规则不能与筛选条件同时使用。请只使用其中一个功能。',
						{ itemIndex: i },
					);
				}

				// 处理返回字段
				const returnFields = this.getNodeParameter('returnFields', i, {}) as IDataObject;
				if (returnFields.field_ids) {
					if (key_type !== 'CELL_VALUE_KEY_TYPE_FIELD_ID') {
						fail(this, '返回字段 ID 仅在 Key 类型为“字段 ID”时有效', i);
					}
					const fieldIds = stringList(this, returnFields.field_ids, '返回字段 ID 列表', i, 1, 1000);
					if (fieldIds.length > 0) {
						body.field_ids = fieldIds;
					}
				}
				if (returnFields.field_titles) {
					if (key_type !== 'CELL_VALUE_KEY_TYPE_FIELD_TITLE') {
						fail(this, '返回字段标题仅在 Key 类型为“字段标题”时有效', i);
					}
					const fieldTitles = stringList(
						this,
						returnFields.field_titles,
						'返回字段标题列表',
						i,
						1,
						1000,
					);
					if (fieldTitles.length > 0) {
						body.field_titles = fieldTitles;
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/get_records',
					body,
				);
			}
			// 权限设置
			else if (operation === 'getDocAuth') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/doc_get_auth', {
					docid,
				});
			} else if (operation === 'modDocSafeRule') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const body: IDataObject = { docid };
				const updateReadonlyCopy = this.getNodeParameter(
					'updateReadonlyCopy',
					i,
					false,
				) as boolean;
				const updateWatermark = this.getNodeParameter('updateWatermark', i, false) as boolean;
				if (updateReadonlyCopy) {
					body.enable_readonly_copy = this.getNodeParameter(
						'enable_readonly_copy',
						i,
						false,
					) as boolean;
				}
				if (updateWatermark) {
					const marginType = integerInRange(
						this,
						this.getNodeParameter('watermark_margin_type', i, 1),
						'水印疏密度',
						i,
						1,
						2,
					);
					const showText = this.getNodeParameter('watermark_show_text', i, false) as boolean;
					const watermark: IDataObject = {
						margin_type: marginType,
						show_visitor_name: this.getNodeParameter(
							'watermark_show_visitor_name',
							i,
							true,
						) as boolean,
						show_text: showText,
					};
					if (showText) {
						watermark.text = requiredText(
							this,
							this.getNodeParameter('watermark_text', i, ''),
							'水印文字',
							i,
							255,
						);
					}
					body.watermark = watermark;
				}
				if (Object.keys(body).length === 1) {
					fail(this, '请至少开启一项要更新的文档安全设置', i);
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/mod_doc_safty_setting',
					body,
				);
			} else if (operation === 'modDocMemberRule') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const addMemberCollection = this.getNodeParameter(
					'addMemberCollection',
					i,
					{},
				) as IDataObject;
				const delMemberCollection = this.getNodeParameter(
					'delMemberCollection',
					i,
					{},
				) as IDataObject;
				const updateMemberCollection = this.getNodeParameter(
					'updateMemberCollection',
					i,
					{},
				) as IDataObject;

				const body: IDataObject = { docid };
				const added = Array.isArray(addMemberCollection.members)
					? (addMemberCollection.members as IDataObject[])
					: [];
				const updated = Array.isArray(updateMemberCollection.members)
					? (updateMemberCollection.members as IDataObject[])
					: [];
				const updateMembers = [...added, ...updated].map((member) =>
					buildDocMember(this, member, i, true),
				);
				const memberIdentity = (member: IDataObject) =>
					member.userid ? `userid:${String(member.userid)}` : `external:${String(member.tmp_external_userid)}`;
				const updateIdentities = updateMembers.map(memberIdentity);
				if (new Set(updateIdentities).size !== updateIdentities.length) {
					fail(this, '更新文档通知范围中不能包含重复成员', i);
				}
				if (updateMembers.length > 100) {
					fail(this, '更新文档通知范围单次最多 100 人', i);
				}
				if (updateMembers.filter((member) => member.auth === 7).length > 3) {
					fail(this, '文档管理员最多 3 人', i);
				}
				if (updateMembers.length) body.update_file_member_list = updateMembers;

				const deleted = Array.isArray(delMemberCollection.members)
					? (delMemberCollection.members as IDataObject[]).map((member) =>
							buildDocMember(this, member, i, false),
						)
					: [];
				const deletedIdentities = deleted.map(memberIdentity);
				if (new Set(deletedIdentities).size !== deletedIdentities.length) {
					fail(this, '删除文档通知范围中不能包含重复成员', i);
				}
				const conflictingMember = deletedIdentities.find((identity) => updateIdentities.includes(identity));
				if (conflictingMember) fail(this, '同一成员不能同时更新和删除', i);
				if (deleted.length > 100) fail(this, '删除文档通知范围单次最多 100 人', i);
				if (deleted.length) body.del_file_member_list = deleted;
				if (Object.keys(body).length === 1) {
					fail(this, '请至少添加一项文档通知范围更新或删除', i);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_doc_member', body);
			} else if (operation === 'modDocShareScope') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const body: IDataObject = { docid };
				const updateInternalJoinRule = this.getNodeParameter(
					'updateInternalJoinRule',
					i,
					false,
				) as boolean;
				const updateExternalJoinRule = this.getNodeParameter(
					'updateExternalJoinRule',
					i,
					false,
				) as boolean;
				const updateBanShareExternal = this.getNodeParameter(
					'updateBanShareExternal',
					i,
					false,
				) as boolean;
				const updateCoAuthList = this.getNodeParameter('update_co_auth_list', i, false) as boolean;
				const banShareExternal = updateBanShareExternal
					? (this.getNodeParameter('ban_share_external', i, false) as boolean)
					: undefined;

				if (updateInternalJoinRule) {
					const enableCorpInternal = this.getNodeParameter(
						'enable_corp_internal',
						i,
						true,
					) as boolean;
					body.enable_corp_internal = enableCorpInternal;
					body.corp_internal_auth = integerInRange(
						this,
						this.getNodeParameter('corp_internal_auth', i, 2),
						'企业内成员权限',
						i,
						1,
						2,
					);
					const internalApproveOnlyByAdmin = this.getNodeParameter(
						'corp_internal_approve_only_by_admin',
						i,
						false,
					) as boolean;
					if (!enableCorpInternal && !internalApproveOnlyByAdmin) {
						fail(this, '禁止企业内成员浏览时，仅管理员审批必须开启', i);
					}
					body.corp_internal_approve_only_by_admin = internalApproveOnlyByAdmin;
				}

				if (updateExternalJoinRule) {
					const enableCorpExternal = this.getNodeParameter(
						'enable_corp_external',
						i,
						false,
					) as boolean;
					body.enable_corp_external = enableCorpExternal;
					body.corp_external_auth = integerInRange(
						this,
						this.getNodeParameter('corp_external_auth', i, 1),
						'企业外成员权限',
						i,
						1,
						2,
					);
					const externalApproveOnlyByAdmin = this.getNodeParameter(
						'corp_external_approve_only_by_admin',
						i,
						true,
					) as boolean;
					if (!enableCorpExternal && banShareExternal !== true && !externalApproveOnlyByAdmin) {
						fail(this, '禁止企业外成员浏览时，仅管理员审批必须开启', i);
					}
					body.corp_external_approve_only_by_admin = externalApproveOnlyByAdmin;
				}

				if (updateBanShareExternal) {
					body.ban_share_external = banShareExternal;
				}

				if (updateCoAuthList) {
					const coAuthCollection = this.getNodeParameter('coAuthCollection', i, {}) as IDataObject;
					const rawDepartments = Array.isArray(coAuthCollection.departments)
						? (coAuthCollection.departments as IDataObject[])
						: Array.isArray(coAuthCollection.members)
							? (coAuthCollection.members as IDataObject[])
							: [];

					body.update_co_auth_list = true;
					body.co_auth_list = rawDepartments.map((department) => {
						const type = department.type ?? 2;

						if (Number(type) !== 2) fail(this, '修改文档加入规则的特定权限列表目前只支持部门类型', i);

						return {
							departmentid: integerInRange(
								this,
								department.departmentid || department.departmentid_selected,
								'部门 ID',
								i,
								1,
								Number.MAX_SAFE_INTEGER,
							),
							auth: integerInRange(this, department.auth, '部门权限', i, 1, 2),
							type: 2,
						};
					});
				}

				if (Object.keys(body).length === 1) {
					throw new NodeOperationError(this.getNode(), '请至少开启一项要更新的加入规则设置', {
						itemIndex: i,
					});
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/mod_doc_join_rule',
					body,
				);
			} else if (operation === 'getSmartsheetGroupChatList') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const cursor = optionalText(
					this,
					this.getNodeParameter('cursor', i, ''),
					'分页游标',
					i,
					4096,
				);
				const limit = integerInRange(
					this,
					this.getNodeParameter('limit', i, 100),
					'每页数量',
					i,
					1,
					200,
				);

				const body: IDataObject = {
					docid,
				};

				if (cursor) {
					body.cursor = cursor;
				}

				body.limit = limit;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/groupchat/list',
					body,
				);
			} else if (operation === 'getSmartsheetGroupChat') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const chat_id = requiredText(this, this.getNodeParameter('chat_id', i), '群聊 ID', i);

				const body: IDataObject = {
					docid,
					chat_id,
				};

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/groupchat/get',
					body,
				);
			} else if (operation === 'updateSmartsheetGroupChat') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const chat_id = requiredText(this, this.getNodeParameter('chat_id', i), '群聊 ID', i);
				const owner = optionalText(
					this,
					this.getNodeParameter('owner', i, '') ||
						this.getNodeParameter('owner_selected', i, ''),
					'新群主 ID',
					i,
				);
				const addUserRaw = [
					this.getNodeParameter('add_user_list', i, ''),
					this.getNodeParameter('add_user_list_selected', i, []),
				];
				const delUserRaw = [
					this.getNodeParameter('del_user_list', i, ''),
					this.getNodeParameter('del_user_list_selected', i, []),
				];
				const addUsers = stringList(this, addUserRaw, '添加成员列表', i, 0, 500);
				const delUsers = stringList(this, delUserRaw, '删除成员列表', i, 0, 500);
				const overlap = addUsers.find((userid) => delUsers.includes(userid));
				if (overlap) fail(this, `成员 ${overlap} 不能同时出现在添加和删除列表`, i);
				if (!owner && !addUsers.length && !delUsers.length) {
					fail(this, '修改群聊至少需要新群主、添加成员或删除成员中的一项', i);
				}

				const body: IDataObject = {
					docid,
					chat_id,
				};

				if (owner) {
					body.owner = owner;
				}

				if (addUsers.length) body.add_user_list = addUsers;
				if (delUsers.length) body.del_user_list = delUsers;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/groupchat/update',
					body,
				);
			} else if (operation === 'manageSmartsheetAuth') {
				// https://developer.work.weixin.qq.com/document/path/99935
				// 简化：更新某一子表内容权限（默认全员规则）
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				// 兼容旧参数 enable + defaultRule.edit
				let sheet_priv_level = this.getNodeParameter('sheet_priv_level', i, 0) as number;
				if (!sheet_priv_level) {
					const enable = this.getNodeParameter('enable', i, true) as boolean;
					const defaultRule = this.getNodeParameter('defaultRule', i, {}) as IDataObject;
					if (!enable) sheet_priv_level = 4;
					else if (defaultRule?.edit) sheet_priv_level = 2;
					else if (defaultRule?.read !== false) sheet_priv_level = 3;
					else sheet_priv_level = 4;
				}
				const manage_priv_type = this.getNodeParameter('manage_priv_type', i, 1) as number;
				const manage_rule_id = this.getNodeParameter('manage_rule_id', i, 0) as number;
				if (![1, 2].includes(manage_priv_type)) fail(this, '权限规则类型只能是 1 或 2', i);
				if (manage_priv_type === 2 && (!Number.isSafeInteger(manage_rule_id) || manage_rule_id <= 0)) {
					fail(this, '额外权限必须提供大于 0 的规则 ID', i);
				}
				if (![1, 2, 3, 4].includes(sheet_priv_level)) fail(this, '子表权限只能是 1、2、3 或 4', i);
				const can_insert_record = this.getNodeParameter(
					'can_insert_record',
					i,
					true,
				) as boolean;
				const can_delete_record = this.getNodeParameter(
					'can_delete_record',
					i,
					true,
				) as boolean;
				const can_create_modify_delete_view = this.getNodeParameter(
					'can_create_modify_delete_view',
					i,
					true,
				) as boolean;
				const record_range_type = this.getNodeParameter(
					'record_range_type',
					i,
					1,
				) as number;
				if (![1, 2, 3].includes(record_range_type)) {
					fail(this, '记录生效范围只能是 1、2 或 3', i);
				}
				const manageAuthExtraJson = this.getNodeParameter(
					'manageAuthExtraJson',
					i,
					'{}',
				) as string;

				const privItem: IDataObject = {
					sheet_id,
					priv: sheet_priv_level,
				};
				if (sheet_priv_level === 2) {
					privItem.can_insert_record = can_insert_record;
					privItem.can_delete_record = can_delete_record;
				}
				if (sheet_priv_level === 1 || sheet_priv_level === 2 || sheet_priv_level === 3) {
					privItem.can_create_modify_delete_view = can_create_modify_delete_view;
				}
				if (sheet_priv_level === 2 || sheet_priv_level === 3) {
					privItem.record_priv = { record_range_type };
				}

				const body: IDataObject = {
					docid,
					type: manage_priv_type,
					priv_list: [privItem],
				};
				if (manage_priv_type === 2 && manage_rule_id) body.rule_id = manage_rule_id;
				Object.assign(
					body,
					parseRequiredJsonObject(manageAuthExtraJson || '{}', '权限扩展 JSON', i),
				);
				body.docid = docid;
				body.type = manage_priv_type;
				if (manage_priv_type === 2) body.rule_id = manage_rule_id;
				body.priv_list = validateSmartsheetPrivList(this, body.priv_list, i);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/update_sheet_priv',
					body,
				);
			}
			// 收集表
			else if (operation === 'createForm') {
				const spaceid = optionalText(this, this.getNodeParameter('spaceid', i, ''), '空间 ID', i);
				const fatherid = optionalText(this, this.getNodeParameter('fatherid', i, ''), '父目录 ID', i);
				const form_title = requiredText(
					this,
					this.getNodeParameter('form_title', i),
					'收集表标题',
					i,
					255,
				);
				const form_description = optionalText(
					this,
					this.getNodeParameter('form_description', i, ''),
					'收集表描述',
					i,
					4000,
				);
				const form_header = optionalText(
					this,
					this.getNodeParameter('form_header', i, ''),
					'收集表头图',
					i,
					4096,
				);
				const questionList = this.getNodeParameter('questionList', i, {}) as IDataObject;
				const formSetting = this.getNodeParameter('formSetting', i, {}) as IDataObject;
				const rawQuestions = Array.isArray(questionList.questions)
					? (questionList.questions as IDataObject[])
					: [];
				if (rawQuestions.length < 1 || rawQuestions.length > 200) {
					fail(this, '收集表问题数量必须为 1–200 个', i);
				}

				const body: IDataObject = {};

				// 添加 spaceid 和 fatherid（如果提供）
				if (spaceid) {
					body.spaceid = spaceid;
				}
				if (fatherid) {
					body.fatherid = fatherid;
				}

				const form_info: IDataObject = {
					form_title: form_title,
				};

				if (form_description) {
					form_info.form_desc = form_description;
				}

				if (form_header) {
					form_info.form_header = form_header;
				}

				// 家校范围的题目 ID 从 2 开始，其余从 1 开始。
				const firstQuestionId = Number(formSetting.fill_out_auth ?? 0) === 4 ? 2 : 1;
				const items = rawQuestions.map((q, idx) => {
						const questionTitle = requiredText(this, q.question_title, `第 ${idx + 1} 题标题`, i, 4000);
						const questionType = integerInRange(
							this,
							q.question_type,
							`第 ${idx + 1} 题类型`,
							i,
							1,
							22,
						);
						if (!FORM_QUESTION_TYPES.has(questionType)) {
							fail(this, `第 ${idx + 1} 题使用了不支持的问题类型 ${questionType}`, i);
						}
						const question: IDataObject = {
							question_id: firstQuestionId + idx,
							title: questionTitle,
							pos: idx + 1,
							status: 1,
							reply_type: questionType,
							must_reply: Boolean(q.is_required),
						};

						// 添加备注
						const note = optionalText(this, q.note, `第 ${idx + 1} 题备注`, i, 4000);
						if (note) question.note = note;

						// 处理选项（单选/多选/下拉列表）
						if ([2, 3, 15].includes(questionType)) {
							const options = stringList(
								this,
								q.options,
								`第 ${idx + 1} 题选项`,
								i,
								1,
								200,
							);
							question.option_item = options.map((opt, optIdx) => ({
								key: optIdx + 1,
								value: opt,
								status: 1,
							}));
						}

						// 处理问题扩展设置
						const rawExtendSetting = String(q.question_extend_setting ?? '').trim();
						if (rawExtendSetting && rawExtendSetting !== '{}') {
							const extendSetting = parseRequiredJsonObject(
								q.question_extend_setting,
								`第 ${idx + 1} 题扩展设置 JSON`,
								i,
							);
							if (Object.keys(extendSetting).length) question.question_extend_setting = extendSetting;
						}

						return question;
					});

				form_info.form_question = { items };

				// 构建设置
				if (Object.keys(formSetting).length > 0) {
					const processedSetting = processFormSetting(this, formSetting, i);
					if (Object.keys(processedSetting).length > 0) {
						form_info.form_setting = processedSetting;
					}
				}

				body.form_info = form_info;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/create_form', body);
			} else if (operation === 'modForm') {
				const formid = requiredText(this, this.getNodeParameter('formid', i), '收集表 ID', i);
				const oper = integerInRange(
					this,
					this.getNodeParameter('formOper', i, 1),
					'修改类型',
					i,
					1,
					2,
				);
				const formInfoJson = this.getNodeParameter('formInfoJson', i, '{}');
				const form_info = parseRequiredJsonObject(formInfoJson, '完整 Form Info JSON', i);
				if (oper === 1) {
					const formTitle = optionalText(
						this,
						this.getNodeParameter('form_title', i, ''),
						'收集表标题',
						i,
						255,
					);
					const formDescription = optionalText(
						this,
						this.getNodeParameter('form_description', i, ''),
						'收集表描述',
						i,
						4000,
					);
					const formHeader = optionalText(
						this,
						this.getNodeParameter('form_header', i, ''),
						'收集表头图',
						i,
						4096,
					);
					if (formTitle) form_info.form_title = formTitle;
					if (formDescription) form_info.form_desc = formDescription;
					if (formHeader) form_info.form_header = formHeader;
					if (form_info.form_setting !== undefined) {
						fail(this, '全量修改问题（oper=1）不能同时提交 form_setting', i);
					}
				} else {
					const formSetting = this.getNodeParameter('formSetting', i, {}) as IDataObject;
					const processedSetting = Object.keys(formSetting).length
						? processFormSetting(this, formSetting, i)
						: {};
					const jsonSetting =
						form_info.form_setting &&
						typeof form_info.form_setting === 'object' &&
						!Array.isArray(form_info.form_setting)
							? (form_info.form_setting as IDataObject)
							: {};
					const extraKeys = Object.keys(form_info).filter((key) => key !== 'form_setting');
					if (extraKeys.length) {
						fail(this, '全量修改设置（oper=2）时 Form Info JSON 只能包含 form_setting', i);
					}
					const mergedSetting = { ...processedSetting, ...jsonSetting };
					if (!Object.keys(mergedSetting).length) {
						fail(this, '全量修改设置时请填写收集表设置表单或 form_setting JSON', i);
					}
					form_info.form_setting = mergedSetting;
				}
				if (!Object.keys(form_info).length) fail(this, '编辑收集表至少需要一项 form_info 内容', i);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/modify_form', {
					oper,
					formid,
					form_info,
				});
			} else if (operation === 'getFormInfo') {
				const formid = requiredText(this, this.getNodeParameter('formid', i), '收集表 ID', i);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_info', {
					formid,
				});
			}
			// 收集表的统计信息查询
			else if (operation === 'getFormStatistic') {
				const repeated_id = requiredText(
					this,
					this.getNodeParameter('repeated_id', i),
					'收集表 Repeated ID',
					i,
				);
				const req_type = integerInRange(
					this,
					this.getNodeParameter('req_type', i),
					'请求类型',
					i,
					1,
					3,
				);

				const body: IDataObject = {
					repeated_id,
					req_type,
				};

				// 如果是获取已提交列表（req_type=2），需要时间范围
				if (req_type === 2) {
					const start_time = dateTimeToUnixSeconds(
						this,
						this.getNodeParameter('start_time', i),
						'开始时间',
						i,
					);
					const end_time = dateTimeToUnixSeconds(
						this,
						this.getNodeParameter('end_time', i),
						'结束时间',
						i,
					);
					if (start_time > end_time) fail(this, '开始时间不能晚于结束时间', i);
					body.start_time = start_time;
					body.end_time = end_time;

					// 添加分页参数
					const limit = integerInRange(
						this,
						this.getNodeParameter('limit', i, 20),
						'每页数量',
						i,
						1,
						10000,
					);
					const cursor = integerInRange(
						this,
						this.getNodeParameter('cursor', i, 0),
						'分页游标',
						i,
						0,
						Number.MAX_SAFE_INTEGER,
					);
					body.limit = limit;
					if (cursor > 0) {
						body.cursor = cursor;
					}
				}
				// 如果是获取未提交列表（req_type=3），需要分页参数
				else if (req_type === 3) {
					const limit = integerInRange(
						this,
						this.getNodeParameter('limit', i, 20),
						'每页数量',
						i,
						1,
						10000,
					);
					const cursor = integerInRange(
						this,
						this.getNodeParameter('cursor', i, 0),
						'分页游标',
						i,
						0,
						Number.MAX_SAFE_INTEGER,
					);
					body.limit = limit;
					if (cursor > 0) {
						body.cursor = cursor;
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/get_form_statistic',
					body,
				);
			}
			// 读取收集表答案
			else if (operation === 'getFormAnswer') {
				const repeated_id = requiredText(
					this,
					this.getNodeParameter('repeated_id', i),
					'收集表 Repeated ID',
					i,
				);
				const answer_ids = stringList(
					this,
					this.getNodeParameter('answer_ids', i),
					'答案 ID 列表',
					i,
					1,
					100,
				).map((id) => integerInRange(this, id, '答案 ID', i, 1, Number.MAX_SAFE_INTEGER));

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_answer', {
					repeated_id,
					answer_ids,
				});
			}
			// 高级账号管理
			else if (operation === 'allocateAdvancedAccount') {
				const userid_list = stringList(
					this,
					[
						this.getNodeParameter('userid_list', i, ''),
						this.getNodeParameter('userid_list_selected', i, []),
					],
					'成员 UserID 列表',
					i,
					1,
					100,
				);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip/batch_add', {
					userid_list,
				});
			} else if (operation === 'deallocateAdvancedAccount') {
				const userid_list = stringList(
					this,
					[
						this.getNodeParameter('userid_list', i, ''),
						this.getNodeParameter('userid_list_selected', i, []),
					],
					'成员 UserID 列表',
					i,
					1,
					100,
				);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip/batch_del', {
					userid_list,
				});
			} else if (operation === 'getAdvancedAccountList') {
				const limit = integerInRange(
					this,
					this.getNodeParameter('limit', i, 100),
					'每页数量',
					i,
					1,
					200,
				);
				const cursor = optionalText(
					this,
					this.getNodeParameter('cursor', i, ''),
					'分页游标',
					i,
					4096,
				);

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip/list', body);
			} else if (operation === 'uploadDocImage') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const imageSource = requiredText(
					this,
					this.getNodeParameter('imageSource', i),
					'图片来源',
					i,
				);
				if (!['binary', 'base64'].includes(imageSource)) {
					fail(this, '图片来源只能是二进制数据或 Base64 字符串', i);
				}

				let base64Content: string;

				if (imageSource === 'binary') {
					// 从二进制数据读取并转换为 base64
					const binaryPropertyName = requiredText(
						this,
						this.getNodeParameter('binaryProperty', i),
						'二进制数据属性',
						i,
					);
					const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					if (!dataBuffer.length) fail(this, '二进制图片内容不能为空', i);
					base64Content = dataBuffer.toString('base64');
				} else {
					// 直接使用用户提供的 base64 字符串
					base64Content = normalizedBase64(
						this,
						this.getNodeParameter('base64Content', i),
						'Base64 图片内容',
						i,
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/image_upload', {
					docid,
					base64_content: base64Content,
				});
			} else if (operation === 'getSheetPriv') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const type = this.getNodeParameter('priv_type', i, 1) as number;
				const rule_id_list_raw = this.getNodeParameter('rule_id_list', i, '') as string;
				if (![1, 2].includes(type)) fail(this, '权限规则类型只能是 1 或 2', i);
				const body: IDataObject = { docid, type };
				if (rule_id_list_raw) {
					body.rule_id_list = stringList(this, rule_id_list_raw, '规则 ID 列表', i, 1, 20).map(
						(id) => integerInRange(this, id, '规则 ID', i, 1, 4294967295),
					);
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/get_sheet_priv',
					body,
				);
			} else if (operation === 'createPrivRule') {
				// https://developer.work.weixin.qq.com/document/path/99935 新增额外权限
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const name = requiredText(
					this,
					this.getNodeParameter('rule_name', i, ''),
					'规则名称',
					i,
					255,
				);
				const body: IDataObject = { docid, name };
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/create_rule',
					body,
				);
			} else if (operation === 'updateSheetPrivFull') {
				// https://developer.work.weixin.qq.com/document/path/99935 更新子表权限
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const update_priv_type = this.getNodeParameter('update_priv_type', i, 2) as number;
				const priv_rule_id = this.getNodeParameter('priv_rule_id', i, 0) as number;
				const update_priv_name = optionalText(
					this,
					this.getNodeParameter('update_priv_name', i, ''),
					'权限规则名称',
					i,
					255,
				);
				const privListCollection = this.getNodeParameter(
					'privListCollection',
					i,
					{},
				) as IDataObject;
				const privRuleJson = this.getNodeParameter('privRuleJson', i, '{}') as string;
				const body: IDataObject = { docid, type: update_priv_type };
				if (![1, 2].includes(update_priv_type)) fail(this, '权限规则类型只能是 1 或 2', i);
				if (update_priv_type === 2) {
					body.rule_id = integerInRange(this, priv_rule_id, '规则 ID', i, 1, 4294967295);
				}
				if (update_priv_type === 2 && update_priv_name) body.name = update_priv_name;
				const priv_list = ((privListCollection?.items as IDataObject[]) || [])
					.filter((p) => p.sheet_id)
					.map((p) => {
						const item: IDataObject = {
							sheet_id: requiredText(this, p.sheet_id, '子表 ID', i),
							priv: integerInRange(this, p.priv ?? 2, '子表权限', i, 1, 4),
						};
						if (p.can_insert_record !== undefined) {
							item.can_insert_record = p.can_insert_record;
						}
						if (p.can_delete_record !== undefined) {
							item.can_delete_record = p.can_delete_record;
						}
						if (p.can_create_modify_delete_view !== undefined) {
							item.can_create_modify_delete_view = p.can_create_modify_delete_view;
						}
						if (p.clear) item.clear = true;
						const privNum = Number(p.priv ?? 2);
						if (privNum === 2 || privNum === 3) {
							item.record_priv = {
								record_range_type: integerInRange(
									this,
									p.record_range_type ?? 1,
									'记录生效范围',
									i,
									1,
									3,
								),
							};
						}
						return item;
					});
				if (priv_list.length) body.priv_list = priv_list;
				Object.assign(body, parseRequiredJsonObject(privRuleJson || '{}', '权限规则 JSON', i));
				body.docid = docid;
				body.type = update_priv_type;
				if (update_priv_type === 2) body.rule_id = priv_rule_id;
				if (body.priv_list !== undefined) {
					body.priv_list = validateSmartsheetPrivList(this, body.priv_list, i);
				}
				if (!body.name && !body.priv_list) fail(this, '更新子表权限至少需要规则名称或子表权限列表', i);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/update_sheet_priv',
					body,
				);
			} else if (operation === 'modPrivRuleMember') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const priv_rule_id = this.getNodeParameter('priv_rule_id', i, 0) as number;
				const add_member_userids = this.getNodeParameter('add_member_userids', i, '') as string;
				const del_member_userids = this.getNodeParameter('del_member_userids', i, '') as string;
				const body: IDataObject = {
					docid,
					rule_id: integerInRange(this, priv_rule_id, '规则 ID', i, 1, 4294967295),
				};
				const addUsers = stringList(
					this,
					[
						add_member_userids,
						this.getNodeParameter('add_member_userids_selected', i, []),
					],
					'添加成员 UserID 列表',
					i,
					0,
					50,
				);
				const delUsers = stringList(
					this,
					[
						del_member_userids,
						this.getNodeParameter('del_member_userids_selected', i, []),
					],
					'删除成员 UserID 列表',
					i,
					0,
					50,
				);
				if (new Set([...addUsers, ...delUsers]).size > 50) {
					fail(this, '一条额外权限规则的成员变更最多涉及 50 人', i);
				}
				if (addUsers.length === 0 && delUsers.length === 0) {
					fail(this, '请至少提供 1 个要添加或删除的成员 UserID', i);
				}
				const overlap = addUsers.find((userid) => delUsers.includes(userid));
				if (overlap) fail(this, `成员 ${overlap} 不能同时添加和删除`, i);
				if (addUsers.length) body.add_member_range = { userid_list: addUsers };
				if (delUsers.length) body.del_member_range = { userid_list: delUsers };
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/mod_rule_member',
					body,
				);
			} else if (operation === 'deletePrivRule') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const rule_id_list_raw = this.getNodeParameter('rule_id_list', i, '') as string;
				const body: IDataObject = {
					docid,
					rule_id_list: stringList(this, rule_id_list_raw, '规则 ID 列表', i, 1, 20).map(
						(id) => integerInRange(this, id, '规则 ID', i, 1, 4294967295),
					),
				};
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/delete_rule',
					body,
				);
			} else if (operation === 'addFieldGroup') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const name = requiredText(this, this.getNodeParameter('group_name', i), '编组名称', i, 255);
				const field_ids = this.getNodeParameter('field_ids', i, '') as string;
				const body: IDataObject = { docid, sheet_id, name };
				if (field_ids) {
					body.children = stringList(this, field_ids, '字段 ID 列表', i, 1, 150).map(
						(field_id) => ({ field_id }),
					);
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/add_field_group',
					body,
				);
			} else if (operation === 'updateFieldGroup') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const group_id = requiredText(this, this.getNodeParameter('group_id', i), '编组 ID', i);
				const name = optionalText(this, this.getNodeParameter('group_name', i, ''), '编组名称', i, 255);
				const field_ids = this.getNodeParameter('field_ids', i, '') as string;
				const body: IDataObject = { docid, sheet_id, group_id };
				if (name) body.name = name;
				if (field_ids) {
					body.children = stringList(this, field_ids, '字段 ID 列表', i, 1, 150).map(
						(field_id) => ({ field_id }),
					);
				}
				if (!name && !field_ids) fail(this, '更新编组至少需要新名称或字段列表', i);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/update_field_group',
					body,
				);
			} else if (operation === 'deleteFieldGroups') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const group_id = this.getNodeParameter('group_id', i) as string;
				const group_id_list = stringList(this, group_id, '编组 ID 列表', i, 1, 150);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/delete_field_groups',
					{ docid, sheet_id, group_id_list },
				);
			} else if (operation === 'getFieldGroups') {
				const docid = requiredText(this, this.getNodeParameter('docid', i), '文档 ID', i);
				const sheet_id = requiredText(this, this.getNodeParameter('sheet_id', i), '子表 ID', i);
				const offset = integerInRange(
					this,
					this.getNodeParameter('offset', i, 0),
					'偏移量',
					i,
					0,
					4294967295,
				);
				const limit = integerInRange(
					this,
					this.getNodeParameter('limit', i, 100),
					'每页数量',
					i,
					0,
					1000,
				);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/get_field_groups',
					{ docid, sheet_id, offset, limit },
				);
			} else {
				fail(this, `不支持的文档操作: ${operation}`, i);
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error instanceof Error ? error.message : String(error),
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}

	return returnData;
}
