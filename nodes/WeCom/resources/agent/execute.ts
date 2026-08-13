import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

const WORKBENCH_TYPES = ['keydata', 'image', 'list', 'webview'] as const;
const MENU_EVENT_TYPES = [
	'click',
	'scancode_push',
	'scancode_waitmsg',
	'pic_sysphoto',
	'pic_photo_or_album',
	'pic_weixin',
	'location_select',
];
const MENU_ACTION_TYPES = [...MENU_EVENT_TYPES, 'view', 'view_miniprogram'];

export async function executeAgent(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const fail = (message: string, itemIndex: number): never => {
		throw new NodeOperationError(this.getNode(), message, { itemIndex });
	};
	const requireText = (
		value: unknown,
		label: string,
		itemIndex: number,
		limits: { maxBytes?: number; minChars?: number; maxChars?: number } = {},
	): string => {
		const text = String(value ?? '').trim();
		if (!text) fail(`${label}不能为空`, itemIndex);
		const characterLength = Array.from(text).length;
		if (limits.minChars !== undefined && characterLength < limits.minChars) {
			fail(`${label}不能少于 ${limits.minChars} 个字符`, itemIndex);
		}
		if (limits.maxChars !== undefined && characterLength > limits.maxChars) {
			fail(`${label}不能超过 ${limits.maxChars} 个字符`, itemIndex);
		}
		if (limits.maxBytes !== undefined && Buffer.byteLength(text, 'utf8') > limits.maxBytes) {
			fail(`${label}不能超过 ${limits.maxBytes} 个字节`, itemIndex);
		}
		return text;
	};
	const getAgentId = (itemIndex: number): number => {
		const agentId = Number(this.getNodeParameter('agentid', itemIndex));
		if (!Number.isSafeInteger(agentId) || agentId <= 0) {
			fail('应用 ID 必须是正整数', itemIndex);
		}
		return agentId;
	};
	const ensureHttpUrl = (
		value: unknown,
		label: string,
		itemIndex: number,
		maxBytes?: number,
	): string => {
		const text = requireText(value, label, itemIndex, { maxBytes });
		try {
			const url = new URL(text);
			if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
		} catch {
			fail(`${label}必须是有效的 HTTP(S) 链接`, itemIndex);
		}
		return text;
	};
	const parseJson = (value: unknown, label: string, itemIndex: number): unknown => {
		if (typeof value !== 'string') return value;
		try {
			return JSON.parse(value);
		} catch (error) {
			return fail(`${label} JSON 解析失败: ${(error as Error).message}`, itemIndex);
		}
	};
	const asObject = (value: unknown, label: string, itemIndex: number): IDataObject => {
		if (!value || typeof value !== 'object' || Array.isArray(value)) {
			fail(`${label}必须是对象`, itemIndex);
		}
		return value as IDataObject;
	};
	const addDestination = (
		source: IDataObject,
		target: IDataObject,
		label: string,
		itemIndex: number,
		jumpDisabled = false,
	) => {
		const jumpUrl = String(source.jump_url ?? '').trim();
		const pagepath = String(source.pagepath ?? '').trim();
		if (jumpUrl && pagepath) fail(`${label}的跳转 URL 与小程序页面路径不能同时设置`, itemIndex);
		if (jumpDisabled && jumpUrl) {
			fail(`${label}开启 Webview 内链接跳转时不能再设置外层跳转 URL`, itemIndex);
		}
		if (jumpUrl) target.jump_url = ensureHttpUrl(jumpUrl, `${label}跳转 URL`, itemIndex, 1024);
		if (pagepath) {
			target.pagepath = requireText(pagepath, `${label}小程序页面路径`, itemIndex, {
				maxBytes: 1024,
			});
		}
	};
	const normalizeWorkbenchData = (
		type: string,
		value: unknown,
		itemIndex: number,
	): IDataObject => {
		if (!WORKBENCH_TYPES.includes(type as (typeof WORKBENCH_TYPES)[number])) {
			fail('工作台模版类型不受支持', itemIndex);
		}
		const data = asObject(value, '模版数据', itemIndex);
		if (type === 'keydata') {
			const keyDataItems = data.items;
			if (!Array.isArray(keyDataItems) || keyDataItems.length < 1 || keyDataItems.length > 4) {
				throw new NodeOperationError(this.getNode(), '关键数据项必须包含 1–4 项', {
					itemIndex,
				});
			}
			return {
				items: keyDataItems.map((entry: unknown, entryIndex: number) => {
					const item = asObject(entry, `关键数据第 ${entryIndex + 1} 项`, itemIndex);
					const result: IDataObject = {
						data: requireText(item.data, `关键数据第 ${entryIndex + 1} 项的数据`, itemIndex, {
							maxChars: 64,
						}),
					};
					const key = String(item.key ?? '').trim();
					if (key) {
						if (Array.from(key).length > 64) fail(`关键数据第 ${entryIndex + 1} 项的名称不能超过 64 个字符`, itemIndex);
						result.key = key;
					}
					addDestination(item, result, `关键数据第 ${entryIndex + 1} 项`, itemIndex);
					return result;
				}),
			};
		}
		if (type === 'image') {
			const result: IDataObject = {
				url: ensureHttpUrl(data.url, '图片 URL', itemIndex),
			};
			addDestination(data, result, '图片', itemIndex);
			return result;
		}
		if (type === 'list') {
			const listItems = data.items;
			if (!Array.isArray(listItems) || listItems.length < 1 || listItems.length > 3) {
				throw new NodeOperationError(this.getNode(), '列表项必须包含 1–3 项', {
					itemIndex,
				});
			}
			return {
				items: listItems.map((entry: unknown, entryIndex: number) => {
					const item = asObject(entry, `列表第 ${entryIndex + 1} 项`, itemIndex);
					const result: IDataObject = {
						title: requireText(item.title, `列表第 ${entryIndex + 1} 项标题`, itemIndex, {
							maxBytes: 128,
						}),
					};
					addDestination(item, result, `列表第 ${entryIndex + 1} 项`, itemIndex);
					return result;
				}),
			};
		}

		const height = String(data.height ?? 'double_row');
		if (!['single_row', 'double_row'].includes(height)) fail('Webview 高度不受支持', itemIndex);
		for (const [field, label] of [
			['hide_title', '隐藏应用标题'],
			['enable_webview_click', '允许 Webview 内链接跳转'],
		] as const) {
			if (data[field] !== undefined && typeof data[field] !== 'boolean') {
				fail(`${label}必须是布尔值`, itemIndex);
			}
		}
		const result: IDataObject = {
			url: ensureHttpUrl(data.url, 'Webview URL', itemIndex),
			height,
			hide_title: Boolean(data.hide_title),
			enable_webview_click: Boolean(data.enable_webview_click),
		};
		addDestination(data, result, 'Webview', itemIndex, result.enable_webview_click === true);
		return result;
	};
	const getWorkbenchData = (type: string, itemIndex: number): IDataObject => {
		const inputMode = this.getNodeParameter('workbenchInputMode', itemIndex, 'form') as string;
		if (inputMode === 'json') {
			return normalizeWorkbenchData(
				type,
				parseJson(this.getNodeParameter('workbenchDataJson', itemIndex, '{}'), '模版数据', itemIndex),
				itemIndex,
			);
		}
		if (inputMode !== 'form') fail('模版数据输入方式不受支持', itemIndex);

		let raw: IDataObject = {};
		if (type === 'keydata') {
			const collection = this.getNodeParameter('keydataItems', itemIndex, {}) as IDataObject;
			raw = {
				items: ((collection.items as IDataObject[]) || []).map((entry) => {
					const item: IDataObject = { key: entry.key, data: entry.data };
					if (entry.linkType === 'url') item.jump_url = entry.jump_url;
					if (entry.linkType === 'pagepath') item.pagepath = entry.pagepath;
					return item;
				}),
			};
		} else if (type === 'image') {
			raw = { url: this.getNodeParameter('image_url', itemIndex, '') as string };
			const linkType = this.getNodeParameter('imageLinkType', itemIndex, 'none') as string;
			if (linkType === 'url') raw.jump_url = this.getNodeParameter('image_jump_url', itemIndex, '') as string;
			if (linkType === 'pagepath') raw.pagepath = this.getNodeParameter('image_pagepath', itemIndex, '') as string;
		} else if (type === 'list') {
			const collection = this.getNodeParameter('listItems', itemIndex, {}) as IDataObject;
			raw = {
				items: ((collection.items as IDataObject[]) || []).map((entry) => {
					const item: IDataObject = { title: entry.title };
					if (entry.linkType === 'url') item.jump_url = entry.jump_url;
					if (entry.linkType === 'pagepath') item.pagepath = entry.pagepath;
					return item;
				}),
			};
		} else if (type === 'webview') {
			raw = {
				url: this.getNodeParameter('webview_url', itemIndex, '') as string,
				height: this.getNodeParameter('webview_height', itemIndex, 'double_row') as string,
				hide_title: this.getNodeParameter('webview_hide_title', itemIndex, false) as boolean,
				enable_webview_click: this.getNodeParameter('webview_enable_click', itemIndex, false) as boolean,
			};
			const linkType = this.getNodeParameter('webviewLinkType', itemIndex, 'none') as string;
			if (linkType === 'url' && raw.enable_webview_click !== true) {
				raw.jump_url = this.getNodeParameter('webview_jump_url', itemIndex, '') as string;
			}
			if (linkType === 'pagepath') raw.pagepath = this.getNodeParameter('webview_pagepath', itemIndex, '') as string;
		} else {
			fail('工作台模版类型不受支持', itemIndex);
		}
		return normalizeWorkbenchData(type, raw, itemIndex);
	};
	const normalizeMenuButtons = (value: unknown, itemIndex: number): IDataObject[] => {
		if (!Array.isArray(value) || value.length < 1 || value.length > 3) {
			throw new NodeOperationError(this.getNode(), '一级菜单必须包含 1–3 项', {
				itemIndex,
			});
		}
		const normalizeEntry = (entry: unknown, entryIndex: number, isSubMenu: boolean): IDataObject => {
			const source = asObject(
				entry,
				`${isSubMenu ? '二级' : '一级'}菜单第 ${entryIndex + 1} 项`,
				itemIndex,
			);
			const label = `${isSubMenu ? '二级' : '一级'}菜单第 ${entryIndex + 1} 项`;
			const result: IDataObject = {
				name: requireText(source.name, `${label}名称`, itemIndex, {
					maxBytes: isSubMenu ? 40 : 16,
				}),
			};
			const subButtons = Array.isArray(source.sub_button) ? source.sub_button : [];
			const hasSubMenu = !isSubMenu && (source.type === 'sub' || subButtons.length > 0);
			if (hasSubMenu) {
				if (subButtons.length < 1 || subButtons.length > 5) {
					fail(`${label}的子菜单必须包含 1–5 项`, itemIndex);
				}
				result.sub_button = subButtons.map((sub, subIndex) => normalizeEntry(sub, subIndex, true));
				return result;
			}
			if (isSubMenu && subButtons.length > 0) fail('二级菜单不能继续包含子菜单', itemIndex);
			const type = String(source.type ?? '');
			if (!MENU_ACTION_TYPES.includes(type)) fail(`${label}类型不受支持`, itemIndex);
			result.type = type;
			if (MENU_EVENT_TYPES.includes(type)) {
				result.key = requireText(source.key, `${label}事件 Key`, itemIndex, { maxBytes: 128 });
			} else if (type === 'view') {
				result.url = ensureHttpUrl(source.url, `${label}网页 URL`, itemIndex, 1024);
			} else {
				result.appid = requireText(source.appid, `${label}小程序 AppID`, itemIndex);
				result.pagepath = requireText(source.pagepath, `${label}小程序页面路径`, itemIndex);
			}
			return result;
		};
		return value.map((entry: unknown, entryIndex: number) =>
			normalizeEntry(entry, entryIndex, false),
		);
	};
	const getMenuButtons = (itemIndex: number): IDataObject[] => {
		const mode = this.getNodeParameter('menuConfigMode', itemIndex, 'form') as string;
		let raw: unknown;
		if (mode === 'json') {
			raw = parseJson(this.getNodeParameter('button', itemIndex, '[]'), '一级菜单', itemIndex);
		} else if (mode === 'form') {
			const collection = this.getNodeParameter('menuButtonCollection', itemIndex, {}) as IDataObject;
			raw = ((collection.buttons as IDataObject[]) || []).map((entry) => {
				if (entry.type !== 'sub') return entry;
				const subCollection = (entry.subButtonsCollection as IDataObject) || {};
				return { name: entry.name, type: 'sub', sub_button: subCollection.items || [] };
			});
		} else {
			fail('菜单配置方式不受支持', itemIndex);
		}
		return normalizeMenuButtons(raw, itemIndex);
	};
	const ensureSuccess = (response: IDataObject, label: string, itemIndex: number) => {
		if (response.errcode !== undefined && Number(response.errcode) !== 0) {
			fail(`${label}失败: ${response.errmsg} (错误码: ${response.errcode})`, itemIndex);
		}
	};

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject | undefined;
			switch (operation) {
				case 'getAgent':
					responseData = await weComApiRequest.call(this, 'GET', '/cgi-bin/agent/get', {}, {
						agentid: getAgentId(i),
					});
					break;
				case 'listAgents':
					responseData = await weComApiRequest.call(this, 'GET', '/cgi-bin/agent/list');
					break;
				case 'setAgent': {
					const body: IDataObject = { agentid: getAgentId(i) };
					const name = String(this.getNodeParameter('name', i, '') ?? '').trim();
					const description = String(this.getNodeParameter('description', i, '') ?? '').trim();
					const logoMediaId = String(this.getNodeParameter('logo_mediaid', i, '') ?? '').trim();
					const homeUrl = String(this.getNodeParameter('home_url', i, '') ?? '').trim();
					const redirectDomain = String(this.getNodeParameter('redirect_domain', i, '') ?? '').trim();
					if (name) body.name = requireText(name, '应用名称', i, { maxChars: 32 });
					if (description) {
						body.description = requireText(description, '应用详情', i, { minChars: 4, maxChars: 120 });
					}
					if (logoMediaId) body.logo_mediaid = logoMediaId;
					if (homeUrl) body.home_url = ensureHttpUrl(homeUrl, '应用主页 URL', i);
					if (redirectDomain) {
						const normalizedDomain = redirectDomain.toLowerCase();
						if (/[:/\s]/.test(normalizedDomain)) fail('可信域名只能填写不含协议和路径的域名', i);
						try {
							const parsed = new URL(`https://${normalizedDomain}`);
							if (parsed.hostname !== normalizedDomain) throw new Error();
						} catch {
							fail('可信域名格式不正确', i);
						}
						body.redirect_domain = normalizedDomain;
					}
					for (const [parameter, label] of [
						['report_location_flag', '地理位置上报'],
						['isreportenter', '进入应用事件上报'],
					] as const) {
						const raw = this.getNodeParameter(parameter, i, '') as string | number;
						if (raw !== '') {
							const value = Number(raw);
							if (![0, 1].includes(value)) fail(`${label}仅支持 0 或 1`, i);
							body[parameter] = value;
						}
					}
					if (Object.keys(body).length === 1) fail('请至少填写一项需要修改的应用设置', i);
					responseData = await weComApiRequest.call(this, 'POST', '/cgi-bin/agent/set', body);
					break;
				}
				case 'createMenu':
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/menu/create',
						{ button: getMenuButtons(i) },
						{ agentid: getAgentId(i) },
					);
					break;
				case 'getMenu':
				case 'deleteMenu': {
					const menuPath =
						operation === 'getMenu' ? '/cgi-bin/menu/get' : '/cgi-bin/menu/delete';
					responseData = await weComApiRequest.call(
						this,
						'GET',
						menuPath,
						{},
						{ agentid: getAgentId(i) },
					);
					break;
				}
				case 'setWorkbenchTemplate': {
					const agentid = getAgentId(i);
					const type = String(this.getNodeParameter('type', i));
					if (![...WORKBENCH_TYPES, 'normal'].includes(type as (typeof WORKBENCH_TYPES)[number] | 'normal')) {
						fail('工作台模版类型不受支持', i);
					}
					const body: IDataObject = { agentid, type };
					if (type !== 'normal') {
						if (this.getNodeParameter('setDefaultData', i, false) as boolean) {
							body[type] = getWorkbenchData(type, i);
						}
						if (this.getNodeParameter('replace_user_data', i, false) as boolean) {
							body.replace_user_data = true;
						}
					}
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/agent/set_workbench_template',
						body,
					);
					break;
				}
				case 'getWorkbenchTemplate':
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/agent/get_workbench_template',
						{ agentid: getAgentId(i) },
					);
					break;
				case 'setWorkbenchData':
				case 'batchSetWorkbenchData': {
					const agentid = getAgentId(i);
					const type = String(this.getNodeParameter('type', i));
					const templateData = getWorkbenchData(type, i);
					if (operation === 'setWorkbenchData') {
						responseData = await weComApiRequest.call(
							this,
							'POST',
							'/cgi-bin/agent/set_workbench_data',
							{
								agentid,
								userid: requireText(
									this.getNodeParameter('userid', i, '') ||
										this.getNodeParameter('userid_selected', i, ''),
									'用户 ID',
									i,
								),
								type,
								[type]: templateData,
							},
						);
					} else {
						const selected = this.getNodeParameter('userid_list_selected', i, []) as string[];
						const manual = String(this.getNodeParameter('userid_list', i, '') ?? '')
							.split(/[,|\n]/)
							.map((userid) => userid.trim())
							.filter(Boolean);
						const selectedUserIds = selected.map(String).map((userid) => userid.trim()).filter(Boolean);
						const useridList = [...new Set([...selectedUserIds, ...manual])];
						if (useridList.length < 1 || useridList.length > 1000) {
							fail('用户列表合并后必须包含 1–1000 人', i);
						}
						responseData = await weComApiRequest.call(
							this,
							'POST',
							'/cgi-bin/agent/batch_set_workbench_data',
							{ agentid, userid_list: useridList, data: { type, [type]: templateData } },
						);
					}
					break;
				}
				case 'getWorkbenchData':
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/agent/get_workbench_data',
						{
							agentid: getAgentId(i),
							userid: requireText(
									this.getNodeParameter('userid', i, '') ||
										this.getNodeParameter('userid_selected', i, ''),
									'用户 ID',
									i,
								),
						},
					);
					break;
				case 'listAppShareInfo': {
					const businessType = Number(this.getNodeParameter('business_type', i, 0));
					if (![0, 1].includes(businessType)) fail('业务类型仅支持 0 或 1', i);
					const body: IDataObject = { agentid: getAgentId(i), business_type: businessType };
					const mode = this.getNodeParameter('shareInfoQueryMode', i, 'list') as string;
					if (mode === 'corp') {
						body.corpid = requireText(this.getNodeParameter('corpid', i), '企业 CorpID', i);
					} else if (mode === 'list') {
						const limit = Number(this.getNodeParameter('limit', i, 0));
						if (!Number.isInteger(limit) || limit < 0 || limit > 100) {
							fail('返回数量必须是 0–100 的整数', i);
						}
						if (limit > 0) body.limit = limit;
						const cursor = String(this.getNodeParameter('cursor', i, '') ?? '').trim();
						if (cursor) body.cursor = cursor;
					} else {
						fail('应用共享信息查询方式不受支持', i);
					}
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/corpgroup/corp/list_app_share_info',
						body,
					);
					break;
				}
				default:
					fail(`未知操作: ${operation}`, i);
			}

			if (!responseData) {
				throw new NodeOperationError(this.getNode(), `操作 ${operation} 未返回结果`, {
					itemIndex: i,
				});
			}
			ensureSuccess(responseData, '应用管理操作', i);
			returnData.push({ json: responseData, pairedItem: { item: i } });
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: { item: i },
				});
				continue;
			}
			if (error instanceof NodeOperationError) throw error;
			throw new NodeOperationError(this.getNode(), (error as Error).message, { itemIndex: i });
		}
	}

	return returnData;
}
