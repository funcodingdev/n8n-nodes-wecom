import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
	WeComCrypto,
	generateReplyMessageXML,
	generateEncryptedResponseXML,
} from '../../shared/crypto';
import { validateTemplateCard } from '../message/execute';

type PassiveReplyType =
	| 'text'
	| 'image'
	| 'voice'
	| 'video'
	| 'news'
	| 'update_button'
	| 'update_template_card';

export async function executePassiveReply(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	if (items.length !== 1) {
		throw new NodeOperationError(
			this.getNode(),
			items.length === 0
				? '没有收到可回复的消息。请确保本节点连接“企业微信消息接收（被动回复）”触发器，且中间节点没有过滤数据。'
				: `被动回复一次只能处理 1 条消息，当前收到 ${items.length} 条。请在到达本节点前合并或筛选数据。`,
		);
	}

	const itemIndex = 0;
	const fail = (message: string): never => {
		throw new NodeOperationError(this.getNode(), message, { itemIndex });
	};
	const requiredText = (value: unknown, label: string): string => {
		const text = String(value ?? '').trim();
		if (!text) fail(`${label}不能为空`);
		return text;
	};
	const validateByteLength = (value: unknown, label: string, maximum: number): string => {
		const text = requiredText(value, label);
		if (Buffer.byteLength(text, 'utf8') > maximum) fail(`${label}不能超过 ${maximum} 个字节`);
		return text;
	};
	const optionalByteLength = (
		value: unknown,
		label: string,
		maximum: number,
	): string | undefined => {
		const text = String(value ?? '').trim();
		if (!text) return undefined;
		if (Buffer.byteLength(text, 'utf8') > maximum) fail(`${label}不能超过 ${maximum} 个字节`);
		return text;
	};
	const validateHttpUrl = (value: unknown, label: string): string => {
		const text = requiredText(value, label);
		try {
			const url = new URL(text);
			if (!['http:', 'https:'].includes(url.protocol)) throw new Error();
		} catch {
			fail(`${label}必须是有效的 HTTP(S) 链接`);
		}
		return text;
	};
	const parseJsonObject = (value: unknown, label: string): IDataObject => {
		let parsed = value;
		if (typeof value === 'string') {
			try {
				parsed = JSON.parse(value) as unknown;
			} catch (error) {
				fail(`${label}必须是有效的 JSON：${(error as Error).message}`);
			}
		}
		if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) fail(`${label}必须是对象`);
		return parsed as IDataObject;
	};
	const compactObject = (value: IDataObject | undefined): IDataObject | undefined => {
		if (!value) return undefined;
		const compacted: IDataObject = {};
		for (const [key, entry] of Object.entries(value)) {
			if (entry === undefined || entry === null || (typeof entry === 'string' && !entry.trim())) continue;
			compacted[key] = typeof entry === 'string' ? entry.trim() : entry;
		}
		return Object.keys(compacted).length ? compacted : undefined;
	};
	const compactAction = (value: IDataObject | undefined): IDataObject | undefined => {
		const action = compactObject(value);
		if (!action) return undefined;
		const type = Number(action.type ?? 0);
		if (type !== 1) delete action.url;
		if (type !== 2) {
			delete action.appid;
			delete action.pagepath;
		}
		return action;
	};
	const compactOptions = (value: unknown): IDataObject[] => {
		return Array.isArray(value)
			? value.map((entry) => compactObject(entry as IDataObject) ?? {})
			: [];
	};
	const compactHorizontalContent = (value: IDataObject): IDataObject => {
		const item = compactObject(value) ?? {};
		const type = Number(item.type ?? 0);
		if (type !== 1) delete item.url;
		if (type !== 2) delete item.media_id;
		if (type !== 3) delete item.userid;
		return item;
	};
	const buildTemplateCard = (): IDataObject => {
		const inputMode = this.getNodeParameter('template_card_input_mode', itemIndex, 'form') as string;
		if (inputMode === 'json') {
			const json = parseJsonObject(
				this.getNodeParameter('template_card_json', itemIndex, '{}'),
				'template_card_json',
			);
			return json.template_card === undefined
				? json
				: parseJsonObject(json.template_card, 'template_card_json.template_card');
		}

		const cardType = this.getNodeParameter('card_type', itemIndex) as string;
		const sourceData = this.getNodeParameter('source', itemIndex, {}) as IDataObject;
		const mainTitleData = this.getNodeParameter('main_title', itemIndex, {}) as IDataObject;
		const emphasisData = this.getNodeParameter('emphasis_content', itemIndex, {}) as IDataObject;
		const quoteData = this.getNodeParameter('quote_area', itemIndex, {}) as IDataObject;
		const horizontalData = this.getNodeParameter('horizontal_content_list', itemIndex, {}) as IDataObject;
		const jumpData = this.getNodeParameter('jump_list', itemIndex, {}) as IDataObject;
		const cardActionData = this.getNodeParameter('card_action', itemIndex, {}) as IDataObject;
		const actionMenuData = this.getNodeParameter('action_menu', itemIndex, {}) as IDataObject;

		const templateCard: IDataObject = { card_type: cardType };
		const source = compactObject(sourceData.sourceInfo as IDataObject | undefined);
		if (source) templateCard.source = source;
		templateCard.main_title = compactObject(
			mainTitleData.titleInfo as IDataObject | undefined,
		) ?? {};
		const emphasis = compactObject(emphasisData.emphasisInfo as IDataObject | undefined);
		if (emphasis) templateCard.emphasis_content = emphasis;
		const quote = compactAction(quoteData.quoteInfo as IDataObject | undefined);
		if (quote) templateCard.quote_area = quote;
		const subTitle = (this.getNodeParameter('sub_title_text', itemIndex, '') as string).trim();
		if (subTitle) templateCard.sub_title_text = subTitle;

		if (Array.isArray(horizontalData.items) && horizontalData.items.length) {
			templateCard.horizontal_content_list = horizontalData.items.map(
				(entry) => compactHorizontalContent(entry as IDataObject),
			);
		}
		if (Array.isArray(jumpData.items) && jumpData.items.length) {
			templateCard.jump_list = jumpData.items.map(
				(entry) => compactAction(entry as IDataObject) ?? {},
			);
		}
		const cardAction = compactAction(cardActionData.actionInfo as IDataObject | undefined);
		if (cardAction) templateCard.card_action = cardAction;

		const actionMenuInfo = compactObject(actionMenuData.menuInfo as IDataObject | undefined);
		if (actionMenuInfo) {
			const actionList = actionMenuInfo.action_list as IDataObject | undefined;
			const actions = compactOptions(actionList?.actions);
			delete actionMenuInfo.action_list;
			if (actions.length) actionMenuInfo.action_list = actions;
			templateCard.action_menu = actionMenuInfo;
		}

		if (cardType === 'button_interaction') {
			const buttonListJsonRaw = this.getNodeParameter('buttonListJson', itemIndex, '[]');
			let buttons: IDataObject[] = [];
			if (
				buttonListJsonRaw !== undefined &&
				buttonListJsonRaw !== null &&
				String(buttonListJsonRaw).trim() !== ''
			) {
				let parsed: unknown = buttonListJsonRaw;
				if (typeof buttonListJsonRaw === 'string') {
					try {
						parsed = JSON.parse(buttonListJsonRaw);
					} catch {
						fail('按钮列表 JSON 不是有效的 JSON');
					}
				}
				if (!Array.isArray(parsed)) fail('按钮列表 JSON 必须是数组');
				if ((parsed as unknown[]).length > 0) buttons = parsed as IDataObject[];
			}
			if (buttons.length === 0) {
				const buttonData = this.getNodeParameter('button_list', itemIndex, {}) as IDataObject;
				if (Array.isArray(buttonData.buttons)) buttons = buttonData.buttons as IDataObject[];
			}
			if (buttons.length) {
				templateCard.button_list = compactOptions(buttons);
			}
			const selectionData = this.getNodeParameter('button_selection', itemIndex, {}) as IDataObject;
			const selection = compactObject(selectionData.selectionInfo as IDataObject | undefined);
			if (selection) {
				const optionData = selection.option_list as IDataObject | undefined;
				selection.option_list = compactOptions(optionData?.options);
				templateCard.button_selection = selection;
			}
		} else if (cardType === 'vote_interaction') {
			const optionData = this.getNodeParameter('option_list', itemIndex, {}) as IDataObject;
			templateCard.checkbox = {
				question_key: (this.getNodeParameter('checkbox_question_key', itemIndex, '') as string).trim(),
				mode: this.getNodeParameter('checkbox_mode', itemIndex, 0) as number,
				disable: this.getNodeParameter('checkbox_disable', itemIndex, false) as boolean,
				option_list: compactOptions(optionData.options),
			};
		} else if (cardType === 'multiple_interaction') {
			const selectData = this.getNodeParameter('select_list', itemIndex, {}) as IDataObject;
			const selectors = Array.isArray(selectData.selectors)
				? selectData.selectors.map((rawSelector) => {
					const selector = compactObject(rawSelector as IDataObject) ?? {};
					const optionData = selector.option_list as IDataObject | undefined;
					selector.option_list = compactOptions(optionData?.options);
					return selector;
				})
				: [];
			templateCard.select_list = selectors;
		}

		if (['vote_interaction', 'multiple_interaction'].includes(cardType)) {
			const submitKey = (this.getNodeParameter('submit_button_key', itemIndex, '') as string).trim();
			if (submitKey) {
				templateCard.submit_button = {
					text: (this.getNodeParameter('submit_button_text', itemIndex, '提交') as string).trim(),
					key: submitKey,
				};
			}
		}

		if (cardType === 'news_notice') {
			const cardImageData = this.getNodeParameter('card_image', itemIndex, {}) as IDataObject;
			const cardImage = compactObject(cardImageData.imageInfo as IDataObject | undefined);
			if (cardImage) templateCard.card_image = cardImage;
			const imageTextData = this.getNodeParameter('image_text_area', itemIndex, {}) as IDataObject;
			const imageText = compactAction(imageTextData.imageTextInfo as IDataObject | undefined);
			if (imageText) templateCard.image_text_area = imageText;
			const verticalData = this.getNodeParameter('vertical_content_list', itemIndex, {}) as IDataObject;
			if (Array.isArray(verticalData.items) && verticalData.items.length) {
				templateCard.vertical_content_list = compactOptions(verticalData.items);
			}
		}

		if (['button_interaction', 'vote_interaction', 'multiple_interaction'].includes(cardType)) {
			const replaceText = (this.getNodeParameter('replace_text', itemIndex, '') as string).trim();
			if (replaceText) templateCard.replace_text = replaceText;
		}
		return templateCard;
	};

	try {
		if (operation !== 'reply') fail(`不支持的被动回复操作：${operation}`);
		const item = items[itemIndex];
		const credentials = await this.getCredentials('weComReceiveApi') as {
			token: string;
			encodingAESKey: string;
			corpId: string;
		};
		const token = requiredText(credentials.token, '接收消息凭证 Token');
		const encodingAESKey = requiredText(
			credentials.encodingAESKey,
			'接收消息凭证 EncodingAESKey',
		);
		const corpId = requiredText(credentials.corpId, '接收消息凭证企业 ID');
		const fromUserName = requiredText(item.json.FromUserName, 'FromUserName');
		const toUserName = requiredText(item.json.ToUserName, 'ToUserName');

		const replyType = this.getNodeParameter('replyType', itemIndex, 'text') as PassiveReplyType;
		let replyContent: Record<string, unknown> = {};

		if (replyType === 'text') {
			replyContent = {
				Content: validateByteLength(
					this.getNodeParameter('textContent', itemIndex),
					'文本内容',
					2048,
				),
			};
		} else if (['image', 'voice', 'video'].includes(replyType)) {
			replyContent = {
				MediaId: requiredText(this.getNodeParameter('mediaId', itemIndex), '媒体 ID'),
			};
			if (replyType === 'video') {
				const title = optionalByteLength(
					this.getNodeParameter('videoTitle', itemIndex, ''),
					'视频标题',
					128,
				);
				const description = optionalByteLength(
					this.getNodeParameter('videoDescription', itemIndex, ''),
					'视频描述',
					512,
				);
				if (title) replyContent.Title = title;
				if (description) replyContent.Description = description;
			}
		} else if (replyType === 'news') {
			const articlesJsonRaw = this.getNodeParameter('articlesJson', itemIndex, '[]');
			let articles: IDataObject[] = [];
			if (
				articlesJsonRaw !== undefined &&
				articlesJsonRaw !== null &&
				String(articlesJsonRaw).trim() !== ''
			) {
				let parsed: unknown = articlesJsonRaw;
				if (typeof articlesJsonRaw === 'string') {
					try {
						parsed = JSON.parse(articlesJsonRaw);
					} catch {
						fail('图文列表 JSON 不是有效的 JSON');
					}
				}
				if (!Array.isArray(parsed)) fail('图文列表 JSON 必须是数组');
				const parsedList = parsed as unknown[];
				if (parsedList.length > 0) articles = parsedList as IDataObject[];
			}
			if (articles.length === 0) {
				const articleData = this.getNodeParameter('articles', itemIndex, {}) as IDataObject;
				articles = Array.isArray(articleData.article)
					? (articleData.article as IDataObject[])
					: [];
			}
			if (articles.length < 1 || articles.length > 8) fail('图文消息必须包含 1 到 8 条图文');
			replyContent = {
				Articles: articles.map((article, index) => {
					const normalized: IDataObject = {
						Title: validateByteLength(article.title, `第 ${index + 1} 条图文标题`, 128),
						Url: validateHttpUrl(article.url, `第 ${index + 1} 条图文跳转链接`),
					};
					const description = optionalByteLength(
						article.description,
						`第 ${index + 1} 条图文描述`,
						512,
					);
					if (description) normalized.Description = description;
					const picUrl = article.picUrl ?? article.picurl;
					if (String(picUrl ?? '').trim()) {
						normalized.PicUrl = validateHttpUrl(
							picUrl,
							`第 ${index + 1} 条图文封面图片链接`,
						);
					}
					return normalized;
				}),
			};
		} else if (replyType === 'update_button') {
			replyContent = {
				Button: {
					ReplaceName: requiredText(
						this.getNodeParameter('buttonReplaceName', itemIndex),
						'按钮替换名称',
					),
				},
			};
		} else if (replyType === 'update_template_card') {
			const templateCard = buildTemplateCard();
			validateTemplateCard(this, templateCard, itemIndex, true, 10);
			if (templateCard.card_type === 'button_interaction') {
				const buttons = Array.isArray(templateCard.button_list)
					? templateCard.button_list as IDataObject[]
					: [];
				const keys = buttons.map((button) => String(button.key ?? ''));
				if (new Set(keys).size !== keys.length) fail('button_list 的按钮 key 不可重复');
			}
			replyContent = { TemplateCard: templateCard };
		} else {
			fail(`不支持的回复消息类型：${replyType}`);
		}

		const crypto = new WeComCrypto(encodingAESKey, corpId);
		const replyMessageXML = generateReplyMessageXML(
			fromUserName,
			toUserName,
			replyType,
			replyContent,
		);
		const responseXML = generateEncryptedResponseXML(
			crypto,
			token,
			replyMessageXML,
			this.getNode(),
		);

		return [{
			json: {
				success: true,
				repliedAt: new Date().toISOString(),
				responseXML,
			},
			pairedItem: { item: itemIndex },
		}];
	} catch (error) {
		if (!this.continueOnFail()) throw error;
		return [{
			json: {
				error: (error as Error).message,
				success: false,
				responseXML: 'success',
			},
			pairedItem: { item: itemIndex },
		}];
	}
}
