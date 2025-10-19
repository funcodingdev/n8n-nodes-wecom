import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendTemplateCard = {
	resource: ['pushMessage'],
	operation: ['sendTemplateCard'],
};

export const sendTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '模板类型',
		name: 'cardType',
		type: 'options',
		displayOptions: {
			show: showOnlyForSendTemplateCard,
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
		description: '选择模板卡片类型',
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
						description: '来源图片的URL',
						hint: '支持JPG、PNG格式，大小不超过200KB',
					},
					{
						displayName: '来源描述',
						name: 'desc',
						type: 'string',
						default: '',
						description: '来源文字描述',
						hint: '建议不超过13个汉字',
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
						description: '一级标题',
						hint: '建议不超过26个汉字',
					},
					{
						displayName: '标题描述',
						name: 'desc',
						type: 'string',
						default: '',
						description: '标题辅助信息',
						hint: '建议不超过30个汉字',
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
						description: '关键数据内容',
						hint: '建议不超过10个汉字',
					},
					{
						displayName: '关键数据描述',
						name: 'desc',
						type: 'string',
						default: '',
						description: '关键数据辅助信息',
						hint: '建议不超过15个汉字',
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
						description: '图片的URL地址',
					},
					{
						displayName: 'Media ID',
						name: 'media_id',
						type: 'string',
						displayOptions: {
							show: {
								type: [2],
							},
						},
						default: '',
						description: '图片的media_id',
					},
					{
						displayName: '图片描述',
						name: 'desc',
						type: 'string',
						default: '',
						description: '图片的辅助信息',
						hint: '建议不超过112个汉字',
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
				cardType: ['text_notice', 'news_notice'],
			},
		},
		default: '',
		description: '二级普通文本，建议不超过112个汉字',
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
						description: '二级标题',
						hint: '建议不超过5个汉字',
					},
					{
						displayName: '文本',
						name: 'value',
						type: 'string',
						default: '',
						description: '二级文本',
						hint: '建议不超过14个汉字',
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
						displayOptions: {
							show: {
								type: [2],
							},
						},
						default: '',
						description: '小程序的appid',
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
						description: '小程序的页面路径',
					},
					{
						displayName: '跳转标题',
						name: 'title',
						type: 'string',
						default: '',
						description: '跳转链接的文字描述',
					},
					{
						displayName: '跳转类型',
						name: 'type',
						type: 'options',
						options: [
							{ name: '跳转URL', value: 1 },
							{ name: '小程序', value: 2 },
						],
						default: 1,
						description: '跳转链接类型',
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
						description: '跳转的URL地址',
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
						description: '跳转的URL地址',
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
						description: '小程序的appid',
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
						description: '小程序的页面路径',
					},
				],
			},
		],
	},
];

