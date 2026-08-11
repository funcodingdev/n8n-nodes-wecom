import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getAccessToken, getWeComBaseUrl, weComApiRequest } from '../../shared/transport';

// 辅助函数：从字段值对象中提取实际值
function extractFieldValue(cv: IDataObject): string | number | boolean {
	const valueType = cv.value_type as string;

	switch (valueType) {
		case 'text': {
			// 文本类型 - 支持多个文本片段（纯文本和链接）
			const textContentList = cv.text_content_list as IDataObject;
			if (textContentList?.items && Array.isArray(textContentList.items)) {
				return JSON.stringify(
					(textContentList.items as IDataObject[]).map((item: IDataObject) => {
						const result: IDataObject = {
							type: item.type || 'text',
							text: item.text || '',
						};
						if (item.type === 'url' && item.link) {
							result.link = item.link;
						}
						return result;
					}),
				);
			}
			return '[]';
		}

		case 'email':
		case 'phone_number':
		case 'barcode':
			return (cv.simple_text_value as string) || '';

		case 'number':
		case 'progress':
		case 'currency':
		case 'percentage':
			return (cv.number_value as number) || 0;

		case 'checkbox':
			return (cv.checkbox_value as boolean) || false;

		case 'date_time':
			return (cv.date_value as string) || '';

		case 'url': {
			// 链接类型 - 支持多个链接
			const urlList = cv.url_list as IDataObject;
			if (urlList?.items && Array.isArray(urlList.items)) {
				return JSON.stringify(
					(urlList.items as IDataObject[]).map((item: IDataObject) => ({
						link: item.link || '',
						text: item.text || item.link || '',
					})),
				);
			}
			return '[]';
		}

		case 'single_select':
		case 'select': {
			// 选项类型 - 支持多个选项
			const optionList = cv.option_list as IDataObject;
			if (optionList?.items && Array.isArray(optionList.items)) {
				return JSON.stringify(
					(optionList.items as IDataObject[]).map((item: IDataObject) => {
						if (item.mode === 'id') {
							return { id: item.id || '' };
						} else {
							return {
								text: item.text || '',
								style: item.style || 1,
							};
						}
					}),
				);
			}
			return '[]';
		}

		case 'user': {
			// 成员类型 - 支持多个成员
			const userList = cv.user_list as IDataObject;
			if (userList?.items && Array.isArray(userList.items)) {
				return JSON.stringify(
					(userList.items as IDataObject[]).map((item: IDataObject) => ({
						user_id: item.user_id || '',
					})),
				);
			}
			return '[]';
		}

		case 'location': {
			// 地点类型 - 支持多个地点
			const locationList = cv.location_list as IDataObject;
			if (locationList?.items && Array.isArray(locationList.items)) {
				return JSON.stringify(
					(locationList.items as IDataObject[]).map((item: IDataObject) => ({
						source_type: item.source_type || 1,
						id: item.id || '',
						latitude: item.latitude || '',
						longitude: item.longitude || '',
						title: item.title || '',
					})),
				);
			}
			return '[]';
		}

		case 'image': {
			// 图片类型 - 表单输入
			const imageList = cv.image_list as IDataObject;
			if (imageList?.images && Array.isArray(imageList.images)) {
				return JSON.stringify(
					(imageList.images as IDataObject[]).map((img: IDataObject) => ({
						id: img.id || '',
						title: img.title || '',
						image_url: img.image_url || '',
						width: img.width || 0,
						height: img.height || 0,
					})),
				);
			}
			return '[]';
		}

		case 'attachment': {
			// 文件类型 - 表单输入
			const attachmentList = cv.attachment_list as IDataObject;
			if (attachmentList?.attachments && Array.isArray(attachmentList.attachments)) {
				return JSON.stringify(
					(attachmentList.attachments as IDataObject[]).map((att: IDataObject) => {
						const docType = att.doc_type as string;
						let fileType = '';
						let fileExt = '';
						let docTypeNum = 2; // 默认为文件

						// 判断是文件夹还是文件
						if (docType === 'folder') {
							// 文件夹
							fileType = 'Folder';
							fileExt = '';
							docTypeNum = 1;
						} else {
							// 文件 - 根据子类型映射
							docTypeNum = 2;
							const subtype = att.file_subtype as string;

							switch (subtype) {
								case 'smartsheet':
									fileType = '70';
									fileExt = 'SMARTSHEET';
									break;
								case 'doc':
									fileType = '50';
									fileExt = 'DOC';
									break;
								case 'sheet':
									fileType = '51';
									fileExt = 'SHEET';
									break;
								case 'slide':
									fileType = '52';
									fileExt = 'SLIDE';
									break;
								case 'mind':
									fileType = '54';
									fileExt = 'MIND';
									break;
								case 'flowchart':
									fileType = '55';
									fileExt = 'FLOWCHART';
									break;
								case 'form':
									fileType = '30';
									fileExt = 'FORM';
									break;
								case 'wedrive':
									fileType = 'Wedrive';
									fileExt = (att.file_ext_custom as string) || '';
									break;
								default:
									fileType = '';
									fileExt = '';
							}
						}

						return {
							file_id: att.file_id || '',
							name: att.name || '',
							file_url: att.file_url || '',
							file_type: fileType,
							file_ext: fileExt,
							doc_type: docTypeNum,
							size: att.size || 0,
						};
					}),
				);
			}
			return '[]';
		}

		default:
			// 默认返回空字符串
			return '';
	}
}

// 辅助函数：构建单元格值 (返回数组格式)
function buildCellValue(valueType: string, value: string): IDataObject[] {
	let cellValueItem: IDataObject;

	switch (valueType) {
		case 'text':
			// 文本类型
			try {
				if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
					const parsed = JSON.parse(value);
					if (Array.isArray(parsed)) {
						// 数组格式：[{"type": "text", "text": "..."}, {"type": "url", "text": "...", "link": "..."}]
						return parsed as IDataObject[];
					} else if (parsed.type && parsed.text !== undefined) {
						// 单个对象格式：{"type": "text", "text": "..."} 或 {"type": "url", "text": "...", "link": "..."}
						return [parsed] as IDataObject[];
					}
				}
			} catch {
				// JSON解析失败，使用简单文本格式
			}
			// 简单文本格式
			cellValueItem = { type: 'text', text: value };
			break;

		case 'number':
			// 数字类型
			cellValueItem = { type: 'double', number: parseFloat(value) || 0 };
			break;

		case 'checkbox':
			// 复选框类型
			cellValueItem = {
				type: 'checkbox',
				checkbox: value.toLowerCase() === 'true' || value === '1',
			};
			break;

		case 'date_time':
			// 日期类型 - 以毫秒为单位的unix时间戳
			cellValueItem = { type: 'date_time', date_time: value };
			break;

		case 'url':
			// 链接类型 - 支持JSON数组格式或对象格式
			try {
				if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
					const parsed = JSON.parse(value);
					if (Array.isArray(parsed)) {
						// 数组格式：[{"link": "...", "text": "..."}]
						return parsed.map((item: IDataObject) => ({
							type: 'url',
							text: item.text || item.link || '',
							link: item.link || '',
						})) as IDataObject[];
					} else if (parsed.link) {
						// 单个对象格式：{"link": "...", "text": "..."}
						cellValueItem = {
							type: 'url',
							text: parsed.text || parsed.link || '',
							link: parsed.link || '',
						};
						break;
					}
				}
			} catch {
				// JSON解析失败，使用简单文本格式
			}
			// 简单字符串格式：直接使用value作为link和text
			cellValueItem = { type: 'url', text: value, link: value };
			break;

		case 'email':
			// 邮箱类型
			cellValueItem = { type: 'email', email: value };
			break;

		case 'phone_number':
			// 电话类型
			cellValueItem = { type: 'phone_number', phone_number: value };
			break;

		case 'single_select':
		case 'select':
			// 单选/多选类型 - 支持JSON数组格式
			try {
				const parsed = typeof value === 'string' ? JSON.parse(value) : value;
				if (Array.isArray(parsed)) {
					// 数组格式：[{"id": "..."}, ...] 或 [{"text": "...", "style": 1}, ...]
					return parsed.map((item: IDataObject) => {
						const option: IDataObject = {};
						if (item.id) {
							option.id = item.id;
						}
						if (item.style !== undefined) {
							option.style = item.style;
						}
						if (item.text) {
							option.text = item.text;
						}
						return { type: valueType, [valueType]: option };
					}) as IDataObject[];
				} else {
					// 单个对象格式：{"id": "..."} 或 {"text": "...", "style": 1}
					const option: IDataObject = {};
					if (parsed.id) {
						option.id = parsed.id;
					}
					if (parsed.style !== undefined) {
						option.style = parsed.style;
					}
					if (parsed.text) {
						option.text = parsed.text;
					}
					cellValueItem = { type: valueType, [valueType]: option };
				}
			} catch (error) {
				throw new Error(`${valueType}类型值格式错误，请提供有效的JSON格式: ${error.message}`);
			}
			break;

		case 'progress':
			// 进度类型 (0-1之间的数值)
			cellValueItem = { type: 'double', progress: parseFloat(value) || 0 };
			break;

		case 'currency':
			// 货币类型
			cellValueItem = { type: 'double', currency: parseFloat(value) || 0 };
			break;

		case 'percentage':
			// 百分数类型
			cellValueItem = { type: 'double', percentage: parseFloat(value) || 0 };
			break;

		case 'barcode':
			// 条码类型
			cellValueItem = { type: 'barcode', barcode: value };
			break;

		case 'location':
			// 地理位置类型 - 支持JSON数组格式
			try {
				const parsed = typeof value === 'string' ? JSON.parse(value) : value;

				const processLocation = (item: IDataObject) => {
					// 必填字段验证
					if (!item.id) {
						throw new Error('地点类型缺少必填字段: id');
					}
					if (!item.latitude) {
						throw new Error('地点类型缺少必填字段: latitude');
					}
					if (!item.longitude) {
						throw new Error('地点类型缺少必填字段: longitude');
					}
					if (!item.title) {
						throw new Error('地点类型缺少必填字段: title');
					}

					const location: IDataObject = {
						id: item.id,
						latitude: item.latitude,
						longitude: item.longitude,
						source_type: item.source_type || 1,
						title: item.title,
					};

					return { type: 'location', location };
				};

				if (Array.isArray(parsed)) {
					// 数组格式：[{"id": "...", "title": "...", ...}]
					return parsed.map(processLocation) as IDataObject[];
				} else {
					// 单个对象格式：{"id": "...", "title": "...", ...}
					cellValueItem = processLocation(parsed);
				}
			} catch (error) {
				throw new Error(`地点类型值格式错误: ${error.message}`);
			}
			break;

		case 'image':
			// 图片类型 - 支持JSON数组或单个对象格式
			try {
				const imageData = typeof value === 'string' ? JSON.parse(value) : value;
				if (Array.isArray(imageData)) {
					cellValueItem = { type: 'image', image: imageData };
				} else if (imageData.image_url) {
					// 单个对象格式：包装成数组
					cellValueItem = { type: 'image', image: [imageData] };
				} else {
					throw new Error('图片类型需要数组格式或包含image_url的对象');
				}
			} catch (error) {
				throw new Error(`图片类型值格式错误: ${error.message}`);
			}
			break;

		case 'attachment':
			// 文件类型 - 支持JSON数组或单个对象格式
			try {
				const attachmentData = typeof value === 'string' ? JSON.parse(value) : value;
				if (Array.isArray(attachmentData)) {
					cellValueItem = { type: 'attachment', attachment: attachmentData };
				} else if (attachmentData.file_id) {
					// 单个对象格式：包装成数组
					cellValueItem = { type: 'attachment', attachment: [attachmentData] };
				} else {
					throw new Error('文件类型需要数组格式或包含file_id的对象');
				}
			} catch (error) {
				throw new Error(`文件类型值格式错误: ${error.message}`);
			}
			break;

		case 'user': {
			// 成员类型 - 支持多种格式
			try {
				let userData: IDataObject[];

				if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
					// JSON格式
					const parsed = JSON.parse(value);
					if (Array.isArray(parsed)) {
						// 数组格式：[{"user_id": "userid1"}, {"user_id": "userid2"}]
						userData = parsed;
					} else if (parsed.user_id) {
						// 单个对象格式：{"user_id": "userid1"}
						userData = [parsed];
					} else {
						throw new Error('成员对象必须包含 user_id 字段');
					}
				} else {
					// 简单字符串格式：直接作为user_id
					userData = [{ user_id: value }];
				}

				cellValueItem = { type: 'user', user: userData };
			} catch (error) {
				throw new Error(`成员类型值格式错误: ${error.message}`);
			}
			break;
		}

		default:
			// 默认为文本类型
			cellValueItem = { type: 'text', text: value };
			break;
	}

	// 根据文档，值应该是数组格式
	return [cellValueItem];
}

// 辅助函数：将值类型（如 'text'）映射到字段类型（如 'FIELD_TYPE_TEXT'）
function mapValueTypeToFieldType(valueType: string): string {
	const valueTypeToFieldTypeMap: IDataObject = {
		text: 'FIELD_TYPE_TEXT',
		number: 'FIELD_TYPE_NUMBER',
		checkbox: 'FIELD_TYPE_CHECKBOX',
		date_time: 'FIELD_TYPE_DATE_TIME',
		image: 'FIELD_TYPE_IMAGE',
		attachment: 'FIELD_TYPE_ATTACHMENT',
		user: 'FIELD_TYPE_USER',
		url: 'FIELD_TYPE_URL',
		select: 'FIELD_TYPE_SELECT',
		multi_select: 'FIELD_TYPE_SELECT',
		single_select: 'FIELD_TYPE_SINGLE_SELECT',
		progress: 'FIELD_TYPE_PROGRESS',
		phone_number: 'FIELD_TYPE_PHONE_NUMBER',
		email: 'FIELD_TYPE_EMAIL',
		location: 'FIELD_TYPE_LOCATION',
		currency: 'FIELD_TYPE_CURRENCY',
		percentage: 'FIELD_TYPE_PERCENTAGE',
		barcode: 'FIELD_TYPE_BARCODE',
	};

	// 如果已经是字段类型格式，直接返回
	if (valueType.startsWith('FIELD_TYPE_')) {
		return valueType;
	}

	// 否则映射到字段类型
	return (valueTypeToFieldTypeMap[valueType.toLowerCase()] as string) || valueType.toUpperCase();
}

// 辅助函数：根据字段类型构建单元格值
// 将字段类型（如 FIELD_TYPE_TEXT）映射到内部值类型（如 text），并构建正确的数据结构
function buildCellValueByFieldType(
	fieldType: string,
	rawValue: string | number | boolean,
): string | number | boolean | IDataObject[] {
	// 将字段类型转换为内部值类型
	const valueTypeMap: IDataObject = {
		FIELD_TYPE_TEXT: 'text',
		FIELD_TYPE_NUMBER: 'number',
		FIELD_TYPE_CHECKBOX: 'checkbox',
		FIELD_TYPE_DATE_TIME: 'date_time',
		FIELD_TYPE_IMAGE: 'image',
		FIELD_TYPE_ATTACHMENT: 'attachment',
		FIELD_TYPE_USER: 'user',
		FIELD_TYPE_URL: 'url',
		FIELD_TYPE_SELECT: 'select',
		FIELD_TYPE_MULTI_SELECT: 'select',
		FIELD_TYPE_PROGRESS: 'progress',
		FIELD_TYPE_PHONE_NUMBER: 'phone_number',
		FIELD_TYPE_EMAIL: 'email',
		FIELD_TYPE_SINGLE_SELECT: 'single_select',
		FIELD_TYPE_LOCATION: 'location',
		FIELD_TYPE_CURRENCY: 'currency',
		FIELD_TYPE_PERCENTAGE: 'percentage',
		FIELD_TYPE_BARCODE: 'barcode',
	};

	// 根据字段类型返回正确的数据结构
	switch (fieldType) {
		case 'FIELD_TYPE_TEXT':
			// 文本类型：Object[](CellTextValue)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					if (Array.isArray(parsed)) {
						return parsed;
					}
					if (parsed && typeof parsed === 'object' && parsed.type) {
						return [parsed];
					}
				} catch {
					// 不是JSON，作为简单文本处理
				}
				return [{ type: 'text', text: rawValue }];
			}
			return [{ type: 'text', text: String(rawValue) }];

		case 'FIELD_TYPE_NUMBER':
		case 'FIELD_TYPE_PROGRESS':
		case 'FIELD_TYPE_CURRENCY':
		case 'FIELD_TYPE_PERCENTAGE':
			// 数字类型：double
			return typeof rawValue === 'number' ? rawValue : parseFloat(String(rawValue)) || 0;

		case 'FIELD_TYPE_CHECKBOX':
			// 复选框类型：bool
			if (typeof rawValue === 'boolean') {
				return rawValue;
			}
			return String(rawValue).toLowerCase() === 'true' || rawValue === 1 || rawValue === '1';

		case 'FIELD_TYPE_DATE_TIME':
			// 日期类型：string(毫秒unix时间戳)
			return String(rawValue);

		case 'FIELD_TYPE_IMAGE':
			// 图片类型：Object[](CellImageValue)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					return Array.isArray(parsed) ? parsed : [parsed];
				} catch {
					throw new Error('图片类型值必须是有效的JSON数组格式');
				}
			}
			if (Array.isArray(rawValue)) {
				return rawValue;
			}
			// extractFieldValue 对于图片类型应该返回字符串，如果不是则抛出错误
			throw new Error('图片类型值格式错误：期望字符串格式的JSON');

		case 'FIELD_TYPE_ATTACHMENT':
			// 文件类型：Object[](CellAttachmentValue)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					return Array.isArray(parsed) ? parsed : [parsed];
				} catch {
					throw new Error('文件类型值必须是有效的JSON数组格式');
				}
			}
			if (Array.isArray(rawValue)) {
				return rawValue;
			}
			// extractFieldValue 对于文件类型应该返回字符串，如果不是则抛出错误
			throw new Error('文件类型值格式错误：期望字符串格式的JSON');

		case 'FIELD_TYPE_USER':
			// 成员类型：Object[](CellUserValue)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					if (Array.isArray(parsed)) {
						return parsed.map((item: IDataObject) => ({
							user_id: item.user_id || String(item),
						}));
					}
					if (parsed && typeof parsed === 'object' && parsed.user_id) {
						return [parsed];
					}
				} catch {
					// 不是JSON，作为user_id字符串处理
				}
				return [{ user_id: String(rawValue) }];
			}
			return Array.isArray(rawValue)
				? rawValue.map((item: IDataObject) => ({
						user_id: typeof item === 'object' && item.user_id ? String(item.user_id) : String(item),
					}))
				: [{ user_id: String(rawValue) }];

		case 'FIELD_TYPE_URL':
			// 链接类型：Object[](CellUrlValue)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					if (Array.isArray(parsed)) {
						return parsed.map((item: IDataObject) => ({
							type: 'url',
							text: item.text || item.link || '',
							link: item.link || '',
						}));
					}
					if (parsed && typeof parsed === 'object' && parsed.link) {
						return [
							{
								type: 'url',
								text: parsed.text || parsed.link || '',
								link: parsed.link || '',
							},
						];
					}
				} catch {
					// 不是JSON，作为链接URL处理
				}
				return [{ type: 'url', text: String(rawValue), link: String(rawValue) }];
			}
			return [{ type: 'url', text: String(rawValue), link: String(rawValue) }];

		case 'FIELD_TYPE_SELECT':
		case 'FIELD_TYPE_MULTI_SELECT':
		case 'FIELD_TYPE_SINGLE_SELECT':
			// 单选/多选类型：Object[](Option)
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					return Array.isArray(parsed) ? parsed : [parsed];
				} catch {
					throw new Error('选项类型值必须是有效的JSON数组格式');
				}
			}
			if (Array.isArray(rawValue)) {
				return rawValue;
			}
			// extractFieldValue 对于选项类型应该返回字符串，如果不是则抛出错误
			throw new Error('选项类型值格式错误：期望字符串格式的JSON');

		case 'FIELD_TYPE_PHONE_NUMBER':
		case 'FIELD_TYPE_EMAIL':
		case 'FIELD_TYPE_BARCODE':
			// 电话/邮箱/条码类型：string
			return String(rawValue);

		case 'FIELD_TYPE_LOCATION':
			// 地理位置类型：Object[](CellLocationValue)，长度不大于1的数组
			if (typeof rawValue === 'string') {
				try {
					const parsed = JSON.parse(rawValue);
					const location = Array.isArray(parsed) ? parsed[0] : parsed;
					if (!location || typeof location !== 'object') {
						throw new Error('地理位置类型值格式错误');
					}
					return [
						{
							source_type: location.source_type || 1,
							id: location.id || '',
							latitude: String(location.latitude || ''),
							longitude: String(location.longitude || ''),
							title: location.title || '',
						},
					];
				} catch (error) {
					throw new Error(
						`地理位置类型值格式错误: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
			}
			if (Array.isArray(rawValue) && rawValue.length > 0) {
				const location = rawValue[0];
				return [
					{
						source_type: location.source_type || 1,
						id: location.id || '',
						latitude: String(location.latitude || ''),
						longitude: String(location.longitude || ''),
						title: location.title || '',
					},
				];
			}
			throw new Error('地理位置类型值格式错误');

		default: {
			// 如果字段类型不在映射中，尝试使用buildCellValue函数
			const mappedValueType = valueTypeMap[fieldType] as string;
			if (mappedValueType) {
				return buildCellValue(mappedValueType, String(rawValue));
			}
			// 如果无法映射，返回原始值的字符串形式
			return String(rawValue);
		}
	}
}

// 辅助函数：构建成员信息
function buildMemberInfo(member: IDataObject): IDataObject {
	const info: IDataObject = { type: member.type };
	if (member.type === 1) {
		info.userid = member.userid;
	} else if (member.type === 2) {
		info.departmentid = member.departmentid;
	}
	if (member.auth !== undefined) {
		info.auth = member.auth;
	}
	return info;
}

export async function executeWedoc(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const parseRequiredJsonObject = (
		value: unknown,
		parameterName: string,
		itemIndex: number,
	): IDataObject => {
		if (value === undefined || value === null) {
			throw new NodeOperationError(this.getNode(), `${parameterName} 不能为空`, { itemIndex });
		}

		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed) {
				throw new NodeOperationError(this.getNode(), `${parameterName} 不能为空`, {
					itemIndex,
				});
			}

			try {
				const parsed = JSON.parse(trimmed) as unknown;
				if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object') {
					throw new NodeOperationError(this.getNode(), `${parameterName} 必须是 JSON 对象`, {
						itemIndex,
					});
				}
				return parsed as IDataObject;
			} catch (error) {
				if (error instanceof NodeOperationError) {
					throw error;
				}
				throw new NodeOperationError(
					this.getNode(),
					`${parameterName} 必须是有效的 JSON: ${(error as Error).message}`,
					{ itemIndex },
				);
			}
		}

		if (Array.isArray(value) || typeof value !== 'object') {
			throw new NodeOperationError(this.getNode(), `${parameterName} 必须是 JSON 对象`, {
				itemIndex,
			});
		}

		return value as IDataObject;
	};

	for (let i = 0; i < items.length; i++)
		try {
			let response: IDataObject;

			// 管理文档
			if (operation === 'createDoc') {
				const doc_type = this.getNodeParameter('doctype', i) as number;
				const doc_name = this.getNodeParameter('doc_name', i) as string;
				const useSpaceId = this.getNodeParameter('useSpaceId', i, false) as boolean;

				const body: IDataObject = { doc_type, doc_name };

				// 处理管理员用户列表 (multiOptions类型,返回string[])
				const adminUsersParam = this.getNodeParameter('admin_users', i, []) as string | string[];
				if (adminUsersParam) {
					const adminUsers = Array.isArray(adminUsersParam)
						? (adminUsersParam as string[]).map((id) => id.trim()).filter((id) => id)
						: (adminUsersParam as string)
								.split(',')
								.map((id) => id.trim())
								.filter((id) => id);

					if (adminUsers.length > 0) {
						body.admin_users = adminUsers;
					}
				}

				if (useSpaceId) {
					const spaceid = this.getNodeParameter('spaceid', i) as string;
					const fatherid = this.getNodeParameter('fatherid', i) as string;
					body.spaceid = spaceid;
					body.fatherid = fatherid;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/create_doc', body);
			} else if (operation === 'renameDoc') {
				const new_name = this.getNodeParameter('new_name', i) as string;
				const docType = this.getNodeParameter('docType', i, 'docid') as string;
				const request: IDataObject = { new_name };

				if (docType === 'formid') {
					request.formid = this.getNodeParameter('formid', i) as string;
				} else {
					request.docid = this.getNodeParameter('docid', i) as string;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/rename_doc', request);
			} else if (operation === 'deleteDoc') {
				const docType = this.getNodeParameter('docType', i, 'docid') as string;
				const request: IDataObject = {};

				if (docType === 'formid') {
					request.formid = this.getNodeParameter('formid', i) as string;
				} else {
					request.docid = this.getNodeParameter('docid', i) as string;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/del_doc', request);
			} else if (operation === 'getDocInfo') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_doc_base_info', {
					docid,
				});
			}
			// 分享文档
			else if (operation === 'shareDoc') {
				const docType = this.getNodeParameter('docType', i, 'docid') as string;
				const request: IDataObject = {};

				if (docType === 'formid') {
					request.formid = this.getNodeParameter('formid', i) as string;
				} else {
					request.docid = this.getNodeParameter('docid', i) as string;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/doc_share', request);
			}
			// 编辑文档
			else if (operation === 'modDocContent') {
				const docid = this.getNodeParameter('docid', i) as string;
				const version = this.getNodeParameter('version', i, 0) as number;
				const requestsCollection = this.getNodeParameter(
					'requestsCollection',
					i,
					{},
				) as IDataObject;

				const requests: IDataObject[] = [];

				if (requestsCollection.requests && Array.isArray(requestsCollection.requests)) {
					for (const req of requestsCollection.requests as IDataObject[]) {
						const request: IDataObject = {};

						if (req.request_type === 'insert_text') {
							request.insert_text = {
								text: req.text || '',
								location: { index: req.location_index || 0 },
							};
						} else if (req.request_type === 'insert_paragraph') {
							request.insert_paragraph = {
								location: { index: req.location_index || 0 },
							};
						} else if (req.request_type === 'delete_content') {
							request.delete_content = {
								range: {
									start_index: req.delete_start_index || 0,
									length: req.delete_length || 1,
								},
							};
						} else if (req.request_type === 'replace_text') {
							const ranges: IDataObject[] = [];
							if (req.rangesCollection && (req.rangesCollection as IDataObject).ranges) {
								const rangesArray = (req.rangesCollection as IDataObject).ranges as IDataObject[];
								if (Array.isArray(rangesArray)) {
									for (const range of rangesArray) {
										ranges.push({
											start_index: range.start_index || 0,
											length: range.length || 1,
										});
									}
								}
							}
							request.replace_text = {
								text: req.replace_text_value || '',
								ranges,
							};
						} else if (req.request_type === 'insert_image') {
							const insertImage: IDataObject = {
								image_id: req.image_id || '',
								location: { index: req.location_index || 0 },
							};
							if (req.image_width) {
								insertImage.width = req.image_width;
							}
							if (req.image_height) {
								insertImage.height = req.image_height;
							}
							request.insert_image = insertImage;
						} else if (req.request_type === 'insert_page_break') {
							request.insert_page_break = {
								location: { index: req.location_index || 0 },
							};
						} else if (req.request_type === 'insert_table') {
							request.insert_table = {
								rows: req.table_rows || 2,
								cols: req.table_cols || 2,
								location: { index: req.location_index || 0 },
							};
						} else if (req.request_type === 'update_text_property') {
							const ranges: IDataObject[] = [];
							if (req.rangesCollection && (req.rangesCollection as IDataObject).ranges) {
								const rangesArray = (req.rangesCollection as IDataObject).ranges as IDataObject[];
								if (Array.isArray(rangesArray)) {
									for (const range of rangesArray) {
										ranges.push({
											start_index: range.start_index || 0,
											length: range.length || 1,
										});
									}
								}
							}
							const textProperty: IDataObject = {};
							if (
								req.textPropertyCollection &&
								(req.textPropertyCollection as IDataObject).text_property
							) {
								const prop = (req.textPropertyCollection as IDataObject)
									.text_property as IDataObject;
								if (prop.bold !== undefined) {
									textProperty.bold = prop.bold;
								}
								if (prop.color) {
									textProperty.color = prop.color;
								}
								if (prop.background_color) {
									textProperty.background_color = prop.background_color;
								}
							}
							request.update_text_property = {
								text_property: textProperty,
								ranges,
							};
						}

						if (Object.keys(request).length > 0) {
							requests.push(request);
						}
					}
				}

				const body: IDataObject = {
					docid,
					requests,
				};
				if (version > 0) {
					body.version = version;
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/document/batch_update',
					body,
				);
			} else if (operation === 'modSheetContent') {
				const docid = this.getNodeParameter('docid', i) as string;
				const requestsCollection = this.getNodeParameter(
					'requestsCollection',
					i,
					{},
				) as IDataObject;

				const requests: IDataObject[] = [];

				if (requestsCollection.requests && Array.isArray(requestsCollection.requests)) {
					for (const req of requestsCollection.requests as IDataObject[]) {
						const request: IDataObject = {};

						if (req.request_type === 'add_sheet') {
							request.add_sheet_request = {
								title: req.title || '',
								row_count: req.add_sheet_row_count || 10,
								column_count: req.add_sheet_column_count || 10,
							};
						} else if (req.request_type === 'delete_sheet') {
							request.delete_sheet_request = {
								sheet_id: req.sheet_id || '',
							};
						} else if (req.request_type === 'update_range') {
							const valuesStr = (req.values as string) || '';
							const rows = valuesStr
								.split(';')
								.map((row) => row.split(',').map((cell) => cell.trim()))
								.filter((row) => row.length > 0);

							const gridData: IDataObject = {
								start_row: req.start_row || 1,
								start_column: req.start_column || 1,
								row_count: req.row_count || 1,
								column_count: req.column_count || 1,
							};

							if (rows.length > 0) {
								gridData.values = rows;
							}

							request.update_range_request = {
								sheet_id: req.sheet_id || '',
								grid_data: gridData,
							};
						} else if (req.request_type === 'delete_dimension') {
							request.delete_dimension_request = {
								sheet_id: req.sheet_id || '',
								dimension: req.dimension || 'ROW',
								start_index: req.start_index || 1,
								end_index: req.end_index || 2,
							};
						}

						if (Object.keys(request).length > 0) {
							requests.push(request);
						}
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/spreadsheet/batch_update',
					{
						docid,
						requests,
					},
				);
			}
			// 智能表格操作 - 子表
			else if (operation === 'addSmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;
				const formSetting = this.getNodeParameter('formSetting', i, {}) as IDataObject;

				const properties: IDataObject = {};
				if (formSetting.sheet_title) {
					properties.title = formSetting.sheet_title;
				}
				if (formSetting.sheet_index !== undefined && formSetting.sheet_index !== null) {
					properties.index = formSetting.sheet_index;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/add_sheet', {
					docid,
					properties,
				});
			} else if (operation === 'delSmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/delete_sheet',
					{
						docid,
						sheet_id,
					},
				);
			} else if (operation === 'updateSmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const sheet_title = this.getNodeParameter('sheet_title', i, '') as string;

				const properties: IDataObject = {};
				if (sheet_title) {
					properties.title = sheet_title;
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/update_sheet',
					{
						docid,
						sheet_id,
						properties,
					},
				);
			}
			// 智能表格操作 - 视图
			else if (operation === 'addSmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_title = this.getNodeParameter('view_title', i) as string;
				const view_type = this.getNodeParameter('view_type', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/add_view', {
					docid,
					sheet_id,
					view_title,
					view_type,
				});
			} else if (operation === 'delSmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_id = this.getNodeParameter('view_id', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/delete_views',
					{
						docid,
						sheet_id,
						view_id,
					},
				);
			} else if (operation === 'updateSmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_id = this.getNodeParameter('view_id', i) as string;
				const view_title = this.getNodeParameter('view_title', i, '') as string;

				const body: IDataObject = { docid, sheet_id, view_id };
				if (view_title) {
					body.view_title = view_title;
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/update_view',
					body,
				);
			}
			// 智能表格操作 - 字段
			else if (operation === 'addSmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const fieldsCollection = this.getNodeParameter('fieldsCollection', i, {}) as IDataObject;

				const fields: IDataObject[] = [];
				if (fieldsCollection.fields && Array.isArray(fieldsCollection.fields)) {
					for (const field of fieldsCollection.fields as IDataObject[]) {
						const fieldDef: IDataObject = {
							field_title: field.field_title,
							field_type: field.field_type,
						};

						// 处理单选/多选的选项
						if (
							['FIELD_TYPE_SINGLE_SELECT', 'FIELD_TYPE_MULTI_SELECT'].includes(
								field.field_type as string,
							) &&
							field.select_options
						) {
							const options = (field.select_options as string).split(',').map((opt, idx) => ({
								id: `opt_${idx}`,
								text: opt.trim(),
							}));
							fieldDef.property_select = { options };
						}

						fields.push(fieldDef);
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/add_fields',
					{
						docid,
						sheet_id,
						fields,
					},
				);
			} else if (operation === 'delSmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const field_ids_str = this.getNodeParameter('field_ids', i) as string;

				const field_ids = field_ids_str
					.split(',')
					.map((id) => id.trim())
					.filter((id) => id);
				if (field_ids.length === 0) {
					throw new NodeOperationError(this.getNode(), '至少需要提供一个字段ID', { itemIndex: i });
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/delete_fields',
					{
						docid,
						sheet_id,
						field_ids,
					},
				);
			} else if (operation === 'updateSmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const fieldsCollection = this.getNodeParameter('fieldsCollection', i, {}) as IDataObject;

				const fields: IDataObject[] = [];
				if (fieldsCollection.fields && Array.isArray(fieldsCollection.fields)) {
					for (const field of fieldsCollection.fields as IDataObject[]) {
						const fieldDef: IDataObject = {
							field_id: field.field_id,
						};

						if (field.field_title) {
							fieldDef.field_title = field.field_title;
						}

						// 处理单选/多选的选项更新
						if (field.select_options) {
							const options = (field.select_options as string).split(',').map((opt, idx) => ({
								id: `opt_${idx}`,
								text: opt.trim(),
							}));
							fieldDef.property_select = { options };
						}

						fields.push(fieldDef);
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/update_fields',
					{
						docid,
						sheet_id,
						fields,
					},
				);
			}
			// 智能表格操作 - 记录
			else if (operation === 'addSmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const key_type = this.getNodeParameter(
					'key_type',
					i,
					'CELL_VALUE_KEY_TYPE_FIELD_TITLE',
				) as string;
				const recordsCollection = this.getNodeParameter('recordsCollection', i, {}) as IDataObject;

				const records: IDataObject[] = [];
				if (recordsCollection.records && Array.isArray(recordsCollection.records)) {
					for (const record of recordsCollection.records as IDataObject[]) {
						const values: IDataObject = {};
						const cellValues = record.cellValues as IDataObject;

						if (cellValues?.values && Array.isArray(cellValues.values)) {
							for (const cv of cellValues.values as IDataObject[]) {
								const fieldKey = cv.field_key as string;
								const valueType = cv.value_type as string;
								// 使用新的提取函数从结构化字段中获取值
								const value = extractFieldValue(cv);
								// 将值类型映射到字段类型，然后根据字段类型构建正确的单元格值结构
								const fieldType = mapValueTypeToFieldType(valueType);
								values[fieldKey] = buildCellValueByFieldType(fieldType, value);
							}
						}

						records.push({ values });
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/add_records',
					{
						docid,
						sheet_id,
						key_type,
						records,
					},
				);
			} else if (operation === 'delSmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const record_ids = this.getNodeParameter('record_ids', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/delete_records',
					{
						docid,
						sheet_id,
						record_ids: record_ids.split(',').map((id) => id.trim()),
					},
				);
			} else if (operation === 'updateSmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const key_type = this.getNodeParameter(
					'key_type',
					i,
					'CELL_VALUE_KEY_TYPE_FIELD_TITLE',
				) as string;
				const recordsCollection = this.getNodeParameter('recordsCollection', i, {}) as IDataObject;

				const records: IDataObject[] = [];
				if (recordsCollection.records && Array.isArray(recordsCollection.records)) {
					for (const record of recordsCollection.records as IDataObject[]) {
						const values: IDataObject = {};
						const cellValues = record.cellValues as IDataObject;

						if (cellValues?.values && Array.isArray(cellValues.values)) {
							for (const cv of cellValues.values as IDataObject[]) {
								const fieldKey = cv.field_key as string;
								const valueType = cv.value_type as string;
								// 使用新的提取函数从结构化字段中获取值
								const value = extractFieldValue(cv);
								// 将值类型映射到字段类型，然后根据字段类型构建正确的单元格值结构
								const fieldType = mapValueTypeToFieldType(valueType);
								values[fieldKey] = buildCellValueByFieldType(fieldType, value);
							}
						}

						records.push({
							record_id: record.record_id,
							values,
						});
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/update_records',
					{
						docid,
						sheet_id,
						key_type,
						records,
					},
				);
			} else if (operation === 'sendSmartsheetWebhook') {
				const itemJson = items[i].json as IDataObject;
				const formWebhook = this.getNodeParameter('webhook_url', i, '') as string;
				const webhook_mode = this.getNodeParameter('webhook_mode', i, 'json') as string;
				const webhookUrl =
					formWebhook ||
					(itemJson.webhook_url as string | undefined) ||
					(itemJson.webhookUrl as string | undefined) ||
					(itemJson.url as string | undefined) ||
					'';

				let payload: IDataObject = {};
				if (webhook_mode === 'add' || webhook_mode === 'update') {
					const records_json = this.getNodeParameter('records_json', i, '[]') as string;
					let records: IDataObject[] = [];
					try {
						const parsed = JSON.parse(records_json || '[]');
						if (Array.isArray(parsed)) records = parsed as IDataObject[];
					} catch (e) {
						throw new NodeOperationError(
							this.getNode(),
							`记录列表JSON 解析失败: ${(e as Error).message}`,
							{ itemIndex: i },
						);
					}
					if (webhook_mode === 'add') payload = { add_records: records };
					else payload = { update_records: records };
				} else {
					payload = parseRequiredJsonObject(
						this.getNodeParameter('payload_json', i, '{}'),
						'payload_json',
						i,
					);
				}

				delete payload.webhook_url;
				delete payload.webhookUrl;
				delete payload.url;

				if (!webhookUrl) {
					throw new NodeOperationError(
						this.getNode(),
						'缺少 Webhook 地址：请在表单填写或在输入数据提供 webhook_url / webhookUrl / url',
						{ itemIndex: i },
					);
				}

				if (!webhookUrl.includes('/cgi-bin/wedoc/smartsheet/webhook')) {
					throw new NodeOperationError(
						this.getNode(),
						'Webhook 地址格式无效，请使用智能表格“接收外部数据”生成的 Webhook 地址',
						{ itemIndex: i },
					);
				}

				if (!Array.isArray(payload.add_records) && !Array.isArray(payload.update_records)) {
					throw new NodeOperationError(
						this.getNode(),
						'请求体至少需要包含 add_records 或 update_records 数组',
						{ itemIndex: i },
					);
				}

				response = (await this.helpers.httpRequest({
					method: 'POST',
					url: webhookUrl,
					body: payload,
					json: true,
					headers: {
						'Content-Type': 'application/json',
					},
				})) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`智能表格 Webhook 请求失败: ${String(response.errmsg || '')} (错误码: ${String(response.errcode)})`,
						{ itemIndex: i },
					);
				}
			}
			// 获取文档数据
			else if (operation === 'getDocData') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/document/get', {
					docid,
				});
			} else if (operation === 'getSheetRange') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/spreadsheet/get_sheet_properties',
					{ docid },
				);
			} else if (operation === 'getSheetData') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const range = this.getNodeParameter('range', i) as string;

				const body: IDataObject = { docid, sheet_id, range };

				try {
					response = await weComApiRequest.call(
						this,
						'POST',
						'/cgi-bin/wedoc/spreadsheet/get_sheet_range_data',
						body,
					);
				} catch (error) {
					const err = error as Error;
					// 错误码 608668 表示元数据未找到，通常是文档类型不匹配
					if (err.message.includes('608668') || err.message.includes('meta is not found')) {
						throw new NodeOperationError(
							this.getNode(),
							`获取表格数据失败：文档ID "${docid}" 可能不是普通在线表格（spreadsheet），或者文档不存在。此接口仅支持普通在线表格，不支持智能表格（smartsheet）。如果您的文档是智能表格，请使用"查询记录"操作来获取数据。`,
							{ itemIndex: i },
						);
					}
					throw error;
				}
			}
			// 获取智能表格数据
			else if (operation === 'querySmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/get_sheet', {
					docid,
				});
			} else if (operation === 'querySmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_ids_str = this.getNodeParameter('view_ids', i, '') as string;
				const offset = this.getNodeParameter('offset', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = { docid, sheet_id, offset, limit };
				if (view_ids_str) {
					body.view_ids = view_ids_str
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/get_views',
					body,
				);
			} else if (operation === 'querySmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const field_ids_str = this.getNodeParameter('field_ids', i, '') as string;
				const offset = this.getNodeParameter('offset', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = { docid, sheet_id, offset, limit };
				if (field_ids_str) {
					body.field_ids = field_ids_str
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/get_fields',
					body,
				);
			} else if (operation === 'querySmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_id = this.getNodeParameter('view_id', i, '') as string;
				const key_type = this.getNodeParameter(
					'key_type',
					i,
					'CELL_VALUE_KEY_TYPE_FIELD_TITLE',
				) as string;
				const record_ids_str = this.getNodeParameter('record_ids', i, '') as string;

				const body: IDataObject = { docid, sheet_id, key_type };
				if (view_id) body.view_id = view_id;

				// 处理记录ID
				if (record_ids_str) {
					const record_ids = record_ids_str
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id);
					if (record_ids.length > 0) {
						body.record_ids = record_ids;
					}
				}

				// 处理筛选条件
				const filterConditions = this.getNodeParameter('filterConditions', i, {}) as IDataObject;
				const conjunction = this.getNodeParameter('conjunction', i, 'CONJUNCTION_AND') as string;

				let hasFilter = false;
				if (filterConditions.conditions && Array.isArray(filterConditions.conditions)) {
					const conditions = filterConditions.conditions as Array<{
						field_id: string;
						field_type: string;
						operator: string;
						value?: string;
					}>;

					if (conditions.length > 0) {
						const apiConditions = conditions.map((condition) => {
							const apiCondition: IDataObject = {
								field_id: condition.field_id,
								field_type: condition.field_type,
								operator: condition.operator,
							};

							if (
								['OPERATOR_IS_EMPTY', 'OPERATOR_IS_NOT_EMPTY'].includes(condition.operator)
							) {
								return apiCondition;
							}

							const fieldType = condition.field_type;

							// 日期时间类型
							if (
								[
									'FIELD_TYPE_DATE_TIME',
									'FIELD_TYPE_CREATED_TIME',
									'FIELD_TYPE_MODIFIED_TIME',
								].includes(fieldType)
							) {
								const dateTimeType =
									(condition as IDataObject).date_time_type as string ||
									'DATE_TIME_TYPE_DETAIL_DATE';
								const dateTimeValue: IDataObject = { type: dateTimeType };
								if (
									dateTimeType === 'DATE_TIME_TYPE_DETAIL_DATE' &&
									(condition as IDataObject).date_value
								) {
									dateTimeValue.value = [
										String((condition as IDataObject).date_value),
									];
								}
								apiCondition.date_time_value = dateTimeValue;
							}
							// 复选框类型
							else if (fieldType === 'FIELD_TYPE_CHECKBOX') {
								apiCondition.bool_value = {
									value: (condition as IDataObject).bool_value === 'true',
								};
							}
							// 数字、进度类型
							else if (
								fieldType === 'FIELD_TYPE_NUMBER' ||
								fieldType === 'FIELD_TYPE_PROGRESS'
							) {
								if (condition.value) {
									apiCondition.number_value = {
										value: parseFloat(condition.value),
									};
								}
							}
							// 人员类型
							else if (
								[
									'FIELD_TYPE_USER',
									'FIELD_TYPE_CREATED_USER',
									'FIELD_TYPE_MODIFIED_USER',
								].includes(fieldType)
							) {
								if (condition.value) {
									const values = condition.value
										.split(',')
										.map((v) => v.trim())
										.filter((v) => v);
									apiCondition.user_value = { value: values };
								}
							}
							// 文本、网址、电话、邮箱、地理位置、单选、多选等
							else {
								if (condition.value) {
									const values = condition.value
										.split(',')
										.map((v) => v.trim())
										.filter((v) => v);
									apiCondition.string_value = { value: values };
								}
							}

							return apiCondition;
						});

						body.filter_spec = {
							conjunction,
							conditions: apiConditions,
						};
						hasFilter = true;
					}
				}

				// 处理分页
				const pagination = this.getNodeParameter('pagination', i, {}) as IDataObject;
				body.limit = pagination.limit !== undefined ? pagination.limit : 50;
				body.offset = pagination.offset !== undefined ? pagination.offset : 0;

				// 处理排序
				const sortConfig = this.getNodeParameter('sort', i, {}) as IDataObject;
				let hasSortRules = false;
				if (sortConfig.rules && Array.isArray(sortConfig.rules) && sortConfig.rules.length > 0) {
					const sortRules = sortConfig.rules as Array<{
						sort_key_type?: string;
						field_id?: string;
						field_title?: string;
						desc: boolean;
					}>;

					body.sort = sortRules.map((rule) => {
						const sortItem: IDataObject = { desc: rule.desc };

						if (rule.sort_key_type === 'field_title' && rule.field_title) {
							sortItem.field_title = rule.field_title;
						} else if (rule.field_id) {
							sortItem.field_id = rule.field_id;
						}

						return sortItem;
					});
					hasSortRules = true;
				}

				// 检查筛选和排序的冲突
				if (hasSortRules && hasFilter) {
					throw new NodeOperationError(
						this.getNode(),
						'排序规则不能与筛选条件同时使用。请只使用其中一个功能。',
						{ itemIndex: i },
					);
				}

				// 处理返回字段
				const returnFields = this.getNodeParameter('returnFields', i, {}) as IDataObject;
				if (returnFields.field_ids) {
					const fieldIds = (returnFields.field_ids as string)
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id);
					if (fieldIds.length > 0) {
						body.field_ids = fieldIds;
					}
				}
				if (returnFields.field_titles) {
					const fieldTitles = (returnFields.field_titles as string)
						.split(',')
						.map((title) => title.trim())
						.filter((title) => title);
					if (fieldTitles.length > 0) {
						body.field_titles = fieldTitles;
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/get_records',
					body,
				);
			}
			// 权限设置
			else if (operation === 'getDocAuth') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/doc_get_auth', {
					docid,
				});
			} else if (operation === 'modDocSafeRule') {
				const docid = this.getNodeParameter('docid', i) as string;
				const watermark_enable = this.getNodeParameter('watermark_enable', i, false) as boolean;
				const allow_download = this.getNodeParameter('allow_download', i, true) as boolean;
				const allow_print = this.getNodeParameter('allow_print', i, true) as boolean;
				const allow_copy = this.getNodeParameter('allow_copy', i, true) as boolean;

				const safe_setting: IDataObject = {
					allow_download,
					allow_print,
					allow_copy,
				};

				if (watermark_enable) {
					const watermark_type = this.getNodeParameter('watermark_type', i, 1) as number;
					const watermark: IDataObject = {
						enable: true,
						type: watermark_type,
					};
					if (watermark_type === 2) {
						watermark.text = this.getNodeParameter('watermark_text', i, '') as string;
					}
					safe_setting.watermark = watermark;
				} else {
					safe_setting.watermark = { enable: false };
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_doc_safty_setting', {
					docid,
					safe_setting,
				});
			} else if (operation === 'modDocMemberRule') {
				const docid = this.getNodeParameter('docid', i) as string;
				const addMemberCollection = this.getNodeParameter(
					'addMemberCollection',
					i,
					{},
				) as IDataObject;
				const delMemberCollection = this.getNodeParameter(
					'delMemberCollection',
					i,
					{},
				) as IDataObject;
				const updateMemberCollection = this.getNodeParameter(
					'updateMemberCollection',
					i,
					{},
				) as IDataObject;

				const body: IDataObject = { docid };

				if (addMemberCollection.members && Array.isArray(addMemberCollection.members)) {
					body.add_member_info = (addMemberCollection.members as IDataObject[]).map(
						buildMemberInfo,
					);
				}

				if (delMemberCollection.members && Array.isArray(delMemberCollection.members)) {
					body.del_member_info = (delMemberCollection.members as IDataObject[]).map(
						buildMemberInfo,
					);
				}

				if (updateMemberCollection.members && Array.isArray(updateMemberCollection.members)) {
					body.update_member_info = (updateMemberCollection.members as IDataObject[]).map(
						buildMemberInfo,
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_doc_member', body);
			} else if (operation === 'modDocShareScope') {
				const docid = this.getNodeParameter('docid', i) as string;
				const body: IDataObject = { docid };
				const updateInternalJoinRule = this.getNodeParameter(
					'updateInternalJoinRule',
					i,
					false,
				) as boolean;
				const updateExternalJoinRule = this.getNodeParameter(
					'updateExternalJoinRule',
					i,
					false,
				) as boolean;
				const updateBanShareExternal = this.getNodeParameter(
					'updateBanShareExternal',
					i,
					false,
				) as boolean;
				const updateCoAuthList = this.getNodeParameter('update_co_auth_list', i, false) as boolean;

				if (updateInternalJoinRule) {
					body.enable_corp_internal = this.getNodeParameter(
						'enable_corp_internal',
						i,
						true,
					) as boolean;
					body.corp_internal_auth = this.getNodeParameter('corp_internal_auth', i, 2) as number;
					body.corp_internal_approve_only_by_admin = this.getNodeParameter(
						'corp_internal_approve_only_by_admin',
						i,
						false,
					) as boolean;
				}

				if (updateExternalJoinRule) {
					body.enable_corp_external = this.getNodeParameter(
						'enable_corp_external',
						i,
						false,
					) as boolean;
					body.corp_external_auth = this.getNodeParameter('corp_external_auth', i, 1) as number;
					body.corp_external_approve_only_by_admin = this.getNodeParameter(
						'corp_external_approve_only_by_admin',
						i,
						true,
					) as boolean;
				}

				if (updateBanShareExternal) {
					body.ban_share_external = this.getNodeParameter(
						'ban_share_external',
						i,
						false,
					) as boolean;
				}

				if (updateCoAuthList) {
					const coAuthCollection = this.getNodeParameter('coAuthCollection', i, {}) as IDataObject;
					const rawDepartments = Array.isArray(coAuthCollection.departments)
						? (coAuthCollection.departments as IDataObject[])
						: Array.isArray(coAuthCollection.members)
							? (coAuthCollection.members as IDataObject[])
							: [];

					body.update_co_auth_list = true;
					body.co_auth_list = rawDepartments.map((department) => {
						const type = department.type ?? 2;

						if (type !== 2) {
							throw new NodeOperationError(
								this.getNode(),
								'修改文档加入规则的特定权限列表目前只支持部门类型',
								{ itemIndex: i },
							);
						}

						return {
							departmentid: department.departmentid,
							auth: department.auth,
							type: 2,
						};
					});
				}

				if (Object.keys(body).length === 1) {
					throw new NodeOperationError(this.getNode(), '请至少开启一项要更新的加入规则设置', {
						itemIndex: i,
					});
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/mod_doc_join_rule',
					body,
				);
			} else if (operation === 'getSmartsheetGroupChatList') {
				const docid = this.getNodeParameter('docid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = {
					docid,
				};

				if (cursor) {
					body.cursor = cursor;
				}

				if (limit) {
					body.limit = limit;
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/groupchat/list',
					body,
				);
			} else if (operation === 'getSmartsheetGroupChat') {
				const docid = this.getNodeParameter('docid', i) as string;
				const chat_id = this.getNodeParameter('chat_id', i) as string;

				const body: IDataObject = {
					docid,
					chat_id,
				};

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/groupchat/get',
					body,
				);
			} else if (operation === 'updateSmartsheetGroupChat') {
				const docid = this.getNodeParameter('docid', i) as string;
				const chat_id = this.getNodeParameter('chat_id', i) as string;
				const owner = this.getNodeParameter('owner', i, '') as string;
				const add_user_list_str = this.getNodeParameter('add_user_list', i, '') as string;
				const del_user_list_str = this.getNodeParameter('del_user_list', i, '') as string;

				const body: IDataObject = {
					docid,
					chat_id,
				};

				if (owner) {
					body.owner = owner;
				}

				if (add_user_list_str) {
					body.add_user_list = add_user_list_str
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id);
				}

				if (del_user_list_str) {
					body.del_user_list = del_user_list_str
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id);
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/groupchat/update',
					body,
				);
			} else if (operation === 'manageSmartsheetAuth') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const enable = this.getNodeParameter('enable', i, false) as boolean;

				const body: IDataObject = { docid, sheet_id, enable };

				if (enable) {
					const defaultRule = this.getNodeParameter('defaultRule', i, {}) as IDataObject;
					if (Object.keys(defaultRule).length > 0) {
						body.default_rule = defaultRule;
					}

					const userRulesCollection = this.getNodeParameter(
						'userRulesCollection',
						i,
						{},
					) as IDataObject;
					if (userRulesCollection.rules && Array.isArray(userRulesCollection.rules)) {
						body.user_rules = (userRulesCollection.rules as IDataObject[]).map((rule) => ({
							userid: rule.userid,
							read: rule.read,
							edit: rule.edit,
						}));
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/update_sheet_priv',
					body,
				);
			}
			// 收集表
			else if (operation === 'createForm') {
				const spaceid = this.getNodeParameter('spaceid', i, '') as string;
				const fatherid = this.getNodeParameter('fatherid', i, '') as string;
				const form_title = this.getNodeParameter('form_title', i) as string;
				const form_description = this.getNodeParameter('form_description', i, '') as string;
				const form_header = this.getNodeParameter('form_header', i, '') as string;
				const questionList = this.getNodeParameter('questionList', i, {}) as IDataObject;
				const formSetting = this.getNodeParameter('formSetting', i, {}) as IDataObject;

				const body: IDataObject = {};

				// 添加 spaceid 和 fatherid（如果提供）
				if (spaceid) {
					body.spaceid = spaceid;
				}
				if (fatherid) {
					body.fatherid = fatherid;
				}

				const form_info: IDataObject = {
					form_title: form_title,
				};

				if (form_description) {
					form_info.form_desc = form_description;
				}

				if (form_header) {
					form_info.form_header = form_header;
				}

				// 构建问题列表
				if (questionList.questions && Array.isArray(questionList.questions)) {
					const items = (questionList.questions as IDataObject[]).map((q, idx) => {
						const question: IDataObject = {
							question_id: idx + 1,
							title: q.question_title,
							pos: idx + 1,
							status: 1,
							reply_type: q.question_type,
							must_reply: q.is_required || false,
						};

						// 添加备注
						if (q.note) {
							question.note = q.note;
						}

						// 添加编辑提示
						if (q.placeholder) {
							question.placeholder = q.placeholder;
						}

						// 处理选项（单选/多选/下拉列表）
						if ([2, 3, 15].includes(q.question_type as number) && q.options) {
							question.option_item = (q.options as string).split(',').map((opt, optIdx) => ({
								key: optIdx + 1,
								value: opt.trim(),
								status: 1,
							}));
						}

						// 处理问题扩展设置
						if (q.question_extend_setting) {
							try {
								const extendSetting =
									typeof q.question_extend_setting === 'string'
										? JSON.parse(q.question_extend_setting as string)
										: q.question_extend_setting;
								if (Object.keys(extendSetting).length > 0) {
									question.question_extend_setting = extendSetting;
								}
							} catch (error) {
								throw new NodeOperationError(
									this.getNode(),
									`问题 "${q.question_title}" 的扩展设置JSON格式错误: ${(error as Error).message}`,
									{ itemIndex: i },
								);
							}
						}

						return question;
					});

					form_info.form_question = { items };
				}

				// 构建设置
				if (Object.keys(formSetting).length > 0) {
					const processedSetting: IDataObject = {};

					// 填写权限
					if (formSetting.fill_out_auth !== undefined) {
						processedSetting.fill_out_auth = formSetting.fill_out_auth;
					}

					// 处理指定填写范围
					if (formSetting.fill_out_auth === 1) {
						const fill_in_range: IDataObject = {};

						// 指定填写人员 (multiOptions类型,返回string[])
						if (formSetting.fill_in_range_userids) {
							const userids = Array.isArray(formSetting.fill_in_range_userids)
								? (formSetting.fill_in_range_userids as string[])
										.map((id) => id.trim())
										.filter((id) => id)
								: (formSetting.fill_in_range_userids as string)
										.split(',')
										.map((id) => id.trim())
										.filter((id) => id);
							if (userids.length > 0) {
								fill_in_range.userids = userids;
							}
						}

						// 指定填写部门 (multiOptions类型,返回string[],需要转换为number[])
						if (formSetting.fill_in_range_departmentids) {
							const departmentids = Array.isArray(formSetting.fill_in_range_departmentids)
								? (formSetting.fill_in_range_departmentids as string[])
										.map((id) => parseInt(id.trim(), 10))
										.filter((id) => !isNaN(id))
								: (formSetting.fill_in_range_departmentids as string)
										.split(',')
										.map((id) => parseInt(id.trim(), 10))
										.filter((id) => !isNaN(id));
							if (departmentids.length > 0) {
								fill_in_range.departmentids = departmentids;
							}
						}

						if (Object.keys(fill_in_range).length > 0) {
							processedSetting.fill_in_range = fill_in_range;
						}
					}

					// 处理收集表管理员 (multiOptions类型,返回string[])
					if (formSetting.setting_manager_range) {
						const userids = Array.isArray(formSetting.setting_manager_range)
							? (formSetting.setting_manager_range as string[])
									.map((id) => id.trim())
									.filter((id) => id)
							: (formSetting.setting_manager_range as string)
									.split(',')
									.map((id) => id.trim())
									.filter((id) => id);

						if (userids.length > 0) {
							processedSetting.setting_manager_range = { userids };
						}
					}

					// 处理定时重复设置
					const timedRepeatInfo: IDataObject = {};
					if (formSetting.timed_repeat_enable) {
						timedRepeatInfo.enable = true;
						if (formSetting.timed_repeat_type !== undefined) {
							timedRepeatInfo.repeat_type = formSetting.timed_repeat_type;
						}
						if (formSetting.timed_repeat_remind_time) {
							timedRepeatInfo.remind_time = formSetting.timed_repeat_remind_time;
						}
					}
					if (formSetting.timed_repeat_info) {
						try {
							const extra =
								typeof formSetting.timed_repeat_info === 'string'
									? JSON.parse(formSetting.timed_repeat_info as string)
									: formSetting.timed_repeat_info;
							if (extra && typeof extra === 'object') {
								Object.assign(timedRepeatInfo, extra as IDataObject);
							}
						} catch (error) {
							throw new NodeOperationError(
								this.getNode(),
								`定时重复设置JSON格式错误: ${(error as Error).message}`,
								{ itemIndex: i },
							);
						}
					}
					if (Object.keys(timedRepeatInfo).length > 0 && timedRepeatInfo.enable) {
						processedSetting.timed_repeat_info = timedRepeatInfo;
					}

					// 处理 allow_multi_fill
					if (formSetting.allow_multi_fill !== undefined) {
						processedSetting.allow_multi_fill = formSetting.allow_multi_fill;
					}

					// 处理 timed_finish：将日期时间转换为时间戳并验证
					if (formSetting.timed_finish) {
						const timedFinish = formSetting.timed_finish as string;
						if (timedFinish) {
							const finishTime = new Date(timedFinish).getTime();
							const currentTime = Date.now();

							// 验证：时间不能早于当前时间
							if (finishTime < currentTime) {
								throw new NodeOperationError(this.getNode(), '定时关闭时间不能早于当前时间', {
									itemIndex: i,
								});
							}

							// 转换为秒级时间戳
							processedSetting.timed_finish = Math.floor(finishTime / 1000);
						}
					}

					// 处理 can_anonymous
					if (formSetting.can_anonymous !== undefined) {
						processedSetting.can_anonymous = formSetting.can_anonymous;
					}

					// 处理 can_notify_submit
					if (formSetting.can_notify_submit !== undefined) {
						processedSetting.can_notify_submit = formSetting.can_notify_submit;
					}

					if (Object.keys(processedSetting).length > 0) {
						form_info.form_setting = processedSetting;
					}
				}

				body.form_info = form_info;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/create_form', body);
			} else if (operation === 'modForm') {
				const formid = this.getNodeParameter('formid', i) as string;
				const form_title = this.getNodeParameter('form_title', i, '') as string;
				const form_description = this.getNodeParameter('form_description', i, '') as string;
				const formSetting = this.getNodeParameter('formSetting', i, {}) as IDataObject;

				const form_info: IDataObject = {};

				if (form_title) {
					form_info.title = form_title;
				}

				if (form_description) {
					form_info.description = form_description;
				}

				if (Object.keys(formSetting).length > 0) {
					form_info.setting = formSetting;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/modify_form', {
					formid,
					form_info,
				});
			} else if (operation === 'getFormInfo') {
				const formid = this.getNodeParameter('formid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_info', {
					formid,
				});
			}
			// 收集表的统计信息查询
			else if (operation === 'getFormStatistic') {
				const repeated_id = this.getNodeParameter('repeated_id', i) as string;
				const req_type = this.getNodeParameter('req_type', i) as number;

				const body: IDataObject = {
					repeated_id,
					req_type,
				};

				// 如果是获取已提交列表（req_type=2），需要时间范围
				if (req_type === 2) {
					const start_time = this.getNodeParameter('start_time', i) as string;
					const end_time = this.getNodeParameter('end_time', i) as string;

					// 将日期时间转换为秒级时间戳
					body.start_time = Math.floor(new Date(start_time).getTime() / 1000);
					body.end_time = Math.floor(new Date(end_time).getTime() / 1000);

					// 添加分页参数
					const limit = this.getNodeParameter('limit', i, 20) as number;
					const cursor = this.getNodeParameter('cursor', i, 0) as number;
					body.limit = limit;
					if (cursor > 0) {
						body.cursor = cursor;
					}
				}
				// 如果是获取未提交列表（req_type=3），需要分页参数
				else if (req_type === 3) {
					const limit = this.getNodeParameter('limit', i, 20) as number;
					const cursor = this.getNodeParameter('cursor', i, 0) as number;
					body.limit = limit;
					if (cursor > 0) {
						body.cursor = cursor;
					}
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/get_form_statistic',
					body,
				);
			}
			// 读取收集表答案
			else if (operation === 'getFormAnswer') {
				const repeated_id = this.getNodeParameter('repeated_id', i) as string;
				const answer_ids_str = this.getNodeParameter('answer_ids', i) as string;

				// 将答案ID字符串转换为数字数组
				const answer_ids = answer_ids_str
					.split(',')
					.map((id) => parseInt(id.trim(), 10))
					.filter((id) => !isNaN(id));

				// 验证答案ID列表
				if (answer_ids.length === 0) {
					throw new NodeOperationError(this.getNode(), '答案ID列表不能为空', { itemIndex: i });
				}
				if (answer_ids.length > 100) {
					throw new NodeOperationError(this.getNode(), '答案ID列表最大不能超过100个', {
						itemIndex: i,
					});
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_answer', {
					repeated_id,
					answer_ids,
				});
			}
			// 高级账号管理
			else if (operation === 'allocateAdvancedAccount') {
				const userid_list = this.getNodeParameter('userid_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip/batch_add', {
					userid_list: userid_list
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id),
				});
			} else if (operation === 'deallocateAdvancedAccount') {
				const userid_list = this.getNodeParameter('userid_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip/batch_del', {
					userid_list: userid_list
						.split(',')
						.map((id) => id.trim())
						.filter((id) => id),
				});
			} else if (operation === 'getAdvancedAccountList') {
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip/list', body);
			} else if (operation === 'uploadDocImage') {
				const docid = this.getNodeParameter('docid', i) as string;
				const imageSource = this.getNodeParameter('imageSource', i) as string;

				let base64Content: string;

				if (imageSource === 'binary') {
					// 从二进制数据读取并转换为 base64
					const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;
					const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
					base64Content = dataBuffer.toString('base64');
				} else {
					// 直接使用用户提供的 base64 字符串
					base64Content = this.getNodeParameter('base64Content', i) as string;
				}

				const accessToken = await getAccessToken.call(this);

				const requestBody = {
					docid,
					base64_content: base64Content,
				};

				response = (await this.helpers.httpRequest({
					method: 'POST',
					url: `${await getWeComBaseUrl.call(this)}/cgi-bin/wedoc/image_upload?access_token=${accessToken}`,
					body: requestBody,
					json: true,
				})) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new Error(`上传文档图片失败: ${response.errmsg} (错误码: ${response.errcode})`);
				}
			} else if (operation === 'getSheetPriv') {
				const docid = this.getNodeParameter('docid', i) as string;
				const type = this.getNodeParameter('priv_type', i, 1) as number;
				const rule_id_list_raw = this.getNodeParameter('rule_id_list', i, '') as string;
				const body: IDataObject = { docid, type };
				if (rule_id_list_raw) {
					body.rule_id_list = rule_id_list_raw
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean)
						.map((id) => Number(id) || id);
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/get_sheet_priv',
					body,
				);
			} else if (operation === 'createPrivRule') {
				// https://developer.work.weixin.qq.com/document/path/99935 新增额外权限
				const docid = this.getNodeParameter('docid', i) as string;
				const name = this.getNodeParameter('rule_name', i, '') as string;
				const privRuleJson = this.getNodeParameter('privRuleJson', i, '{}') as string;
				const body: IDataObject = { docid };
				if (name) body.name = name;
				try {
					Object.assign(body, JSON.parse(privRuleJson || '{}') as IDataObject);
					body.docid = docid;
					if (name) body.name = name;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/create_rule',
					body,
				);
			} else if (operation === 'updateSheetPrivFull') {
				// https://developer.work.weixin.qq.com/document/path/99935 更新子表权限
				const docid = this.getNodeParameter('docid', i) as string;
				const update_priv_type = this.getNodeParameter('update_priv_type', i, 2) as number;
				const priv_rule_id = this.getNodeParameter('priv_rule_id', i, 0) as number;
				const update_priv_name = this.getNodeParameter('update_priv_name', i, '') as string;
				const privListCollection = this.getNodeParameter(
					'privListCollection',
					i,
					{},
				) as IDataObject;
				const privRuleJson = this.getNodeParameter('privRuleJson', i, '{}') as string;
				const body: IDataObject = { docid, type: update_priv_type };
				if (update_priv_type === 2 && priv_rule_id) body.rule_id = priv_rule_id;
				if (update_priv_name) body.name = update_priv_name;
				const priv_list = ((privListCollection?.items as IDataObject[]) || [])
					.filter((p) => p.sheet_id)
					.map((p) => {
						const item: IDataObject = {
							sheet_id: p.sheet_id,
							priv: p.priv ?? 2,
						};
						if (p.can_insert_record !== undefined) {
							item.can_insert_record = p.can_insert_record;
						}
						if (p.can_delete_record !== undefined) {
							item.can_delete_record = p.can_delete_record;
						}
						if (p.can_create_modify_delete_view !== undefined) {
							item.can_create_modify_delete_view = p.can_create_modify_delete_view;
						}
						if (p.clear) item.clear = true;
						const privNum = Number(p.priv ?? 2);
						if (privNum === 2 || privNum === 3) {
							item.record_priv = {
								record_range_type: p.record_range_type ?? 1,
							};
						}
						return item;
					});
				if (priv_list.length) body.priv_list = priv_list;
				try {
					Object.assign(body, JSON.parse(privRuleJson || '{}') as IDataObject);
					body.docid = docid;
					if (update_priv_type) body.type = update_priv_type;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/update_sheet_priv',
					body,
				);
			} else if (operation === 'modPrivRuleMember') {
				const docid = this.getNodeParameter('docid', i) as string;
				const priv_rule_id = this.getNodeParameter('priv_rule_id', i, 0) as number;
				const add_member_userids = this.getNodeParameter('add_member_userids', i, '') as string;
				const del_member_userids = this.getNodeParameter('del_member_userids', i, '') as string;
				const privRuleJson = this.getNodeParameter('privRuleJson', i, '{}') as string;
				const body: IDataObject = { docid };
				if (priv_rule_id) body.rule_id = priv_rule_id;
				const addUsers = add_member_userids.split(',').map((s) => s.trim()).filter(Boolean);
				const delUsers = del_member_userids.split(',').map((s) => s.trim()).filter(Boolean);
				if (addUsers.length) body.add_member_range = { userid_list: addUsers };
				if (delUsers.length) body.del_member_range = { userid_list: delUsers };
				try {
					Object.assign(body, JSON.parse(privRuleJson || '{}') as IDataObject);
					body.docid = docid;
					if (priv_rule_id) body.rule_id = priv_rule_id;
				} catch {
					// ignore
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/mod_rule_member',
					body,
				);
			} else if (operation === 'deletePrivRule') {
				const docid = this.getNodeParameter('docid', i) as string;
				const rule_id_list_raw = this.getNodeParameter('rule_id_list', i, '') as string;
				const body: IDataObject = {
					docid,
					rule_id_list: rule_id_list_raw
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean)
						.map((id) => Number(id) || id),
				};
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/content_priv/delete_rule',
					body,
				);
			} else if (operation === 'addFieldGroup') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const name = this.getNodeParameter('group_name', i) as string;
				const field_ids = this.getNodeParameter('field_ids', i, '') as string;
				const body: IDataObject = { docid, sheet_id, name };
				if (field_ids) {
					body.children = field_ids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean)
						.map((field_id) => ({ field_id }));
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/add_field_group',
					body,
				);
			} else if (operation === 'updateFieldGroup') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const group_id = this.getNodeParameter('group_id', i) as string;
				const name = this.getNodeParameter('group_name', i, '') as string;
				const field_ids = this.getNodeParameter('field_ids', i, '') as string;
				const body: IDataObject = { docid, sheet_id, group_id };
				if (name) body.name = name;
				if (field_ids) {
					body.children = field_ids
						.split(',')
						.map((id) => id.trim())
						.filter(Boolean)
						.map((field_id) => ({ field_id }));
				}
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/update_field_group',
					body,
				);
			} else if (operation === 'deleteFieldGroups') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const group_id = this.getNodeParameter('group_id', i) as string;
				const group_id_list = group_id
					.split(',')
					.map((id) => id.trim())
					.filter(Boolean);
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/delete_field_groups',
					{ docid, sheet_id, group_id_list },
				);
			} else if (operation === 'getFieldGroups') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedoc/smartsheet/get_field_groups',
					{ docid, sheet_id },
				);
			} else {
				response = {};
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

	return returnData;
}
