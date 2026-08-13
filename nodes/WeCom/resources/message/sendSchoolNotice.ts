import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSchoolNotice = {
	resource: ['message'],
	operation: ['sendSchoolNotice'],
};

const schoolNoticeDoc =
	'<a href="https://developer.work.weixin.qq.com/document/path/91609" target="_blank">官方文档</a>';

export const sendSchoolNoticeDescription: INodeProperties[] = [
	{
		displayName: '消息类型',
		name: 'msgtype',
		type: 'options',
		options: [
			{ name: '文本消息', value: 'text' },
			{ name: '图片消息', value: 'image' },
			{ name: '语音消息', value: 'voice' },
			{ name: '视频消息', value: 'video' },
			{ name: '文件消息', value: 'file' },
			{ name: '图文消息（News）', value: 'news' },
			{ name: '图文消息（Mpnews）', value: 'mpnews' },
			{ name: '小程序消息', value: 'miniprogram' },
		],
		default: 'text',
		displayOptions: { show: showOnlyForSchoolNotice },
		description: `选择要发送的学校通知类型。${schoolNoticeDoc}`,
	},
	{
		displayName: '接收身份',
		name: 'recv_scope',
		type: 'options',
		options: [
			{ name: '家长', value: 0 },
			{ name: '学生', value: 1 },
			{ name: '家长和学生', value: 2 },
		],
		default: 0,
		displayOptions: { show: showOnlyForSchoolNotice },
		description: `决定列表和班级中的接收身份。${schoolNoticeDoc}`,
	},
	{
		displayName: '发送给全部',
		name: 'toall',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnlyForSchoolNotice },
		description: `开启后发送给“接收身份”范围内的学校全部成员，并忽略下方指定列表。${schoolNoticeDoc}`,
	},
	{
		displayName: '家长 UserID 列表',
		name: 'to_parent_userid',
		type: 'string',
		default: '',
		placeholder: '例如：parent001,parent002',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				toall: [false],
				recv_scope: [0, 2],
			},
		},
		description: `多个家长 UserID 用逗号或 | 分隔，最多 1000 个。${schoolNoticeDoc}`,
	},
	{
		displayName: '学生 UserID 列表',
		name: 'to_student_userid',
		type: 'string',
		default: '',
		placeholder: '例如：student001,student002',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				toall: [false],
			},
		},
		description: `多个学生 UserID 用逗号或 | 分隔，最多 1000 个；含义随“接收身份”变化。${schoolNoticeDoc}`,
	},
	{
		displayName: '班级部门 ID 列表',
		name: 'to_party',
		type: 'string',
		default: '',
		placeholder: '例如：1,2,3',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				toall: [false],
			},
		},
		description: `多个家校通讯录部门 ID 用逗号或 | 分隔，最多 100 个。${schoolNoticeDoc}`,
	},
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				msgtype: ['text'],
			},
		},
		description: `文本内容，最长 2048 字节，支持 ID 转译。${schoolNoticeDoc}`,
	},
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				msgtype: ['image', 'voice', 'video', 'file'],
			},
		},
		description: `通过素材管理上传对应类型的临时素材后取得。${schoolNoticeDoc}`,
	},
	{
		displayName: '视频标题',
		name: 'video_title',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				msgtype: ['video'],
			},
		},
		description: `可选，最长 128 字节。${schoolNoticeDoc}`,
	},
	{
		displayName: '视频描述',
		name: 'video_description',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				msgtype: ['video'],
			},
		},
		description: `可选，最长 512 字节。${schoolNoticeDoc}`,
	},
	{
		displayName: '图文列表',
		name: 'news_articles',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		required: true,
		default: {},
		placeholder: '添加图文',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				msgtype: ['news'],
			},
		},
		description: `必须包含 1～8 条图文。${schoolNoticeDoc}`,
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
						description: '标题，最长 128 字节，支持 ID 转译',
					},
					{
						displayName: '描述',
						name: 'description',
						type: 'string',
						typeOptions: { rows: 2 },
						default: '',
						description: '可选，最长 512 字节，支持 ID 转译',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'https://example.com',
						description: '点击图文后跳转的链接',
					},
					{
						displayName: '图片链接',
						name: 'picurl',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/image.jpg',
						description: '可选，支持 JPG、PNG 格式',
					},
				],
			},
		],
	},
	{
		displayName: 'Mpnews 图文列表',
		name: 'mpnews_articles',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		required: true,
		default: {},
		placeholder: '添加图文',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				msgtype: ['mpnews'],
			},
		},
		description: `必须包含 1～8 条图文。${schoolNoticeDoc}`,
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
						description: '标题，最长 128 字节，支持 ID 转译',
					},
					{
						displayName: '缩略图 Media ID',
						name: 'thumb_media_id',
						type: 'string',
						required: true,
						default: '',
					},
					{
						displayName: '内容',
						name: 'content',
						type: 'string',
						typeOptions: { rows: 5 },
						required: true,
						default: '',
						description: '支持 HTML 标签，最长 666K 字节，支持 ID 转译',
					},
					{
						displayName: '作者',
						name: 'author',
						type: 'string',
						default: '',
						description: '可选，最长 64 字节',
					},
					{
						displayName: '阅读原文链接',
						name: 'content_source_url',
						type: 'string',
						default: '',
					},
					{
						displayName: '摘要',
						name: 'digest',
						type: 'string',
						typeOptions: { rows: 2 },
						default: '',
						description: '可选，最长 512 字节，支持 ID 转译',
					},
				],
			},
		],
	},
	{
		displayName: '小程序 AppID',
		name: 'school_miniprogram_appid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				msgtype: ['miniprogram'],
			},
		},
		description: `必须是已关联到企业的小程序。${schoolNoticeDoc}`,
	},
	{
		displayName: '小程序标题',
		name: 'school_miniprogram_title',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				msgtype: ['miniprogram'],
			},
		},
		description: `可选，最长 64 字节，支持 ID 转译。${schoolNoticeDoc}`,
	},
	{
		displayName: '小程序封面 Media ID',
		name: 'school_miniprogram_thumb_media_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				msgtype: ['miniprogram'],
			},
		},
		description: `封面图建议尺寸为 520×416。${schoolNoticeDoc}`,
	},
	{
		displayName: '小程序页面路径',
		name: 'school_miniprogram_pagepath',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'pages/index',
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				msgtype: ['miniprogram'],
			},
		},
		description: `点击消息卡片后进入的小程序页面路径。${schoolNoticeDoc}`,
	},
	{
		displayName: '开启 ID 转译',
		name: 'school_enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				msgtype: ['text', 'news', 'mpnews', 'miniprogram'],
			},
		},
		description: `将支持字段中的 UserID、部门 ID 转为通讯录名称。${schoolNoticeDoc}`,
	},
	{
		displayName: '开启重复消息检查',
		name: 'school_enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnlyForSchoolNotice },
		description: `开启后，同一时间间隔内不会重复发送相同请求。${schoolNoticeDoc}`,
	},
	{
		displayName: '重复消息检查间隔（秒）',
		name: 'school_duplicate_check_interval',
		type: 'number',
		typeOptions: { minValue: 0, maxValue: 14400 },
		default: 1800,
		displayOptions: {
			show: {
				...showOnlyForSchoolNotice,
				school_enable_duplicate_check: [true],
			},
		},
		description: `最大 14400 秒（4 小时）。${schoolNoticeDoc}`,
	},
];
