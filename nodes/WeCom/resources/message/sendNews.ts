import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendNews = {
	resource: ['message'],
	operation: ['sendNews'],
};

export const sendNewsDescription: INodeProperties[] = [
	...getRecipientFields('sendNews'),
	{
		displayName: '输入方式',
		name: 'news_input_mode',
		type: 'options',
		options: [
			{ name: '表单输入', value: 'form' },
			{ name: 'JSON输入', value: 'json' },
		],
		default: 'form',
		displayOptions: {
			show: showOnlySendNews,
		},
		description: '选择图文消息的输入方式',
	},
	{
		displayName: '图文列表（JSON）',
		name: 'news_json',
		type: 'json',
		typeOptions: {
			rows: 4,
		},
		default: '[]',
		placeholder: '[{"title":"标题","description":"摘要","url":"https://example.com","picurl":"https://example.com/image.jpg"}]',
		displayOptions: {
			show: {
				...showOnlySendNews,
				news_input_mode: ['json'],
			},
		},

		description:
			'使用 JSON 直接输入图文列表（数组）或完整 news 对象（包含 articles）。<a href="https://developer.work.weixin.qq.com/document/path/90236#图文消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '图文列表',
		name: 'articles',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		placeholder: '添加图文',
		displayOptions: {
			show: {
				...showOnlySendNews,
				news_input_mode: ['form'],
			},
		},
		description:
			'图文消息，一个图文消息支持1到8条图文。<a href="https://developer.work.weixin.qq.com/document/path/90236#图文消息" target="_blank">官方文档</a>',
		options: [
			{
				displayName: '图文',
				name: 'article',
				values: [
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						required: true,
						default: '',
						placeholder: '请输入图文标题',
						description:
							'标题，不超过128个字节，超过会自动截断（支持ID转译）。<a href="https://developer.work.weixin.qq.com/document/path/90236#图文消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '描述',
						name: 'description',
						type: 'string',
						typeOptions: {
							rows: 2,
						},
						default: '',
						placeholder: '请输入图文描述',
						description:
							'可选。描述，不超过512个字节，超过会自动截断（支持ID转译）。<a href="https://developer.work.weixin.qq.com/document/path/90236#图文消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '跳转类型',
						name: 'jump_type',
						type: 'options',
						options: [
							{
								name: 'URL链接',
								value: 'url',
							},
							{
								name: '小程序',
								value: 'miniprogram',
							},
						],
						default: 'url',
						description: '选择跳转类型，URL链接或小程序',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						displayOptions: {
							show: {
								jump_type: ['url'],
							},
						},
						description: '点击后跳转的链接。最长2048字节，请确保包含了协议头(http/https)，小程序或者URL必须填写一个。<a href="https://developer.work.weixin.qq.com/document/path/90236#图文消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '小程序Appid',
						name: 'appid',
						type: 'string',
						default: '',
						placeholder: 'wx1234567890abcdef',
						displayOptions: {
							show: {
								jump_type: ['miniprogram'],
							},
						},
						description: '小程序appid，必须是与当前应用关联的小程序，appid和pagepath必须同时填写，填写后会忽略URL字段。<a href="https://developer.work.weixin.qq.com/document/path/90236#图文消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '小程序Page路径',
						name: 'pagepath',
						type: 'string',
						default: '',
						placeholder: 'pages/index?userid=zhangsan',
						displayOptions: {
							show: {
								jump_type: ['miniprogram'],
							},
						},
						description: '点击消息卡片后的小程序页面，最长128字节，仅限本小程序内的页面。appid和pagepath必须同时填写，填写后会忽略URL字段。<a href="https://developer.work.weixin.qq.com/document/path/90236#图文消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '图片链接',
						name: 'picurl',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/image.jpg',
						description:
							'可选。图文消息的图片链接，最长2048字节，支持JPG、PNG格式，较好的效果为大图 1068*455，小图150*150。<a href="https://developer.work.weixin.qq.com/document/path/90236#图文消息" target="_blank">官方文档</a>',
					},
				],
			},
		],
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlySendNews,
			},
		},
		description: '可选。表示是否开启ID转译，默认否。开启后会将消息中的userid转为@对应成员显示。<a href="https://developer.work.weixin.qq.com/document/path/90236#图文消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlySendNews,
			},
		},
		description: '可选。表示是否开启重复消息检查，默认否。开启后相同内容的消息在时间间隔内不会重复发送。<a href="https://developer.work.weixin.qq.com/document/path/90236#图文消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '重复消息检查时间间隔',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendNews,
				enable_duplicate_check: [true],
			},
		},
		typeOptions: {
			minValue: 0,
			maxValue: 14400,
		},
		description:
			'可选。表示是否重复消息检查的时间间隔，默认1800秒，最大不超过4小时（14400秒）。<a href="https://developer.work.weixin.qq.com/document/path/90236#图文消息" target="_blank">官方文档</a>',
	},
];
