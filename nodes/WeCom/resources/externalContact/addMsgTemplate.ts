import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['addMsgTemplate'] };

export const addMsgTemplateDescription: INodeProperties[] = [
	{
		displayName: '此接口只创建群发任务，不会直接发送；成员需在企业微信中确认后才会触达客户或客户群',
		name: 'groupMessageConfirmationNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '群发任务类型',
		name: 'chat_type',
		type: 'options',
		options: [
			{ name: '发送给客户（单聊）', value: 'single', description: '发送给客户个人' },
			{ name: '发送给客户群（群聊）', value: 'group', description: '发送到客户群' },
		],
		default: 'single',
		displayOptions: { show: showOnly },
		description: '群发任务的类型，默认为single表示发送给客户',
	},
	// 发送成员（群聊时必填）
	{
		displayName: '发送成员UserID',
		name: 'sender',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '发送企业群发消息的成员 UserID；客户群群发时必填；可与下方选择二选一',
		placeholder: 'zhangsan',
	},
	{
		displayName: '发送成员(选择)',
		name: 'sender_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnly },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	// 客户列表（单聊时使用）
	{
		displayName: '客户ExternalUserID列表',
		name: 'external_userid',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, chat_type: ['single'] } },
		description: '客户的external_userid列表，用逗号分隔，最多可一次指定1万个客户。如不指定，则默认给该成员所有客户发送',
		placeholder: 'woAJ2GCAAAXtWyujaWJHDDGi0mACAAAA,wmqfasd1e1927831123109rBAAAA',
	},
	// 客户群列表（群聊时使用）
	{
		displayName: '客户群ID列表',
		name: 'chat_id_list',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, chat_type: ['group'] } },
		description: '客户群ID列表，用逗号分隔，最多可一次指定2000个客户群。指定群ID后，群主无须再选择客户群',
		placeholder: 'wr2GCAAAXtWyujaWJHDDGasdadAAA',
	},
	// 标签过滤（单聊时使用）
	{
		displayName: '启用标签过滤',
		name: 'enableTagFilter',
		type: 'boolean',
		default: false,
		displayOptions: { show: { ...showOnly, chat_type: ['single'] } },
		description: '同组标签按“或”、不同组按“且”；若同时填写客户 ExternalUserID，接口会忽略标签过滤，本节点也不会发送标签过滤',
	},
	{
		displayName: '标签组',
		name: 'tagFilterGroups',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: { show: { ...showOnly, chat_type: ['single'], enableTagFilter: [true] } },
		placeholder: '添加标签组',
		description: '标签过滤组，同组标签之间按或关系筛选，不同组标签按且关系筛选',
		options: [
			{
				displayName: '标签组',
				name: 'groups',
				values: [
					{
						displayName: '标签ID列表',
						name: 'tag_list',
						type: 'string',
						default: '',
						description: '标签ID列表，用逗号分隔，每组最多指定100个标签',
						placeholder: 'ete19278asuMT123109rBAAAA,ete19MT12278109UYteaBAAAA',
					},
				],
			},
		],
	},
	// 是否允许成员重新选择
	{
		displayName: '允许成员重新选择客户',
		name: 'allow_select',
		type: 'boolean',
		default: false,
		displayOptions: { show: { ...showOnly, chat_type: ['single'] } },
		description: '是否允许成员在待发送客户列表中重新进行选择，默认为false，仅支持客户群发场景',
	},
	// 文本内容
	{
		displayName: '文本消息内容',
		name: 'text_content',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		typeOptions: { rows: 4 },
		description: '消息文本内容，最多4000个字节。text和attachments不能同时为空',
		placeholder: '亲爱的客户，感谢您的支持...',
	},
	// 附件
	{
		displayName: '添加附件',
		name: 'enableAttachments',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '是否添加附件，最多支持添加9个附件',
	},
	{
		displayName: '附件列表',
		name: 'attachments',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: { show: { ...showOnly, enableAttachments: [true] } },
		placeholder: '添加附件',
		description: '最多支持添加9个附件，可以是图片、链接、小程序、视频或文件',
		options: [
			{
				displayName: '图片附件',
				name: 'images',
				values: [
					{
						displayName: '图片Media ID',
						name: 'media_id',
						type: 'string',
						default: '',
						description: '图片的media_id，可通过素材管理接口获得。media_id和pic_url只需填写一个',
					},
					{
						displayName: '图片URL',
						name: 'pic_url',
						type: 'string',
						default: '',
						description: '图片的链接，仅可使用上传图片接口得到的链接。media_id和pic_url只需填写一个',
					},
				],
			},
			{
				displayName: '链接附件',
				name: 'links',
				values: [
					{
						displayName: '标题（必填）',
						name: 'title',
						type: 'string',
						default: '',
						required: true,
						description: '图文消息标题，最长128个字节',
					},
					{
						displayName: '封面URL',
						name: 'picurl',
						type: 'string',
						default: '',
						description: '图文消息封面的URL，最长2048个字节',
					},
					{
						displayName: '描述',
						name: 'desc',
						type: 'string',
						default: '',
						description: '图文消息的描述，最多512个字节',
					},
					{
						displayName: '链接URL（必填）',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						description: '图文消息的链接，最长2048个字节',
					},
				],
			},
			{
				displayName: '小程序附件',
				name: 'miniprograms',
				values: [
					{
						displayName: '标题（必填）',
						name: 'title',
						type: 'string',
						default: '',
						required: true,
						description: '小程序消息标题，最多64个字节',
					},
					{
						displayName: '封面Media ID（必填）',
						name: 'pic_media_id',
						type: 'string',
						default: '',
						required: true,
						description: '小程序消息封面的mediaid，封面图建议尺寸为520*416',
					},
					{
						displayName: 'AppID（必填）',
						name: 'appid',
						type: 'string',
						default: '',
						required: true,
						description: '小程序appid，必须是关联到企业的小程序应用',
					},
					{
						displayName: '页面路径（必填）',
						name: 'page',
						type: 'string',
						default: '',
						required: true,
						description: '小程序page路径',
						placeholder: '/path/index.html',
					},
				],
			},
			{
				displayName: '视频附件',
				name: 'videos',
				values: [
					{
						displayName: '视频Media ID（必填）',
						name: 'media_id',
						type: 'string',
						default: '',
						required: true,
						description: '视频的media_id，可通过素材管理接口获得',
					},
				],
			},
			{
				displayName: '文件附件',
				name: 'files',
				values: [
					{
						displayName: '文件Media ID（必填）',
						name: 'media_id',
						type: 'string',
						default: '',
						required: true,
						description: '文件的media_id，可通过素材管理接口获得',
					},
				],
			},
		],
	},
];
