import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendTemplateCard = {
	resource: ['pushMessage'],
	operation: ['sendTemplateCard'],
};

export const sendTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '输入方式',
		name: 'template_card_input_mode',
		type: 'options',
		options: [
			{ name: '表单输入', value: 'form' },
			{ name: 'JSON输入', value: 'json' },
		],
		default: 'form',
		displayOptions: {
			show: showOnlyForSendTemplateCard,
		},
		description: '选择模板卡片的输入方式',
	},
	{
		displayName: '模板卡片（JSON）',
		name: 'template_card_json',
		type: 'json',
		typeOptions: {
			rows: 6,
		},
		default: '{}',
		placeholder: '{"card_type":"text_notice","main_title":{"title":"标题","desc":"说明"},"card_action":{"type":1,"url":"https://example.com"}}',
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['json'],
			},
		},
		description:
			'可选。使用JSON直接输入template_card对象。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
	{
		displayName: '模板类型',
		name: 'cardType',
		type: 'options',
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
			},
		},
		options: [
			{
				name: '文本通知模板卡片',
				value: 'text_notice',
				description: '用于发送文本通知',
			},
			{
				name: '图文展示模板卡片',
				value: 'news_notice',
				description: '用于发送图文展示',
			},
		],
		default: 'text_notice',
		description: '选择模板卡片类型。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
	// 文本通知模板卡片字段
	{
		displayName: '卡片来源',
		name: 'source',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['text_notice', 'news_notice'],
			},
		},
		default: {},
		options: [
			{
				name: 'sourceValue',
				displayName: '来源',
				values: [
					{
						displayName: '来源图标',
						name: 'icon_url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/icon.png',
						description: '可选。来源图片的 URL 地址。支持JPG、PNG格式，大小不超过200KB。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '来源描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '企业通知',
						description: '可选。来源文字描述，建议不超过13个汉字。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '来源描述颜色',
						name: 'desc_color',
						type: 'options',
						options: [
							{ name: '默认', value: 0 },
							{ name: '灰色', value: 1 },
							{ name: '黑色', value: 2 },
							{ name: '红色', value: 3 },
						],
						default: 0,
						description: '来源文字颜色',
					},
				],
			},
		],
	},
	{
		displayName: '主要内容',
		name: 'mainTitle',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['text_notice', 'news_notice'],
			},
		},
		default: {},
		required: true,
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
						required: true,
						placeholder: '请输入主标题...',
						description: '一级标题，必填。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '标题描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '标题辅助信息',
						description: '可选。标题辅助信息。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
				],
			},
		],
	},
	{
		displayName: '关键数据样式',
		name: 'emphasisContent',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['text_notice'],
			},
		},
		default: {},
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
						description: '可选。关键数据内容，通常用于突出显示重要数据。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '关键数据描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '完成率',
						description: '可选。关键数据辅助信息。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
				],
			},
		],
	},
	{
		displayName: '图文展示样式',
		name: 'imageTextArea',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['news_notice'],
			},
		},
		default: {},
		options: [
			{
				name: 'imageTextValue',
				displayName: '图文展示',
				values: [
					{
						displayName: '图片类型',
						name: 'type',
						type: 'options',
						options: [
							{ name: '图片链接', value: 1 },
							{ name: 'Media ID', value: 2 },
						],
						default: 1,
						description: '选择图片的提供方式',
					},
					{
						displayName: '图片链接',
						name: 'url',
						type: 'string',
						displayOptions: {
							show: {
								type: [1],
							},
						},
						default: '',
						placeholder: 'https://example.com/image.jpg',
						description: '图片的 URL 地址。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: 'Media ID',
						name: 'media_ID',
						type: 'string',
						displayOptions: {
							show: {
								type: [2],
							},
						},
						default: '',
						placeholder: '请输入图片的 media_id...',
						description: '图片的 media_id，通过素材管理接口上传图片获得。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '图片描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '请输入图片描述...',
						description: '可选。图片的辅助信息，建议不超过112个汉字。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
				],
			},
		],
	},
	{
		displayName: '二级普通文本',
		name: 'subTitleText',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['text_notice', 'news_notice'],
			},
		},
		default: '',
		placeholder: '请输入二级普通文本...',
		description: '可选。二级普通文本，用于补充说明，建议不超过112个汉字。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
	{
		displayName: '二级标题+文本列表',
		name: 'horizontalContentList',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['text_notice', 'news_notice'],
			},
		},
		default: {},
		placeholder: '添加列表项',
		options: [
			{
				name: 'item',
				displayName: '列表项',
				values: [
					{
						displayName: '标题',
						name: 'keyname',
						type: 'string',
						default: '',
						placeholder: '状态',
						description: '可选。二级标题，建议不超过5个汉字。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '文本',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '进行中',
						description: '可选。二级文本内容，建议不超过14个汉字。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
				],
			},
		],
	},
	{
		displayName: '跳转链接',
		name: 'jumpList',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['text_notice', 'news_notice'],
			},
		},
		default: {},
		placeholder: '添加跳转链接',
		options: [
			{
				name: 'jump',
				displayName: '跳转链接',
				values: [
					{
						displayName: '小程序 AppID',
						name: 'appid',
						type: 'string',
						default: '',
						placeholder: 'wx1234567890abcdef',
						description: '可选。小程序的 appid，跳转类型为小程序时必填。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '小程序页面路径',
						name: 'pagepath',
						type: 'string',
						default: '',
						placeholder: 'pages/index/index',
						description: '可选。小程序的页面路径，跳转类型为小程序时必填。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '跳转标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '查看详情',
						description: '可选。跳转链接的文字描述。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '跳转类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '跳转URL',
								value: 1
							},
							{
								name: '小程序',
								value: 2
							},
						],
						default: 1,
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/detail',
						description: '可选。跳转的 URL 地址，跳转类型为 URL 时必填。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
			],
			},
		],
	},
	{
		displayName: '整体卡片点击跳转',
		name: 'cardAction',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: false,
		},
		displayOptions: {
			show: {
				...showOnlyForSendTemplateCard,
				template_card_input_mode: ['form'],
				cardType: ['text_notice', 'news_notice'],
			},
		},
		default: {},
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
							{ name: '跳转URL', value: 1 },
							{ name: '小程序', value: 2 },
						],
						default: 1,
						description: '卡片点击后的跳转类型',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						displayOptions: {
							show: {
								type: [1],
							},
						},
						default: '',
						placeholder: 'https://example.com',
						description: '跳转的 URL 地址，跳转类型为 URL 时必填。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '小程序 AppID',
						name: 'appid',
						type: 'string',
						displayOptions: {
							show: {
								type: [2],
							},
						},
						default: '',
						placeholder: 'wx1234567890abcdef',
						description: '小程序的 appid，跳转类型为小程序时必填。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
					{
						displayName: '小程序页面路径',
						name: 'pagepath',
						type: 'string',
						displayOptions: {
							show: {
								type: [2],
							},
						},
						default: '',
						placeholder: 'pages/index/index',
						description: '小程序的页面路径，跳转类型为小程序时必填。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
					},
				],
			},
		],
	},
];
