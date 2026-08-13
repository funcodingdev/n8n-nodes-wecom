import { createHash } from 'crypto';
import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/** 群机器人发送消息官方路径 */
const WEBHOOK_SEND_PATH = '/cgi-bin/webhook/send';
/** 群机器人上传媒体官方路径 */
const WEBHOOK_UPLOAD_MEDIA_PATH = '/cgi-bin/webhook/upload_media';

export async function executePushMessage(
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
	const ensureByteLength = (
		value: unknown,
		parameterName: string,
		maxBytes: number,
		itemIndex: number,
	): string => {
		const text = String(value ?? '');
		if (!text.trim()) {
			throw new NodeOperationError(this.getNode(), `${parameterName} 不能为空`, { itemIndex });
		}
		if (Buffer.byteLength(text, 'utf8') > maxBytes) {
			throw new NodeOperationError(
				this.getNode(),
				`${parameterName} 不能超过 ${maxBytes} 个字节`,
				{ itemIndex },
			);
		}
		return text;
	};
	const normalizeDelimitedList = (value: unknown): string[] => {
		const values = [...new Set(
			String(value ?? '')
				.split(/[,|\n]/)
				.map((entry) => entry.trim())
				.filter(Boolean),
		)];
		return values.includes('@all') ? ['@all'] : values;
	};
	const ensureOptionalByteLength = (
		value: unknown,
		parameterName: string,
		maxBytes: number,
		itemIndex: number,
	): string | undefined => {
		const text = String(value ?? '').trim();
		if (!text) return undefined;
		if (Buffer.byteLength(text, 'utf8') > maxBytes) {
			throw new NodeOperationError(
				this.getNode(),
				`${parameterName} 不能超过 ${maxBytes} 个字节`,
				{ itemIndex },
			);
		}
		return text;
	};
	const ensureHttpUrl = (value: unknown, parameterName: string, itemIndex: number): string => {
		const text = String(value ?? '').trim();
		try {
			const url = new URL(text);
			if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error();
		} catch {
			throw new NodeOperationError(
				this.getNode(),
				`${parameterName} 必须是有效的 HTTP(S) 链接`,
				{ itemIndex },
			);
		}
		return text;
	};
	const asObject = (
		value: unknown,
		parameterName: string,
		itemIndex: number,
		required = false,
	): IDataObject | undefined => {
		if (value === undefined || value === null) {
			if (required) {
				throw new NodeOperationError(this.getNode(), `${parameterName} 不能为空`, { itemIndex });
			}
			return undefined;
		}
		if (typeof value !== 'object' || Array.isArray(value)) {
			throw new NodeOperationError(this.getNode(), `${parameterName} 必须是对象`, { itemIndex });
		}
		return value as IDataObject;
	};
	const asObjectArray = (
		value: unknown,
		parameterName: string,
		itemIndex: number,
	): IDataObject[] => {
		if (value === undefined || value === null) return [];
		if (!Array.isArray(value)) {
			throw new NodeOperationError(this.getNode(), `${parameterName} 必须是数组`, { itemIndex });
		}
		return value.map((entry, index) => {
			if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
				throw new NodeOperationError(
					this.getNode(),
					`${parameterName} 第 ${index + 1} 项必须是对象`,
					{ itemIndex },
				);
			}
			return entry as IDataObject;
		});
	};
	const requireText = (value: unknown, parameterName: string, itemIndex: number): string => {
		const text = String(value ?? '').trim();
		if (!text) {
			throw new NodeOperationError(this.getNode(), `${parameterName} 不能为空`, { itemIndex });
		}
		return text;
	};
	const validateCardLinkAction = (
		value: unknown,
		parameterName: string,
		itemIndex: number,
		allowNoAction: boolean,
	) => {
		const action = asObject(value, parameterName, itemIndex, true)!;
		const actionType = Number(action.type ?? 0);
		const supportedTypes = allowNoAction ? [0, 1, 2] : [1, 2];
		if (!supportedTypes.includes(actionType)) {
			throw new NodeOperationError(
				this.getNode(),
				`${parameterName}.type 仅支持 ${supportedTypes.join('、')}`,
				{ itemIndex },
			);
		}
		if (actionType === 1) ensureHttpUrl(action.url, `${parameterName}.url`, itemIndex);
		if (actionType === 2) requireText(action.appid, `${parameterName}.appid`, itemIndex);
	};
	const validateTemplateCard = (templateCard: IDataObject, itemIndex: number) => {
		const cardType = String(templateCard.card_type ?? '');
		if (!['text_notice', 'news_notice'].includes(cardType)) {
			throw new NodeOperationError(
				this.getNode(),
				'template_card.card_type 仅支持 text_notice 或 news_notice',
				{ itemIndex },
			);
		}

		const source = asObject(templateCard.source, 'template_card.source', itemIndex);
		if (source?.icon_url) ensureHttpUrl(source.icon_url, 'template_card.source.icon_url', itemIndex);
		if (source?.desc_color !== undefined && ![0, 1, 2, 3].includes(Number(source.desc_color))) {
			throw new NodeOperationError(
				this.getNode(),
				'template_card.source.desc_color 仅支持 0、1、2、3',
				{ itemIndex },
			);
		}

		const mainTitle = asObject(templateCard.main_title, 'template_card.main_title', itemIndex, true)!;
		if (cardType === 'text_notice') {
			if (!String(mainTitle.title ?? '').trim() && !String(templateCard.sub_title_text ?? '').trim()) {
				throw new NodeOperationError(
					this.getNode(),
					'文本通知卡片的 main_title.title 与 sub_title_text 至少填写一项',
					{ itemIndex },
				);
			}
		} else {
			requireText(mainTitle.title, 'template_card.main_title.title', itemIndex);
			const cardImage = asObject(templateCard.card_image, 'template_card.card_image', itemIndex, true)!;
			ensureHttpUrl(cardImage.url, 'template_card.card_image.url', itemIndex);
			if (cardImage.aspect_ratio !== undefined) {
				const ratio = Number(cardImage.aspect_ratio);
				if (!Number.isFinite(ratio) || ratio < 1.3 || ratio > 2.25) {
					throw new NodeOperationError(
						this.getNode(),
						'template_card.card_image.aspect_ratio 必须在 1.3 到 2.25 之间',
						{ itemIndex },
					);
				}
			}
			const imageTextArea = asObject(
				templateCard.image_text_area,
				'template_card.image_text_area',
				itemIndex,
			);
			if (imageTextArea) {
				ensureHttpUrl(imageTextArea.image_url, 'template_card.image_text_area.image_url', itemIndex);
				validateCardLinkAction(imageTextArea, 'template_card.image_text_area', itemIndex, true);
			}
			const verticalContentList = asObjectArray(
				templateCard.vertical_content_list,
				'template_card.vertical_content_list',
				itemIndex,
			);
			if (verticalContentList.length > 4) {
				throw new NodeOperationError(
					this.getNode(),
					'template_card.vertical_content_list 最多包含 4 项',
					{ itemIndex },
				);
			}
			verticalContentList.forEach((entry, index) => {
				requireText(entry.title, `template_card.vertical_content_list[${index}].title`, itemIndex);
			});
		}

		const quoteArea = asObject(templateCard.quote_area, 'template_card.quote_area', itemIndex);
		if (quoteArea) validateCardLinkAction(quoteArea, 'template_card.quote_area', itemIndex, true);

		const horizontalContentList = asObjectArray(
			templateCard.horizontal_content_list,
			'template_card.horizontal_content_list',
			itemIndex,
		);
		if (horizontalContentList.length > 6) {
			throw new NodeOperationError(
				this.getNode(),
				'template_card.horizontal_content_list 最多包含 6 项',
				{ itemIndex },
			);
		}
		horizontalContentList.forEach((entry, index) => {
			requireText(entry.keyname, `template_card.horizontal_content_list[${index}].keyname`, itemIndex);
			const type = Number(entry.type ?? 0);
			if (![0, 1, 2, 3].includes(type)) {
				throw new NodeOperationError(
					this.getNode(),
					`template_card.horizontal_content_list[${index}].type 仅支持 0、1、2、3`,
					{ itemIndex },
				);
			}
			if (type === 1) ensureHttpUrl(entry.url, `template_card.horizontal_content_list[${index}].url`, itemIndex);
			if (type === 2) requireText(entry.media_id, `template_card.horizontal_content_list[${index}].media_id`, itemIndex);
			if (type === 3) {
				const memberUserid = requireText(
					entry.userid || entry.userid_selected,
					`template_card.horizontal_content_list[${index}].userid`,
					itemIndex,
				);
				entry.userid = memberUserid;
				delete entry.userid_selected;
			}
		});

		const jumpList = asObjectArray(templateCard.jump_list, 'template_card.jump_list', itemIndex);
		if (jumpList.length > 3) {
			throw new NodeOperationError(
				this.getNode(),
				'template_card.jump_list 最多包含 3 项',
				{ itemIndex },
			);
		}
		jumpList.forEach((entry, index) => {
			requireText(entry.title, `template_card.jump_list[${index}].title`, itemIndex);
			validateCardLinkAction(entry, `template_card.jump_list[${index}]`, itemIndex, true);
		});
		validateCardLinkAction(templateCard.card_action, 'template_card.card_action', itemIndex, false);
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
	const compactLinkAction = (value: IDataObject | undefined): IDataObject | undefined => {
		const compacted = compactObject(value);
		if (!compacted) return undefined;
		const type = Number(compacted.type ?? 0);
		if (type !== 1) delete compacted.url;
		if (type !== 2) {
			delete compacted.appid;
			delete compacted.pagepath;
		}
		return compacted;
	};
	const compactHorizontalContent = (value: IDataObject): IDataObject => {
		const compacted = compactObject(value) ?? {};
		const type = Number(compacted.type ?? 0);
		if (type !== 1) delete compacted.url;
		if (type !== 2) delete compacted.media_id;
		if (type !== 3) delete compacted.userid;
		return compacted;
	};

	for (let i = 0; i < items.length; i++) {
		try {
			const credentials = await this.getCredentials('weComWebhookApi');
			const webhookUrl = credentials.webhookUrl as string;

			let body: IDataObject = {};
			let isUploadMedia = false;

			if (operation === 'uploadMedia') {
				// 上传媒体文件操作使用 webhook 凭证中的 key
				isUploadMedia = true;
				let webhookKey: string | null = null;
				try {
					const webhookUrlObject = new URL(webhookUrl);
					webhookKey = webhookUrlObject.searchParams.get('key');
				} catch {
					throw new NodeOperationError(
						this.getNode(),
						'Webhook URL 无效，无法解析 key 参数',
						{ itemIndex: i },
					);
				}

				if (!webhookKey) {
					throw new NodeOperationError(
						this.getNode(),
						'Webhook URL 缺少 key 参数',
						{ itemIndex: i },
					);
				}

				const mediaType = this.getNodeParameter('mediaType', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
				const fileName = (binaryData.fileName || 'file').replace(/[\r\n"]/g, '_');
				const rawContentType = binaryData.mimeType || 'application/octet-stream';
				const contentType = /^[\w.+-]+\/[\w.+-]+$/.test(rawContentType)
					? rawContentType
					: 'application/octet-stream';
				const fileLength = dataBuffer.length;
				if (fileLength <= 5) {
					throw new NodeOperationError(
						this.getNode(),
						'上传文件必须大于 5 字节',
						{ itemIndex: i },
					);
				}
				const maxFileLength = mediaType === 'voice' ? 2 * 1024 * 1024 : 20 * 1024 * 1024;
				if (fileLength > maxFileLength) {
					throw new NodeOperationError(
						this.getNode(),
						`${mediaType === 'voice' ? '语音' : '普通'}文件不能超过 ${mediaType === 'voice' ? '2M' : '20M'}`,
						{ itemIndex: i },
					);
				}
				if (
					mediaType === 'voice' &&
					!fileName.toLowerCase().endsWith('.amr') &&
					!/amr/i.test(contentType)
				) {
					throw new NodeOperationError(
						this.getNode(),
						'语音文件仅支持 AMR 格式',
						{ itemIndex: i },
					);
				}

				// 手动构建 multipart/form-data 请求体
				const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
				const CRLF = '\r\n';

				// 构建 multipart body
				const header = `--${boundary}${CRLF}Content-Disposition: form-data; name="media";filename="${fileName}"; filelength=${fileLength}${CRLF}Content-Type: ${contentType}${CRLF}${CRLF}`;
				const footer = `${CRLF}--${boundary}--${CRLF}`;

				const headerBuffer = Buffer.from(header, 'utf-8');
				const footerBuffer = Buffer.from(footer, 'utf-8');
				const bodyBuffer = Buffer.concat([headerBuffer, dataBuffer, footerBuffer]);

				const baseUrl = await getWeComBaseUrl.call(this, 'weComWebhookApi');
				const uploadUrl = `${baseUrl}${WEBHOOK_UPLOAD_MEDIA_PATH}?key=${webhookKey}&type=${mediaType}`;

				const response = (await this.helpers.httpRequest({
					method: 'POST',
					url: uploadUrl,
					body: bodyBuffer,
					headers: {
						'Content-Type': `multipart/form-data; boundary=${boundary}`,
						'Content-Length': bodyBuffer.length.toString(),
					},
				})) as IDataObject;

				if (response.errcode !== undefined && Number(response.errcode) !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`上传媒体文件失败: ${response.errmsg} (错误码: ${response.errcode})`,
						{ itemIndex: i },
					);
				}

				returnData.push({
					json: response,
					pairedItem: { item: i },
				});

			} else if (operation === 'sendText') {
				// 发送文本消息
				const content = ensureByteLength(
					this.getNodeParameter('content', i),
					'消息内容',
					2048,
					i,
				);
				const mentionedList = this.getNodeParameter('mentionedList', i, '') as string;
				const mentionedMobileList = this.getNodeParameter('mentionedMobileList', i, '') as string;

				const textBody: IDataObject = {
					content,
				};

				// 处理 mentioned_list
				if (mentionedList.trim()) {
					const mentioned = normalizeDelimitedList(mentionedList);
					if (mentioned.length > 0) {
						textBody.mentioned_list = mentioned;
					}
				}

				// 处理 mentioned_mobile_list
				if (mentionedMobileList.trim()) {
					const mentionedMobile = normalizeDelimitedList(mentionedMobileList);
					if (mentionedMobile.length > 0) {
						textBody.mentioned_mobile_list = mentionedMobile;
					}
				}

				body = {
					msgtype: 'text',
					text: textBody,
				};

			} else if (operation === 'sendMarkdown') {
				// 发送 Markdown 消息
				const content = ensureByteLength(
					this.getNodeParameter('content', i),
					'Markdown 内容',
					4096,
					i,
				);

				body = {
					msgtype: 'markdown',
					markdown: {
						content,
					},
				};

			} else if (operation === 'sendImage') {
				// 发送图片消息
				const imageSource = this.getNodeParameter('imageSource', i) as string;
				let base64: string;
				let md5: string;

				if (imageSource === 'binary') {
					const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;
					this.helpers.assertBinaryData(i, binaryPropertyName);
					const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					if (dataBuffer.length > 2 * 1024 * 1024) {
						throw new NodeOperationError(this.getNode(), '图片不能超过 2M', { itemIndex: i });
					}
					const isPng = dataBuffer.subarray(0, 8).equals(
						Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
					);
					const isJpeg = dataBuffer.length >= 3 &&
						dataBuffer[0] === 0xff && dataBuffer[1] === 0xd8 && dataBuffer[2] === 0xff;
					if (!isPng && !isJpeg) {
						throw new NodeOperationError(this.getNode(), '图片仅支持 JPG 或 PNG 格式', { itemIndex: i });
					}
					base64 = dataBuffer.toString('base64');
					md5 = createHash('md5').update(dataBuffer).digest('hex');
				} else {
					base64 = (this.getNodeParameter('base64', i) as string).replace(/\s+/g, '');
					md5 = (this.getNodeParameter('md5', i) as string).trim().toLowerCase();
					if (!base64 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(base64)) {
						throw new NodeOperationError(this.getNode(), 'Base64 图片格式无效', { itemIndex: i });
					}
					const imageBuffer = Buffer.from(base64, 'base64');
					if (imageBuffer.length > 2 * 1024 * 1024) {
						throw new NodeOperationError(this.getNode(), '图片不能超过 2M', { itemIndex: i });
					}
					const isPng = imageBuffer.subarray(0, 8).equals(
						Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
					);
					const isJpeg = imageBuffer.length >= 3 &&
						imageBuffer[0] === 0xff && imageBuffer[1] === 0xd8 && imageBuffer[2] === 0xff;
					if (!isPng && !isJpeg) {
						throw new NodeOperationError(this.getNode(), '图片仅支持 JPG 或 PNG 格式', { itemIndex: i });
					}
					if (!/^[a-f0-9]{32}$/.test(md5)) {
						throw new NodeOperationError(this.getNode(), 'MD5 值必须是 32 位十六进制字符串', { itemIndex: i });
					}
					const computedMd5 = createHash('md5').update(imageBuffer).digest('hex');
					if (computedMd5 !== md5) {
						throw new NodeOperationError(this.getNode(), 'MD5 值与图片内容不匹配', { itemIndex: i });
					}
				}

				body = {
					msgtype: 'image',
					image: {
						base64,
						md5,
					},
				};

			} else if (operation === 'sendNews') {
				// 发送图文消息
				const newsInputMode = this.getNodeParameter('news_input_mode', i, 'form') as string;
				const newsJson = newsInputMode === 'json'
					? parseOptionalJsonParameter(
						this.getNodeParameter('news_json', i, '[]') as string,
						'news_json',
						i,
					)
					: undefined;
				const articlesData = newsInputMode === 'form'
					? this.getNodeParameter('articles', i, {}) as IDataObject
					: {};
				let articles: IDataObject[] = [];

				if (newsInputMode === 'json') {
					if (!newsJson) {
						throw new NodeOperationError(
							this.getNode(),
							'请选择 JSON 输入并提供 news_json',
							{ itemIndex: i },
						);
					}
					if (Array.isArray(newsJson)) {
						articles = newsJson as IDataObject[];
					} else if ((newsJson as IDataObject).news) {
						const newsPayload = (newsJson as IDataObject).news as IDataObject;
						if (!Array.isArray(newsPayload.articles)) {
							throw new NodeOperationError(
								this.getNode(),
								'news_json.news 必须包含 articles 数组',
								{ itemIndex: i },
							);
						}
						articles = newsPayload.articles as IDataObject[];
					} else if (Array.isArray((newsJson as IDataObject).articles)) {
						articles = (newsJson as IDataObject).articles as IDataObject[];
					} else {
						throw new NodeOperationError(
							this.getNode(),
							'news_json 必须是图文数组或包含 articles 的对象',
							{ itemIndex: i },
						);
					}
				} else {
					articles = (articlesData.article as IDataObject[]) || [];
				}
				if (articles.length < 1 || articles.length > 8) {
					throw new NodeOperationError(
						this.getNode(),
						'图文列表必须包含 1 到 8 条图文',
						{ itemIndex: i },
					);
				}
				const normalizedArticles = articles.map((article, articleIndex) => {
					if (!article || typeof article !== 'object' || Array.isArray(article)) {
						throw new NodeOperationError(
							this.getNode(),
							`第 ${articleIndex + 1} 条图文必须是对象`,
							{ itemIndex: i },
						);
					}
					const title = ensureByteLength(article.title, `第 ${articleIndex + 1} 条图文标题`, 128, i);
					const url = ensureHttpUrl(article.url, `第 ${articleIndex + 1} 条图文跳转链接`, i);
					const description = ensureOptionalByteLength(
						article.description,
						`第 ${articleIndex + 1} 条图文描述`,
						512,
						i,
					);
					const picurl = String(article.picurl ?? '').trim();
					const normalized: IDataObject = { title, url };
					if (description) normalized.description = description;
					if (picurl) normalized.picurl = ensureHttpUrl(picurl, `第 ${articleIndex + 1} 条图文图片链接`, i);
					return normalized;
				});

				body = {
					msgtype: 'news',
					news: {
						articles: normalizedArticles,
					},
				};

			} else if (operation === 'sendMarkdownV2') {
				// 发送 Markdown V2 消息
				const content = ensureByteLength(
					this.getNodeParameter('content', i),
					'Markdown V2 内容',
					4096,
					i,
				);

				body = {
					msgtype: 'markdown_v2',
					markdown_v2: {
						content,
					},
				};

			} else if (operation === 'sendFile') {
				// 发送文件消息
				const mediaId = requireText(this.getNodeParameter('mediaId', i), 'Media ID', i);

				body = {
					msgtype: 'file',
					file: {
						media_id: mediaId,
					},
				};

			} else if (operation === 'sendVoice') {
				// 发送语音消息
				const mediaId = requireText(this.getNodeParameter('mediaId', i), 'Media ID', i);

				body = {
					msgtype: 'voice',
					voice: {
						media_id: mediaId,
					},
				};

			} else if (operation === 'sendTemplateCard') {
				// 发送模板卡片消息
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
				let templateCard: IDataObject;

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
					const jsonObject = templateCardJson as IDataObject;
					templateCard = jsonObject.template_card === undefined
						? jsonObject
						: asObject(jsonObject.template_card, 'template_card_json.template_card', i, true)!;
				} else {
					const cardType = this.getNodeParameter('cardType', i) as string;
					templateCard = {
						card_type: cardType,
					};

					const sourceData = this.getNodeParameter('source', i, {}) as IDataObject;
					const source = compactObject(sourceData.sourceValue as IDataObject | undefined);
					if (source) templateCard.source = source;

					const mainTitleData = this.getNodeParameter('mainTitle', i, {}) as IDataObject;
					templateCard.main_title = compactObject(
						mainTitleData.mainTitleValue as IDataObject | undefined,
					) ?? {};

					if (cardType === 'text_notice') {
						const emphasisData = this.getNodeParameter('emphasisContent', i, {}) as IDataObject;
						const emphasis = compactObject(emphasisData.emphasisValue as IDataObject | undefined);
						if (emphasis) templateCard.emphasis_content = emphasis;
						const subTitleText = (this.getNodeParameter('subTitleText', i, '') as string).trim();
						if (subTitleText) templateCard.sub_title_text = subTitleText;
					}

					if (cardType === 'news_notice') {
						const cardImageData = this.getNodeParameter('cardImage', i, {}) as IDataObject;
						templateCard.card_image = compactObject(
							cardImageData.cardImageValue as IDataObject | undefined,
						) ?? {};
						const imageTextData = this.getNodeParameter('imageTextArea', i, {}) as IDataObject;
						const imageTextArea = compactLinkAction(
							imageTextData.imageTextValue as IDataObject | undefined,
						);
						if (imageTextArea) templateCard.image_text_area = imageTextArea;
						const verticalData = this.getNodeParameter('verticalContentList', i, {}) as IDataObject;
						if (Array.isArray(verticalData.item) && verticalData.item.length) {
							templateCard.vertical_content_list = verticalData.item.map(
								(entry) => compactObject(entry as IDataObject) ?? {},
							);
						}
					}

					const quoteData = this.getNodeParameter('quoteArea', i, {}) as IDataObject;
					const quoteArea = compactLinkAction(quoteData.quoteValue as IDataObject | undefined);
					if (quoteArea) templateCard.quote_area = quoteArea;

					const horizontalData = this.getNodeParameter('horizontalContentList', i, {}) as IDataObject;
					if (Array.isArray(horizontalData.item) && horizontalData.item.length) {
						templateCard.horizontal_content_list = horizontalData.item.map(
							(entry) => compactHorizontalContent(entry as IDataObject),
						);
					}

					const jumpListData = this.getNodeParameter('jumpList', i, {}) as IDataObject;
					if (Array.isArray(jumpListData.jump) && jumpListData.jump.length) {
						templateCard.jump_list = jumpListData.jump.map(
							(entry) => compactLinkAction(entry as IDataObject) ?? {},
						);
					}

					const cardActionData = this.getNodeParameter('cardAction', i, {}) as IDataObject;
					const cardAction = compactLinkAction(cardActionData.actionValue as IDataObject | undefined);
					if (cardAction) templateCard.card_action = cardAction;
				}
				validateTemplateCard(templateCard, i);

				body = {
					msgtype: 'template_card',
					template_card: templateCard,
				};

			} else if (!isUploadMedia) {
				throw new NodeOperationError(
					this.getNode(),
					`不支持的操作: ${operation}`,
					{ itemIndex: i },
				);
			}

			if (!isUploadMedia) {
				// 官方路径: /cgi-bin/webhook/send?key=KEY
				let sendUrl = webhookUrl;
				if (!sendUrl.includes(WEBHOOK_SEND_PATH)) {
					// 若凭证只配了 key，拼官方 send 地址
					try {
						const u = new URL(webhookUrl);
						const key = u.searchParams.get('key');
						if (key) {
							sendUrl = `${u.origin}${WEBHOOK_SEND_PATH}?key=${key}`;
						}
					} catch {
						// keep original
					}
				}
				const response = await this.helpers.httpRequest({
					method: 'POST',
					url: sendUrl,
					body,
					json: true,
				}) as IDataObject;
				if (response.errcode !== undefined && Number(response.errcode) !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`发送消息失败: ${String(response.errmsg ?? '未知错误')} (错误码: ${String(response.errcode)})`,
						{ itemIndex: i },
					);
				}

				returnData.push({
					json: response,
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
