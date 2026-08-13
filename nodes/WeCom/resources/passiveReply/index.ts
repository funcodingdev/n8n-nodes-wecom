import type { INodeProperties } from 'n8n-workflow';
import { sendTemplateCardDescription } from '../message/sendTemplateCard';

const showOnlyForPassiveReply = {
	resource: ['passiveReply'],
};

const templateCardExcludedFields = new Set([
	'recipientType',
	'touser',
	'toparty',
	'totag',
	'touser_manual',
	'toparty_manual',
	'totag_manual',
	'task_id',
	'button_list',
	'enable_id_trans',
	'enable_duplicate_check',
	'duplicate_check_interval',
]);

const passiveTemplateCardFields = sendTemplateCardDescription
	.filter((property) => !templateCardExcludedFields.has(property.name))
	.map((property): INodeProperties => ({
		...property,
		displayOptions: {
			...property.displayOptions,
			show: {
				...(property.displayOptions?.show ?? {}),
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
			},
		},
	}));

const passiveButtonList: INodeProperties = {
	displayName: '按钮列表',
	name: 'button_list',
	type: 'fixedCollection',
	typeOptions: { multipleValues: true },
	default: {},
	required: true,
	placeholder: '添加按钮',
	displayOptions: {
		show: {
			...showOnlyForPassiveReply,
			operation: ['reply'],
			replyType: ['update_template_card'],
			template_card_input_mode: ['form'],
			card_type: ['button_interaction'],
		},
	},
	description: '按钮交互型卡片必须包含 1 到 6 个按钮。',
	options: [
		{
			name: 'buttons',
			displayName: '按钮',
			values: [
				{
					displayName: '按钮文案',
					name: 'text',
					type: 'string',
					default: '',
					required: true,
					placeholder: '同意',
				},
				{
					displayName: '按钮样式',
					name: 'style',
					type: 'options',
					options: [
						{ name: '样式 1', value: 1 },
						{ name: '样式 2', value: 2 },
						{ name: '样式 3', value: 3 },
						{ name: '样式 4', value: 4 },
					],
					default: 1,
				},
				{
					displayName: '按钮 Key',
					name: 'key',
					type: 'string',
					default: '',
					required: true,
					placeholder: 'button_agree',
					description: '用户点击后随回调返回。同一卡片内不可重复，最长 1024 字节。',
				},
			],
		},
	],
};

export const passiveReplyDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnlyForPassiveReply },
		options: [
			{
				name: '[消息接收与发送] 被动回复',
				value: 'reply',
				action: '被动回复',
				description: '回复企业微信回调中的消息或模板卡片事件',
			},
		],
		default: 'reply',
	},
	{
		displayName: '使用提示',
		name: 'passiveReplyNotice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
			},
		},
		description: '本操作必须连接“企业微信消息接收（被动回复）”触发器、选择与触发器相同的“消息接收 API”凭证，并作为分支最后一个节点；企业微信要求在 5 秒内返回。',
	},
	{
		displayName: '回复消息类型',
		name: 'replyType',
		type: 'options',
		options: [
			{ name: '文本消息', value: 'text', description: '被动回复文本消息' },
			{ name: '图片消息', value: 'image', description: '使用媒体 ID 回复图片' },
			{ name: '语音消息', value: 'voice', description: '使用媒体 ID 回复语音' },
			{ name: '视频消息', value: 'video', description: '使用媒体 ID 回复视频' },
			{ name: '图文消息', value: 'news', description: '回复一组图文' },
			{
				name: '更新模板卡片按钮文案',
				value: 'update_button',
				description: '仅更新点击用户的按钮文案，并将按钮设为不可点击',
			},
			{
				name: '更新整张模板卡片',
				value: 'update_template_card',
				description: '更新点击用户看到的整张模板卡片',
			},
		],
		default: 'text',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
			},
		},
	},
	{
		displayName: '文本内容',
		name: 'textContent',
		type: 'string',
		typeOptions: { rows: 4 },
		default: '',
		required: true,
		placeholder: '感谢您的消息！',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['text'],
			},
		},
		description: '文本内容最长 2048 个字节。',
	},
	{
		displayName: '媒体 ID',
		name: 'mediaId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['image', 'voice', 'video'],
			},
		},
		description: '通过素材管理接口上传后获得的媒体文件 ID。',
	},
	{
		displayName: '视频标题',
		name: 'videoTitle',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['video'],
			},
		},
		description: '可选。最长 128 个字节。',
	},
	{
		displayName: '视频描述',
		name: 'videoDescription',
		type: 'string',
		typeOptions: { rows: 2 },
		default: '',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['video'],
			},
		},
		description: '可选。最长 512 个字节。',
	},
	{
		displayName: '图文消息',
		name: 'articles',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		default: {},
		required: true,
		placeholder: '添加图文',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['news'],
			},
		},
		description: '添加 1 到 8 条图文。',
		options: [
			{
				name: 'article',
				displayName: '图文',
				values: [
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						required: true,
						description: '最长 128 个字节。',
					},
					{
						displayName: '描述',
						name: 'description',
						type: 'string',
						typeOptions: { rows: 2 },
						default: '',
						description: '可选。最长 512 个字节。',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: '封面图片链接',
						name: 'picUrl',
						type: 'string',
						default: '',
						description: '可选。支持 JPG、PNG。',
					},
				],
			},
		],
	},
	...passiveTemplateCardFields,
	passiveButtonList,
	{
		displayName: '按钮替换文案',
		name: 'replace_text',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
				template_card_input_mode: ['form'],
				card_type: ['button_interaction', 'vote_interaction', 'multiple_interaction'],
			},
		},
		description: '可选。填写后展示灰色不可点击按钮。',
	},
	{
		displayName: '按钮替换名称',
		name: 'buttonReplaceName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_button'],
			},
		},
		description: '更新点击用户的按钮文案，同时将按钮变为不可点击。',
	},
];
