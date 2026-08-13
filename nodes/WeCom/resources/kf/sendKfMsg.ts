import type { INodeProperties } from 'n8n-workflow';

/**
 * 发送客服消息参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/94677
 *
 * 支持的消息类型：
 * - text: 文本消息
 * - image: 图片消息
 * - voice: 语音消息
 * - video: 视频消息
 * - file: 文件消息
 * - link: 图文链接消息
 * - miniprogram: 小程序消息
 * - msgmenu: 菜单消息
 * - location: 地理位置消息
 * - ca_link: 获客链接消息
 */

const showOnlyForSendKfMsg = {
	resource: ['kf'],
	operation: ['sendKfMsg'],
};

export const sendKfMsgDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForSendKfMsg,
		},
		default: '',
		description: '选择要使用的客服账号',
	},
	{
		displayName: '客户 External UserID',
		name: 'touser',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSendKfMsg,
		},
		default: '',
		description: '接收消息的微信客户 external_userid',
		placeholder: 'wmxxxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '发送限制',
		name: 'sendKfMsgNotice',
		type: 'notice',
		displayOptions: { show: showOnlyForSendKfMsg },
		default: '',
		description: '仅可在客户主动发消息后的 48 小时内发送，最多 5 条。接口返回成功不代表最终送达，还需关注消息发送失败回调。<a href="https://developer.work.weixin.qq.com/document/path/94677" target="_blank">官方文档</a>',
	},
	{
		displayName: '消息 ID',
		name: 'msgid',
		type: 'string',
		displayOptions: { show: showOnlyForSendKfMsg },
		default: '',
		description: '可选，最多 32 字节，仅支持数字、大小写字母、下划线和连字符；指定时须保证该客服账号内唯一',
		placeholder: 'order_20260813_001',
	},
	{
		displayName: '消息类型',
		name: 'msgtype',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForSendKfMsg,
		},
		 
		options: [
			{
				name: '文本消息',
				value: 'text',
				description: '发送纯文本消息',
			},
			{
				name: '图片消息',
				value: 'image',
				description: '发送图片消息',
			},
			{
				name: '语音消息',
				value: 'voice',
				description: '发送语音消息',
			},
			{
				name: '视频消息',
				value: 'video',
				description: '发送视频消息',
			},
			{
				name: '文件消息',
				value: 'file',
				description: '发送文件消息',
			},
			{
				name: '图文链接',
				value: 'link',
				description: '发送图文链接消息',
			},
			{
				name: '小程序消息',
				value: 'miniprogram',
				description: '发送小程序卡片',
			},
			{
				name: '菜单消息',
				value: 'msgmenu',
				description: '发送菜单消息',
			},
			{
				name: '地理位置',
				value: 'location',
				description: '发送地理位置消息',
			},
			{
				name: '获客链接',
				value: 'ca_link',
				description: '发送由获客助手创建的获客链接名片',
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
				...showOnlyForSendKfMsg,
				msgtype: ['text'],
			},
		},
		default: '',
		description: '文本消息内容，最长不超过2048个字节',
		placeholder: '请输入要发送的文本内容...',
	},

	// ==================== 图片消息参数 ====================
	{
		displayName: '图片 Media ID',
		name: 'image_media_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['image'],
			},
		},
		default: '',
		description: '图片的media_id，通过"上传临时素材"接口获取',
		placeholder: 'MEDIA_ID',
	},

	// ==================== 语音消息参数 ====================
	{
		displayName: '语音 Media ID',
		name: 'voice_media_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['voice'],
			},
		},
		default: '',
		description: '语音的media_id，通过"上传临时素材"接口获取',
		placeholder: 'MEDIA_ID',
	},

	// ==================== 视频消息参数 ====================
	{
		displayName: '视频 Media ID',
		name: 'video_media_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['video'],
			},
		},
		default: '',
		description: '视频的media_id，通过"上传临时素材"接口获取',
		placeholder: 'MEDIA_ID',
	},

	// ==================== 文件消息参数 ====================
	{
		displayName: '文件 Media ID',
		name: 'file_media_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['file'],
			},
		},
		default: '',
		description: '文件的media_id，通过"上传临时素材"接口获取',
		placeholder: 'MEDIA_ID',
	},

	// ==================== 图文链接消息参数 ====================
	{
		displayName: '链接标题',
		name: 'link_title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['link'],
			},
		},
		default: '',
		description: '图文链接标题，最多 128 字节',
		placeholder: '点击查看详情',
	},
	{
		displayName: '链接描述',
		name: 'link_desc',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['link'],
			},
		},
		default: '',
		description: '可选，最多 512 字节',
		placeholder: '这里是链接的详细描述...',
	},
	{
		displayName: '链接 URL',
		name: 'link_url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['link'],
			},
		},
		default: '',
		description: '图文链接跳转 URL，最多 2048 字节，须包含 http/https 协议头',
		placeholder: 'https://example.com',
	},
	{
		displayName: '缩略图 Media ID',
		name: 'link_thumb_media_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['link'],
			},
		},
		default: '',
		description: '必填，通过上传临时素材接口获取的缩略图 Media ID',
		placeholder: 'MEDIA_ID',
	},

	// ==================== 小程序消息参数 ====================
	{
		displayName: '小程序标题',
		name: 'miniprogram_title',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['miniprogram'],
			},
		},
		default: '',
		description: '可选，小程序消息标题，最多 64 字节',
		placeholder: '点击打开小程序',
	},
	{
		displayName: '小程序 AppID',
		name: 'miniprogram_appid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['miniprogram'],
			},
		},
		default: '',
		description: '小程序的AppID',
		placeholder: 'wx1234567890abcdef',
	},
	{
		displayName: '小程序页面路径',
		name: 'miniprogram_pagepath',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['miniprogram'],
			},
		},
		default: '',
		description: '小程序页面路径，需要以 .html 结尾',
		placeholder: 'pages/index.html',
	},
	{
		displayName: '缩略图 Media ID',
		name: 'miniprogram_thumb_media_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['miniprogram'],
			},
		},
		default: '',
		description: '小程序消息封面图的media_id',
		placeholder: 'MEDIA_ID',
	},

	// ==================== 菜单消息参数 ====================
	{
		displayName: '菜单起始文本',
		name: 'msgmenu_head_content',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['msgmenu'],
			},
		},
		default: '',
		description: '可选，最多 1024 字节；与菜单项、结束文本至少填写一项',
		placeholder: '请选择以下选项：',
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
				...showOnlyForSendKfMsg,
				msgtype: ['msgmenu'],
			},
		},
		default: {},
		description: '最多 50 个菜单项，其中点击、跳转链接和小程序类型合计不超过 10 个',
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
						description: '可选，最多 128 字节；建议只使用字母、数字和下划线',
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
						placeholder: '选项1',
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
				...showOnlyForSendKfMsg,
				msgtype: ['msgmenu'],
			},
		},
		default: '',
		description: '可选，最多 1024 字节；与起始文本、菜单项至少填写一项',
		placeholder: '如有其他问题请直接回复',
	},

	// ==================== 地理位置消息参数 ====================
	{
		displayName: '位置名称',
		name: 'location_name',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['location'],
			},
		},
		default: '',
		placeholder: '北京市朝阳区',
	},
	{
		displayName: '详细地址',
		name: 'location_address',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['location'],
			},
		},
		default: '',

		placeholder: '朝阳区xx路xx号',
	},
	{
		displayName: '纬度',
		name: 'location_latitude',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['location'],
			},
		},
		default: 0,
		description: '纬度（-90到90之间）',
		placeholder: '39.9042',
		typeOptions: {
			minValue: -90,
			maxValue: 90,
		},
	},
	{
		displayName: '经度',
		name: 'location_longitude',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['location'],
			},
		},
		default: 0,
		description: '经度（-180到180之间）',
		placeholder: '116.4074',
		typeOptions: {
			minValue: -180,
			maxValue: 180,
		},
	},
	{
		displayName: '获客链接 URL',
		name: 'ca_link_url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['ca_link'],
			},
		},
		default: '',
		description: '通过获客助手创建的获客链接，须包含 http/https 协议头',
		placeholder: 'https://work.weixin.qq.com/ca/xxxxxx',
	},
];
