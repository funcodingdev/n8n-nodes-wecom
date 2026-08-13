import type { INodeProperties } from 'n8n-workflow';

/**
 * 发送事件响应消息参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95122
 *
 * 用于在用户进入会话等事件发生时，快速响应用户
 * 支持的消息类型：
 * - text: 文本消息
 * - msgmenu: 菜单消息
 */

const showOnlyForSendKfEventMsg = {
	resource: ['kf'],
	operation: ['sendKfEventMsg'],
};

export const sendKfEventMsgDescription: INodeProperties[] = [
	{
		displayName: '事件 Code 具有场景、会话状态和有效期限制，且通过事件回调下发的 Code 仅可使用一次；欢迎语与结束语 Code 通常仅 20 秒有效。<a href="https://developer.work.weixin.qq.com/document/path/95122" target="_blank">官方文档</a>',
		name: 'sendKfEventMsgNotice',
		type: 'notice',
		displayOptions: { show: showOnlyForSendKfEventMsg },
		default: '',
	},
	{
		displayName: '事件响应 Code',
		name: 'code',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSendKfEventMsg,
		},
		default: '',
		description: '事件响应消息对应的code，通过事件推送下发（如进入会话事件）',
		placeholder: 'CODE_FROM_EVENT',
	},
	{
		displayName: '消息 ID',
		name: 'msgid',
		type: 'string',
		displayOptions: { show: showOnlyForSendKfEventMsg },
		default: '',
		description: '可选，最多 32 字节，仅支持数字、大小写字母、下划线和连字符',
		placeholder: 'welcome_001',
	},
	{
		displayName: '消息类型',
		name: 'msgtype',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForSendKfEventMsg,
		},
		options: [
			{
				name: '文本消息',
				value: 'text',
				description: '发送纯文本欢迎消息',
			},
			{
				name: '菜单消息',
				value: 'msgmenu',
				description: '发送菜单选项消息',
			},
		],
		default: 'text',
		description: '选择要发送的消息类型',
	},

	// ==================== 文本消息参数 ====================
	{
		displayName: '消息内容',
		name: 'text_content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfEventMsg,
				msgtype: ['text'],
			},
		},
		default: '',
		description: '文本消息内容，最长不超过2048个字节',
		placeholder: '您好，欢迎咨询！',
	},

	// ==================== 菜单消息参数 ====================
	{
		displayName: '菜单起始文本',
		name: 'msgmenu_head_content',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendKfEventMsg,
				msgtype: ['msgmenu'],
			},
		},
		default: '',
		description: '可选，最多 1024 字节；与菜单项、结束文本至少填写一项',
		placeholder: '请选择您需要的服务：',
	},
	{
		displayName: '菜单项列表',
		name: 'msgmenu_list',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				...showOnlyForSendKfEventMsg,
				msgtype: ['msgmenu'],
			},
		},
		default: {},
		description: '最多 10 个菜单项',
		placeholder: '添加菜单项',
		options: [
			{
				name: 'items',
				displayName: '菜单项',
				values: [
					{
						displayName: '菜单 ID',
						name: 'reply_content',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								type: ['click'],
							},
						},
						description: '点击菜单的唯一 ID',
						placeholder: 'menu_101',
					},
					{
						displayName: '小程序 AppID',
						name: 'appid',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								type: ['miniprogram'],
							},
						},
						description: '小程序的AppID',
						placeholder: 'wx1234567890abcdef',
					},
					{
						displayName: '小程序页面路径',
						name: 'pagepath',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								type: ['miniprogram'],
							},
						},
						description: '小程序的页面路径',
						placeholder: 'pages/index.html',
					},
					{
						displayName: '菜单文案',
						name: 'content',
						type: 'string',
						required: true,
						default: '',
						description: '菜单项显示的文字',
						placeholder: '产品咨询',
					},
					{
						displayName: '菜单项类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '点击菜单',
								value: 'click',
								description: '点击后回复指定内容',
							},
							{
								name: '跳转链接',
								value: 'view',
								description: '点击后跳转到指定URL',
							},
							{
								name: '小程序',
								value: 'miniprogram',
								description: '点击后打开小程序',
							},
							{
								name: '文本',
								value: 'text',
								description: '纯文本项，可与其他菜单类型混排',
							},
						],
						default: 'click',
						description: '菜单项的类型',
					},
					{
						displayName: '跳转 URL',
						name: 'url',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								type: ['view'],
							},
						},
						description: '点击后跳转的URL',
						placeholder: 'https://example.com',
					},
					{
						displayName: '内容后不换行',
						name: 'no_newline',
						type: 'boolean',
						default: false,
						displayOptions: {
							show: {
								type: ['text'],
							},
						},
						description: '仅文本菜单项可用，开启后对应 no_newline=1',
					},
			],
			},
		],
	},
	{
		displayName: '菜单尾部文案',
		name: 'msgmenu_tail_content',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendKfEventMsg,
				msgtype: ['msgmenu'],
			},
		},
		default: '',
		description: '可选，最多 1024 字节；与起始文本、菜单项至少填写一项',
		placeholder: '如有其他问题请直接回复',
	},
];
