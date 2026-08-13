import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError, SEND_AND_WAIT_OPERATION } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { extractRecipients } from './commonFields';
import { executeSendAndWait } from './sendAndWait';

function asObject(value: unknown): IDataObject | undefined {
	return value && typeof value === 'object' && !Array.isArray(value)
		? (value as IDataObject)
		: undefined;
}

function asObjectArray(value: unknown): IDataObject[] {
	return Array.isArray(value) ? (value as IDataObject[]) : [];
}

export function validateTemplateCard(
	context: IExecuteFunctions,
	card: IDataObject,
	itemIndex: number,
	isUpdate = false,
	actionMenuLimit = 3,
): void {
	const fail = (message: string): never => {
		throw new NodeOperationError(context.getNode(), message, { itemIndex });
	};
	const cardType = String(card.card_type || '');
	if (!cardType) fail('模板卡片必须包含 card_type');
	if (
		!['text_notice', 'news_notice', 'button_interaction', 'vote_interaction', 'multiple_interaction'].includes(
			cardType,
		)
	) {
		fail(`不支持的模板卡片类型：${cardType}`);
	}

	const mainTitle = asObject(card.main_title);
	const cardAction = asObject(card.card_action);
	const validateAction = (action: IDataObject | undefined, label: string): void => {
		if (!action) {
			fail(`${label}不能为空`);
			return;
		}
		const type = Number(action.type);
		if (![1, 2].includes(type)) fail(`${label}.type 必须是 1（URL）或 2（小程序）`);
		if (type === 1 && !action.url) fail(`${label}.url 在 type=1 时必填`);
		if (type === 2 && !action.appid) fail(`${label}.appid 在 type=2 时必填`);
	};
	const validateOptionalAction = (action: IDataObject | undefined, label: string): void => {
		if (!action) return;
		const type = Number(action.type || 0);
		if (![0, 1, 2].includes(type)) fail(`${label}.type 只能是 0、1 或 2`);
		if (type === 1 && !action.url) fail(`${label}.url 在 type=1 时必填`);
		if (type === 2 && !action.appid) fail(`${label}.appid 在 type=2 时必填`);
	};
	const validateOptions = (options: IDataObject[], label: string, maximum: number): void => {
		if (options.length < 1 || options.length > maximum) {
			fail(`${label} 必须包含 1～${maximum} 个选项`);
		}
		const ids = new Set<string>();
		for (const option of options) {
			if (!option.id || !option.text) fail(`${label} 每个选项的 id 和 text 必填`);
			const id = String(option.id);
			if (ids.has(id)) fail(`${label} 的选项 id 不可重复`);
			ids.add(id);
		}
	};

	validateOptionalAction(asObject(card.quote_area), 'quote_area');

	const horizontalItems = asObjectArray(card.horizontal_content_list);
	if (horizontalItems.length > 6) fail('horizontal_content_list 最多 6 项');
	for (const item of horizontalItems) {
		if (!item.keyname) fail('horizontal_content_list[].keyname 必填');
		if (Number(item.type) === 1 && !item.url) fail('horizontal_content_list[].url 在 type=1 时必填');
		if (Number(item.type) === 2 && !item.media_id) {
			fail('horizontal_content_list[].media_id 在 type=2 时必填');
		}
		if (Number(item.type) === 3) {
			const memberUserid = String(item.userid || item.userid_selected || '').trim();
			if (!memberUserid) fail('horizontal_content_list[].userid 在 type=3 时必填');
			item.userid = memberUserid;
			delete item.userid_selected;
		}
	}

	const jumpItems = asObjectArray(card.jump_list);
	if (jumpItems.length > 3) fail('jump_list 最多 3 项');
	for (const item of jumpItems) {
		if (!item.title) fail('jump_list[].title 必填');
		if (Number(item.type) === 1 && !item.url) fail('jump_list[].url 在 type=1 时必填');
		if (Number(item.type) === 2 && !item.appid) fail('jump_list[].appid 在 type=2 时必填');
	}

	const actionMenu = asObject(card.action_menu);
	if (actionMenu) {
		const actions = asObjectArray(actionMenu.action_list);
		if (actions.length < 1 || actions.length > actionMenuLimit) {
			fail(`action_menu.action_list 必须包含 1～${actionMenuLimit} 项`);
		}
		const keys = new Set<string>();
		for (const action of actions) {
			if (!action.text || !action.key) fail('action_menu.action_list 每项的 text 和 key 必填');
			const key = String(action.key);
			if (keys.has(key)) fail('action_menu.action_list 的 key 不可重复');
			keys.add(key);
		}
	}

	if (cardType === 'text_notice') {
		if (!mainTitle?.title && !card.sub_title_text) {
			fail('text_notice 的 main_title.title 与 sub_title_text 不能同时为空');
		}
		validateAction(cardAction, 'card_action');
	} else if (cardType === 'news_notice') {
		if (!mainTitle?.title) fail('news_notice 的 main_title.title 必填');
		if (!card.card_image && !card.image_text_area) {
			fail('news_notice 的 card_image 与 image_text_area 必须至少填写一项');
		}
		const cardImage = asObject(card.card_image);
		if (cardImage) {
			if (!cardImage.url) fail('card_image.url 必填');
			const aspectRatio = Number(cardImage.aspect_ratio || 1.3);
			if (aspectRatio < 1.3 || aspectRatio > 2.25) {
				fail('card_image.aspect_ratio 必须在 1.3～2.25 之间');
			}
		}
		const imageTextArea = asObject(card.image_text_area);
		if (imageTextArea) {
			if (!imageTextArea.image_url) fail('image_text_area.image_url 必填');
			validateOptionalAction(imageTextArea, 'image_text_area');
		}
		const verticalItems = asObjectArray(card.vertical_content_list);
		if (verticalItems.length > 4) fail('vertical_content_list 最多 4 项');
		if (verticalItems.some((item) => !item.title)) fail('vertical_content_list[].title 必填');
		validateAction(cardAction, 'card_action');
	} else if (cardType === 'button_interaction') {
		if (!mainTitle?.title) fail('button_interaction 的 main_title.title 必填');
		if (!isUpdate && !card.task_id) fail('button_interaction 的 task_id 必填');
		const buttons = asObjectArray(card.button_list);
		if (buttons.length < 1 || buttons.length > 6) fail('button_list 必须包含 1～6 个按钮');
		for (const button of buttons) {
			if (!button.text) fail('button_list[].text 必填');
			const type = Number(button.type || 0);
			if (![0, 1].includes(type)) fail('button_list[].type 只能是 0 或 1');
			if (type === 0 && !button.key) fail('button_list[].key 在 type=0 时必填');
			if (type === 1 && !button.url) fail('button_list[].url 在 type=1 时必填');
			const style = Number(button.style || 1);
			if (style < 1 || style > 4) fail('button_list[].style 必须在 1～4 之间');
		}
		const buttonSelection = asObject(card.button_selection);
		if (buttonSelection) {
			if (!buttonSelection.question_key) fail('button_selection.question_key 必填');
			validateOptions(asObjectArray(buttonSelection.option_list), 'button_selection.option_list', 10);
		}
	} else if (cardType === 'vote_interaction') {
		if (!mainTitle?.title) fail('vote_interaction 的 main_title.title 必填');
		if (!isUpdate && !card.task_id) fail('vote_interaction 的 task_id 必填');
		const checkbox = asObject(card.checkbox);
		if (!checkbox?.question_key) {
			fail('checkbox.question_key 必填');
			return;
		}
		const mode = Number(checkbox.mode || 0);
		if (![0, 1].includes(mode)) fail('checkbox.mode 只能是 0（单选）或 1（多选）');
		validateOptions(asObjectArray(checkbox.option_list), 'checkbox.option_list', 20);
		const submitButton = asObject(card.submit_button);
		if (!submitButton?.key) fail('submit_button.key 必填');
	} else if (cardType === 'multiple_interaction') {
		if (!mainTitle?.title) fail('multiple_interaction 的 main_title.title 必填');
		if (!isUpdate && !card.task_id) fail('multiple_interaction 的 task_id 必填');
		const selectors = asObjectArray(card.select_list);
		if (selectors.length < 1 || selectors.length > 3) fail('select_list 必须包含 1～3 个选择器');
		for (const selector of selectors) {
			if (!selector.question_key) fail('select_list[].question_key 必填');
			validateOptions(asObjectArray(selector.option_list), 'select_list[].option_list', 10);
		}
		const submitButton = asObject(card.submit_button);
		if (!submitButton?.key) fail('submit_button.key 必填');
	}

	if (!isUpdate && card.action_menu && !card.task_id) {
		fail('使用 action_menu 时 task_id 必填');
	}
}

export async function executeMessage(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	if (operation === SEND_AND_WAIT_OPERATION) {
		return await executeSendAndWait.call(this, items);
	}

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
	const parseDelimitedList = (
		value: string,
		label: string,
		limit: number,
		itemIndex: number,
	): string[] => {
		const values = [
			...new Set(
				value
					.split(/[|,]/)
					.map((entry) => entry.trim())
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
	const parseOptionalIdJson = (
		value: unknown,
		label: string,
		itemIndex: number,
		keys: string[],
	): string[] => {
		if (value === undefined || value === null || String(value).trim() === '') return [];
		let parsed: unknown = value;
		if (typeof value === 'string') {
			try {
				parsed = JSON.parse(value);
			} catch {
				throw new NodeOperationError(this.getNode(), `${label}不是有效的 JSON`, { itemIndex });
			}
		}
		if (!Array.isArray(parsed)) {
			throw new NodeOperationError(this.getNode(), `${label}必须是 JSON 数组`, { itemIndex });
		}
		if (parsed.length === 0) return [];
		return parsed
			.map((entry) => {
				if (typeof entry === 'string' || typeof entry === 'number') return String(entry).trim();
				if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
					const row = entry as IDataObject;
					for (const key of keys) {
						if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== '') {
							return String(row[key]).trim();
						}
					}
				}
				return '';
			})
			.filter(Boolean);
	};
	const parseNumericIds = (value: string, label: string, itemIndex: number): number[] => {
		const values = value.split('|').filter(Boolean);
		if (values.some((entry) => !/^\d+$/.test(entry))) {
			throw new NodeOperationError(this.getNode(), `${label}只能包含整数 ID`, { itemIndex });
		}
		return values.map((entry) => Number(entry));
	};

	for (let i = 0; i < items.length; i++) {
		try {
			const credentials = await this.getCredentials('weComApi');
			const agentId = credentials.agentId as string;

			if (operation === 'recallMessage') {
				const msgid = this.getNodeParameter('msgid', i) as string;

				const recallBody = {
					msgid,
				};

				const response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/message/recall',
					recallBody,
				);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
				continue;
			}

			// 获取接收人信息（支持新旧两种方式）
			let touser = '';
			let toparty = '';
			let totag = '';

			// 检查是否使用新的接收人选择方式
			const recipientType = this.getNodeParameter('recipientType', i, null) as string | null;

			if (recipientType !== null) {
				// 新方式：使用 recipientType 选择
				const touserArray = this.getNodeParameter('touser', i, []) as string[];
				const topartyArray = this.getNodeParameter('toparty', i, []) as string[];
				const totagArray = this.getNodeParameter('totag', i, []) as string[];
				const touserManual = this.getNodeParameter('touser_manual', i, '') as string;
				const topartyManual = this.getNodeParameter('toparty_manual', i, '') as string;
				const totagManual = this.getNodeParameter('totag_manual', i, '') as string;
				const touserJson = this.getNodeParameter('touserJson', i, '[]');
				const topartyJson = this.getNodeParameter('topartyJson', i, '[]');
				const totagJson = this.getNodeParameter('totagJson', i, '[]');

				const recipients = extractRecipients(
					recipientType,
					touserArray,
					topartyArray,
					totagArray,
					touserManual,
					topartyManual,
					totagManual,
					touserJson,
					topartyJson,
					totagJson,
				);

				touser = recipients.touser || '';
				toparty = recipients.toparty || '';
				totag = recipients.totag || '';
			} else {
				// 旧方式：直接获取字段（向后兼容）
				touser = this.getNodeParameter('touser', i, '') as string;
				toparty = this.getNodeParameter('toparty', i, '') as string;
				totag = this.getNodeParameter('totag', i, '') as string;
			}

				if (operation !== 'sendSchoolNotice' && !touser && !toparty && !totag) {
				throw new NodeOperationError(
					this.getNode(),
					'必须指定至少一个接收人（成员ID、部门ID或标签ID）',
					{ itemIndex: i },
				);
			}

			if (operation === 'sendMiniprogramNotice' && touser.split('|').includes('@all')) {
				throw new NodeOperationError(
					this.getNode(),
					'小程序通知消息不支持 @all 全员发送',
					{ itemIndex: i },
				);
			}

			let body: IDataObject = { agentid: agentId };
			if (touser) body.touser = touser;
			if (toparty) body.toparty = toparty;
			if (totag) body.totag = totag;

			if (operation === 'sendText') {
				const content = this.getNodeParameter('content', i) as string;
				const safe = this.getNodeParameter('safe', i, false) as boolean;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				body = {
					...body,
					msgtype: 'text',
					text: {
						content,
					},
					safe: safe ? 1 : 0,
					enable_id_trans: enable_id_trans ? 1 : 0,
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
			} else if (operation === 'sendMarkdown') {
				const content = this.getNodeParameter('content', i) as string;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				body = {
					...body,
					msgtype: 'markdown',
					markdown: {
						content,
					},
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
			} else if (operation === 'sendImage') {
				const mediaId = this.getNodeParameter('media_id', i) as string;
				const safe = this.getNodeParameter('safe', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				body = {
					...body,
					msgtype: 'image',
					image: {
						media_id: mediaId,
					},
					safe: safe ? 1 : 0,
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
			} else if (operation === 'sendFile') {
				const mediaId = this.getNodeParameter('media_id', i) as string;
				const safe = this.getNodeParameter('safe', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				body = {
					...body,
					msgtype: 'file',
					file: {
						media_id: mediaId,
					},
					safe: safe ? 1 : 0,
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
			} else if (operation === 'sendVoice') {
				const mediaId = this.getNodeParameter('media_id', i) as string;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				body = {
					...body,
					msgtype: 'voice',
					voice: {
						media_id: mediaId,
					},
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
			} else if (operation === 'sendVideo') {
				const mediaId = this.getNodeParameter('media_id', i) as string;
				const title = this.getNodeParameter('title', i, '') as string;
				const description = this.getNodeParameter('description', i, '') as string;
				const safe = this.getNodeParameter('safe', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

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
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
			} else if (operation === 'sendTextCard') {
					const title = this.getNodeParameter('title', i) as string;
					const description = this.getNodeParameter('description', i, '') as string;
				const url = this.getNodeParameter('url', i) as string;
				const btntxt = this.getNodeParameter('btntxt', i, '详情') as string;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				body = {
					...body,
					msgtype: 'textcard',
					textcard: {
						title,
						description,
						url,
						btntxt,
					},
					enable_id_trans: enable_id_trans ? 1 : 0,
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
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
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				let articleList: IDataObject[] = [];
				if (newsInputMode === 'json') {
					if (!newsJson) {
						throw new NodeOperationError(
							this.getNode(),
							'请选择 JSON 输入并提供 news_json',
							{ itemIndex: i },
						);
					}
					const newsPayload = Array.isArray(newsJson)
						? { articles: newsJson }
						: (newsJson as IDataObject);
					if (!Array.isArray(newsPayload.articles) || newsPayload.articles.length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'news_json 必须包含 articles 数组，且至少提供一条图文',
							{ itemIndex: i },
						);
					}
					articleList = newsPayload.articles as IDataObject[];
				} else {
					articleList = ((articles.article as IDataObject[]) || []).slice(0, 8).map((article) => {
						const processedArticle: IDataObject = {
							title: article.title,
						};
						if (article.description) processedArticle.description = article.description;
						if (article.picurl) processedArticle.picurl = article.picurl;

						// 处理跳转类型：小程序或URL
						if (article.jump_type === 'miniprogram' && article.appid && article.pagepath) {
							processedArticle.appid = article.appid;
							processedArticle.pagepath = article.pagepath;
						} else if (article.url) {
							processedArticle.url = article.url;
						}

						return processedArticle;
					});
				}
				if (articleList.length < 1 || articleList.length > 8) {
					throw new NodeOperationError(this.getNode(), '图文列表必须包含 1～8 条图文', {
						itemIndex: i,
					});
				}
				for (const article of articleList) {
					if (!article.title) {
						throw new NodeOperationError(this.getNode(), '图文标题不能为空', { itemIndex: i });
					}
					if (!article.url && !(article.appid && article.pagepath)) {
						throw new NodeOperationError(
							this.getNode(),
							'每条图文必须填写 URL，或同时填写小程序 AppID 和 Page 路径',
							{ itemIndex: i },
						);
					}
				}

				body = {
					...body,
					msgtype: 'news',
					news: {
						articles: articleList,
					},
					enable_id_trans: enable_id_trans ? 1 : 0,
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
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
				const safe = this.getNodeParameter('safe', i, 0) as number;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				let articleList: IDataObject[] = [];
				if (mpnewsInputMode === 'json') {
					if (!mpnewsJson) {
						throw new NodeOperationError(
							this.getNode(),
							'请选择 JSON 输入并提供 mpnews_json',
							{ itemIndex: i },
						);
					}
					const mpnewsPayload = Array.isArray(mpnewsJson)
						? { articles: mpnewsJson }
						: (mpnewsJson as IDataObject);
					if (!Array.isArray(mpnewsPayload.articles) || mpnewsPayload.articles.length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'mpnews_json 必须包含 articles 数组，且至少提供一条图文',
							{ itemIndex: i },
						);
					}
					articleList = mpnewsPayload.articles as IDataObject[];
				} else {
					articleList = ((articles.article as IDataObject[]) || []).slice(0, 8).map((article) => ({
						title: article.title,
						thumb_media_id: article.thumb_media_id || article.thumb_media_ID,
						author: article.author,
						content_source_url: article.content_source_url,
						content: article.content,
						digest: article.digest,
					}));
				}
				if (articleList.length < 1 || articleList.length > 8) {
					throw new NodeOperationError(this.getNode(), 'Mpnews 列表必须包含 1～8 条图文', {
						itemIndex: i,
					});
				}
				for (const article of articleList) {
					if (!article.title || !article.thumb_media_id || !article.content) {
						throw new NodeOperationError(
							this.getNode(),
							'Mpnews 每条图文的 title、thumb_media_id 和 content 必填',
							{ itemIndex: i },
						);
					}
				}

				body = {
					...body,
					msgtype: 'mpnews',
					mpnews: {
						articles: articleList,
					},
					safe,
					enable_id_trans: enable_id_trans ? 1 : 0,
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
			} else if (operation === 'sendMiniprogramNotice') {
				const miniprogramNoticeInputMode = this.getNodeParameter(
					'miniprogram_notice_input_mode',
					i,
					'form',
				) as string;
				const miniprogramNoticeJson = miniprogramNoticeInputMode === 'json'
					? parseOptionalJsonParameter(
						this.getNodeParameter('miniprogram_notice_json', i, '{}') as string,
						'miniprogram_notice_json',
						i,
					)
					: undefined;
				const appid = this.getNodeParameter('appid', i) as string;
				const page = this.getNodeParameter('page', i, '') as string;
				const title = this.getNodeParameter('title', i) as string;
				const description = this.getNodeParameter('description', i, '') as string;
				const emphasis_first_item = this.getNodeParameter(
					'emphasis_first_item',
					i,
					false,
				) as boolean;
				const content_items = this.getNodeParameter('content_items', i, {}) as IDataObject;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				let miniprogramNotice: IDataObject;
				if (miniprogramNoticeInputMode === 'json') {
					if (!miniprogramNoticeJson) {
						throw new NodeOperationError(
							this.getNode(),
							'请选择 JSON 输入并提供 miniprogram_notice_json',
							{ itemIndex: i },
						);
					}
					if (Array.isArray(miniprogramNoticeJson)) {
						throw new NodeOperationError(
							this.getNode(),
							'miniprogram_notice_json 必须是对象',
							{ itemIndex: i },
						);
					}
					miniprogramNotice = miniprogramNoticeJson;
				} else {
					const contentItemList = (content_items.item as IDataObject[]) || [];
					miniprogramNotice = {
						appid,
						page,
						title,
						description,
						emphasis_first_item: emphasis_first_item ? true : false,
						content_item: contentItemList,
					};
				}
				if (!miniprogramNotice.appid || !miniprogramNotice.title) {
					throw new NodeOperationError(
						this.getNode(),
						'小程序通知的 appid 和 title 必填',
						{ itemIndex: i },
					);
				}
				if (Array.isArray(miniprogramNotice.content_item)) {
					miniprogramNotice.content_item = miniprogramNotice.content_item.slice(0, 10);
				}

				body = {
					...body,
					msgtype: 'miniprogram_notice',
					miniprogram_notice: miniprogramNotice,
					enable_id_trans: enable_id_trans ? 1 : 0,
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
			} else if (operation === 'sendTaskCard') {
				const taskcardInputMode = this.getNodeParameter('taskcard_input_mode', i, 'form') as string;
				const taskcardJson = taskcardInputMode === 'json'
					? parseOptionalJsonParameter(
						this.getNodeParameter('taskcard_json', i, '{}') as string,
						'taskcard_json',
						i,
					)
					: undefined;
				const title = this.getNodeParameter('title', i) as string;
				const description = this.getNodeParameter('description', i) as string;
				const url = this.getNodeParameter('url', i, '') as string;
				const task_id = this.getNodeParameter('task_id', i) as string;
				const buttons = this.getNodeParameter('buttons', i, {}) as IDataObject;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				let taskcard: IDataObject;
				if (taskcardInputMode === 'json') {
					if (!taskcardJson) {
						throw new NodeOperationError(
							this.getNode(),
							'请选择 JSON 输入并提供 taskcard_json',
							{ itemIndex: i },
						);
					}
					if (Array.isArray(taskcardJson)) {
						throw new NodeOperationError(
							this.getNode(),
							'taskcard_json 必须是对象',
							{ itemIndex: i },
						);
					}
					taskcard = taskcardJson;
				} else {
					const buttonList = ((buttons.button as IDataObject[]) || []).slice(0, 2).map((btn) => ({
						key: btn.key,
						name: btn.name,
						color: btn.color || 'blue',
						is_bold: btn.is_bold ? true : false,
					}));

					taskcard = {
						title,
						task_id,
						btn: buttonList,
					};
					if (description) taskcard.description = description;
					if (url) taskcard.url = url;
				}
				const taskButtons = asObjectArray(taskcard.btn);
				if (!taskcard.title || !taskcard.task_id || taskButtons.length < 1 || taskButtons.length > 2) {
					throw new NodeOperationError(
						this.getNode(),
						'任务卡片的 title、task_id 必填，且 btn 必须包含 1～2 个按钮',
						{ itemIndex: i },
					);
				}
				for (const button of taskButtons) {
					if (!button.key || !button.name) {
						throw new NodeOperationError(
							this.getNode(),
							'任务卡片每个按钮的 key 和 name 必填',
							{ itemIndex: i },
						);
					}
				}

				body = {
					...body,
					msgtype: 'interactive_taskcard',
					interactive_taskcard: taskcard,
					enable_id_trans: enable_id_trans ? 1 : 0,
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
			} else if (operation === 'sendTemplateCard') {
				const templateCardInputMode = this.getNodeParameter(
					'template_card_input_mode',
					i,
					'form',
				) as string;
				const templateCardJson = templateCardInputMode === 'json'
					? parseOptionalJsonParameter(
						this.getNodeParameter('template_card_json', i, '{}') as string,
						'template_card_json',
						i,
					)
					: undefined;
				const card_type = this.getNodeParameter('card_type', i) as string;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				let template_card: IDataObject;
				if (templateCardInputMode === 'json') {
					if (!templateCardJson) {
						throw new NodeOperationError(
							this.getNode(),
							'请选择 JSON 输入并提供 template_card_json',
							{ itemIndex: i },
						);
					}
					if (Array.isArray(templateCardJson)) {
						throw new NodeOperationError(
							this.getNode(),
							'template_card_json 必须是对象',
							{ itemIndex: i },
						);
					}
					template_card = { ...(templateCardJson as IDataObject) };
					if (!template_card.card_type) {
						template_card.card_type = card_type;
					}
				} else {
					// 获取fixedCollection字段
					const sourceData = this.getNodeParameter('source', i, {}) as IDataObject;
					const mainTitleData = this.getNodeParameter('main_title', i, {}) as IDataObject;
					const emphasisContentData = this.getNodeParameter('emphasis_content', i, {}) as IDataObject;
					const quoteAreaData = this.getNodeParameter('quote_area', i, {}) as IDataObject;
					const sub_title_text = this.getNodeParameter('sub_title_text', i, '') as string;
					const horizontalContentListData = this.getNodeParameter('horizontal_content_list', i, {}) as IDataObject;
					const jumpListData = this.getNodeParameter('jump_list', i, {}) as IDataObject;
					const cardActionData = this.getNodeParameter('card_action', i, {}) as IDataObject;
					const task_id = this.getNodeParameter('task_id', i, '') as string;
					const actionMenuData = this.getNodeParameter('action_menu', i, {}) as IDataObject;

					template_card = {
						card_type,
					};

					// 添加source
					if (sourceData.sourceInfo) {
						template_card.source = sourceData.sourceInfo;
					}

					// 添加main_title
					if (mainTitleData.titleInfo) {
						template_card.main_title = mainTitleData.titleInfo;
					}

					// 添加emphasis_content
					if (emphasisContentData.emphasisInfo) {
						template_card.emphasis_content = emphasisContentData.emphasisInfo;
					}

					// 添加quote_area
					if (quoteAreaData.quoteInfo) {
						template_card.quote_area = quoteAreaData.quoteInfo;
					}

					// 添加sub_title_text
					if (sub_title_text) {
						template_card.sub_title_text = sub_title_text;
					}

					// 添加horizontal_content_list
					if (horizontalContentListData.items && Array.isArray(horizontalContentListData.items)) {
						template_card.horizontal_content_list = (
							horizontalContentListData.items as IDataObject[]
						).map((item) => {
							const normalized = { ...item };
							if (Number(normalized.type) === 3) {
								normalized.userid = String(
									normalized.userid || normalized.userid_selected || '',
								).trim();
								delete normalized.userid_selected;
							}
							return normalized;
						});
					}

					// 添加jump_list
					if (jumpListData.items && Array.isArray(jumpListData.items)) {
						template_card.jump_list = jumpListData.items;
					}

					// 添加card_action
					if (cardActionData.actionInfo) {
						template_card.card_action = cardActionData.actionInfo;
					}

					// 添加task_id
					if (task_id) {
						template_card.task_id = task_id;
					}

					// 针对不同卡片类型的特殊处理
					if (card_type === 'button_interaction') {
						const buttonListData = this.getNodeParameter('button_list', i, {}) as IDataObject;
						if (buttonListData.buttons && Array.isArray(buttonListData.buttons)) {
							template_card.button_list = buttonListData.buttons;
						}

						const buttonSelectionData = this.getNodeParameter('button_selection', i, {}) as IDataObject;
						if (buttonSelectionData.selectionInfo) {
							const selectionInfo = buttonSelectionData.selectionInfo as IDataObject;
							template_card.button_selection = {
								question_key: selectionInfo.question_key,
								title: selectionInfo.title,
								selected_id: selectionInfo.selected_id,
								disable: selectionInfo.disable === true,
								option_list: (selectionInfo.option_list as IDataObject)?.options || [],
							};
						}
					} else if (card_type === 'vote_interaction') {
						const checkbox_question_key = this.getNodeParameter(
							'checkbox_question_key',
							i,
							'',
						) as string;
						const checkbox_mode = this.getNodeParameter('checkbox_mode', i, 0) as number;
						const checkbox_disable = this.getNodeParameter('checkbox_disable', i, false) as boolean;
						const optionListData = this.getNodeParameter('option_list', i, {}) as IDataObject;
						const submit_button_text = this.getNodeParameter(
							'submit_button_text',
							i,
							'提交',
						) as string;
						const submit_button_key = this.getNodeParameter('submit_button_key', i, '') as string;

						if (checkbox_question_key) {
							const options = Array.isArray(optionListData.options)
								? (optionListData.options as IDataObject[])
								: [];
							template_card.checkbox = {
								question_key: checkbox_question_key,
								mode: checkbox_mode,
								disable: checkbox_disable,
								option_list: options.map((opt: IDataObject) => ({
									id: opt.id,
									text: opt.text,
									is_checked: opt.is_checked || false,
								})),
							};
						}

						if (submit_button_key) {
							template_card.submit_button = {
								text: submit_button_text,
								key: submit_button_key,
							};
						}
					} else if (card_type === 'multiple_interaction') {
						const selectListData = this.getNodeParameter('select_list', i, {}) as IDataObject;
						const submit_button_text = this.getNodeParameter(
							'submit_button_text',
							i,
							'提交',
						) as string;
						const submit_button_key = this.getNodeParameter('submit_button_key', i, '') as string;

						if (selectListData.selectors && Array.isArray(selectListData.selectors)) {
							template_card.select_list = (selectListData.selectors as IDataObject[]).map(
								(selector: IDataObject) => {
									const optionList = selector.option_list as IDataObject | undefined;
									const options = optionList && Array.isArray(optionList.options)
										? (optionList.options as IDataObject[])
										: [];
									return {
										question_key: selector.question_key,
										title: selector.title,
										selected_id: selector.selected_id,
										disable: selector.disable === true,
										option_list: options,
									};
								},
							);
						}

						if (submit_button_key) {
							template_card.submit_button = {
								text: submit_button_text,
								key: submit_button_key,
							};
						}
					} else if (card_type === 'news_notice') {
						const imageTextAreaData = this.getNodeParameter('image_text_area', i, {}) as IDataObject;
						if (imageTextAreaData.imageTextInfo) {
							template_card.image_text_area = imageTextAreaData.imageTextInfo;
						}

						const cardImageData = this.getNodeParameter('card_image', i, {}) as IDataObject;
						if (cardImageData.imageInfo) {
							template_card.card_image = cardImageData.imageInfo;
						}

						const verticalContentListData = this.getNodeParameter('vertical_content_list', i, {}) as IDataObject;
						if (verticalContentListData.items && Array.isArray(verticalContentListData.items)) {
							template_card.vertical_content_list = verticalContentListData.items;
						}
					}

					// 添加action_menu
					if (actionMenuData.menuInfo) {
						const menuInfo = actionMenuData.menuInfo as IDataObject;
						const menuData: IDataObject = {};
						if (menuInfo.desc) {
							menuData.desc = menuInfo.desc;
						}
						if (menuInfo.action_list) {
							const actionListData = menuInfo.action_list as IDataObject;
							if (actionListData.actions && Array.isArray(actionListData.actions)) {
								menuData.action_list = actionListData.actions;
							}
						}
						if (Object.keys(menuData).length > 0) {
							template_card.action_menu = menuData;
						}
					}
				}
				validateTemplateCard(this, template_card, i);

				body = {
					...body,
					msgtype: 'template_card',
					template_card,
					enable_id_trans: enable_id_trans ? 1 : 0,
					enable_duplicate_check: enable_duplicate_check ? 1 : 0,
				};

				if (enable_duplicate_check) {
					const duplicate_check_interval = this.getNodeParameter(
						'duplicate_check_interval',
						i,
						1800,
					) as number;
					body.duplicate_check_interval = duplicate_check_interval;
				}
			} else if (operation === 'updateTemplateCard') {
				const response_code = this.getNodeParameter('response_code', i) as string;
				const templateCardInputMode = this.getNodeParameter(
					'template_card_input_mode',
					i,
					'form',
				) as string;
				const templateCardJson = templateCardInputMode === 'json'
					? parseOptionalJsonParameter(
						this.getNodeParameter('template_card_json', i, '{}') as string,
						'template_card_json',
						i,
					)
					: undefined;
				const card_type = this.getNodeParameter('card_type', i) as string;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const replace_text = this.getNodeParameter('replace_text', i, '') as string;
				const button_update_only = this.getNodeParameter(
					'button_update_only',
					i,
					false,
				) as boolean;

				// 获取接收人信息
				const recipientType = this.getNodeParameter('recipientType', i) as string;
				const touser = this.getNodeParameter('touser', i, []) as string[];
				const toparty = this.getNodeParameter('toparty', i, []) as string[];
				const totag = this.getNodeParameter('totag', i, []) as string[];
				const touser_manual = this.getNodeParameter('touser_manual', i, '') as string;
				const toparty_manual = this.getNodeParameter('toparty_manual', i, '') as string;
				const totag_manual = this.getNodeParameter('totag_manual', i, '') as string;
				const touserJson = this.getNodeParameter('touserJson', i, '[]');
				const topartyJson = this.getNodeParameter('topartyJson', i, '[]');
				const totagJson = this.getNodeParameter('totagJson', i, '[]');
				const atall = this.getNodeParameter('recipientType', i) === 'all' ? 1 : 0;

				const recipients = extractRecipients(
					recipientType,
					touser,
					toparty,
					totag,
					touser_manual,
					toparty_manual,
					totag_manual,
					touserJson,
					topartyJson,
					totagJson,
				);

				// 获取fixedCollection字段
				const sourceData = this.getNodeParameter('source', i, {}) as IDataObject;
				const mainTitleData = this.getNodeParameter('main_title', i, {}) as IDataObject;
				const emphasisContentData = this.getNodeParameter('emphasis_content', i, {}) as IDataObject;
				const quoteAreaData = this.getNodeParameter('quote_area', i, {}) as IDataObject;
				const sub_title_text = this.getNodeParameter('sub_title_text', i, '') as string;
				const horizontalContentListData = this.getNodeParameter('horizontal_content_list', i, {}) as IDataObject;
				const jumpListData = this.getNodeParameter('jump_list', i, {}) as IDataObject;
				const cardActionData = this.getNodeParameter('card_action', i, {}) as IDataObject;
				const actionMenuData = this.getNodeParameter('action_menu', i, {}) as IDataObject;

				let template_card: IDataObject;
				if (templateCardInputMode === 'json') {
					if (!templateCardJson) {
						throw new NodeOperationError(
							this.getNode(),
							'请选择 JSON 输入并提供 template_card_json',
							{ itemIndex: i },
						);
					}
					if (Array.isArray(templateCardJson)) {
						throw new NodeOperationError(
							this.getNode(),
							'template_card_json 必须是对象',
							{ itemIndex: i },
						);
					}
					template_card = { ...(templateCardJson as IDataObject) };
					if (!template_card.card_type) {
						template_card.card_type = card_type;
					}
				} else {
					template_card = {
						card_type,
					};

					// 添加source
					if (sourceData.sourceInfo) {
						template_card.source = sourceData.sourceInfo;
					}

					// 添加main_title
					if (mainTitleData.titleInfo) {
						template_card.main_title = mainTitleData.titleInfo;
					}

					// 添加emphasis_content
					if (emphasisContentData.emphasisInfo) {
						template_card.emphasis_content = emphasisContentData.emphasisInfo;
					}

					// 添加quote_area
					if (quoteAreaData.quoteInfo) {
						template_card.quote_area = quoteAreaData.quoteInfo;
					}

					// 添加sub_title_text
					if (sub_title_text) {
						template_card.sub_title_text = sub_title_text;
					}

					// 添加horizontal_content_list
					if (horizontalContentListData.items && Array.isArray(horizontalContentListData.items)) {
						template_card.horizontal_content_list = (
							horizontalContentListData.items as IDataObject[]
						).map((item) => {
							const normalized = { ...item };
							if (Number(normalized.type) === 3) {
								normalized.userid = String(
									normalized.userid || normalized.userid_selected || '',
								).trim();
								delete normalized.userid_selected;
							}
							return normalized;
						});
					}

					// 添加jump_list
					if (jumpListData.items && Array.isArray(jumpListData.items)) {
						template_card.jump_list = jumpListData.items;
					}

					// 添加card_action
					if (cardActionData.actionInfo) {
						template_card.card_action = cardActionData.actionInfo;
					}

					// 针对不同卡片类型的特殊处理
					if (card_type === 'button_interaction') {
						const buttonListData = this.getNodeParameter('button_list', i, {}) as IDataObject;
						if (buttonListData.buttons && Array.isArray(buttonListData.buttons)) {
							template_card.button_list = buttonListData.buttons;
						}

						const buttonSelectionData = this.getNodeParameter('button_selection', i, {}) as IDataObject;
						if (buttonSelectionData.selectionInfo) {
							const selectionInfo = buttonSelectionData.selectionInfo as IDataObject;
							template_card.button_selection = {
								question_key: selectionInfo.question_key,
								title: selectionInfo.title,
								selected_id: selectionInfo.selected_id,
								disable: selectionInfo.disable === true,
								option_list: (selectionInfo.option_list as IDataObject)?.options || [],
							};
						}

						if (replace_text) {
							template_card.replace_text = replace_text;
						}
					} else if (card_type === 'vote_interaction') {
						const checkbox_question_key = this.getNodeParameter(
							'checkbox_question_key',
							i,
							'',
						) as string;
						const checkbox_mode = this.getNodeParameter('checkbox_mode', i, 0) as number;
						const checkbox_disable = this.getNodeParameter('checkbox_disable', i, false) as boolean;
						const optionListData = this.getNodeParameter('option_list', i, {}) as IDataObject;
						const submit_button_text = this.getNodeParameter(
							'submit_button_text',
							i,
							'提交',
						) as string;
						const submit_button_key = this.getNodeParameter('submit_button_key', i, '') as string;

						if (checkbox_question_key) {
							const options = Array.isArray(optionListData.options)
								? (optionListData.options as IDataObject[])
								: [];
							template_card.checkbox = {
								question_key: checkbox_question_key,
								mode: checkbox_mode,
								disable: checkbox_disable,
								option_list: options.map((opt: IDataObject) => ({
									id: opt.id,
									text: opt.text,
									is_checked: opt.is_checked || false,
								})),
							};
						}

						if (submit_button_key) {
							template_card.submit_button = {
								text: submit_button_text,
								key: submit_button_key,
							};
						}

						if (replace_text) {
							template_card.replace_text = replace_text;
						}
					} else if (card_type === 'multiple_interaction') {
						const selectListData = this.getNodeParameter('select_list', i, {}) as IDataObject;
						const submit_button_text = this.getNodeParameter(
							'submit_button_text',
							i,
							'提交',
						) as string;
						const submit_button_key = this.getNodeParameter('submit_button_key', i, '') as string;

						if (selectListData.selectors && Array.isArray(selectListData.selectors)) {
							template_card.select_list = (selectListData.selectors as IDataObject[]).map(
								(selector: IDataObject) => {
									const optionList = selector.option_list as IDataObject | undefined;
									const options = optionList && Array.isArray(optionList.options)
										? (optionList.options as IDataObject[])
										: [];
									return {
										question_key: selector.question_key,
										title: selector.title,
										selected_id: selector.selected_id,
										disable: selector.disable || false,
										option_list: options,
									};
								},
							);
						}

						if (submit_button_key) {
							template_card.submit_button = {
								text: submit_button_text,
								key: submit_button_key,
							};
						}

						if (replace_text) {
							template_card.replace_text = replace_text;
						}
					} else if (card_type === 'news_notice') {
						const imageTextAreaData = this.getNodeParameter('image_text_area', i, {}) as IDataObject;
						if (imageTextAreaData.imageTextInfo) {
							template_card.image_text_area = imageTextAreaData.imageTextInfo;
						}

						const cardImageData = this.getNodeParameter('card_image', i, {}) as IDataObject;
						if (cardImageData.imageInfo) {
							template_card.card_image = cardImageData.imageInfo;
						}

						const verticalContentListData = this.getNodeParameter('vertical_content_list', i, {}) as IDataObject;
						if (verticalContentListData.items && Array.isArray(verticalContentListData.items)) {
							template_card.vertical_content_list = verticalContentListData.items;
						}
					}

					// 添加action_menu
					if (actionMenuData.menuInfo) {
						const menuInfo = actionMenuData.menuInfo as IDataObject;
						const menuData: IDataObject = {};
						if (menuInfo.desc) {
							menuData.desc = menuInfo.desc;
						}
						if (menuInfo.action_list) {
							const actionListData = menuInfo.action_list as IDataObject;
							if (actionListData.actions && Array.isArray(actionListData.actions)) {
								menuData.action_list = actionListData.actions;
							}
						}
						if (Object.keys(menuData).length > 0) {
							template_card.action_menu = menuData;
						}
					}
				}

				delete template_card.task_id;

				const effectiveCardType = String(template_card.card_type || card_type || '');
				if (
					!button_update_only &&
					['text_notice', 'news_notice'].includes(effectiveCardType) &&
					!template_card.card_action
				) {
					throw new NodeOperationError(
						this.getNode(),
						'更新 text_notice 或 news_notice 卡片时，card_action 为必填字段',
						{ itemIndex: i },
					);
				}
				if (!button_update_only) validateTemplateCard(this, template_card, i, true);

				// 构建更新请求body
					body = {
						...body,
						response_code,
						agentid: agentId,
					};
					if (!button_update_only) body.enable_id_trans = enable_id_trans ? 1 : 0;

				// 添加接收人信息
				if (atall === 1) {
					body.atall = 1;
				} else {
					if (recipients.touser && recipients.touser !== '@all') {
						body.userids = recipients.touser.split('|');
					}
						if (recipients.toparty) {
							body.partyids = parseNumericIds(recipients.toparty, '部门 ID 列表', i);
						}
						if (recipients.totag) {
							body.tagids = parseNumericIds(recipients.totag, '标签 ID 列表', i);
						}
				}

				// 简单更新按钮：仅提交 button.replace_name
				if (button_update_only) {
					if (!replace_text) {
						throw new NodeOperationError(
							this.getNode(),
							'仅更新按钮为不可点击状态时，必须填写按钮替换文案',
							{ itemIndex: i },
						);
					}
					body.button = {
						replace_name: replace_text,
					};
				} else {
					// 否则使用完整卡片更新
					body.template_card = template_card;
				}

				// 使用更新接口
				const response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/message/update_template_card',
					body,
				);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
				continue;
				} else if (operation === 'sendSchoolNotice') {
					const msgtype = this.getNodeParameter('msgtype', i) as string;
					const recv_scope = this.getNodeParameter('recv_scope', i, 0) as number;
					const toall = this.getNodeParameter('toall', i, false) as boolean;
					const parentUserIds = toall
						? []
						: [
								...parseDelimitedList(
									this.getNodeParameter('to_parent_userid', i, '') as string,
									'家长 UserID 列表',
									1000,
									i,
								),
								...parseOptionalIdJson(
									this.getNodeParameter('toParentUseridJson', i, '[]'),
									'家长列表 JSON',
									i,
									['userid', 'user_id', 'parent_userid', 'id'],
								),
							].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 1000);
					const studentUserIds = toall
						? []
						: [
								...parseDelimitedList(
									this.getNodeParameter('to_student_userid', i, '') as string,
									'学生 UserID 列表',
									1000,
									i,
								),
								...parseOptionalIdJson(
									this.getNodeParameter('toStudentUseridJson', i, '[]'),
									'学生列表 JSON',
									i,
									['userid', 'user_id', 'student_userid', 'id'],
								),
							].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 1000);
					const partyIds = toall
						? []
						: [
								...parseDelimitedList(
									this.getNodeParameter('to_party', i, '') as string,
									'班级部门 ID 列表',
									100,
									i,
								),
								...parseOptionalIdJson(
									this.getNodeParameter('toPartyJson', i, '[]'),
									'班级部门列表 JSON',
									i,
									['partyid', 'party_id', 'departmentid', 'id'],
								),
							].filter((v, idx, arr) => arr.indexOf(v) === idx).slice(0, 100);

					if (!toall && parentUserIds.length === 0 && studentUserIds.length === 0 && partyIds.length === 0) {
						throw new NodeOperationError(
							this.getNode(),
							'请开启“发送给全部”，或至少填写一个家长、学生或班级部门 ID',
							{ itemIndex: i },
						);
					}

					const duplicateCheck = this.getNodeParameter(
						'school_enable_duplicate_check',
						i,
						false,
					) as boolean;
					const schoolBody: IDataObject = {
						recv_scope,
						toall: toall ? 1 : 0,
						msgtype,
						agentid: agentId,
						enable_duplicate_check: duplicateCheck ? 1 : 0,
					};
					if (parentUserIds.length) schoolBody.to_parent_userid = parentUserIds;
					if (studentUserIds.length) schoolBody.to_student_userid = studentUserIds;
					if (partyIds.length) schoolBody.to_party = partyIds;
					if (duplicateCheck) {
						schoolBody.duplicate_check_interval = this.getNodeParameter(
							'school_duplicate_check_interval',
							i,
							1800,
						) as number;
					}

					if (['text', 'news', 'mpnews', 'miniprogram'].includes(msgtype)) {
						const enableIdTrans = this.getNodeParameter(
							'school_enable_id_trans',
							i,
							false,
						) as boolean;
						schoolBody.enable_id_trans = enableIdTrans ? 1 : 0;
					}

					if (msgtype === 'text') {
						schoolBody.text = {
							content: this.getNodeParameter('content', i) as string,
						};
					} else if (['image', 'voice', 'file'].includes(msgtype)) {
						schoolBody[msgtype] = {
							media_id: this.getNodeParameter('media_id', i) as string,
						};
					} else if (msgtype === 'video') {
						const video: IDataObject = {
							media_id: this.getNodeParameter('media_id', i) as string,
						};
						const videoTitle = this.getNodeParameter('video_title', i, '') as string;
						const videoDescription = this.getNodeParameter(
							'video_description',
							i,
							'',
						) as string;
						if (videoTitle) video.title = videoTitle;
						if (videoDescription) video.description = videoDescription;
						schoolBody.video = video;
					} else if (msgtype === 'news') {
						const newsCollection = this.getNodeParameter('news_articles', i, {}) as IDataObject;
						const articles = ((newsCollection.article as IDataObject[]) || []).map((article) => {
							const normalized: IDataObject = {
								title: article.title,
								url: article.url,
							};
							if (article.description) normalized.description = article.description;
							if (article.picurl) normalized.picurl = article.picurl;
							return normalized;
						});
						if (articles.length < 1 || articles.length > 8) {
							throw new NodeOperationError(this.getNode(), '学校通知图文列表必须包含 1～8 条', {
								itemIndex: i,
							});
						}
						if (articles.some((article) => !article.title || !article.url)) {
							throw new NodeOperationError(this.getNode(), '学校通知每条图文的标题和跳转链接必填', {
								itemIndex: i,
							});
						}
						schoolBody.news = { articles };
					} else if (msgtype === 'mpnews') {
						const mpnewsCollection = this.getNodeParameter(
							'mpnews_articles',
							i,
							{},
						) as IDataObject;
						const articles = ((mpnewsCollection.article as IDataObject[]) || []).map((article) => {
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
						if (articles.length < 1 || articles.length > 8) {
							throw new NodeOperationError(this.getNode(), '学校通知 Mpnews 列表必须包含 1～8 条', {
								itemIndex: i,
							});
						}
						if (
							articles.some(
								(article) => !article.title || !article.thumb_media_id || !article.content,
							)
						) {
							throw new NodeOperationError(
								this.getNode(),
								'学校通知每条 Mpnews 的标题、缩略图 Media ID 和内容必填',
								{ itemIndex: i },
							);
						}
						schoolBody.mpnews = { articles };
					} else if (msgtype === 'miniprogram') {
						const miniprogram: IDataObject = {
							appid: this.getNodeParameter('school_miniprogram_appid', i) as string,
							thumb_media_id: this.getNodeParameter(
								'school_miniprogram_thumb_media_id',
								i,
							) as string,
							pagepath: this.getNodeParameter('school_miniprogram_pagepath', i) as string,
						};
						const miniprogramTitle = this.getNodeParameter(
							'school_miniprogram_title',
							i,
							'',
						) as string;
						if (miniprogramTitle) miniprogram.title = miniprogramTitle;
						schoolBody.miniprogram = miniprogram;
					}

					const response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/externalcontact/message/send',
						schoolBody,
				);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
				continue;
			}

			const response = await weComApiRequest.call(this, 'POST', '/cgi-bin/message/send', body);

			returnData.push({
				json: response as IDataObject,
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
