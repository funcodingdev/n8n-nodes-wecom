import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export function fail(context: IExecuteFunctions, message: string, itemIndex: number): never {
	throw new NodeOperationError(context.getNode(), message, { itemIndex });
}

function characterLength(value: string): number {
	return Array.from(value).length;
}

export function requireText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumCharacters?: number,
): string {
	const text = String(value ?? '').trim();
	if (!text) fail(context, `${label}不能为空`, itemIndex);
	if (maximumCharacters !== undefined && characterLength(text) > maximumCharacters) {
		fail(context, `${label}不能超过 ${maximumCharacters} 个字符`, itemIndex);
	}
	return text;
}

export function optionalText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumCharacters?: number,
): string | undefined {
	const text = String(value ?? '').trim();
	if (!text) return undefined;
	if (maximumCharacters !== undefined && characterLength(text) > maximumCharacters) {
		fail(context, `${label}不能超过 ${maximumCharacters} 个字符`, itemIndex);
	}
	return text;
}

export function requireByteText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumBytes: number,
): string {
	const text = requireText(context, value, label, itemIndex);
	if (Buffer.byteLength(text, 'utf8') > maximumBytes) {
		fail(context, `${label}不能超过 ${maximumBytes} 个 UTF-8 字节`, itemIndex);
	}
	return text;
}

export function optionalByteText(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	maximumBytes: number,
): string | undefined {
	const text = optionalText(context, value, label, itemIndex);
	if (text !== undefined && Buffer.byteLength(text, 'utf8') > maximumBytes) {
		fail(context, `${label}不能超过 ${maximumBytes} 个 UTF-8 字节`, itemIndex);
	}
	return text;
}

export function buildConclusion(
	context: IExecuteFunctions,
	itemIndex: number,
): IDataObject {
	const type = String(context.getNodeParameter('conclusionType', itemIndex, 'text'));
	if (type === 'text') {
		return {
			text: {
				content: requireByteText(
					context,
					context.getNodeParameter('conclusion_text', itemIndex, ''),
					'结束语文本',
					itemIndex,
					4000,
				),
			},
		};
	}
	if (type === 'image') {
		return {
			image: {
				media_id: requireText(
					context,
					context.getNodeParameter('conclusion_image_media_id', itemIndex, ''),
					'结束语图片 Media ID',
					itemIndex,
				),
			},
		};
	}
	if (type === 'link') {
		const link: IDataObject = {
			title: requireByteText(
				context,
				context.getNodeParameter('conclusion_link_title', itemIndex, ''),
				'结束语链接标题',
				itemIndex,
				128,
			),
			url: requireText(
				context,
				context.getNodeParameter('conclusion_link_url', itemIndex, ''),
				'结束语链接 URL',
				itemIndex,
			),
		};
		const picurl = optionalText(
			context,
			context.getNodeParameter('conclusion_link_picurl', itemIndex, ''),
			'结束语链接封面 URL',
			itemIndex,
		);
		const desc = optionalByteText(
			context,
			context.getNodeParameter('conclusion_link_desc', itemIndex, ''),
			'结束语链接描述',
			itemIndex,
			512,
		);
		if (picurl) link.picurl = picurl;
		if (desc) link.desc = desc;
		return { link };
	}
	if (type === 'miniprogram') {
		return {
			miniprogram: {
				title: requireByteText(
					context,
					context.getNodeParameter('conclusion_miniprogram_title', itemIndex, ''),
					'结束语小程序标题',
					itemIndex,
					64,
				),
				appid: requireText(
					context,
					context.getNodeParameter('conclusion_miniprogram_appid', itemIndex, ''),
					'结束语小程序 AppID',
					itemIndex,
				),
				page: requireText(
					context,
					context.getNodeParameter('conclusion_miniprogram_page', itemIndex, ''),
					'结束语小程序页面路径',
					itemIndex,
				),
				pic_media_id: requireText(
					context,
					context.getNodeParameter('conclusion_miniprogram_pic_media_id', itemIndex, ''),
					'结束语小程序封面 Media ID',
					itemIndex,
				),
			},
		};
	}
	fail(context, '结束语类型无效', itemIndex);
}

export function buildMessageAttachments(
	context: IExecuteFunctions,
	itemIndex: number,
	value: unknown,
): IDataObject[] {
	const attachments: IDataObject[] = [];
	for (const [imageIndex, row] of collectionRows(value, 'images').entries()) {
		const mediaId = optionalText(context, row.media_id, `第 ${imageIndex + 1} 个图片 Media ID`, itemIndex);
		const picUrl = optionalByteText(context, row.pic_url, `第 ${imageIndex + 1} 个图片 URL`, itemIndex, 2048);
		if (!mediaId && !picUrl) fail(context, `第 ${imageIndex + 1} 个图片必须填写 Media ID 或图片 URL`, itemIndex);
		attachments.push({ msgtype: 'image', image: mediaId ? { media_id: mediaId } : { pic_url: picUrl } });
	}
	for (const [linkIndex, row] of collectionRows(value, 'links').entries()) {
		const link: IDataObject = {
			title: requireByteText(context, row.title, `第 ${linkIndex + 1} 个链接标题`, itemIndex, 128),
			url: requireByteText(context, row.url, `第 ${linkIndex + 1} 个链接 URL`, itemIndex, 2048),
		};
		const picurl = optionalByteText(context, row.picurl, `第 ${linkIndex + 1} 个链接封面 URL`, itemIndex, 2048);
		const desc = optionalByteText(context, row.desc, `第 ${linkIndex + 1} 个链接描述`, itemIndex, 512);
		if (picurl) link.picurl = picurl;
		if (desc) link.desc = desc;
		attachments.push({ msgtype: 'link', link });
	}
	for (const [miniIndex, row] of collectionRows(value, 'miniprograms').entries()) {
		attachments.push({
			msgtype: 'miniprogram',
			miniprogram: {
				title: requireByteText(context, row.title, `第 ${miniIndex + 1} 个小程序标题`, itemIndex, 64),
				pic_media_id: requireText(context, row.pic_media_id, `第 ${miniIndex + 1} 个小程序封面 Media ID`, itemIndex),
				appid: requireText(context, row.appid, `第 ${miniIndex + 1} 个小程序 AppID`, itemIndex),
				page: requireText(context, row.page, `第 ${miniIndex + 1} 个小程序页面路径`, itemIndex),
			},
		});
	}
	for (const [videoIndex, row] of collectionRows(value, 'videos').entries()) {
		attachments.push({
			msgtype: 'video',
			video: {
				media_id: requireText(context, row.media_id, `第 ${videoIndex + 1} 个视频 Media ID`, itemIndex),
			},
		});
	}
	for (const [fileIndex, row] of collectionRows(value, 'files').entries()) {
		attachments.push({
			msgtype: 'file',
			file: {
				media_id: requireText(context, row.media_id, `第 ${fileIndex + 1} 个文件 Media ID`, itemIndex),
			},
		});
	}
	if (attachments.length < 1 || attachments.length > 9) {
		fail(context, '附件数量必须为 1–9 个', itemIndex);
	}
	return attachments;
}

export function buildSingleWelcomeAttachment(
	context: IExecuteFunctions,
	itemIndex: number,
	typeValue: unknown,
): IDataObject {
	const type = String(typeValue ?? 'none');
	if (type === 'none') return {};
	if (type === 'image') {
		const mediaId = optionalText(
			context,
			context.getNodeParameter('image_media_id', itemIndex, ''),
			'图片 Media ID',
			itemIndex,
		);
		const picUrl = optionalByteText(
			context,
			context.getNodeParameter('image_pic_url', itemIndex, ''),
			'图片 URL',
			itemIndex,
			2048,
		);
		if (!mediaId && !picUrl) fail(context, '图片必须填写 Media ID 或图片 URL', itemIndex);
		return { image: mediaId ? { media_id: mediaId } : { pic_url: picUrl } };
	}
	if (type === 'link') {
		const link: IDataObject = {
			title: requireByteText(
				context,
				context.getNodeParameter('link_title', itemIndex, ''),
				'链接标题',
				itemIndex,
				128,
			),
			url: requireByteText(
				context,
				context.getNodeParameter('link_url', itemIndex, ''),
				'链接 URL',
				itemIndex,
				2048,
			),
		};
		const picurl = optionalByteText(
			context,
			context.getNodeParameter('link_picurl', itemIndex, ''),
			'链接封面 URL',
			itemIndex,
			2048,
		);
		const desc = optionalByteText(
			context,
			context.getNodeParameter('link_desc', itemIndex, ''),
			'链接描述',
			itemIndex,
			512,
		);
		if (picurl) link.picurl = picurl;
		if (desc) link.desc = desc;
		return { link };
	}
	if (type === 'miniprogram') {
		return {
			miniprogram: {
				title: requireByteText(
					context,
					context.getNodeParameter('miniprogram_title', itemIndex, ''),
					'小程序标题',
					itemIndex,
					64,
				),
				pic_media_id: requireText(
					context,
					context.getNodeParameter('miniprogram_pic_media_id', itemIndex, ''),
					'小程序封面 Media ID',
					itemIndex,
				),
				appid: requireText(
					context,
					context.getNodeParameter('miniprogram_appid', itemIndex, ''),
					'小程序 AppID',
					itemIndex,
				),
				page: requireText(
					context,
					context.getNodeParameter('miniprogram_page', itemIndex, ''),
					'小程序页面路径',
					itemIndex,
				),
			},
		};
	}
	if (type === 'file' || type === 'video') {
		const mediaId = requireText(
			context,
			context.getNodeParameter(`${type}_media_id`, itemIndex, ''),
			`${type === 'file' ? '文件' : '视频'} Media ID`,
			itemIndex,
		);
		return { [type]: { media_id: mediaId } };
	}
	fail(context, '欢迎语附件类型无效', itemIndex);
}

export function requireInteger(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	minimum: number,
	maximum: number,
): number {
	const parsed = Number(value);
	if (!Number.isSafeInteger(parsed) || parsed < minimum || parsed > maximum) {
		fail(context, `${label}必须是 ${minimum}–${maximum} 的整数`, itemIndex);
	}
	return parsed;
}

export function requireOption(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	allowed: readonly number[],
): number {
	const parsed = Number(value);
	if (!Number.isSafeInteger(parsed) || !allowed.includes(parsed)) {
		fail(context, `${label}仅支持 ${allowed.join('、')}`, itemIndex);
	}
	return parsed;
}

function flattenListEntries(value: unknown): string[] {
	if (Array.isArray(value)) {
		return value.flatMap((entry) => flattenListEntries(entry));
	}
	return String(value ?? '')
		.split(/[，,|\n\r]+/u)
		.map((entry) => entry.trim());
}

export function stringList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	options: { minimum?: number; maximum?: number; allowEmptyEntry?: boolean } = {},
): string[] {
	let values = flattenListEntries(value);
	if (!options.allowEmptyEntry) values = values.filter(Boolean);
	values = [...new Set(values)];
	const minimum = options.minimum ?? 0;
	const maximum = options.maximum ?? Number.MAX_SAFE_INTEGER;
	if (values.length < minimum || values.length > maximum) {
		if (maximum === Number.MAX_SAFE_INTEGER) {
			fail(context, `${label}至少需要 ${minimum} 个`, itemIndex);
		}
		fail(context, `${label}数量必须为 ${minimum}–${maximum} 个`, itemIndex);
	}
	return values;
}

export function integerList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	options: { minimum?: number; maximum?: number; valueMinimum?: number } = {},
): number[] {
	const values = stringList(context, value, label, itemIndex, {
		minimum: options.minimum,
		maximum: options.maximum,
	});
	const parsed = values.map((entry) => Number(entry));
	if (parsed.some((entry) => !Number.isSafeInteger(entry) || entry < (options.valueMinimum ?? 1))) {
		fail(context, `${label}只能包含正整数`, itemIndex);
	}
	return [...new Set(parsed)];
}

/** Parse optional JSON array of userids: ["u1"] or [{userid:"u1"}]. Empty / "[]" → []. */
export function parseUserIdJson(
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
			return requireText(context, entry, `${label}第 ${index + 1} 项`, itemIndex);
		}
		if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
			const row = entry as IDataObject;
			return requireText(
				context,
				row.userid || row.userid_selected || row.user_id,
				`${label}第 ${index + 1} 项 UserID`,
				itemIndex,
			);
		}
		fail(context, `${label}第 ${index + 1} 项必须是字符串或含 userid 的对象`, itemIndex);
	});
}

/** Parse optional JSON array of string IDs: ["id"] or [{key:"id"}]. Empty / "[]" → []. */
export function parseStringIdJson(
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
			return requireText(context, entry, `${label}第 ${index + 1} 项`, itemIndex);
		}
		if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
			const row = entry as IDataObject;
			for (const key of keys) {
				if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
					return requireText(context, row[key], `${label}第 ${index + 1} 项`, itemIndex);
				}
			}
		}
		fail(context, `${label}第 ${index + 1} 项必须是字符串或含 ${keys[0]} 的对象`, itemIndex);
	});
}

/** Parse optional JSON array of party/dept ids: [1,2] or [{partyid:1}]. Empty / "[]" → []. */
export function parsePartyIdJson(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number[] {
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
	const ids = parsed.map((entry, index) => {
		if (typeof entry === 'string' || typeof entry === 'number') {
			const n = Number(entry);
			if (!Number.isSafeInteger(n) || n < 1) {
				fail(context, `${label}第 ${index + 1} 项必须是正整数`, itemIndex);
			}
			return n;
		}
		if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
			const row = entry as IDataObject;
			const n = Number(row.partyid ?? row.party_id ?? row.departmentid ?? row.id);
			if (!Number.isSafeInteger(n) || n < 1) {
				fail(context, `${label}第 ${index + 1} 项必须包含正整数 partyid`, itemIndex);
			}
			return n;
		}
		fail(context, `${label}第 ${index + 1} 项必须是数字或含 partyid 的对象`, itemIndex);
	});
	return [...new Set(ids)];
}

export function collectionRows(
	value: unknown,
	group: string,
): IDataObject[] {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
	const rows = (value as IDataObject)[group];
	return Array.isArray(rows) ? (rows as IDataObject[]) : [];
}

export function productImageAttachments(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
	jsonOverride?: unknown,
): IDataObject[] {
	let rows = collectionRows(value, 'attachments');
	if (jsonOverride !== undefined && jsonOverride !== null && String(jsonOverride).trim() !== '') {
		let parsed: unknown = jsonOverride;
		if (typeof jsonOverride === 'string') {
			try {
				parsed = JSON.parse(jsonOverride);
			} catch {
				fail(context, `${label} JSON 不是有效的 JSON`, itemIndex);
			}
		}
		if (!Array.isArray(parsed)) fail(context, `${label} JSON 必须是数组`, itemIndex);
		if (parsed.length > 0) {
			rows = (parsed as unknown[]).map((entry, index) => {
				if (typeof entry === 'string' || typeof entry === 'number') {
					return { media_id: entry };
				}
				if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
					return entry as IDataObject;
				}
				fail(context, `${label} JSON 第 ${index + 1} 项必须是字符串或含 media_id 的对象`, itemIndex);
			});
		}
	}
	if (rows.length < 1 || rows.length > 9) {
		fail(context, `${label}数量必须为 1–9 个`, itemIndex);
	}
	return rows.map((row, rowIndex) => ({
		type: 'image',
		image: {
			media_id: requireText(
				context,
				row.media_id,
				`${label}第 ${rowIndex + 1} 项的 Media ID`,
				itemIndex,
			),
		},
	}));
}

export function interceptWordList(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): string[] {
	const words = stringList(context, value, '敏感词列表', itemIndex, {
		minimum: 1,
		maximum: 300,
	});
	for (const [wordIndex, word] of words.entries()) {
		requireText(context, word, `第 ${wordIndex + 1} 个敏感词`, itemIndex, 32);
	}
	return words;
}

export function rangeNodes(
	context: IExecuteFunctions,
	value: unknown,
	group: string,
	label: string,
	itemIndex: number,
	options: {
		minimum?: number;
		maximum?: number;
		extraUserids?: unknown;
		extraPartyids?: unknown;
	} = {},
): IDataObject[] {
	const rows = collectionRows(value, group);
	const bulkUsers = stringList(context, options.extraUserids ?? '', `${label}成员列表`, itemIndex, {
		maximum: options.maximum ?? 3000,
	});
	const bulkParties = integerList(
		context,
		options.extraPartyids ?? '',
		`${label}部门列表`,
		itemIndex,
		{ maximum: options.maximum ?? 3000 },
	);
	const minimum = options.minimum ?? 0;
	const maximum = options.maximum ?? 3000;
	const total = rows.length + bulkUsers.length + bulkParties.length;
	if (total < minimum || total > maximum) {
		fail(context, `${label}数量必须为 ${minimum}–${maximum} 个`, itemIndex);
	}
	const identities = new Set<string>();
	const result: IDataObject[] = [];
	for (const userid of bulkUsers) {
		const identity = `1:${userid}`;
		if (identities.has(identity)) fail(context, `${label}不能包含重复节点 ${userid}`, itemIndex);
		identities.add(identity);
		result.push({ type: 1, userid });
	}
	for (const partyid of bulkParties) {
		const identity = `2:${partyid}`;
		if (identities.has(identity)) fail(context, `${label}不能包含重复节点 ${partyid}`, itemIndex);
		identities.add(identity);
		result.push({ type: 2, partyid });
	}
	for (const [rowIndex, row] of rows.entries()) {
		const type = requireOption(
			context,
			row.type,
			`${label}第 ${rowIndex + 1} 项的节点类型`,
			itemIndex,
			[1, 2],
		);
		const node: IDataObject = { type };
		const identity =
			type === 1
				? `1:${requireText(
						context,
						row.userid || row.userid_selected,
						`${label}第 ${rowIndex + 1} 项的成员 UserID`,
						itemIndex,
					)}`
				: `2:${requireInteger(
						context,
						row.partyid || row.partyid_selected,
						`${label}第 ${rowIndex + 1} 项的部门 ID`,
						itemIndex,
						1,
						Number.MAX_SAFE_INTEGER,
					)}`;
		if (identities.has(identity)) fail(context, `${label}不能包含重复节点 ${identity.slice(2)}`, itemIndex);
		identities.add(identity);
		if (type === 1) node.userid = identity.slice(2);
		else node.partyid = Number(identity.slice(2));
		result.push(node);
	}
	return result;
}

export function dateTimeToUnixTimestamp(value: unknown): number;
export function dateTimeToUnixTimestamp(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): number | undefined;
export function dateTimeToUnixTimestamp(
	contextOrValue: IExecuteFunctions | unknown,
	validatedValue?: unknown,
	label?: string,
	itemIndex?: number,
): number | undefined {
	const validating = arguments.length > 1;
	const context = validating ? (contextOrValue as IExecuteFunctions) : undefined;
	const value = validating ? validatedValue : contextOrValue;
	if (value === undefined || value === null || value === '') return validating ? undefined : 0;
	if (typeof value === 'number') {
		if (Number.isFinite(value) && value > 0) return Math.floor(value);
		if (context) fail(context, `${label}不是有效时间`, itemIndex ?? 0);
		return 0;
	}
	const timestamp = new Date(String(value)).getTime();
	if (!Number.isFinite(timestamp) || timestamp <= 0) {
		if (context) fail(context, `${label}不是有效时间`, itemIndex ?? 0);
		return 0;
	}
	return Math.floor(timestamp / 1000);
}
