import type { INodeProperties } from 'n8n-workflow';

const showOnlyForPassiveReply = {
	resource: ['passiveReply'],
};

export const passiveReplyDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForPassiveReply,
		},
		options: [
			{
				name: '[消息接收与发送] 被动回复',
				value: 'reply',
				action: '被动回复',
				description: '被动回复企业微信消息',
			},
		],
		default: 'reply',
	},
	{
		displayName: '回复消息类型',
		name: 'replyType',
		type: 'options',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
			},
		},
		options: [
			{
				name: '消息接收与发送-被动回复-文本消息',
				value: 'text',
				description: '被动回复文本消息（MsgType=text），文本内容最长不超过2048个字节',
			},
			{
				name: '消息接收与发送-被动回复-图片消息',
				value: 'image',
				description: '被动回复图片消息（MsgType=image），需提供图片媒体文件 ID',
			},
			{
				name: '消息接收与发送-被动回复-语音消息',
				value: 'voice',
				description: '被动回复语音消息（MsgType=voice），需提供语音文件 ID',
			},
			{
				name: '消息接收与发送-被动回复-视频消息',
				value: 'video',
				description: '被动回复视频消息（MsgType=video），可设置标题和描述',
			},
			{
				name: '消息接收与发送-被动回复-图文消息',
				value: 'news',
				description: '被动回复图文消息（MsgType=news），包含 ArticleCount 和 Articles',
			},
			{
				name: '消息接收与发送-被动回复-模板卡片按钮文案更新消息',
				value: 'update_button',
				description: '更新点击用户的按钮文案（MsgType=update_button）',
			},
			{
				name: '消息接收与发送-被动回复-模板卡片更新消息',
				value: 'update_template_card',
				description: '更新点击用户的整张模板卡片（MsgType=update_template_card）',
			},
		],
		default: 'text',
		description: '被动回复的消息类型',
	},
	{
		displayName: '文本内容',
		name: 'textContent',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['text'],
			},
		},
		default: '',
		required: true,
		description: '回复的文本内容',
		placeholder: '感谢您的消息！',
	},
	{
		displayName: '媒体ID',
		name: 'mediaId',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['image', 'voice', 'video'],
			},
		},
		default: '',
		required: true,
		description: '媒体文件ID（需先通过素材管理接口上传获得）。可以使用表达式从前面节点获取，如：{{$JSON.media_id}}',
	},
	{
		displayName: '视频标题',
		name: 'videoTitle',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['video'],
			},
		},
		default: '',
	},
	{
		displayName: '视频描述',
		name: 'videoDescription',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['video'],
			},
		},
		default: '',
	},
	{
		displayName: '图文消息',
		name: 'articles',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['news'],
			},
		},
		default: {},
		placeholder: '添加图文',
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
						description: '图文标题',
					},
					{
						displayName: '描述',
						name: 'description',
						type: 'string',
						typeOptions: {
							rows: 2,
						},
						default: '',
						description: '图文描述',
					},
					{
						displayName: '链接',
						name: 'url',
						type: 'string',
						default: '',
						required: true,
						description: '点击后跳转的链接',
					},
					{
						displayName: '封面图片链接',
						name: 'picUrl',
						type: 'string',
						default: '',
						description: '图文封面图片URL',
					},
				],
			},
		],
		description: '图文消息列表',
	},
	{
		displayName: '模板卡片类型',
		name: 'cardType',
		type: 'options',
		options: [
			{
				name: '文本通知型',
				value: 'text_notice',
				description: '文本通知型模板卡片',
			},
			{
				name: '图文展示型',
				value: 'news_notice',
				description: '图文展示型模板卡片',
			},
			{
				name: '按钮交互型',
				value: 'button_interaction',
				description: '按钮交互型模板卡片',
			},
			{
				name: '投票选择型',
				value: 'vote_interaction',
				description: '投票选择型模板卡片',
			},
			{
				name: '多项选择型',
				value: 'multiple_interaction',
				description: '多项选择型模板卡片',
			},
		],
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
			},
		},
		default: 'text_notice',
		description: '选择模板卡片的类型',
	},
	{
		displayName: '卡片来源',
		name: 'cardSource',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加来源信息',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
			},
		},
		description: '可选。模板卡片来源样式信息',
		options: [
			{
				name: 'source',
				displayName: '来源信息',
				values: [
					{
						displayName: '来源图标URL',
						name: 'icon_url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/icon.png',
						description: '来源图标的URL地址',
					},
					{
						displayName: '来源描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '企业微信',
						description: '来源的描述文字',
					},
				],
			},
		],
	},
	{
		displayName: '一级标题',
		name: 'cardMainTitle',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加标题',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
			},
		},
		description: '模板卡片的主要内容，包含一级标题和标题辅助信息',
		options: [
			{
				name: 'mainTitle',
				displayName: '标题内容',
				values: [
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '欢迎使用',
						description: '一级标题文本',
					},
					{
						displayName: '副标题',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '点击查看详情',
						description: '标题辅助信息',
					},
				],
			},
		],
	},
	{
		displayName: '关键数据样式',
		name: 'cardEmphasisContent',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加关键数据',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
			},
		},
		options: [
			{
				name: 'emphasisContent',
				displayName: '关键数据',
				values: [
					{
						displayName: '数据',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '100',
						description: '关键数据内容',
					},
					{
						displayName: '数据描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '已完成',
						description: '数据的描述说明',
					},
				],
			},
		],
	},
	{
		displayName: '引用文献样式',
		name: 'cardQuoteArea',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加引用',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
			},
		},
		description: '可选。引用文献样式，建议不与关键数据共用',
		options: [
			{
				name: 'quoteArea',
				displayName: '引用内容',
				values: [
					{
						displayName: '引用类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '边框类型',
								value: 1,
							},
							{
								name: '卡片类型',
								value: 2,
							},
						],
						default: 1,
						description: '引用文献的样式类型',
					},
					{
						displayName: '引用链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						description: '点击引用后跳转的链接',
					},
					{
						displayName: '引用标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '引用标题',
						description: '引用文献的标题',
					},
					{
						displayName: '引用文本',
						name: 'quote_text',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						placeholder: '引用的具体内容',
						description: '引用文献的具体文本内容',
					},
				],
			},
		],
	},
	{
		displayName: '二级普通文本',
		name: 'cardSubTitleText',
		type: 'string',
		default: '',
		placeholder: '请输入二级文本内容',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
			},
		},
		description: '可选。二级普通文本（支持ID转译），建议不超过160个字',
	},
	{
		displayName: '二级标题+文本列表',
		name: 'cardHorizontalContentList',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: '添加列表项',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
			},
		},
		description: '可选。二级标题+文本列表，列表长度不超过6',
		options: [
			{
				name: 'items',
				displayName: '列表项',
				values: [
					{
						displayName: '标题',
						name: 'keyname',
						type: 'string',
						default: '',
						placeholder: '姓名',
						description: '列表项的标题',
					},
					{
						displayName: '内容',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '张三',
						description: '列表项的内容',
					},
					{
						displayName: '内容类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '普通文本',
								value: 0,
							},
							{
								name: '带跳转链接',
								value: 1,
							},
						],
						default: 0,
						description: '内容的类型',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						description: '点击内容后跳转的链接（仅当类型为带跳转链接时有效）',
						displayOptions: {
							show: {
								type: [1],
							},
						},
					},
				],
			},
		],
	},
	{
		displayName: '跳转指引样式列表',
		name: 'cardJumpList',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: '添加跳转指引',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
			},
		},
		description: '可选。跳转指引样式的列表，列表长度不超过3',
		options: [
			{
				name: 'items',
				displayName: '跳转指引',
				values: [
					{
						displayName: '跳转类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '跳转URL',
								value: 1,
							},
							{
								name: '跳转小程序',
								value: 2,
							},
						],
						default: 1,
						description: '跳转目标的类型',
					},
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '查看详情',
						description: '跳转指引的标题',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
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
		default: {},
		placeholder: '设置卡片跳转',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
				cardType: ['text_notice'],
			},
		},
		description: '文本通知型必填。整体卡片的点击跳转事件',
		options: [
			{
				name: 'action',
				displayName: '跳转设置',
				values: [
					{
						displayName: '跳转类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '跳转URL',
								value: 1,
							},
							{
								name: '跳转小程序',
								value: 2,
							},
						],
						default: 1,
						description: '点击卡片后的跳转类型',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						description: '跳转的URL地址',
					},
				],
			},
		],
	},
	{
		displayName: '任务ID',
		name: 'cardTaskId',
		type: 'string',
		default: '',
		placeholder: 'task_001',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
			},
		},
		description: '可选。任务ID，同一个应用任务ID不能重复',
	},
	{
		displayName: '按钮列表',
		name: 'cardButtonList',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: '添加按钮',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
				cardType: ['button_interaction'],
			},
		},
		description: '按钮交互型卡片的按钮列表，列表长度不超过6',
		options: [
			{
				name: 'buttons',
				displayName: '按钮',
				values: [
					{
						displayName: '按钮文本',
						name: 'text',
						type: 'string',
						default: '',
						placeholder: '同意',
						description: '按钮上显示的文字',
					},
					{
						displayName: '按钮样式',
						name: 'style',
						type: 'options',
						options: [
							{
								name: '蓝色样式',
								value: 1,
							},
							{
								name: '灰色样式',
								value: 2,
							},
						],
						default: 1,
						description: '按钮的样式类型',
					},
					{
						displayName: '按钮Key',
						name: 'key',
						type: 'string',
						default: '',
						placeholder: 'btn_agree',
						description: '按钮的唯一标识，用于回调事件',
					},
				],
			},
		],
	},
	{
		displayName: '选择题Key值',
		name: 'cardCheckboxQuestionKey',
		type: 'string',
		default: '',
		placeholder: 'question_001',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
				cardType: ['vote_interaction', 'multiple_interaction'],
			},
		},
		description: '可选。选择题key值，用户提交选项后会产生回调事件',
	},
	{
		displayName: '选择题模式',
		name: 'cardCheckboxMode',
		type: 'options',
		options: [
			{
				name: '单选',
				value: 'single',
			},
			{
				name: '多选',
				value: 'multiple',
			},
		],
		default: 'single',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
				cardType: ['vote_interaction', 'multiple_interaction'],
			},
		},
		description: '可选。选择题模式，单选或多选',
	},
	{
		displayName: '选项列表',
		name: 'cardOptionList',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: '添加选项',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
				cardType: ['vote_interaction', 'multiple_interaction'],
			},
		},
		description: '选项列表，列表长度不超过10',
		options: [
			{
				name: 'options',
				displayName: '选项',
				values: [
					{
						displayName: '选项ID',
						name: 'id',
						type: 'string',
						default: '',
						placeholder: 'option1',
						description: '选项的唯一标识',
					},
					{
						displayName: '选项文本',
						name: 'text',
						type: 'string',
						default: '',
						placeholder: '选项一',
						description: '选项显示的文本',
					},
				],
			},
		],
	},
	{
		displayName: '提交按钮文案',
		name: 'cardSubmitButtonText',
		type: 'string',
		default: '提交',
		placeholder: '提交',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
				cardType: ['vote_interaction', 'multiple_interaction'],
			},
		},
		description: '可选。提交按钮文案，建议不超过10个字',
	},
	{
		displayName: '提交按钮Key值',
		name: 'cardSubmitButtonKey',
		type: 'string',
		default: '',
		placeholder: 'submit_001',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
				cardType: ['vote_interaction', 'multiple_interaction'],
			},
		},
		description: '提交按钮key值，用户提交选项后会产生回调事件',
	},
	{
		displayName: '图片样式',
		name: 'cardImageTextArea',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加图片',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
				cardType: ['news_notice'],
			},
		},
		description: '可选。左图右文样式',
		options: [
			{
				name: 'imageText',
				displayName: '图片内容',
				values: [
					{
						displayName: '图片类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '普通图片',
								value: 0,
							},
							{
								name: '可点击图片',
								value: 1,
							},
						],
						default: 0,
						description: '图片的类型',
					},
					{
						displayName: '图片链接',
						name: 'image_url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/image.png',
						description: '图片的URL地址',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						description: '点击图片后跳转的链接（仅当类型为可点击图片时有效）',
						displayOptions: {
							show: {
								type: [1],
							},
						},
					},
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '图片标题',
						description: '图片的标题',
					},
					{
						displayName: '描述',
						name: 'desc',
						type: 'string',
						typeOptions: {
							rows: 2,
						},
						default: '',
						placeholder: '图片描述',
						description: '图片的描述文字',
					},
				],
			},
		],
	},
	{
		displayName: '卡片右上角更多操作按钮',
		name: 'cardActionMenu',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加操作菜单',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_template_card'],
			},
		},
		options: [
			{
				name: 'actionMenu',
				displayName: '操作菜单',
				values: [
					{
						displayName: '菜单描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '更多操作',
						description: '菜单的描述文字',
					},
					{
						displayName: '操作列表',
						name: 'action_list',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: '添加操作',
						options: [
							{
								name: 'actions',
								displayName: '操作',
								values: [
									{
										displayName: '操作文本',
										name: 'text',
										type: 'string',
										default: '',
										placeholder: '删除',
										description: '操作的文本',
									},
									{
										displayName: '操作Key',
										name: 'key',
										type: 'string',
										default: '',
										placeholder: 'action_delete',
										description: '操作的唯一标识',
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: '按钮替换名称',
		name: 'buttonReplaceName',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForPassiveReply,
				operation: ['reply'],
				replyType: ['update_button', 'update_template_card'],
			},
		},
		default: '',
		description: '按钮替换名称。用于更新点击用户的按钮文案，按钮会自动变更为不可点击状态',
	},
];
