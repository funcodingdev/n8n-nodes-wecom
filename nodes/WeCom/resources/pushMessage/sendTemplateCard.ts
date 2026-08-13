import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendTemplateCard = {
	resource: ['pushMessage'],
	operation: ['sendTemplateCard'],
};

const officialDocument =
	'<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>';

export const sendTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '输入方式',
		name: 'template_card_input_mode',
		type: 'options',
		options: [
			{ name: '表单输入', value: 'form' },
			{ name: 'JSON 输入', value: 'json' },
		],
		default: 'form',
		displayOptions: { show: showOnlyForSendTemplateCard },
		description: '选择使用引导表单或完整 JSON 构建模板卡片',
	},
	{
		displayName: '模板卡片（JSON）',
		name: 'template_card_json',
		type: 'json',
		typeOptions: { rows: 10 },
		default: `{
  "card_type": "text_notice",
  "main_title": {
    "title": "标题",
    "desc": "说明"
  },
  "card_action": {
    "type": 1,
    "url": "https://work.weixin.qq.com"
  }
}`,
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['json'],
			},
		},
		description: `输入 template_card 对象，也可输入包含 template_card 的完整消息对象。${officialDocument}`,
	},
	{
		displayName: '模板类型',
		name: 'cardType',
		type: 'options',
		options: [
			{ name: '文本通知模板卡片', value: 'text_notice' },
			{ name: '图文展示模板卡片', value: 'news_notice' },
		],
		default: 'text_notice',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
			},
		},
		description: `群机器人支持文本通知和图文展示两种模板卡片。${officialDocument}`,
	},
	{
		displayName: '卡片来源',
		name: 'source',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
			},
		},
		options: [
			{
				name: 'sourceValue',
				displayName: '来源',
				values: [
					{
						displayName: '来源图标 URL',
						name: 'icon_url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/icon.png',
						description: '可选。JPG 或 PNG 图片，大小不超过 200KB。',
					},
					{
						displayName: '来源描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '企业通知',
						description: '可选。建议不超过 13 个字。',
					},
					{
						displayName: '来源描述颜色',
						name: 'desc_color',
						type: 'options',
						options: [
							{ name: '灰色（默认）', value: 0 },
							{ name: '黑色', value: 1 },
							{ name: '红色', value: 2 },
							{ name: '绿色', value: 3 },
						],
						default: 0,
					},
				],
			},
		],
	},
	{
		displayName: '主要内容',
		name: 'mainTitle',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
			},
		},
		description: '图文卡片必须填写标题；文本卡片的标题与二级普通文本至少填写一项。',
		options: [
			{
				name: 'mainTitleValue',
				displayName: '主要内容',
				values: [
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '请输入主标题...',
						description: '一级标题，建议不超过 26 个字。',
					},
					{
						displayName: '标题描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '标题辅助信息',
						description: '可选。建议不超过 30 个字。',
					},
				],
			},
		],
	},
	{
		displayName: '关键数据样式',
		name: 'emphasisContent',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['text_notice'],
			},
		},
		options: [
			{
				name: 'emphasisValue',
				displayName: '关键数据',
				values: [
					{
						displayName: '关键数据',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '99.99%',
						description: '可选。建议不超过 10 个字。',
					},
					{
						displayName: '关键数据描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '完成率',
						description: '可选。建议不超过 15 个字。',
					},
				],
			},
		],
	},
	{
		displayName: '卡片主图',
		name: 'cardImage',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['news_notice'],
			},
		},
		options: [
			{
				name: 'cardImageValue',
				displayName: '卡片主图',
				values: [
					{
						displayName: '图片 URL',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						placeholder: 'https://example.com/card.jpg',
					},
					{
						displayName: '宽高比',
						name: 'aspect_ratio',
						type: 'number',
						typeOptions: { minValue: 1.3, maxValue: 2.25, numberPrecision: 2 },
						default: 1.3,
						description: '图片宽高比，范围 1.3 到 2.25。',
					},
				],
			},
		],
	},
	{
		displayName: '左图右文样式',
		name: 'imageTextArea',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['news_notice'],
			},
		},
		options: [
			{
				name: 'imageTextValue',
				displayName: '左图右文',
				values: [
					{
						displayName: '点击动作',
						name: 'type',
						type: 'options',
						options: [
							{ name: '无点击动作', value: 0 },
							{ name: '跳转 URL', value: 1 },
							{ name: '打开小程序', value: 2 },
						],
						default: 0,
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						displayOptions: { show: { type: [1] } },
						placeholder: 'https://example.com/detail',
					},
					{
						displayName: '小程序 AppID',
						name: 'appid',
						type: 'string',
						default: '',
						required: true,
						displayOptions: { show: { type: [2] } },
					},
					{
						displayName: '小程序页面路径',
						name: 'pagepath',
						type: 'string',
						default: '',
						displayOptions: { show: { type: [2] } },
					},
					{
						displayName: '图片 URL',
						name: 'image_url',
						type: 'string',
						default: '',
						required: true,
						placeholder: 'https://example.com/image.jpg',
					},
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
					},
					{
						displayName: '描述',
						name: 'desc',
						type: 'string',
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: '引用文献样式',
		name: 'quoteArea',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
			},
		},
		description: '可选。引用区不建议与关键数据样式同时使用。',
		options: [
			{
				name: 'quoteValue',
				displayName: '引用文献',
				values: [
					{
						displayName: '点击动作',
						name: 'type',
						type: 'options',
						options: [
							{ name: '无点击动作', value: 0 },
							{ name: '跳转 URL', value: 1 },
							{ name: '打开小程序', value: 2 },
						],
						default: 0,
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						displayOptions: { show: { type: [1] } },
					},
					{
						displayName: '小程序 AppID',
						name: 'appid',
						type: 'string',
						default: '',
						required: true,
						displayOptions: { show: { type: [2] } },
					},
					{
						displayName: '小程序页面路径',
						name: 'pagepath',
						type: 'string',
						default: '',
						displayOptions: { show: { type: [2] } },
					},
					{
						displayName: '引用标题',
						name: 'title',
						type: 'string',
						default: '',
					},
					{
						displayName: '引用文案',
						name: 'quote_text',
						type: 'string',
						typeOptions: { rows: 3 },
						default: '',
					},
				],
			},
		],
	},
	{
		displayName: '二级普通文本',
		name: 'subTitleText',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['text_notice'],
			},
		},
		placeholder: '请输入补充说明...',
		description: '建议不超过 112 个字。文本卡片的标题与此字段至少填写一项。',
	},
	{
		displayName: '垂直内容列表',
		name: 'verticalContentList',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		placeholder: '添加垂直内容',
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['news_notice'],
			},
		},
		description: '可选。最多 4 项。',
		options: [
			{
				name: 'item',
				displayName: '垂直内容',
				values: [
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						required: true,
						description: '建议不超过 26 个字。',
					},
					{
						displayName: '描述',
						name: 'desc',
						type: 'string',
						default: '',
						description: '可选。建议不超过 112 个字。',
					},
				],
			},
		],
	},
	{
		displayName: '横向内容列表',
		name: 'horizontalContentList',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		placeholder: '添加横向内容',
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
			},
		},
		description: '可选。最多 6 项，可设置普通文本、链接、附件或成员详情。',
		options: [
			{
				name: 'item',
				displayName: '横向内容',
				values: [
					{
						displayName: '类型',
						name: 'type',
						type: 'options',
						options: [
							{ name: '普通文本', value: 0 },
							{ name: '跳转 URL', value: 1 },
							{ name: '文件附件', value: 2 },
							{ name: '成员详情', value: 3 },
						],
						default: 0,
					},
					{
						displayName: '标题',
						name: 'keyname',
						type: 'string',
						default: '',
						required: true,
						description: '建议不超过 5 个字。',
					},
					{
						displayName: '文本',
						name: 'value',
						type: 'string',
						default: '',
						description: '可选。附件类型时用于显示文件名。',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						displayOptions: { show: { type: [1] } },
					},
					{
						displayName: 'Media ID',
						name: 'media_id',
						type: 'string',
						default: '',
						required: true,
						displayOptions: { show: { type: [2] } },
						description: '通过本资源的“上传媒体文件”操作获得。',
					},
					{
						displayName: '成员 UserID',
						name: 'userid',
						type: 'string',
						default: '',
						displayOptions: { show: { type: [3] } },
						description: '可与下方选择二选一',
					},
					{
						displayName: '成员(选择)',
						name: 'userid_selected',
						type: 'options',
						typeOptions: { loadOptionsMethod: 'getAllUsers' },
						default: '',
						displayOptions: { show: { type: [3] } },
						description: '与上方字符串二选一；均填写时以字符串为准',
					},
				],
			},
		],
	},
	{
		displayName: '跳转指引列表',
		name: 'jumpList',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		placeholder: '添加跳转指引',
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
			},
		},
		description: '可选。最多 3 项。',
		options: [
			{
				name: 'jump',
				displayName: '跳转指引',
				values: [
					{
						displayName: '跳转类型',
						name: 'type',
						type: 'options',
						options: [
							{ name: '无跳转', value: 0 },
							{ name: '跳转 URL', value: 1 },
							{ name: '打开小程序', value: 2 },
						],
						default: 0,
					},
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						required: true,
						description: '建议不超过 13 个字。',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						displayOptions: { show: { type: [1] } },
					},
					{
						displayName: '小程序 AppID',
						name: 'appid',
						type: 'string',
						default: '',
						required: true,
						displayOptions: { show: { type: [2] } },
					},
					{
						displayName: '小程序页面路径',
						name: 'pagepath',
						type: 'string',
						default: '',
						displayOptions: { show: { type: [2] } },
					},
				],
			},
		],
	},
	{
		displayName: '整体卡片点击跳转',
		name: 'cardAction',
		type: 'fixedCollection',
		typeOptions: { multipleValues: false },
		default: {},
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
			},
		},
		options: [
			{
				name: 'actionValue',
				displayName: '卡片点击',
				values: [
					{
						displayName: '跳转类型',
						name: 'type',
						type: 'options',
						options: [
							{ name: '跳转 URL', value: 1 },
							{ name: '打开小程序', value: 2 },
						],
						default: 1,
						required: true,
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						displayOptions: { show: { type: [1] } },
					},
					{
						displayName: '小程序 AppID',
						name: 'appid',
						type: 'string',
						default: '',
						required: true,
						displayOptions: { show: { type: [2] } },
					},
					{
						displayName: '小程序页面路径',
						name: 'pagepath',
						type: 'string',
						default: '',
						displayOptions: { show: { type: [2] } },
					},
				],
			},
		],
		description: `必填。选择整个卡片点击后跳转 URL 或打开小程序。${officialDocument}`,
	},
];
