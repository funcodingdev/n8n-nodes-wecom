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
		displayName: '外部联系人ID',
		name: 'touser',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSendKfMsg,
		},
		default: '',
		description: '接收消息的客户UserID（external_userid）',
		placeholder: 'wmxxxxxxxxxxxxxxxxxxxx',
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
		displayName: '图片Media ID',
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
		displayName: '语音Media ID',
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
		displayName: '视频Media ID',
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
		displayName: '文件Media ID',
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
		description: '图文链接标题',
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
		description: '图文链接描述（可选）',
		placeholder: '这里是链接的详细描述...',
	},
	{
		displayName: '链接URL',
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
		description: '图文链接跳转URL',
		placeholder: 'https://example.com',
	},
	{
		displayName: '缩略图URL',
		name: 'link_thumb_url',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['link'],
			},
		},
		default: '',
		description: '图文链接缩略图URL（可选）',
		placeholder: 'https://example.com/image.jpg',
	},

	// ==================== 小程序消息参数 ====================
	{
		displayName: '小程序标题',
		name: 'miniprogram_title',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['miniprogram'],
			},
		},
		default: '',
		description: '小程序消息标题',
		placeholder: '点击打开小程序',
	},
	{
		displayName: '小程序AppID',
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
		description: '小程序的页面路径',
		placeholder: 'pages/index/index',
	},
	{
		displayName: '缩略图Media ID',
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
		displayName: '菜单标题',
		name: 'msgmenu_head_content',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['msgmenu'],
			},
		},
		default: '',
		description: '菜单消息头部文案',
		placeholder: '请选择以下选项：',
	},
	{
		displayName: '菜单项列表',
		name: 'msgmenu_list',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				...showOnlyForSendKfMsg,
				msgtype: ['msgmenu'],
			},
		},
		default: {},
		description: '菜单项列表，最多3个',
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
						description: '点击菜单的唯一 ID，建议只使用字母、数字和下划线',
						placeholder: 'menu_101',
					},
					{
						displayName: '小程序AppID',
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
						placeholder: 'pages/index/index',
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
						displayName: '跳转URL',
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
		description: '菜单消息尾部文案（可选）',
		placeholder: '如有其他问题请直接回复',
	},

	// ==================== 地理位置消息参数 ====================
	{
		displayName: '位置名称',
		name: 'location_name',
		type: 'string',
		required: true,
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
		required: true,
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
];
