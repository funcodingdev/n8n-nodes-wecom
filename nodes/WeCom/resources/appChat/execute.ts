import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeAppChat(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const parseOptionalJsonParameter = (
		value: unknown,
		parameterName: string,
		itemIndex: number,
	): IDataObject | IDataObject[] | undefined => {
		if (value === undefined || value === null) {
			return undefined;
		}
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed || trimmed === '{}' || trimmed === '[]') {
				return undefined;
			}
			try {
				return JSON.parse(trimmed) as IDataObject | IDataObject[];
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`${parameterName} 必须是有效的 JSON: ${(error as Error).message}`,
					{ itemIndex },
				);
			}
		}
		return value as IDataObject | IDataObject[];
	};
	const resolveSafeValue = (value: unknown): number | undefined => {
		if (value === undefined || value === null) {
			return undefined;
		}
		if (typeof value === 'boolean') {
			return value ? 1 : 0;
		}
		if (typeof value === 'number') {
			return value;
		}
		if (typeof value === 'string') {
			const parsed = Number.parseInt(value, 10);
			return Number.isNaN(parsed) ? undefined : parsed;
		}
		return undefined;
	};
	const parseDelimitedList = (
		value: string,
		label: string,
		limit: number,
		itemIndex: number,
	): string[] => {
		if (!value.trim()) {
			return [];
		}

		const values = [
			...new Set(
				value
					.split(/[|,]/)
					.map((item) => item.trim())
					.filter(Boolean),
			),
		];
		if (values.length > limit) {
			throw new NodeOperationError(this.getNode(), `${label}最多支持 ${limit} 个`, {
				itemIndex,
			});
		}
		return values;
	};
	const parseUserIdJson = (value: unknown, label: string, itemIndex: number): string[] => {
		if (value === undefined || value === null || String(value).trim() === '') return [];
		let parsed: unknown = value;
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed || trimmed === '[]') return [];
			try {
				parsed = JSON.parse(trimmed);
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`${label}必须是有效的 JSON: ${(error as Error).message}`,
					{ itemIndex },
				);
			}
		}
		if (!Array.isArray(parsed)) {
			throw new NodeOperationError(this.getNode(), `${label}必须是 JSON 数组`, { itemIndex });
		}
		return normalizeMentionedUsers(parsed, itemIndex).filter((id) => id !== '@all');
	};
	const mergeIdLists = (
		selected: string[],
		manual: string[],
		label: string,
		limit: number,
		itemIndex: number,
		fromJson: string[] = [],
	): string[] => {
		const values = [
			...new Set(
				[...selected, ...manual, ...fromJson]
					.map((entry) => String(entry).trim())
					.filter(Boolean),
			),
		];
		if (values.length > limit) {
			throw new NodeOperationError(this.getNode(), `${label}最多支持 ${limit} 个`, {
				itemIndex,
			});
		}
		return values;
	};
	const normalizeMentionedUsers = (value: unknown, itemIndex: number): string[] => {
		const values: string[] = [];
		const collect = (entry: unknown) => {
			if (entry === undefined || entry === null) return;
			if (Array.isArray(entry)) {
				for (const item of entry) collect(item);
				return;
			}
			if (typeof entry === 'object') {
				const row = entry as IDataObject;
				const id = row.userid ?? row.userid_selected ?? row.user_id;
				if (id !== undefined && id !== null && String(id).trim()) {
					values.push(String(id).trim());
					return;
				}
			}
			if (typeof entry === 'string') {
				const trimmed = entry.trim();
				if (!trimmed) return;
				if (trimmed.startsWith('[')) {
					try {
						const parsed = JSON.parse(trimmed) as unknown;
						if (Array.isArray(parsed)) {
							for (const item of parsed) collect(item);
							return;
						}
					} catch (error) {
						void error;
					}
				}
				values.push(...parseDelimitedList(trimmed, '@提醒成员', 2000, itemIndex));
				return;
			}
			const text = String(entry).trim();
			if (text) values.push(text);
		};
		collect(value);

		const normalized = [...new Set(values)];
		if (normalized.includes('@all')) return ['@all'];
		if (normalized.length > 2000) {
			throw new NodeOperationError(this.getNode(), '@提醒成员最多支持 2000 个', { itemIndex });
		}
		return normalized;
	};

	for (let i = 0; i < items.length; i++) {
		try {
			if (operation === 'createAppChat') {
				// 创建群聊会话
				const name = this.getNodeParameter('name', i, '') as string;
				const owner =
					(this.getNodeParameter('owner', i, '') as string) ||
					(this.getNodeParameter('owner_selected', i, '') as string);
				const userlist = this.getNodeParameter('userlist', i, '') as string;
				const selectedUsers = this.getNodeParameter('userlist_selected', i, []) as string[];
				const chatid = this.getNodeParameter('chatid', i, '') as string;

				const userList = mergeIdLists(
					selectedUsers,
					parseDelimitedList(userlist, '群成员列表', 2000, i),
					'群成员列表',
					2000,
					i,
					parseUserIdJson(this.getNodeParameter('userlistJson', i, '[]'), '成员列表 JSON', i),
				);
				if (userList.length < 2) {
					throw new NodeOperationError(this.getNode(), '创建群聊至少需要 2 位成员', {
						itemIndex: i,
					});
				}
				if (owner && !userList.includes(owner)) {
					throw new NodeOperationError(this.getNode(), '群主必须包含在群成员列表中', {
						itemIndex: i,
					});
				}
				if (chatid && !/^[A-Za-z0-9]{1,32}$/.test(chatid)) {
					throw new NodeOperationError(
						this.getNode(),
						'指定群聊 ID 只能包含数字和英文字母，且最长 32 个字符',
						{ itemIndex: i },
					);
				}

				const body: IDataObject = { userlist: userList };

				if (name) {
					body.name = name;
				}

				if (owner) {
					body.owner = owner;
				}

				if (chatid) {
					body.chatid = chatid;
				}

				const response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/appchat/create',
					body,
				);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			} else if (operation === 'updateAppChat') {
				// 修改群聊会话
				const chatid = this.getNodeParameter('chatid', i) as string;
				const updateType = this.getNodeParameter('updateType', i) as string;

				const body: IDataObject = {
					chatid,
				};
				let updated = false;

				if (updateType === 'name' || updateType === 'combined') {
					const name = this.getNodeParameter('name', i, '') as string;
					if (name) {
						body.name = name;
						updated = true;
					} else if (updateType === 'name') {
						throw new NodeOperationError(this.getNode(), '修改群名称时必须填写新的群聊名称', {
							itemIndex: i,
						});
					}
				}

				if (updateType === 'owner' || updateType === 'combined') {
					const owner =
						(this.getNodeParameter('owner', i, '') as string) ||
						(this.getNodeParameter('owner_selected', i, '') as string);
					if (owner) {
						body.owner = owner;
						updated = true;
					} else if (updateType === 'owner') {
						throw new NodeOperationError(this.getNode(), '修改群主时必须填写新群主 ID', {
							itemIndex: i,
						});
					}
				}

				let addUsers: string[] = [];
				if (updateType === 'addUsers' || updateType === 'combined') {
					const add_user_list = this.getNodeParameter('add_user_list', i, '') as string;
					const selectedAddUsers = this.getNodeParameter(
						'add_user_list_selected',
						i,
						[],
					) as string[];
					addUsers = mergeIdLists(
						selectedAddUsers,
						parseDelimitedList(add_user_list, '添加成员列表', 2000, i),
						'添加成员列表',
						2000,
						i,
						parseUserIdJson(this.getNodeParameter('addUserListJson', i, '[]'), '添加成员 JSON', i),
					);
					if (addUsers.length) {
						body.add_user_list = addUsers;
						updated = true;
					} else if (updateType === 'addUsers') {
						throw new NodeOperationError(this.getNode(), '添加成员时必须填写成员列表', {
							itemIndex: i,
						});
					}
				}

				let delUsers: string[] = [];
				if (updateType === 'delUsers' || updateType === 'combined') {
					const del_user_list = this.getNodeParameter('del_user_list', i, '') as string;
					const selectedDelUsers = this.getNodeParameter(
						'del_user_list_selected',
						i,
						[],
					) as string[];
					delUsers = mergeIdLists(
						selectedDelUsers,
						parseDelimitedList(del_user_list, '删除成员列表', 2000, i),
						'删除成员列表',
						2000,
						i,
						parseUserIdJson(this.getNodeParameter('delUserListJson', i, '[]'), '删除成员 JSON', i),
					);
					if (delUsers.length) {
						body.del_user_list = delUsers;
						updated = true;
					} else if (updateType === 'delUsers') {
						throw new NodeOperationError(this.getNode(), '删除成员时必须填写成员列表', {
							itemIndex: i,
						});
					}
				}

				if (addUsers.some((userId) => delUsers.includes(userId))) {
					throw new NodeOperationError(this.getNode(), '同一成员不能同时出现在添加和删除列表中', {
						itemIndex: i,
					});
				}
				if (!updated) {
					throw new NodeOperationError(this.getNode(), '组合更新至少需要填写一项变更内容', {
						itemIndex: i,
					});
				}

				const response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/appchat/update',
					body,
				);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			} else if (operation === 'getAppChat') {
				// 获取群聊会话
				const chatid = this.getNodeParameter('chatid', i) as string;

				const response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/appchat/get',
					{},
					{
						chatid,
					},
				);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			} else {
				// 发送消息到群聊会话
				const chatid = this.getNodeParameter('chatid', i) as string;
				let body: IDataObject = {
					chatid,
				};

				if (operation === 'sendText') {
					const content = this.getNodeParameter('content', i) as string;
					const safe = this.getNodeParameter('safe', i, false) as boolean;
					const mentionedList = [
						this.getNodeParameter('mentionedList_manual', i, ''),
						this.getNodeParameter('mentionedList', i, []),
						this.getNodeParameter('mentionedListJson', i, '[]'),
					] as Array<string | string[]>;
					const text: IDataObject = {
						content,
					};
					const mentionedUsers = normalizeMentionedUsers(mentionedList, i);

					if (mentionedUsers.length > 0) {
						text.mentioned_list = mentionedUsers;
					}

					body = {
						...body,
						msgtype: 'text',
						text,
						safe: safe ? 1 : 0,
					};
				} else if (operation === 'sendImage') {
					const mediaId =
						(this.getNodeParameter('media_id', i, '') as string) ||
						(this.getNodeParameter('media_ID', i, '') as string);
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					body = {
						...body,
						msgtype: 'image',
						image: {
							media_id: mediaId,
						},
						safe: safe ? 1 : 0,
					};
				} else if (operation === 'sendFile') {
					const mediaId =
						(this.getNodeParameter('media_id', i, '') as string) ||
						(this.getNodeParameter('media_ID', i, '') as string);
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					body = {
						...body,
						msgtype: 'file',
						file: {
							media_id: mediaId,
						},
						safe: safe ? 1 : 0,
					};
				} else if (operation === 'sendMarkdown') {
					const content = this.getNodeParameter('content', i) as string;

					body = {
						...body,
						msgtype: 'markdown',
						markdown: {
							content,
						},
					};
				} else if (operation === 'sendNews') {
					const newsInputMode = this.getNodeParameter('news_input_mode', i, 'form') as string;
					const newsJson = newsInputMode === 'json'
						? parseOptionalJsonParameter(
							this.getNodeParameter('news_json', i, '[]') as string,
							'news_json',
							i,
						)
						: undefined;
					const articles = this.getNodeParameter('articles', i, {}) as IDataObject;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					let articleList: IDataObject[] = [];
					let safeValue: number | undefined = safe ? 1 : 0;

					if (newsInputMode === 'json') {
						if (!newsJson) {
							throw new NodeOperationError(
								this.getNode(),
								'请选择 JSON 输入并提供 news_json',
								{ itemIndex: i },
							);
						}
						if (Array.isArray(newsJson)) {
							articleList = newsJson as IDataObject[];
						} else if ((newsJson as IDataObject).news) {
							const newsPayload = (newsJson as IDataObject).news as IDataObject;
							if (!Array.isArray(newsPayload.articles)) {
								throw new NodeOperationError(
									this.getNode(),
									'news_json.news 必须包含 articles 数组',
									{ itemIndex: i },
								);
							}
							articleList = newsPayload.articles as IDataObject[];
						} else if (Array.isArray((newsJson as IDataObject).articles)) {
							articleList = (newsJson as IDataObject).articles as IDataObject[];
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'news_json 必须是图文数组或包含 articles 的对象',
								{ itemIndex: i },
							);
						}

						const safeFromJson = resolveSafeValue((newsJson as IDataObject).safe);
						if (safeFromJson !== undefined) {
							safeValue = safeFromJson;
						}
					} else {
						articleList = ((articles.article as IDataObject[]) || []).map((article) => {
							const normalized: IDataObject = {
								title: article.title,
								url: article.url,
							};
							if (article.description) normalized.description = article.description;
							if (article.picurl) normalized.picurl = article.picurl;
							return normalized;
						});
					}
					if (articleList.length < 1 || articleList.length > 8) {
						throw new NodeOperationError(this.getNode(), '群聊图文列表必须包含 1～8 条', {
							itemIndex: i,
						});
					}
					if (articleList.some((article) => !article.title || !article.url)) {
						throw new NodeOperationError(this.getNode(), '群聊每条图文的标题和跳转链接必填', {
							itemIndex: i,
						});
					}
					if (safeValue !== 0 && safeValue !== 1) {
						throw new NodeOperationError(this.getNode(), '保密消息只能设置为 0 或 1', {
							itemIndex: i,
						});
					}

					body = {
						...body,
						msgtype: 'news',
						news: {
							articles: articleList,
						},
					};

					if (safeValue !== undefined) {
						body.safe = safeValue;
					}
				} else if (operation === 'sendVoice') {
					const mediaId =
						(this.getNodeParameter('media_id', i, '') as string) ||
						(this.getNodeParameter('media_ID', i, '') as string);

					body = {
						...body,
						msgtype: 'voice',
						voice: {
							media_id: mediaId,
						},
					};
				} else if (operation === 'sendVideo') {
					const mediaId =
						(this.getNodeParameter('media_id', i, '') as string) ||
						(this.getNodeParameter('media_ID', i, '') as string);
					const title = this.getNodeParameter('title', i, '') as string;
					const description = this.getNodeParameter('description', i, '') as string;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					const videoData: IDataObject = {
						media_id: mediaId,
					};

					if (title) {
						videoData.title = title;
					}

					if (description) {
						videoData.description = description;
					}

					body = {
						...body,
						msgtype: 'video',
						video: videoData,
						safe: safe ? 1 : 0,
					};
				} else if (operation === 'sendTextCard') {
					const textcardInputMode = this.getNodeParameter(
						'textcard_input_mode',
						i,
						'form',
					) as string;
					const textcardJson = textcardInputMode === 'json'
						? parseOptionalJsonParameter(
							this.getNodeParameter('textcard_json', i, '{}') as string,
							'textcard_json',
							i,
						)
						: undefined;
					const title = this.getNodeParameter('title', i, '') as string;
					const description = this.getNodeParameter('description', i, '') as string;
					const url = this.getNodeParameter('url', i, '') as string;
					const btntxt = this.getNodeParameter('btntxt', i, '详情') as string;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					let textcard: IDataObject;
					let safeValue: number | undefined = safe ? 1 : 0;

					if (textcardInputMode === 'json') {
						if (!textcardJson) {
							throw new NodeOperationError(
								this.getNode(),
								'请选择 JSON 输入并提供 textcard_json',
								{ itemIndex: i },
							);
						}
						if (Array.isArray(textcardJson)) {
							throw new NodeOperationError(
								this.getNode(),
								'textcard_json 必须是对象',
								{ itemIndex: i },
							);
						}
						const rawPayload = { ...(textcardJson as IDataObject) };
						const textcardPayload = rawPayload.textcard;
						if (
							textcardPayload !== undefined &&
							(!textcardPayload || typeof textcardPayload !== 'object' || Array.isArray(textcardPayload))
						) {
							throw new NodeOperationError(this.getNode(), 'textcard_json.textcard 必须是对象', {
								itemIndex: i,
							});
						}
						const safeFromJson = resolveSafeValue(rawPayload.safe);
						delete rawPayload.safe;
						delete rawPayload.textcard;
						textcard = (textcardPayload as IDataObject | undefined) ?? rawPayload;
						if (safeFromJson !== undefined) {
							safeValue = safeFromJson;
						}
					} else {
						textcard = {
							title,
							description,
							url,
							btntxt,
						};
					}
					if (!textcard.title || !textcard.description || !textcard.url) {
						throw new NodeOperationError(
							this.getNode(),
							'文本卡片的 title、description 和 url 必填',
							{ itemIndex: i },
						);
					}
					if (safeValue !== 0 && safeValue !== 1) {
						throw new NodeOperationError(this.getNode(), '保密消息只能设置为 0 或 1', {
							itemIndex: i,
						});
					}

					body = {
						...body,
						msgtype: 'textcard',
						textcard,
					};

					if (safeValue !== undefined) {
						body.safe = safeValue;
					}
				} else if (operation === 'sendMpNews') {
					const mpnewsInputMode = this.getNodeParameter('mpnews_input_mode', i, 'form') as string;
					const mpnewsJson = mpnewsInputMode === 'json'
						? parseOptionalJsonParameter(
							this.getNodeParameter('mpnews_json', i, '[]') as string,
							'mpnews_json',
							i,
						)
						: undefined;
					const articles = this.getNodeParameter('articles', i, {}) as IDataObject;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					let articleList: IDataObject[] = [];
					let safeValue: number | undefined = safe ? 1 : 0;

					if (mpnewsInputMode === 'json') {
						if (!mpnewsJson) {
							throw new NodeOperationError(
								this.getNode(),
								'请选择 JSON 输入并提供 mpnews_json',
								{ itemIndex: i },
							);
						}
						if (Array.isArray(mpnewsJson)) {
							articleList = mpnewsJson as IDataObject[];
						} else if ((mpnewsJson as IDataObject).mpnews) {
							const mpnewsPayload = (mpnewsJson as IDataObject).mpnews as IDataObject;
							if (!Array.isArray(mpnewsPayload.articles)) {
								throw new NodeOperationError(
									this.getNode(),
									'mpnews_json.mpnews 必须包含 articles 数组',
									{ itemIndex: i },
								);
							}
							articleList = mpnewsPayload.articles as IDataObject[];
						} else if (Array.isArray((mpnewsJson as IDataObject).articles)) {
							articleList = (mpnewsJson as IDataObject).articles as IDataObject[];
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'mpnews_json 必须是图文数组或包含 articles 的对象',
								{ itemIndex: i },
							);
						}

						const safeFromJson = resolveSafeValue((mpnewsJson as IDataObject).safe);
						if (safeFromJson !== undefined) {
							safeValue = safeFromJson;
						}
					} else {
						articleList = ((articles.article as IDataObject[]) || []).map((article) => {
							const normalized: IDataObject = {
								title: article.title,
								thumb_media_id: article.thumb_media_id,
								content: article.content,
							};
							if (article.author) normalized.author = article.author;
							if (article.content_source_url) {
								normalized.content_source_url = article.content_source_url;
							}
							if (article.digest) normalized.digest = article.digest;
							return normalized;
						});
					}
					if (articleList.length < 1 || articleList.length > 8) {
						throw new NodeOperationError(this.getNode(), '群聊 Mpnews 列表必须包含 1～8 条', {
							itemIndex: i,
						});
					}
					if (
						articleList.some(
							(article) => !article.title || !article.thumb_media_id || !article.content,
						)
					) {
						throw new NodeOperationError(
							this.getNode(),
							'群聊每条 Mpnews 的标题、缩略图 Media ID 和内容必填',
							{ itemIndex: i },
						);
					}
					if (safeValue !== 0 && safeValue !== 1) {
						throw new NodeOperationError(this.getNode(), '保密消息只能设置为 0 或 1', {
							itemIndex: i,
						});
					}

					body = {
						...body,
						msgtype: 'mpnews',
						mpnews: {
							articles: articleList,
						},
					};

					if (safeValue !== undefined) {
						body.safe = safeValue;
					}
				}

				const response = await weComApiRequest.call(this, 'POST', '/cgi-bin/appchat/send', body);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			}
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
