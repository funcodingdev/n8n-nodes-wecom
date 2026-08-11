import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';
import { extractRecipients } from './commonFields';

export async function executeMessage(
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

				const recipients = extractRecipients(
					recipientType,
					touserArray,
					topartyArray,
					totagArray,
					touserManual,
					topartyManual,
					totagManual,
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

			if (!touser && !toparty && !totag) {
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

			let body: IDataObject = {
				touser,
				toparty,
				totag,
				agentid: agentId,
			};

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
				const description = this.getNodeParameter('description', i) as string;
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
					articleList = ((articles.article as IDataObject[]) || []).map((article) => {
						const processedArticle: IDataObject = {
							title: article.title,
							description: article.description,
							picurl: article.picurl,
						};

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
					articleList = (articles.article as IDataObject[]) || [];
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
					const buttonList = ((buttons.button as IDataObject[]) || []).map((btn) => ({
						key: btn.key,
						name: btn.name,
						replace_name: btn.replace_name || '已处理',
						color: btn.color || 'blue',
						is_bold: btn.is_bold ? true : false,
					}));

					taskcard = {
						title,
						description,
						url,
						task_id,
						btn: buttonList,
					};
				}

				body = {
					...body,
					msgtype: 'taskcard',
					taskcard,
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
						template_card.horizontal_content_list = horizontalContentListData.items;
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
				const atall = this.getNodeParameter('recipientType', i) === 'all' ? 1 : 0;

				const recipients = extractRecipients(
					recipientType,
					touser,
					toparty,
					totag,
					touser_manual,
					toparty_manual,
					totag_manual,
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
						template_card.horizontal_content_list = horizontalContentListData.items;
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

				// 构建更新请求body
				body = {
					...body,
					response_code,
					agentid: agentId,
					enable_id_trans: enable_id_trans ? 1 : 0,
				};

				// 添加接收人信息
				if (atall === 1) {
					body.atall = 1;
				} else {
					if (recipients.touser && recipients.touser !== '@all') {
						body.userids = recipients.touser.split('|');
					}
					if (recipients.toparty) {
						body.partyids = recipients.toparty.split('|').map((id) => parseInt(id, 10));
					}
					if (recipients.totag) {
						body.tagids = recipients.totag.split('|').map((id) => parseInt(id, 10));
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
				const schoolTouser = this.getNodeParameter('touser', i, '') as string;
				const schoolToparty = this.getNodeParameter('toparty', i, '') as string;
				const schoolTotag = this.getNodeParameter('totag', i, '') as string;
				const title = this.getNodeParameter('title', i) as string;
				const description = this.getNodeParameter('description', i) as string;
				const url = this.getNodeParameter('url', i, '') as string;
				const emphasis_first_item = this.getNodeParameter('emphasis_first_item', i, false) as boolean;
				const content_item = this.getNodeParameter('content_item', i, '[]') as string;

				const schoolBody: IDataObject = {
					touser: schoolTouser,
					toparty: schoolToparty,
					totag: schoolTotag,
					agentid: agentId,
					msgtype: 'school_notice',
					school_notice: {
						title,
						description,
					},
				};

				if (url) {
					(schoolBody.school_notice as IDataObject).url = url;
				}

				(schoolBody.school_notice as IDataObject).emphasis_first_item = emphasis_first_item;

				const content_items = this.getNodeParameter('content_items', i, {}) as IDataObject;
				let contentItemList: IDataObject[] = ((content_items.item as IDataObject[]) || [])
					.filter((it) => it.key)
					.map((it) => ({ key: it.key as string, value: String(it.value || '') }));
				if (content_item && content_item !== '[]') {
					try {
						const parsed = JSON.parse(content_item);
						if (Array.isArray(parsed) && parsed.length) {
							contentItemList = parsed as IDataObject[];
						}
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`content_item 必须是有效的 JSON 数组: ${(error as Error).message}`,
							{ itemIndex: i },
						);
					}
				}
				if (contentItemList.length) {
					(schoolBody.school_notice as IDataObject).content_item = contentItemList;
				}

				// 使用发送学校通知接口
				const response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/message/send',
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
