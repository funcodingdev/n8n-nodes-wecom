import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

/**
 * 执行应用管理相关操作
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90227
 */
export async function executeAgent(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject;

			switch (operation) {
				// 获取应用详情
				case 'getAgent': {
					const agentid = this.getNodeParameter('agentid', i) as number;
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/agent/get',
						{},
						{ agentid },
					);
					break;
				}

				// 获取应用列表
				case 'listAgents': {
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/agent/list',
					);
					break;
				}

				// 设置应用
				case 'setAgent': {
					const agentid = this.getNodeParameter('agentid', i) as number;
					const name = this.getNodeParameter('name', i, '') as string;
					const description = this.getNodeParameter('description', i, '') as string;
					const logo_mediaid = this.getNodeParameter('logo_mediaid', i, '') as string;
					const home_url = this.getNodeParameter('home_url', i, '') as string;
					const redirect_domain = this.getNodeParameter('redirect_domain', i, '') as string;
					const report_location_flag = this.getNodeParameter('report_location_flag', i, undefined) as number | undefined;
					const isreportenter = this.getNodeParameter('isreportenter', i, undefined) as number | undefined;

					const body: IDataObject = {
						agentid,
					};

					// 只添加非空的可选参数
					if (name) body.name = name;
					if (description) body.description = description;
					if (logo_mediaid) body.logo_mediaid = logo_mediaid;
					if (home_url) body.home_url = home_url;
					if (redirect_domain) body.redirect_domain = redirect_domain;
					if (report_location_flag !== undefined) body.report_location_flag = report_location_flag;
					if (isreportenter !== undefined) body.isreportenter = isreportenter;

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/agent/set',
						body,
					);
					break;
				}

				// 创建菜单
				case 'createMenu': {
					const agentid = this.getNodeParameter('agentid', i) as number;
					const menuConfigMode = this.getNodeParameter('menuConfigMode', i, 'form') as string;
					let button: IDataObject[] = [];

					if (menuConfigMode === 'json') {
						const buttonJson = this.getNodeParameter('button', i) as string;
						try {
							button = typeof buttonJson === 'string' ? JSON.parse(buttonJson) : buttonJson;
						} catch {
							throw new Error('菜单配置JSON格式错误，请检查JSON语法');
						}
					} else {
						const collection = this.getNodeParameter('menuButtonCollection', i, {}) as IDataObject;
						const items = (collection?.buttons as IDataObject[]) || [];
						button = items
							.filter((b) => b.name)
							.map((b) => {
								const item: IDataObject = { name: b.name };
								if (b.type === 'sub') {
									try {
										const subs = JSON.parse(String(b.sub_button_json || '[]'));
										if (Array.isArray(subs) && subs.length) item.sub_button = subs;
									} catch {
										/* ignore */
									}
								} else {
									item.type = b.type;
									if (b.key) item.key = b.key;
									if (b.url) item.url = b.url;
									if (b.appid) item.appid = b.appid;
									if (b.pagepath) item.pagepath = b.pagepath;
								}
								return item;
							});
					}

					if (!Array.isArray(button) || !button.length) {
						throw new Error('请至少配置一个一级菜单');
					}

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/menu/create',
						{ button },
						{ agentid },
					);
					break;
				}

				// 获取菜单
				case 'getMenu': {
					const agentid = this.getNodeParameter('agentid', i) as number;
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/menu/get',
						{},
						{ agentid },
					);
					break;
				}

				// 删除菜单
				case 'deleteMenu': {
					const agentid = this.getNodeParameter('agentid', i) as number;
					responseData = await weComApiRequest.call(
						this,
						'GET',
						'/cgi-bin/menu/delete',
						{},
						{ agentid },
					);
					break;
				}

				// 设置工作台模版
				case 'setWorkbenchTemplate': {
					const agentid = this.getNodeParameter('agentid', i) as number;
					const type = this.getNodeParameter('type', i) as string;

					const body: IDataObject = {
						agentid,
						type,
					};

					if (type !== 'normal') {
						let templateData: IDataObject = {};
						if (type === 'keydata') {
							const collection = this.getNodeParameter('keydataItems', i, {}) as IDataObject;
							const items = ((collection?.items as IDataObject[]) || [])
								.filter((it) => it.key)
								.slice(0, 4)
								.map((it) => {
									const item: IDataObject = { key: it.key, data: it.data || '' };
									if (it.jump_url) item.jump_url = it.jump_url;
									if (it.pagepath) item.pagepath = it.pagepath;
									return item;
								});
							templateData = { items };
						} else if (type === 'image') {
							const url = this.getNodeParameter('image_url', i, '') as string;
							const jump_url = this.getNodeParameter('image_jump_url', i, '') as string;
							const pagepath = this.getNodeParameter('image_pagepath', i, '') as string;
							if (url) templateData.url = url;
							if (jump_url) templateData.jump_url = jump_url;
							if (pagepath) templateData.pagepath = pagepath;
						} else if (type === 'list') {
							const collection = this.getNodeParameter('listItems', i, {}) as IDataObject;
							const items = ((collection?.items as IDataObject[]) || [])
								.filter((it) => it.title)
								.slice(0, 3)
								.map((it) => {
									const item: IDataObject = { title: it.title };
									if (it.jump_url) item.jump_url = it.jump_url;
									if (it.pagepath) item.pagepath = it.pagepath;
									return item;
								});
							templateData = { items };
						} else if (type === 'webview') {
							const url = this.getNodeParameter('webview_url', i, '') as string;
							const jump_url = this.getNodeParameter('webview_jump_url', i, '') as string;
							const height = this.getNodeParameter('webview_height', i, 'double_row') as string;
							const hide_title = this.getNodeParameter('webview_hide_title', i, false) as boolean;
							const enable_webview_click = this.getNodeParameter(
								'webview_enable_click',
								i,
								false,
							) as boolean;
							if (url) templateData.url = url;
							if (jump_url) templateData.jump_url = jump_url;
							templateData.height = height;
							templateData.hide_title = hide_title;
							templateData.enable_webview_click = enable_webview_click;
						}

						try {
							const extra = JSON.parse(
								this.getNodeParameter('templateExtraJson', i, '{}') as string,
							) as IDataObject;
							if (extra && typeof extra === 'object') Object.assign(templateData, extra);
						} catch {
							/* ignore */
						}

						body[type] = templateData;

						const replace_user_data = this.getNodeParameter('replace_user_data', i, false) as boolean;
						if (replace_user_data) {
							body.replace_user_data = replace_user_data;
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

				// 获取工作台模版
				case 'getWorkbenchTemplate': {
					const agentid = this.getNodeParameter('agentid', i) as number;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/agent/get_workbench_template',
						{ agentid },
					);
					break;
				}

				// 设置用户工作台数据
				case 'setWorkbenchData':
				case 'batchSetWorkbenchData': {
					const agentid = this.getNodeParameter('agentid', i) as number;
					const type = this.getNodeParameter('type', i) as string;
					let templateData: IDataObject = {};
					if (type === 'keydata') {
						const collection = this.getNodeParameter('keydataItems', i, {}) as IDataObject;
						templateData = {
							items: ((collection?.items as IDataObject[]) || [])
								.filter((it) => it.key)
								.slice(0, 4)
								.map((it) => {
									const item: IDataObject = { key: it.key, data: it.data || '' };
									if (it.jump_url) item.jump_url = it.jump_url;
									if (it.pagepath) item.pagepath = it.pagepath;
									return item;
								}),
						};
					} else if (type === 'image') {
						const url = this.getNodeParameter('image_url', i, '') as string;
						const jump_url = this.getNodeParameter('image_jump_url', i, '') as string;
						const pagepath = this.getNodeParameter('image_pagepath', i, '') as string;
						if (url) templateData.url = url;
						if (jump_url) templateData.jump_url = jump_url;
						if (pagepath) templateData.pagepath = pagepath;
					} else if (type === 'list') {
						const collection = this.getNodeParameter('listItems', i, {}) as IDataObject;
						templateData = {
							items: ((collection?.items as IDataObject[]) || [])
								.filter((it) => it.title)
								.slice(0, 3)
								.map((it) => {
									const item: IDataObject = { title: it.title };
									if (it.jump_url) item.jump_url = it.jump_url;
									if (it.pagepath) item.pagepath = it.pagepath;
									return item;
								}),
						};
					} else if (type === 'webview') {
						const url = this.getNodeParameter('webview_url', i, '') as string;
						const jump_url = this.getNodeParameter('webview_jump_url', i, '') as string;
						if (url) templateData.url = url;
						if (jump_url) templateData.jump_url = jump_url;
					}
					try {
						const extra = JSON.parse(
							this.getNodeParameter('templateExtraJson', i, '{}') as string,
						) as IDataObject;
						if (extra && typeof extra === 'object') Object.assign(templateData, extra);
					} catch {
						/* ignore */
					}

					if (operation === 'setWorkbenchData') {
						const userid = this.getNodeParameter('userid', i) as string;
						responseData = await weComApiRequest.call(
							this,
							'POST',
							'/cgi-bin/agent/set_workbench_data',
							{ agentid, userid, type, [type]: templateData },
						);
					} else {
						const useridListStr = this.getNodeParameter('userid_list', i) as string;
						const userid_list = useridListStr
							.split(',')
							.map((id) => id.trim())
							.filter((id) => id);
						responseData = await weComApiRequest.call(
							this,
							'POST',
							'/cgi-bin/agent/batch_set_workbench_data',
							{
								agentid,
								userid_list,
								data: { type, [type]: templateData },
							},
						);
					}
					break;
				}

				// 获取用户工作台数据
				case 'getWorkbenchData': {
					const agentid = this.getNodeParameter('agentid', i) as number;
					const userid = this.getNodeParameter('userid', i) as string;
					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/agent/get_workbench_data',
						{ agentid, userid },
					);
					break;
				}

				case 'listAppShareInfo': {
					const agentid = this.getNodeParameter('agentid', i) as number;
					const business_type = this.getNodeParameter('business_type', i, 0) as number;
					const corpid = this.getNodeParameter('corpid', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 0) as number;
					const cursor = this.getNodeParameter('cursor', i, '') as string;

					const body: IDataObject = { agentid };
					if (business_type !== undefined) body.business_type = business_type;
					if (corpid) body.corpid = corpid;
					if (limit) body.limit = limit;
					if (cursor) body.cursor = cursor;

					responseData = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/corpgroup/corp/list_app_share_info',
						body,
					);
					break;
				}
				default:
					throw new Error(`未知操作: ${operation}`);
			}

			returnData.push({
				json: responseData,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
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
