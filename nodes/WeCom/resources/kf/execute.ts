import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import {
	fail,
	dateTimeToUnixTimestamp,
	integerList,
	optionalByteText,
	optionalText,
	requireByteText,
	requireHttpUrl,
	requireInteger,
	requireNumber,
	requireText,
	stringList,
	validateStatisticWindow,
} from './utils';

function parseUserIdJsonList(
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
	return stringList(
		context,
		parsed.map((entry) => {
			if (typeof entry === 'string' || typeof entry === 'number') return entry;
			if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
				const row = entry as IDataObject;
				return row.userid ?? row.userid_selected ?? row.user_id ?? '';
			}
			return '';
		}),
		label,
		itemIndex,
		1000,
	);
}

function parsePartyIdJsonList(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): Array<string | number> {
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
	return (parsed as unknown[]).map((entry) => {
		if (typeof entry === 'string' || typeof entry === 'number') return entry;
		if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
			const row = entry as IDataObject;
			return (row.partyid ??
				row.party_id ??
				row.departmentid ??
				row.department_id ??
				row.id ??
				'') as string | number;
		}
		return '';
	});
}

function buildMsgMenuMessage(
	context: IExecuteFunctions,
	menuItemsValue: unknown,
	headContentValue: unknown,
	tailContentValue: unknown,
	itemIndex: number,
	maximumItems: number,
): IDataObject {
	const menuItems = Array.isArray(menuItemsValue) ? (menuItemsValue as IDataObject[]) : [];
	if (menuItems.length > maximumItems) {
		fail(context, `菜单项不能超过 ${maximumItems} 个`, itemIndex);
	}
	const interactiveItems = menuItems.filter((item) => String(item.type ?? '') !== 'text').length;
	if (interactiveItems > 10) {
		fail(context, '点击、跳转链接和小程序菜单项合计不能超过 10 个', itemIndex);
	}

	const list = menuItems.map((item: IDataObject, menuIndex: number) => {
		const type = String(item.type || '');
		const label = `第 ${menuIndex + 1} 个菜单项`;

		if (type === 'click') {
			const click: IDataObject = {
				content: requireByteText(context, item.content, `${label}文案`, itemIndex, 128),
			};
			const id = optionalByteText(context, item.reply_content, `${label} ID`, itemIndex, 128);
			if (id) click.id = id;
			return {
				type,
				click,
			};
		}

		if (type === 'view') {
			return {
				type,
				view: {
					url: requireHttpUrl(context, item.url, `${label}跳转 URL`, itemIndex),
					content: requireByteText(context, item.content, `${label}文案`, itemIndex, 1024),
				},
			};
		}

		if (type === 'miniprogram') {
			return {
				type,
				miniprogram: {
					appid: requireByteText(context, item.appid, `${label}小程序 AppID`, itemIndex, 32),
					pagepath: requireByteText(
						context,
						item.pagepath,
						`${label}小程序页面路径`,
						itemIndex,
						1024,
					),
					content: requireByteText(context, item.content, `${label}文案`, itemIndex, 1024),
				},
			};
		}

		if (type === 'text') {
			const text: IDataObject = {
				content: requireByteText(context, item.content, `${label}文本`, itemIndex, 256),
			};

			text.no_newline = item.no_newline ? 1 : 0;

			return {
				type,
				text,
			};
		}

		fail(context, `${label}类型无效`, itemIndex);
	});

	const messageContent: IDataObject = {};
	const headContent = optionalByteText(context, headContentValue, '菜单起始文本', itemIndex, 1024);
	const tailContent = optionalByteText(context, tailContentValue, '菜单结束文本', itemIndex, 1024);

	if (headContent) messageContent.head_content = headContent;
	if (list.length > 0) messageContent.list = list;
	if (tailContent) messageContent.tail_content = tailContent;
	if (!headContent && list.length === 0 && !tailContent) {
		fail(context, '菜单起始文本、菜单项和结束文本至少需要填写一项', itemIndex);
	}

	return messageContent;
}

function objectValue(
	context: IExecuteFunctions,
	value: unknown,
	label: string,
	itemIndex: number,
): IDataObject {
	let parsed = value;
	if (typeof value === 'string') {
		try {
			parsed = JSON.parse(value);
		} catch {
			fail(context, `${label}不是有效的 JSON`, itemIndex);
		}
	}
	if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
		fail(context, `${label}必须是 JSON 对象`, itemIndex);
	}
	return parsed as IDataObject;
}

function collectionRows(value: unknown, key: string): IDataObject[] {
	if (Array.isArray(value)) return value.filter((row) => row && typeof row === 'object') as IDataObject[];
	if (value && typeof value === 'object') {
		const rows = (value as IDataObject)[key];
		if (Array.isArray(rows)) {
			return rows.filter((row) => row && typeof row === 'object') as IDataObject[];
		}
	}
	return [];
}

function normalizeKnowledgeQuestion(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject {
	const question = objectValue(context, value, '主问题', itemIndex);
	const textValue = question.text;
	const content =
		textValue && typeof textValue === 'object' && !Array.isArray(textValue)
			? (textValue as IDataObject).content
			: textValue;
	return {
		text: {
			content: requireText(context, content, '主问题文本', itemIndex, 200),
		},
	};
}

function normalizeKnowledgeSimilarQuestions(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject {
	const similarQuestions = objectValue(context, value, '相似问法', itemIndex);
	const rawItems = similarQuestions.items ?? [];
	if (!Array.isArray(rawItems)) fail(context, '相似问法 items 必须是数组', itemIndex);
	if (rawItems.length > 100) fail(context, '相似问法不能超过 100 个', itemIndex);
	return {
		items: rawItems.map((rawItem, questionIndex) => {
			const item = objectValue(
				context,
				rawItem,
				`第 ${questionIndex + 1} 个相似问法`,
				itemIndex,
			);
			const textValue = item.text;
			const content =
				textValue && typeof textValue === 'object' && !Array.isArray(textValue)
					? (textValue as IDataObject).content
					: textValue;
			return {
				text: {
					content: requireText(
						context,
						content,
						`第 ${questionIndex + 1} 个相似问法`,
						itemIndex,
						200,
					),
				},
			};
		}),
	};
}

function normalizeKnowledgeAttachments(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject[] {
	if (!Array.isArray(value)) fail(context, '回答附件必须是数组', itemIndex);
	if (value.length > 4) fail(context, '回答附件不能超过 4 个', itemIndex);
	return value.map((rawAttachment, attachmentIndex) => {
		const attachment = objectValue(
			context,
			rawAttachment,
			`第 ${attachmentIndex + 1} 个回答附件`,
			itemIndex,
		);
		const msgtype = String(attachment.msgtype ?? '');
		const label = `第 ${attachmentIndex + 1} 个回答附件`;
		if (msgtype === 'image' || msgtype === 'video') {
			const contentValue = attachment[msgtype];
			const content =
				contentValue && typeof contentValue === 'object' && !Array.isArray(contentValue)
					? (contentValue as IDataObject)
					: attachment;
			return {
				msgtype,
				[msgtype]: {
					media_id: requireText(context, content.media_id, `${label} Media ID`, itemIndex),
				},
			};
		}
		if (msgtype === 'link') {
			const linkValue = attachment.link;
			const link =
				linkValue && typeof linkValue === 'object' && !Array.isArray(linkValue)
					? (linkValue as IDataObject)
					: attachment;
			const normalized: IDataObject = {
				title: requireText(context, link.title ?? link.link_title, `${label}标题`, itemIndex),
				url: requireHttpUrl(context, link.url ?? link.link_url, `${label} URL`, itemIndex),
			};
			const desc = optionalText(context, link.desc ?? link.link_desc, `${label}描述`, itemIndex);
			const picUrl = optionalText(
				context,
				link.pic_url ?? link.link_pic_url,
				`${label}缩略图 URL`,
				itemIndex,
			);
			if (desc) normalized.desc = desc;
			if (picUrl) normalized.pic_url = requireHttpUrl(context, picUrl, `${label}缩略图 URL`, itemIndex);
			return { msgtype, link: normalized };
		}
		if (msgtype === 'miniprogram') {
			const miniValue = attachment.miniprogram;
			const mini =
				miniValue && typeof miniValue === 'object' && !Array.isArray(miniValue)
					? (miniValue as IDataObject)
					: attachment;
			const normalized: IDataObject = {
				thumb_media_id: requireText(
					context,
					mini.thumb_media_id ?? mini.miniprogram_thumb_media_id,
					`${label}封面 Media ID`,
					itemIndex,
				),
				appid: requireText(
					context,
					mini.appid ?? mini.miniprogram_appid,
					`${label}小程序 AppID`,
					itemIndex,
				),
				pagepath: requireText(
					context,
					mini.pagepath ?? mini.miniprogram_pagepath,
					`${label}小程序页面路径`,
					itemIndex,
				),
			};
			const title = optionalByteText(
				context,
				mini.title ?? mini.miniprogram_title,
				`${label}小程序标题`,
				itemIndex,
				64,
			);
			if (title) normalized.title = title;
			return { msgtype, miniprogram: normalized };
		}
		fail(context, `${label}类型无效`, itemIndex);
	});
}

function normalizeKnowledgeAnswers(
	context: IExecuteFunctions,
	value: unknown,
	itemIndex: number,
): IDataObject[] {
	if (!Array.isArray(value) || value.length !== 1) {
		fail(context, '回答列表目前必须且只能包含 1 个回答', itemIndex);
	}
	const answer = objectValue(context, value[0], '回答', itemIndex);
	const textValue = answer.text;
	const content =
		textValue && typeof textValue === 'object' && !Array.isArray(textValue)
			? (textValue as IDataObject).content
			: textValue;
	const normalized: IDataObject = {
		text: {
			content: requireText(context, content, '回答文本', itemIndex, 500),
		},
	};
	if (Object.prototype.hasOwnProperty.call(answer, 'attachments')) {
		normalized.attachments = normalizeKnowledgeAttachments(
			context,
			answer.attachments,
			itemIndex,
		);
	}
	return [normalized];
}

function normalizeKnowledgeIntentBody(
	context: IExecuteFunctions,
	value: unknown,
	actionType: 'add' | 'mod',
	itemIndex: number,
): IDataObject {
	const raw = objectValue(context, value, '问答请求 JSON', itemIndex);
	const body: IDataObject = {};
	if (actionType === 'add') {
		body.group_id = requireText(context, raw.group_id, '分组 ID', itemIndex);
		body.question = normalizeKnowledgeQuestion(context, raw.question, itemIndex);
		if (Object.prototype.hasOwnProperty.call(raw, 'similar_questions')) {
			body.similar_questions = normalizeKnowledgeSimilarQuestions(
				context,
				raw.similar_questions,
				itemIndex,
			);
		}
		body.answers = normalizeKnowledgeAnswers(context, raw.answers, itemIndex);
		return body;
	}

	body.intent_id = requireText(context, raw.intent_id, '问答 ID', itemIndex);
	let sectionCount = 0;
	if (Object.prototype.hasOwnProperty.call(raw, 'question')) {
		body.question = normalizeKnowledgeQuestion(context, raw.question, itemIndex);
		sectionCount++;
	}
	if (Object.prototype.hasOwnProperty.call(raw, 'similar_questions')) {
		body.similar_questions = normalizeKnowledgeSimilarQuestions(
			context,
			raw.similar_questions,
			itemIndex,
		);
		sectionCount++;
	}
	if (Object.prototype.hasOwnProperty.call(raw, 'answers')) {
		body.answers = normalizeKnowledgeAnswers(context, raw.answers, itemIndex);
		sectionCount++;
	}
	if (sectionCount === 0) fail(context, '请至少选择或提供一个要修改的问答部分', itemIndex);
	return body;
}

export async function executeKf(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 客服账号管理
			if (operation === 'addKfAccount') {
				const name = requireText(this, this.getNodeParameter('name', i), '客服名称', i, 16);
				const media_id = requireByteText(
					this,
					this.getNodeParameter('media_id', i),
					'客服头像 Media ID',
					i,
					128,
				);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/add', {
					name,
					media_id,
				});
			} else if (operation === 'delKfAccount') {
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/del', {
					open_kfid,
				});
			} else if (operation === 'updateKfAccount') {
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const updateName = this.getNodeParameter('updateName', i, false) as boolean;
				const updateMediaId = this.getNodeParameter('updateMediaId', i, false) as boolean;

				const body: IDataObject = { open_kfid };
				if (updateName) {
					body.name = requireText(
						this,
						this.getNodeParameter('name', i, ''),
						'客服名称',
						i,
						16,
					);
				}
				if (updateMediaId) {
					body.media_id = requireByteText(
						this,
						this.getNodeParameter('media_id', i, ''),
						'客服头像 Media ID',
						i,
						128,
					);
				}
				if (!updateName && !updateMediaId) fail(this, '请至少选择一个要修改的字段', i);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/update', body);
			} else if (operation === 'listKfAccount') {
				const offset = requireInteger(
					this,
					this.getNodeParameter('offset', i, 0),
					'偏移量',
					i,
					0,
					4294967295,
				);
				const limit = requireInteger(
					this,
					this.getNodeParameter('limit', i, 100),
					'返回数量',
					i,
					1,
					100,
				);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/list', {
					offset,
					limit,
				});
			} else if (operation === 'getKfAccountLink') {
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const scene = optionalByteText(
					this,
					this.getNodeParameter('scene', i, ''),
					'场景值',
					i,
					32,
				);
				if (scene && !/^[0-9A-Za-z_-]*$/.test(scene)) {
					fail(this, '场景值只能包含数字、大小写字母、下划线和连字符', i);
				}

				const body: IDataObject = { open_kfid };
				if (scene) body.scene = scene;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/add_contact_way', body);
			}
			// 接待人员管理
			else if (operation === 'addServicer') {
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const userid_list = stringList(
					this,
					[
						this.getNodeParameter('userid_list_text', i, ''),
						this.getNodeParameter('userid_list', i, []),
						...parseUserIdJsonList(
							this,
							this.getNodeParameter('useridListJson', i, '[]'),
							'接待人员 JSON',
							i,
						),
					],
					'接待人员列表',
					i,
					100,
				);
				const department_id_list = integerList(
					this,
					[
						this.getNodeParameter('department_id_list_text', i, ''),
						this.getNodeParameter('department_id_list', i, []),
						...parsePartyIdJsonList(
							this,
							this.getNodeParameter('departmentIdListJson', i, '[]'),
							'接待部门 JSON',
							i,
						),
					],
					'接待人员部门列表',
					i,
					20,
				);
				if (userid_list.length === 0 && department_id_list.length === 0) {
					fail(this, '接待人员列表和部门列表至少需要填写一项', i);
				}

				const body: IDataObject = { open_kfid };
				if (userid_list.length > 0) body.userid_list = userid_list;
				if (department_id_list.length > 0) body.department_id_list = department_id_list;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/servicer/add', body);
			} else if (operation === 'delServicer') {
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const userid_list = stringList(
					this,
					[
						this.getNodeParameter('userid_list_text', i, ''),
						this.getNodeParameter('userid_list', i, []),
						...parseUserIdJsonList(
							this,
							this.getNodeParameter('useridListJson', i, '[]'),
							'接待人员 JSON',
							i,
						),
					],
					'接待人员列表',
					i,
					100,
				);
				const department_id_list = integerList(
					this,
					[
						this.getNodeParameter('department_id_list_text', i, ''),
						this.getNodeParameter('department_id_list', i, []),
						...parsePartyIdJsonList(
							this,
							this.getNodeParameter('departmentIdListJson', i, '[]'),
							'接待部门 JSON',
							i,
						),
					],
					'接待人员部门列表',
					i,
					100,
				);
				if (userid_list.length === 0 && department_id_list.length === 0) {
					fail(this, '接待人员列表和部门列表至少需要填写一项', i);
				}

				const body: IDataObject = { open_kfid };
				if (userid_list.length > 0) body.userid_list = userid_list;
				if (department_id_list.length > 0) body.department_id_list = department_id_list;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/servicer/del', body);
			} else if (operation === 'listServicer') {
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);

				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/kf/servicer/list',
					{},
					{ open_kfid },
				);
			}
			// 会话分配与消息收发
			else if (operation === 'getServiceState') {
				// 获取会话状态
				// https://developer.work.weixin.qq.com/document/path/94669
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const external_userid = requireText(
					this,
					this.getNodeParameter('external_userid', i),
					'客户 External UserID',
					i,
				);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/service_state/get', {
					open_kfid,
					external_userid,
				});
			} else if (operation === 'transServiceState') {
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const external_userid = requireText(
					this,
					this.getNodeParameter('external_userid', i),
					'客户 External UserID',
					i,
				);
				const service_state = requireInteger(
					this,
					this.getNodeParameter('service_state', i),
					'目标服务状态',
					i,
					2,
					4,
				);

				const body: IDataObject = {
					open_kfid,
					external_userid,
					service_state,
				};

				if (service_state === 3) {
					body.servicer_userid = requireText(
						this,
						this.getNodeParameter('servicer_userid', i, '') ||
							this.getNodeParameter('servicer_userid_selected', i, ''),
						'接待人员 UserID',
						i,
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/service_state/trans', body);
			} else if (operation === 'sendKfMsg') {
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const touser = requireText(
					this,
					this.getNodeParameter('touser', i),
					'客户 External UserID',
					i,
				);
				const msgtype = this.getNodeParameter('msgtype', i) as string;
				const msgid = optionalByteText(
					this,
					this.getNodeParameter('msgid', i, ''),
					'消息 ID',
					i,
					32,
				);
				if (msgid && !/^[0-9A-Za-z_-]*$/.test(msgid)) {
					fail(this, '消息 ID 只能包含数字、大小写字母、下划线和连字符', i);
				}

				let messageContent: IDataObject = {};

				if (msgtype === 'text') {
					messageContent = {
						content: requireByteText(
							this,
							this.getNodeParameter('text_content', i),
							'消息内容',
							i,
							2048,
						),
					};
				} else if (msgtype === 'image') {
					messageContent = {
						media_id: requireText(
							this,
							this.getNodeParameter('image_media_id', i),
							'图片 Media ID',
							i,
						),
					};
				} else if (msgtype === 'voice') {
					messageContent = {
						media_id: requireText(
							this,
							this.getNodeParameter('voice_media_id', i),
							'语音 Media ID',
							i,
						),
					};
				} else if (msgtype === 'video') {
					messageContent = {
						media_id: requireText(
							this,
							this.getNodeParameter('video_media_id', i),
							'视频 Media ID',
							i,
						),
					};
				} else if (msgtype === 'file') {
					messageContent = {
						media_id: requireText(
							this,
							this.getNodeParameter('file_media_id', i),
							'文件 Media ID',
							i,
						),
					};
				} else if (msgtype === 'link') {
					const title = requireByteText(
						this,
						this.getNodeParameter('link_title', i),
						'链接标题',
						i,
						128,
					);
					const desc = optionalByteText(
						this,
						this.getNodeParameter('link_desc', i, ''),
						'链接描述',
						i,
						512,
					);
					const url = requireHttpUrl(
						this,
						this.getNodeParameter('link_url', i),
						'链接 URL',
						i,
					);
					const thumb_media_id = requireText(
						this,
						this.getNodeParameter('link_thumb_media_id', i),
						'缩略图 Media ID',
						i,
					);

					messageContent = { title, url, thumb_media_id };
					if (desc) messageContent.desc = desc;
				} else if (msgtype === 'miniprogram') {
					const title = optionalByteText(
						this,
						this.getNodeParameter('miniprogram_title', i, ''),
						'小程序标题',
						i,
						64,
					);
					const appid = requireText(
						this,
						this.getNodeParameter('miniprogram_appid', i),
						'小程序 AppID',
						i,
					);
					const pagepath = requireText(
						this,
						this.getNodeParameter('miniprogram_pagepath', i),
						'小程序页面路径',
						i,
					);
					if (!pagepath.split(/[?#]/, 1)[0].endsWith('.html')) {
						fail(this, '小程序页面路径需要以 .html 结尾', i);
					}
					const thumb_media_id = requireText(
						this,
						this.getNodeParameter('miniprogram_thumb_media_id', i),
						'小程序缩略图 Media ID',
						i,
					);

					messageContent = { appid, pagepath, thumb_media_id };
					if (title) messageContent.title = title;
				} else if (msgtype === 'msgmenu') {
					messageContent = buildMsgMenuMessage(
						this,
						this.getNodeParameter('msgmenu_list.items', i, []),
						this.getNodeParameter('msgmenu_head_content', i, ''),
						this.getNodeParameter('msgmenu_tail_content', i, ''),
						i,
						50,
					);
				} else if (msgtype === 'location') {
					const name = optionalText(
						this,
						this.getNodeParameter('location_name', i, ''),
						'位置名称',
						i,
					);
					const address = optionalText(
						this,
						this.getNodeParameter('location_address', i, ''),
						'详细地址',
						i,
					);
					const latitude = requireNumber(
						this,
						this.getNodeParameter('location_latitude', i),
						'纬度',
						i,
						-90,
						90,
					);
					const longitude = requireNumber(
						this,
						this.getNodeParameter('location_longitude', i),
						'经度',
						i,
						-180,
						180,
					);

					messageContent = { latitude, longitude };
					if (name) messageContent.name = name;
					if (address) messageContent.address = address;
				} else if (msgtype === 'ca_link') {
					messageContent = {
						link_url: requireHttpUrl(
							this,
							this.getNodeParameter('ca_link_url', i),
							'获客链接 URL',
							i,
						),
					};
				} else {
					fail(this, `不支持的消息类型: ${msgtype}`, i);
				}

				const body: IDataObject = {
					touser,
					open_kfid,
					msgtype,
					[msgtype]: messageContent,
				};
				if (msgid) body.msgid = msgid;
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/send_msg', body);
			} else if (operation === 'sendKfEventMsg') {
				const code = requireText(this, this.getNodeParameter('code', i), '事件响应 Code', i);
				const msgtype = this.getNodeParameter('msgtype', i) as string;
				const msgid = optionalByteText(
					this,
					this.getNodeParameter('msgid', i, ''),
					'消息 ID',
					i,
					32,
				);
				if (msgid && !/^[0-9A-Za-z_-]*$/.test(msgid)) {
					fail(this, '消息 ID 只能包含数字、大小写字母、下划线和连字符', i);
				}

				let messageContent: IDataObject = {};

				if (msgtype === 'text') {
					messageContent = {
						content: requireByteText(
							this,
							this.getNodeParameter('text_content', i),
							'消息内容',
							i,
							2048,
						),
					};
				} else if (msgtype === 'msgmenu') {
					messageContent = buildMsgMenuMessage(
						this,
						this.getNodeParameter('msgmenu_list.items', i, []),
						this.getNodeParameter('msgmenu_head_content', i, ''),
						this.getNodeParameter('msgmenu_tail_content', i, ''),
						i,
						10,
					);
				} else {
					fail(this, `不支持的消息类型: ${msgtype}`, i);
				}

				const body: IDataObject = {
					code,
					msgtype,
					[msgtype]: messageContent,
				};
				if (msgid) body.msgid = msgid;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/kf/send_msg_on_event',
					body,
				);
			} else if (operation === 'setUpgradeService') {
				// 为客户升级为专员或客户群服务
				// https://developer.work.weixin.qq.com/document/path/94674
				// 官方路径：/cgi-bin/kf/customer/upgrade_service
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const external_userid = requireText(
					this,
					this.getNodeParameter('external_userid', i),
					'客户 External UserID',
					i,
				);
				const upgradeType = this.getNodeParameter('upgradeType', i) as string;
				if (upgradeType !== 'member' && upgradeType !== 'groupchat') {
					fail(this, '升级类型无效', i);
				}

				const body: IDataObject = {
					open_kfid,
					external_userid,
					type: upgradeType === 'groupchat' ? 2 : 1,
				};

				if (upgradeType === 'member') {
					const member_userid = requireText(
						this,
						this.getNodeParameter('member_userid', i, '') ||
							this.getNodeParameter('member_userid_selected', i, ''),
						'服务专员 UserID',
						i,
					);
					const member_wording = optionalText(
						this,
						this.getNodeParameter('member_wording', i, ''),
						'专员推荐语',
						i,
					);
					const member: IDataObject = { userid: member_userid };
					if (member_wording) member.wording = member_wording;
					body.member = member;
				} else {
					const groupchat_chat_id = requireText(
						this,
						this.getNodeParameter('groupchat_chat_id', i),
						'客户群 ID',
						i,
					);
					const groupchat_wording = optionalText(
						this,
						this.getNodeParameter('groupchat_wording', i, ''),
						'客户群推荐语',
						i,
					);
					const groupchat: IDataObject = { chat_id: groupchat_chat_id };
					if (groupchat_wording) groupchat.wording = groupchat_wording;
					body.groupchat = groupchat;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/customer/upgrade_service', body);
			} else if (operation === 'cancelUpgradeService') {
				// 为客户取消升级服务推荐
				// https://developer.work.weixin.qq.com/document/path/94674
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const external_userid = requireText(
					this,
					this.getNodeParameter('external_userid', i),
					'客户 External UserID',
					i,
				);

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/kf/customer/cancel_upgrade_service',
					{
						open_kfid,
						external_userid,
					},
				);
			} else if (operation === 'getUpgradeServiceConfig') {
				// 获取配置的专员与客户群
				// https://developer.work.weixin.qq.com/document/path/94674
				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/kf/customer/get_upgrade_service_config',
					{},
				);
			} else if (operation === 'syncMsg') {
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const cursor = optionalByteText(
					this,
					this.getNodeParameter('cursor', i, ''),
					'游标',
					i,
					64,
				);
				const token = optionalByteText(
					this,
					this.getNodeParameter('token', i, ''),
					'Token',
					i,
					128,
				);
				const limit = requireInteger(
					this,
					this.getNodeParameter('limit', i, 1000),
					'拉取条数',
					i,
					1,
					1000,
				);
				const voice_format = requireInteger(
					this,
					this.getNodeParameter('voice_format', i, 0),
					'语音格式',
					i,
					0,
					1,
				);
				const parse_message_types = this.getNodeParameter(
					'parse_message_types',
					i,
					false,
				) as boolean;

				const body: IDataObject = {
					open_kfid,
					limit,
					voice_format,
				};

				if (cursor) body.cursor = cursor;
				if (token) body.token = token;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/sync_msg', body);

				// 如果需要解析消息类型，对msg_list进行处理
				if (parse_message_types && response.msg_list && Array.isArray(response.msg_list)) {
					response.msg_list = (response.msg_list as IDataObject[]).map((msg: IDataObject) => {
						const msgtype = msg.msgtype as string;
						
						// 为每个消息添加解析后的字段，便于后续处理
						const parsedMsg: IDataObject = {
							...msg,
							parsed_content: null,
						};

						// 根据消息类型解析内容
						if (msgtype === 'text' && msg.text) {
							parsedMsg.parsed_content = msg.text;
						} else if (msgtype === 'image' && msg.image) {
							parsedMsg.parsed_content = msg.image;
						} else if (msgtype === 'voice' && msg.voice) {
							parsedMsg.parsed_content = msg.voice;
						} else if (msgtype === 'video' && msg.video) {
							parsedMsg.parsed_content = msg.video;
						} else if (msgtype === 'file' && msg.file) {
							parsedMsg.parsed_content = msg.file;
						} else if (msgtype === 'location' && msg.location) {
							parsedMsg.parsed_content = msg.location;
						} else if (msgtype === 'link' && msg.link) {
							parsedMsg.parsed_content = msg.link;
						} else if (msgtype === 'business_card' && msg.business_card) {
							parsedMsg.parsed_content = msg.business_card;
						} else if (msgtype === 'miniprogram' && msg.miniprogram) {
							parsedMsg.parsed_content = msg.miniprogram;
						} else if (msgtype === 'msgmenu' && msg.msgmenu) {
							parsedMsg.parsed_content = msg.msgmenu;
						} else if (msgtype === 'channels_shop_product' && msg.channels_shop_product) {
							parsedMsg.parsed_content = msg.channels_shop_product;
						} else if (msgtype === 'channels_shop_order' && msg.channels_shop_order) {
							parsedMsg.parsed_content = msg.channels_shop_order;
						} else if (msgtype === 'merged_msg' && msg.merged_msg) {
							parsedMsg.parsed_content = msg.merged_msg;
						} else if (msgtype === 'channels' && msg.channels) {
							parsedMsg.parsed_content = msg.channels;
						} else if (msgtype === 'event' && msg.event) {
							parsedMsg.parsed_content = msg.event;
							// 为事件类型添加event_type字段方便筛选
							parsedMsg.event_type = (msg.event as IDataObject).event_type;
						}

						return parsedMsg;
					});
				}
			} else if (operation === 'getCustomerInfo') {
				// 获取客户基础信息
				// https://developer.work.weixin.qq.com/document/path/95159
				// 官方路径：/cgi-bin/kf/customer/batchget
				const external_userid_list = stringList(
					this,
					this.getNodeParameter('external_userid_list', i),
					'客户 External UserID 列表',
					i,
					100,
				);
				const need_enter_session_context = this.getNodeParameter(
					'need_enter_session_context',
					i,
					false,
				) as boolean;

				if (external_userid_list.length === 0) {
					fail(this, '客户 External UserID 列表至少需要填写 1 个', i);
				}

				const body: IDataObject = { external_userid_list };
				if (need_enter_session_context) {
					body.need_enter_session_context = 1;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/customer/batchget', body);
			}
			// 统计管理
			else if (operation === 'getCorpStatistic') {
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('start_time', i),
					'起始日期',
					i,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('end_time', i),
					'结束日期',
					i,
				);
				validateStatisticWindow(this, start_time, end_time, i);

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/get_corp_statistic', {
					open_kfid,
					start_time,
					end_time,
				});
			} else if (operation === 'getServicerStatistic') {
				const open_kfid = requireByteText(
					this,
					(this.getNodeParameter('open_kfid', i, '') || this.getNodeParameter('open_kfid_selected', i, '')),
					'客服账号 ID',
					i,
					64,
				);
				const servicer_userid = optionalText(
					this,
					this.getNodeParameter('servicer_userid', i, '') ||
						this.getNodeParameter('servicer_userid_selected', i, ''),
					'接待人员 UserID',
					i,
				);
				const start_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('start_time', i),
					'起始日期',
					i,
				);
				const end_time = dateTimeToUnixTimestamp(
					this,
					this.getNodeParameter('end_time', i),
					'结束日期',
					i,
				);
				validateStatisticWindow(this, start_time, end_time, i);
				const body: IDataObject = {
					open_kfid,
					start_time,
					end_time,
				};
				if (servicer_userid) body.servicer_userid = servicer_userid;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/kf/get_servicer_statistic',
					body,
				);
			}
			// 机器人管理
			else if (operation === 'manageKnowledgeGroup') {
				const action_type = this.getNodeParameter('action_type', i) as string;

				let endpoint: string;
				const body: IDataObject = {};

				if (action_type === 'add') {
					endpoint = '/cgi-bin/kf/knowledge/add_group';
					body.name = requireText(
						this,
						this.getNodeParameter('group_name', i),
						'分组名称',
						i,
						12,
					);
				} else if (action_type === 'del') {
					endpoint = '/cgi-bin/kf/knowledge/del_group';
					body.group_id = requireText(
						this,
						this.getNodeParameter('group_id', i),
						'分组 ID',
						i,
					);
				} else if (action_type === 'mod') {
					endpoint = '/cgi-bin/kf/knowledge/mod_group';
					body.group_id = requireText(
						this,
						this.getNodeParameter('group_id', i),
						'分组 ID',
						i,
					);
					body.name = requireText(
						this,
						this.getNodeParameter('new_group_name', i),
						'新分组名称',
						i,
						12,
					);
				} else if (action_type === 'list') {
					endpoint = '/cgi-bin/kf/knowledge/list_group';
					const cursor = optionalText(
						this,
						this.getNodeParameter('cursor', i, ''),
						'分页游标',
						i,
					);
					const group_id = optionalText(
						this,
						this.getNodeParameter('list_group_id', i, ''),
						'分组 ID 筛选',
						i,
					);
					const limit = requireInteger(
						this,
						this.getNodeParameter('limit', i, 500),
						'每页数量',
						i,
						1,
						1000,
					);
					if (cursor) body.cursor = cursor;
					body.limit = limit;
					if (group_id) body.group_id = group_id;
				} else {
					fail(this, '知识库分组操作类型无效', i);
				}

				response = await weComApiRequest.call(this, 'POST', endpoint, body);
			} else if (operation === 'manageKnowledgeIntent') {
				const action_type = this.getNodeParameter('action_type', i) as string;

				let endpoint: string;
				let body: IDataObject;

				if (action_type === 'add' || action_type === 'mod') {
					endpoint =
						action_type === 'add'
							? '/cgi-bin/kf/knowledge/add_intent'
							: '/cgi-bin/kf/knowledge/mod_intent';
					const inputMode = String(this.getNodeParameter('intentInputMode', i, 'form'));
					if (inputMode === 'json') {
						body = normalizeKnowledgeIntentBody(
							this,
							this.getNodeParameter('intentBodyJson', i, '{}'),
							action_type,
							i,
						);
					} else if (inputMode === 'form' && action_type === 'add') {
						const rawBody: IDataObject = {
							group_id: this.getNodeParameter('group_id', i),
							question: {
								text: { content: this.getNodeParameter('question_text', i) },
							},
						};
						const similarRows = collectionRows(
							this.getNodeParameter('similarQuestionsCollection', i, {}),
							'questions',
						);
						if (similarRows.length > 0) {
							rawBody.similar_questions = {
								items: similarRows.map((row) => ({ text: { content: row.text } })),
							};
						}
						const answer: IDataObject = {
							text: { content: this.getNodeParameter('answer_text', i) },
						};
						const attachmentRows = collectionRows(
							this.getNodeParameter('attachmentsCollection', i, {}),
							'attachments',
						);
						if (attachmentRows.length > 0) answer.attachments = attachmentRows;
						rawBody.answers = [answer];
						body = normalizeKnowledgeIntentBody(this, rawBody, 'add', i);
					} else if (inputMode === 'form') {
						const rawBody: IDataObject = {
							intent_id: this.getNodeParameter('mod_intent_id', i),
						};
						if (this.getNodeParameter('updateQuestion', i, false) as boolean) {
							rawBody.question = {
								text: { content: this.getNodeParameter('updated_question_text', i, '') },
							};
						}
						if (this.getNodeParameter('updateSimilarQuestions', i, false) as boolean) {
							const similarRows = collectionRows(
								this.getNodeParameter('updatedSimilarQuestionsCollection', i, {}),
								'questions',
							);
							rawBody.similar_questions = {
								items: similarRows.map((row) => ({ text: { content: row.text } })),
							};
						}
						if (this.getNodeParameter('updateAnswer', i, false) as boolean) {
							const attachmentRows = collectionRows(
								this.getNodeParameter('updatedAttachmentsCollection', i, {}),
								'attachments',
							);
							rawBody.answers = [
								{
									text: {
										content: this.getNodeParameter('updated_answer_text', i, ''),
									},
									attachments: attachmentRows,
								},
							];
						}
						body = normalizeKnowledgeIntentBody(this, rawBody, 'mod', i);
					} else {
						fail(this, '问答输入方式无效', i);
					}
				} else if (action_type === 'del') {
					endpoint = '/cgi-bin/kf/knowledge/del_intent';
					body = {
						intent_id: requireText(
							this,
							this.getNodeParameter('intent_id', i),
							'问答 ID',
							i,
						),
					};
				} else if (action_type === 'list') {
					endpoint = '/cgi-bin/kf/knowledge/list_intent';
					body = {};
					const group_id = optionalText(
						this,
						this.getNodeParameter('list_intent_group_id', i, ''),
						'分组 ID 筛选',
						i,
					);
					const intent_id = optionalText(
						this,
						this.getNodeParameter('list_intent_id', i, ''),
						'问答 ID 筛选',
						i,
					);
					const cursor = optionalText(
						this,
						this.getNodeParameter('cursor', i, ''),
						'分页游标',
						i,
					);
					const limit = requireInteger(
						this,
						this.getNodeParameter('limit', i, 500),
						'每页数量',
						i,
						1,
						1000,
					);
					if (group_id) body.group_id = group_id;
					if (intent_id) body.intent_id = intent_id;
					if (cursor) body.cursor = cursor;
					body.limit = limit;
				} else {
					fail(this, '知识库问答操作类型无效', i);
				}

				response = await weComApiRequest.call(this, 'POST', endpoint, body);
			} else {
				fail(this, `不支持的微信客服操作: ${operation}`, i);
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
