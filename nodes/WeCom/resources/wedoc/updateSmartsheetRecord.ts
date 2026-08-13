import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['updateSmartsheetRecord'] };
export const updateSmartsheetRecordDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '智能表格的docid。',
	},
	{
		displayName: '子表ID',
		name: 'sheet_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '子表的sheet_id。',
	},
	{
		displayName: 'Key类型',
		name: 'key_type',
		type: 'options',
		displayOptions: { show: showOnly },
		default: 'CELL_VALUE_KEY_TYPE_FIELD_TITLE',
		options: [
			{
				name: '字段标题',
				value: 'CELL_VALUE_KEY_TYPE_FIELD_TITLE',
				description: '使用字段标题作为单元格数据的key（推荐）',
			},
			{
				name: '字段ID',
				value: 'CELL_VALUE_KEY_TYPE_FIELD_ID',
				description: '使用字段ID作为单元格数据的key',
			},
		],
		description: '指定记录中字段值的key类型',
	},
	{
		displayName: '记录列表',
		name: 'recordsCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加要更新的记录',
		typeOptions: { multipleValues: true },
		description: '要更新的记录列表（单次更新建议在500行内）；下方 JSON 非空时覆盖表单',
		options: [
			{
				displayName: '记录',
				name: 'records',
				values: [
					{
						displayName: '记录ID',
						name: 'record_id',
						type: 'string',
						default: '',
						required: true,
						description: '要更新的记录ID',
					},
					{
						displayName: '字段值',
						name: 'cellValues',
						type: 'fixedCollection',
						default: {},
						placeholder: '添加字段值',
						typeOptions: { multipleValues: true },
						description: '要更新的字段值',
						options: [
							{
								displayName: '值',
								name: 'values',
								values: [
									{
										displayName: '字段（ID或标题）',
										name: 'field_key',
										type: 'string',
										default: '',
										required: true,
										description: '字段ID或字段标题（根据上方Key类型设置）',
									},
									{
										displayName: '值类型',
										name: 'value_type',
										type: 'options',
										default: 'text',
										options: [
											{ name: '文本', value: 'text' },
											{ name: '数字', value: 'number' },
											{ name: '复选框', value: 'checkbox' },
											{ name: '日期', value: 'date_time' },
											{ name: '链接', value: 'url' },
											{ name: '邮箱', value: 'email' },
											{ name: '电话', value: 'phone_number' },
											{ name: '单选', value: 'single_select' },
											{ name: '多选', value: 'select' },
											{ name: '进度', value: 'progress' },
											{ name: '货币', value: 'currency' },
											{ name: '百分数', value: 'percentage' },
											{ name: '条码', value: 'barcode' },
											{ name: '地点', value: 'location' },
											{ name: '图片', value: 'image' },
											{ name: '文件', value: 'attachment' },
											{ name: '成员', value: 'user' },
										],
										description: '值的类型',
									},
									// 文本类型
									{
										displayName: '文本内容',
										name: 'text_content_list',
										type: 'fixedCollection',
										displayOptions: {
											show: {
												value_type: ['text'],
											},
										},
										default: {},
										placeholder: '添加文本片段',
										typeOptions: { multipleValues: true },
										description: '添加一个或多个文本片段（支持纯文本和链接）',
										options: [
											{
												displayName: '文本片段',
												name: 'items',
												values: [
													{
														displayName: '类型',
														name: 'type',
														type: 'options',
														options: [
															{ name: '纯文本', value: 'text' },
															{ name: '链接', value: 'url' },
														],
														default: 'text',
														description: '选择内容类型',
													},
													{
														displayName: '文本内容',
														name: 'text',
														type: 'string',
														default: '',
														required: true,
														description: '显示的文本内容',
													},
													{
														displayName: '链接URL',
														name: 'link',
														type: 'string',
														displayOptions: {
															show: {
																type: ['url'],
															},
														},
														default: '',
														required: true,
														description: '链接跳转的URL地址',
														placeholder: 'https://example.com',
													},
												],
											},
										],
									},
									// 简单文本类型（邮箱、电话、条码）
									{
										displayName: '值',
										name: 'simple_text_value',
										type: 'string',
										displayOptions: {
											show: {
												value_type: ['email', 'phone_number', 'barcode'],
											},
										},
										default: '',
										description: '输入文本内容',
									},
									// 数字类型（数字、进度、货币、百分数）
									{
										displayName: '值',
										name: 'number_value',
										type: 'number',
										displayOptions: {
											show: {
												value_type: ['number', 'progress', 'currency', 'percentage'],
											},
										},
										default: 0,
										description: '输入数字。进度类型请输入0-1之间的数值',
									},
									// 复选框类型
									{
										displayName: '值',
										name: 'checkbox_value',
										type: 'boolean',
										displayOptions: {
											show: {
												value_type: ['checkbox'],
											},
										},
										default: false,
										description: '选中或不选中',
									},
									// 日期类型
									{
										displayName: '值',
										name: 'date_value',
										type: 'string',
										displayOptions: {
											show: {
												value_type: ['date_time'],
											},
										},
										default: '',
										description: '输入毫秒时间戳',
										placeholder: '1609459200000',
									},
									// 链接类型
									{
										displayName: '链接列表',
										name: 'url_list',
										type: 'fixedCollection',
										displayOptions: {
											show: {
												value_type: ['url'],
											},
										},
										default: {},
										placeholder: '添加链接',
										typeOptions: { multipleValues: true },
										description: '添加一个或多个链接',
										options: [
											{
												displayName: '链接',
												name: 'items',
												values: [
													{
														displayName: '链接URL',
														name: 'link',
														type: 'string',
														default: '',
														required: true,
														description: '链接的URL地址',
														placeholder: 'https://example.com',
													},
													{
														displayName: '链接文本',
														name: 'text',
														type: 'string',
														default: '',
														description: '链接显示的文本，留空则使用URL',
													},
												],
											},
										],
									},
									// 选项类型（单选/多选）
									{
										displayName: '选项列表',
										name: 'option_list',
										type: 'fixedCollection',
										displayOptions: {
											show: {
												value_type: ['single_select', 'select'],
											},
										},
										default: {},
										placeholder: '添加选项',
										typeOptions: { multipleValues: true },
										description: '添加一个或多个选项',
										options: [
											{
												displayName: '选项',
												name: 'items',
												values: [
													{
														displayName: '输入方式',
														name: 'mode',
														type: 'options',
														options: [
															{ name: '使用已存在的选项ID', value: 'id' },
															{ name: '新增选项', value: 'new' },
														],
														default: 'id',
														description: '选择输入方式',
													},
													{
														displayName: '选项ID',
														name: 'id',
														type: 'string',
														displayOptions: {
															show: {
																mode: ['id'],
															},
														},
														default: '',
														required: true,
														description: '已存在选项的ID',
													},
													{
														displayName: '选项文本',
														name: 'text',
														type: 'string',
														displayOptions: {
															show: {
																mode: ['new'],
															},
														},
														default: '',
														required: true,
														description: '新增选项的文本内容',
													},
													{
														displayName: '选项颜色',
														name: 'style',
														type: 'number',
														displayOptions: {
															show: {
																mode: ['new'],
															},
														},
														default: 1,
														description: '新增选项的颜色样式（整数）',
													},
												],
											},
										],
									},
									// 成员类型
									{
										displayName: '成员列表',
										name: 'user_list',
										type: 'fixedCollection',
										displayOptions: {
											show: {
												value_type: ['user'],
											},
										},
										default: {},
										placeholder: '添加成员',
										typeOptions: { multipleValues: true },
										description: '添加一个或多个成员',
										options: [
											{
												displayName: '成员',
												name: 'items',
												values: [
													{
														displayName: '成员ID',
														name: 'user_id',
														type: 'string',
														default: '',
														description: '成员的userid；可与下方选择二选一',
														placeholder: 'userid1',
													},
													{
														displayName: '成员(选择)',
														name: 'user_id_selected',
														type: 'options',
														typeOptions: { loadOptionsMethod: 'getAllUsers' },
														default: '',
														description: '与上方字符串二选一；均填写时以字符串为准',
													},
												],
											},
										],
									},
									// 地点类型
									{
										displayName: '地点列表',
										name: 'location_list',
										type: 'fixedCollection',
										displayOptions: {
											show: {
												value_type: ['location'],
											},
										},
										default: {},
										placeholder: '添加地点',
										typeOptions: { multipleValues: true },
										description: '添加一个或多个地点',
										options: [
											{
												displayName: '地点',
												name: 'items',
												values: [
													{
														displayName: '地点ID',
														name: 'id',
														type: 'string',
														default: '',
														required: true,
														description: '地点的唯一标识符',
													},
													{
														displayName: '地点名称',
														name: 'title',
														type: 'string',
														default: '',
														required: true,
														description: '地点的显示名称',
													},
													{
														displayName: '纬度',
														name: 'latitude',
														type: 'string',
														default: '',
														required: true,
														description: '地点的纬度坐标',
														placeholder: '23.10647',
													},
													{
														displayName: '经度',
														name: 'longitude',
														type: 'string',
														default: '',
														required: true,
														description: '地点的经度坐标',
														placeholder: '113.32446',
													},
													{
														displayName: '来源类型',
														name: 'source_type',
														type: 'options',
														options: [{ name: '腾讯地图', value: 1 }],
														default: 1,
														description: '地图来源，目前仅支持腾讯地图',
													},
												],
											},
										],
									},
									// 图片类型
									{
										displayName: '图片列表',
										name: 'image_list',
										type: 'fixedCollection',
										displayOptions: {
											show: {
												value_type: ['image'],
											},
										},
										default: {},
										placeholder: '添加图片',
										typeOptions: { multipleValues: true },
										description: '添加一个或多个图片',
										options: [
											{
												displayName: '图片',
												name: 'images',
												values: [
													{
														displayName: '图片ID',
														name: 'id',
														type: 'string',
														default: '',
														description: '图片的唯一标识符（自定义ID）',
													},
													{
														displayName: '图片标题',
														name: 'title',
														type: 'string',
														default: '',
														description: '图片的标题',
													},
													{
														displayName: '图片链接',
														name: 'image_url',
														type: 'string',
														default: '',
														required: true,
														description: '图片URL，通过上传图片接口获取',
														placeholder: 'https://example.com/image.jpg',
													},
													{
														displayName: '宽度',
														name: 'width',
														type: 'number',
														default: 0,
														description: '图片宽度（像素）',
													},
													{
														displayName: '高度',
														name: 'height',
														type: 'number',
														default: 0,
														description: '图片高度（像素）',
													},
												],
											},
										],
									},
									// 文件类型
									{
										displayName: '文件列表',
										name: 'attachment_list',
										type: 'fixedCollection',
										displayOptions: {
											show: {
												value_type: ['attachment'],
											},
										},
										default: {},
										placeholder: '添加文件',
										typeOptions: { multipleValues: true },
										description: '添加一个或多个文件',
										options: [
											{
												displayName: '文件',
												name: 'attachments',
												values: [
													{
														displayName: '类型',
														name: 'doc_type',
														type: 'options',
														options: [
															{ name: '文件', value: 'file' },
															{ name: '文件夹', value: 'folder' },
														],
														default: 'file',
														description: '选择是文档还是文件夹',
													},
													{
														displayName: '文档子类型',
														name: 'file_subtype',
														type: 'options',
														displayOptions: {
															show: {
																doc_type: ['file'],
															},
														},
														default: 'smartsheet',
														options: [
															{ name: '智能表', value: 'smartsheet' },
															{ name: '文档', value: 'doc' },
															{ name: '表格', value: 'sheet' },
															{ name: '幻灯片', value: 'slide' },
															{ name: '思维导图', value: 'mind' },
															{ name: '流程图', value: 'flowchart' },
															{ name: '收集表', value: 'form' },
															{ name: '微盘文件', value: 'wedrive' },
														],
														description: '选择文档的具体类型',
													},
													{
														displayName: '文件ID',
														name: 'file_id',
														type: 'string',
														default: '',
														required: true,
														description: '文件的唯一标识符',
													},
													{
														displayName: '名称',
														name: 'name',
														type: 'string',
														default: '',
														required: true,
														description: '文件或文件夹的显示名称',
													},
													{
														displayName: 'URL',
														name: 'file_url',
														type: 'string',
														default: '',
														required: true,
														description:
															'文件的访问链接。微盘文档通过获取分享链接获得，其他为文档URL',
														placeholder: 'https://doc.weixin.qq.com/...',
													},
													{
														displayName: '文件扩展名',
														name: 'file_ext_custom',
														type: 'string',
														displayOptions: {
															show: {
																doc_type: ['file'],
																file_subtype: ['wedrive'],
															},
														},
														default: '',
														description: '微盘文件的扩展名（如：pdf, xlsx, docx）',
														placeholder: 'pdf',
													},
													{
														displayName: '文件大小',
														name: 'size',
														type: 'number',
														default: 0,
														description: '文件大小（字节）',
													},
												],
											},
										],
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: '记录列表 JSON',
		name: 'recordsJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '[]',
		description:
			'可选。非空数组时覆盖上方记录表单。官方 records 结构，例如 [{\"record_id\":\"...\",\"values\":{...}}]',
	},
];
