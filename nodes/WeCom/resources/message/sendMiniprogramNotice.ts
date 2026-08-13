import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendMiniprogramNotice = {
	resource: ['message'],
	operation: ['sendMiniprogramNotice'],
};

export const sendMiniprogramNoticeDescription: INodeProperties[] = [
	...getRecipientFields('sendMiniprogramNotice'),
	{
		displayName: '输入方式',
		name: 'miniprogram_notice_input_mode',
		type: 'options',
		options: [
			{ name: '表单输入', value: 'form' },
			{ name: 'JSON输入', value: 'json' },
		],
		default: 'form',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '选择小程序通知的输入方式',
	},
	{
		displayName: '小程序通知内容（JSON）',
		name: 'miniprogram_notice_json',
		type: 'json',
		typeOptions: {
			rows: 4,
		},
		default: '{}',
		placeholder: '{"appid":"wx1234567890abcdef","page":"pages/index","title":"通知","description":"描述","content_item":[{"key":"姓名","value":"张三"}]}',
		displayOptions: {
			show: {
				...showOnlySendMiniprogramNotice,
				miniprogram_notice_input_mode: ['json'],
			},
		},

		description:
			'使用 JSON 直接输入 miniprogram_notice 对象。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '小程序Appid',
		name: 'appid',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'wx1234567890abcdef',
		displayOptions: {
			show: {
				...showOnlySendMiniprogramNotice,
				miniprogram_notice_input_mode: ['form'],
			},
		},
		description:
			'小程序appid，必须是与当前应用关联的小程序。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '小程序Page路径',
		name: 'page',
		type: 'string',
		default: '',
		placeholder: 'pages/index/index',
		displayOptions: {
			show: {
				...showOnlySendMiniprogramNotice,
				miniprogram_notice_input_mode: ['form'],
			},
		},
		description:
			'可选。点击消息卡片后的小程序页面，最长1024字节，仅限本小程序内的页面。不填则消息点击后不跳转。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '消息标题',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		placeholder: '请输入消息标题',
		displayOptions: {
			show: {
				...showOnlySendMiniprogramNotice,
				miniprogram_notice_input_mode: ['form'],
			},
		},
		description:
			'消息标题，长度限制4-12个汉字（支持ID转译）。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '消息描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		default: '',
		placeholder: '请输入消息描述',
		displayOptions: {
			show: {
				...showOnlySendMiniprogramNotice,
				miniprogram_notice_input_mode: ['form'],
			},
		},
		description:
			'可选。消息描述，长度限制4-12个汉字（支持ID转译）。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否放大第一个Content_item',
		name: 'emphasis_first_item',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlySendMiniprogramNotice,
				miniprogram_notice_input_mode: ['form'],
			},
		},
		description:
			'可选。是否放大第一个content_item。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '消息内容键值对',
		name: 'content_items',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: '添加内容项',
		displayOptions: {
			show: {
				...showOnlySendMiniprogramNotice,
				miniprogram_notice_input_mode: ['form'],
			},
		},
		description:
			'可选。消息内容键值对，最多允许10个item。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
		options: [
			{
				displayName: '内容项',
				name: 'item',
				values: [
					{
						displayName: '键名',
						name: 'key',
						type: 'string',
						required: true,
						default: '',
						placeholder: '例如：姓名',
						description:
							'长度10个汉字以内。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '键值',
						name: 'value',
						type: 'string',
						required: true,
						default: '',
						placeholder: '例如：张三',
						description:
							'长度30个汉字以内（支持ID转译）。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
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
				...showOnlySendMiniprogramNotice,
			},
		},
		description:
			'可选。表示是否开启ID转译，0表示否，1表示是，默认0。开启后，消息中的userid会转译为@对应成员。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlySendMiniprogramNotice,
			},
		},
		description:
			'可选。表示是否开启重复消息检查，0表示否，1表示是，默认0。开启后在时间间隔内相同内容的消息不会重复发送。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '重复消息检查时间间隔',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendMiniprogramNotice,
				enable_duplicate_check: [true],
			},
		},
		typeOptions: {
			minValue: 0,
			maxValue: 14400,
		},
		description:
			'可选。表示是否重复消息检查的时间间隔，默认1800秒，最大不超过4小时（14400秒）。<a href="https://developer.work.weixin.qq.com/document/path/90236#小程序通知消息" target="_blank">官方文档</a>',
	},
];
