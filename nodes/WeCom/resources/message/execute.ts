import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest, uploadMedia } from '../../shared/transport';
import { extractRecipients } from './commonFields';

export async function executeMessage(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const credentials = await this.getCredentials('weComApi');
			const agentId = credentials.agentId as string;

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

				body = {
					...body,
					msgtype: 'markdown',
					markdown: {
						content,
					},
				};
			} else if (operation === 'sendImage') {
				const imageSource = this.getNodeParameter('imageSource', i) as string;
				let mediaId: string;

				if (imageSource === 'mediaId') {
					mediaId = this.getNodeParameter('media_ID', i) as string;
				} else {
					// 上传图片
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

					mediaId = await uploadMedia.call(
						this,
						'image',
						buffer,
						binaryData.fileName || 'image.jpg',
					);
				}

				body = {
					...body,
					msgtype: 'image',
					image: {
						media_ID: mediaId,
					},
				};
			} else if (operation === 'sendFile') {
				const fileSource = this.getNodeParameter('fileSource', i) as string;
				let mediaId: string;

				if (fileSource === 'mediaId') {
					mediaId = this.getNodeParameter('media_ID', i) as string;
				} else {
					// 上传文件
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

					mediaId = await uploadMedia.call(
						this,
						'file',
						buffer,
						binaryData.fileName || 'file.bin',
					);
				}

				body = {
					...body,
					msgtype: 'file',
					file: {
						media_ID: mediaId,
					},
				};
			} else if (operation === 'sendVoice') {
				const voiceSource = this.getNodeParameter('voiceSource', i) as string;
				const safe = this.getNodeParameter('safe', i, false) as boolean;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;
				let mediaId: string;

				if (voiceSource === 'mediaId') {
					mediaId = this.getNodeParameter('media_ID', i) as string;
				} else {
					// 上传语音
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

					mediaId = await uploadMedia.call(
						this,
						'voice',
						buffer,
						binaryData.fileName || 'voice.amr',
					);
				}

				body = {
					...body,
					msgtype: 'voice',
					voice: {
						media_ID: mediaId,
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
			} else if (operation === 'sendVideo') {
				const videoSource = this.getNodeParameter('videoSource', i) as string;
				const title = this.getNodeParameter('title', i, '') as string;
				const description = this.getNodeParameter('description', i, '') as string;
				const safe = this.getNodeParameter('safe', i, false) as boolean;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;
				let mediaId: string;

				if (videoSource === 'mediaId') {
					mediaId = this.getNodeParameter('media_ID', i) as string;
				} else {
					// 上传视频
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;
					const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
					const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

					mediaId = await uploadMedia.call(
						this,
						'video',
						buffer,
						binaryData.fileName || 'video.mp4',
					);
				}

				body = {
					...body,
					msgtype: 'video',
					video: {
						media_ID: mediaId,
						title,
						description,
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
				const articles = this.getNodeParameter('articles', i, {}) as IDataObject;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				const articleList = (articles.article as IDataObject[]) || [];

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
				const articles = this.getNodeParameter('articles', i, {}) as IDataObject;
				const safe = this.getNodeParameter('safe', i, false) as boolean;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				const articleList = (articles.article as IDataObject[]) || [];

				body = {
					...body,
					msgtype: 'mpnews',
					mpnews: {
						articles: articleList,
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
			} else if (operation === 'sendMiniprogramNotice') {
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

				const contentItemList = (content_items.item as IDataObject[]) || [];

				body = {
					...body,
					msgtype: 'miniprogram_notice',
					miniprogram_notice: {
						appid,
						page,
						title,
						description,
						emphasis_first_item: emphasis_first_item ? true : false,
						content_item: contentItemList,
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
			} else if (operation === 'sendTaskCard') {
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

				const buttonList = ((buttons.button as IDataObject[]) || []).map((btn) => ({
					key: btn.key,
					name: btn.name,
					replace_name: btn.replace_name || '已处理',
					color: btn.color || 'blue',
					is_bold: btn.is_bold ? true : false,
				}));

				body = {
					...body,
					msgtype: 'taskcard',
					taskcard: {
						title,
						description,
						url,
						task_id,
						btn: buttonList,
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
			} else if (operation === 'sendTemplateCard') {
				const card_type = this.getNodeParameter('card_type', i) as string;
				const enable_id_trans = this.getNodeParameter('enable_id_trans', i, false) as boolean;
				const enable_duplicate_check = this.getNodeParameter(
					'enable_duplicate_check',
					i,
					false,
				) as boolean;

				// 解析JSON字段
				const source = this.getNodeParameter('source', i, '{}') as string;
				const main_title = this.getNodeParameter('main_title', i, '{"title": ""}') as string;
				const emphasis_content = this.getNodeParameter('emphasis_content', i, '{}') as string;
				const quote_area = this.getNodeParameter('quote_area', i, '{}') as string;
				const sub_title_text = this.getNodeParameter('sub_title_text', i, '') as string;
				const horizontal_content_list = this.getNodeParameter(
					'horizontal_content_list',
					i,
					'[]',
				) as string;
				const jump_list = this.getNodeParameter('jump_list', i, '[]') as string;
				const card_action = this.getNodeParameter('card_action', i, '{}') as string;
				const task_id = this.getNodeParameter('task_id', i, '') as string;
				const action_menu = this.getNodeParameter('action_menu', i, '{}') as string;

				const template_card: IDataObject = {
					card_type,
				};

				// 添加source
				try {
					const sourceObj = JSON.parse(source);
					if (Object.keys(sourceObj).length > 0) {
						template_card.source = sourceObj;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加main_title
				try {
					template_card.main_title = JSON.parse(main_title);
				} catch {
					template_card.main_title = { title: '' };
				}

				// 添加emphasis_content
				try {
					const emphasisObj = JSON.parse(emphasis_content);
					if (Object.keys(emphasisObj).length > 0) {
						template_card.emphasis_content = emphasisObj;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加quote_area
				try {
					const quoteObj = JSON.parse(quote_area);
					if (Object.keys(quoteObj).length > 0) {
						template_card.quote_area = quoteObj;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加sub_title_text
				if (sub_title_text) {
					template_card.sub_title_text = sub_title_text;
				}

				// 添加horizontal_content_list
				try {
					const horizontalList = JSON.parse(horizontal_content_list);
					if (Array.isArray(horizontalList) && horizontalList.length > 0) {
						template_card.horizontal_content_list = horizontalList;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加jump_list
				try {
					const jumpListObj = JSON.parse(jump_list);
					if (Array.isArray(jumpListObj) && jumpListObj.length > 0) {
						template_card.jump_list = jumpListObj;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加card_action
				try {
					const cardActionObj = JSON.parse(card_action);
					if (Object.keys(cardActionObj).length > 0) {
						template_card.card_action = cardActionObj;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加task_id
				if (task_id) {
					template_card.task_id = task_id;
				}

				// 针对不同卡片类型的特殊处理
				if (card_type === 'button_interaction') {
					const button_list = this.getNodeParameter('button_list', i, '[]') as string;
					try {
						const buttonListObj = JSON.parse(button_list);
						if (Array.isArray(buttonListObj) && buttonListObj.length > 0) {
							template_card.button_list = buttonListObj;
						}
				} catch {
					// 忽略解析错误
				}
				} else if (
					card_type === 'vote_interaction' ||
					card_type === 'multiple_interaction'
				) {
					const checkbox_question_key = this.getNodeParameter(
						'checkbox_question_key',
						i,
						'',
					) as string;
					const checkbox_mode = this.getNodeParameter(
						'checkbox_mode',
						i,
						'single',
					) as string;
					const option_list = this.getNodeParameter('option_list', i, '[]') as string;
					const submit_button_text = this.getNodeParameter(
						'submit_button_text',
						i,
						'提交',
					) as string;
					const submit_button_key = this.getNodeParameter('submit_button_key', i) as string;

					if (checkbox_question_key) {
						template_card.checkbox = {
							question_key: checkbox_question_key,
							mode: checkbox_mode,
							option_list: JSON.parse(option_list),
						};
					}

					template_card.submit_button = {
						text: submit_button_text,
						key: submit_button_key,
					};
				} else if (card_type === 'news_notice') {
					const image_text_area = this.getNodeParameter('image_text_area', i, '{}') as string;
					try {
						const imageTextObj = JSON.parse(image_text_area);
						if (Object.keys(imageTextObj).length > 0) {
							template_card.image_text_area = imageTextObj;
						}
				} catch {
					// 忽略解析错误
				}
				}

				// 添加action_menu
				try {
					const actionMenuObj = JSON.parse(action_menu);
					if (Object.keys(actionMenuObj).length > 0) {
						template_card.action_menu = actionMenuObj;
					}
				} catch {
					// 忽略解析错误
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
				const card_type = this.getNodeParameter('card_type', i) as string;
				const button_key = this.getNodeParameter('button_key', i, '') as string;

				// 解析JSON字段
				const source = this.getNodeParameter('source', i, '{}') as string;
				const main_title = this.getNodeParameter('main_title', i, '{"title": ""}') as string;
				const emphasis_content = this.getNodeParameter('emphasis_content', i, '{}') as string;
				const quote_area = this.getNodeParameter('quote_area', i, '{}') as string;
				const sub_title_text = this.getNodeParameter('sub_title_text', i, '') as string;
				const horizontal_content_list = this.getNodeParameter(
					'horizontal_content_list',
					i,
					'[]',
				) as string;
				const jump_list = this.getNodeParameter('jump_list', i, '[]') as string;
				const card_action = this.getNodeParameter('card_action', i, '{}') as string;
				const task_id = this.getNodeParameter('task_id', i, '') as string;
				const action_menu = this.getNodeParameter('action_menu', i, '{}') as string;

				const template_card: IDataObject = {
					card_type,
				};

				// 添加source
				try {
					const sourceObj = JSON.parse(source);
					if (Object.keys(sourceObj).length > 0) {
						template_card.source = sourceObj;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加main_title
				try {
					template_card.main_title = JSON.parse(main_title);
				} catch {
					template_card.main_title = { title: '' };
				}

				// 添加emphasis_content
				try {
					const emphasisObj = JSON.parse(emphasis_content);
					if (Object.keys(emphasisObj).length > 0) {
						template_card.emphasis_content = emphasisObj;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加quote_area
				try {
					const quoteObj = JSON.parse(quote_area);
					if (Object.keys(quoteObj).length > 0) {
						template_card.quote_area = quoteObj;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加sub_title_text
				if (sub_title_text) {
					template_card.sub_title_text = sub_title_text;
				}

				// 添加horizontal_content_list
				try {
					const horizontalList = JSON.parse(horizontal_content_list);
					if (Array.isArray(horizontalList) && horizontalList.length > 0) {
						template_card.horizontal_content_list = horizontalList;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加jump_list
				try {
					const jumpListObj = JSON.parse(jump_list);
					if (Array.isArray(jumpListObj) && jumpListObj.length > 0) {
						template_card.jump_list = jumpListObj;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加card_action
				try {
					const cardActionObj = JSON.parse(card_action);
					if (Object.keys(cardActionObj).length > 0) {
						template_card.card_action = cardActionObj;
					}
				} catch {
					// 忽略解析错误
				}

				// 添加task_id
				if (task_id) {
					template_card.task_id = task_id;
				}

				// 针对不同卡片类型的特殊处理
				if (card_type === 'button_interaction') {
					const button_list = this.getNodeParameter('button_list', i, '[]') as string;
					try {
						const buttonListObj = JSON.parse(button_list);
						if (Array.isArray(buttonListObj) && buttonListObj.length > 0) {
							template_card.button_list = buttonListObj;
						}
				} catch {
					// 忽略解析错误
				}
				} else if (
					card_type === 'vote_interaction' ||
					card_type === 'multiple_interaction'
				) {
					const checkbox_question_key = this.getNodeParameter(
						'checkbox_question_key',
						i,
						'',
					) as string;
					const checkbox_mode = this.getNodeParameter(
						'checkbox_mode',
						i,
						'single',
					) as string;
					const option_list = this.getNodeParameter('option_list', i, '[]') as string;
					const submit_button_text = this.getNodeParameter(
						'submit_button_text',
						i,
						'提交',
					) as string;
					const submit_button_key = this.getNodeParameter('submit_button_key', i) as string;

					if (checkbox_question_key) {
						template_card.checkbox = {
							question_key: checkbox_question_key,
							mode: checkbox_mode,
							option_list: JSON.parse(option_list),
						};
					}

					template_card.submit_button = {
						text: submit_button_text,
						key: submit_button_key,
					};
				} else if (card_type === 'news_notice') {
					const image_text_area = this.getNodeParameter('image_text_area', i, '{}') as string;
					try {
						const imageTextObj = JSON.parse(image_text_area);
						if (Object.keys(imageTextObj).length > 0) {
							template_card.image_text_area = imageTextObj;
						}
				} catch {
					// 忽略解析错误
				}
				}

				// 添加action_menu
				try {
					const actionMenuObj = JSON.parse(action_menu);
					if (Object.keys(actionMenuObj).length > 0) {
						template_card.action_menu = actionMenuObj;
					}
				} catch {
					// 忽略解析错误
				}

				// 构建更新请求body
				body = {
					...body,
					response_code,
					template_card,
				};

				// 添加button_key（如果有）
				if (button_key) {
					body.button_key = button_key;
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
			} else if (operation === 'recallMessage') {
				const msgid = this.getNodeParameter('msgid', i) as string;

				const recallBody = {
					msgid,
				};

				// 使用撤回消息接口
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

				if (content_item && content_item !== '[]') {
					try {
						(schoolBody.school_notice as IDataObject).content_item = JSON.parse(content_item);
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`content_item 必须是有效的 JSON 数组: ${error.message}`,
							{ itemIndex: i },
						);
					}
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

