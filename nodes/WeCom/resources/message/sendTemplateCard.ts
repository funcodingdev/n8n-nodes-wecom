import type { INodeProperties } from 'n8n-workflow';

const showOnlySendTemplateCard = {
	resource: ['message'],
	operation: ['sendTemplateCard'],
};

export const sendTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '接收人',
		name: 'touser',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '成员ID列表（消息接收者，多个接收者用 | 分隔，最多支持1000个）。特殊情况：指定为 @all，则向该企业应用的全部成员发送',
	},
	{
		displayName: '部门ID',
		name: 'toparty',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '部门ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '标签ID',
		name: 'totag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '标签ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '模板卡片类型',
		name: 'card_type',
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
		required: true,
		default: 'text_notice',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '选择模板卡片的类型',
	},
	{
		displayName: '模板卡片来源样式信息',
		name: 'source',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '模板卡片来源样式信息，不需要来源样式可不填写，JSON格式。参考文档：https://developer.work.weixin.qq.com/document/path/90236#%E6%A8%A1%E6%9D%BF%E5%8D%A1%E7%89%87%E6%B6%88%E6%81%AF',
	},
	{
		displayName: '一级标题',
		name: 'main_title',
		type: 'json',
		default: '{"title": ""}',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '模板卡片的主要内容，包含一级标题和标题辅助信息，JSON格式',
	},
	{
		displayName: '关键数据样式',
		name: 'emphasis_content',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '关键数据样式，JSON格式',
	},
	{
		displayName: '引用文献样式',
		name: 'quote_area',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '引用文献样式，建议不与关键数据共用，JSON格式',
	},
	{
		displayName: '二级普通文本',
		name: 'sub_title_text',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '二级普通文本，建议不超过160个字，（支持id转译）',
	},
	{
		displayName: '二级标题+文本列表',
		name: 'horizontal_content_list',
		type: 'json',
		typeOptions: {
			rows: 4,
		},
		default: '[]',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '二级标题+文本列表，该字段可为空数组，但有数据的话需确认对应字段是否必填，列表长度不超过6，JSON数组格式',
	},
	{
		displayName: '跳转指引样式的列表',
		name: 'jump_list',
		type: 'json',
		typeOptions: {
			rows: 4,
		},
		default: '[]',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '跳转指引样式的列表，该字段可为空数组，但有数据的话需确认对应字段是否必填，列表长度不超过3，JSON数组格式',
	},
	{
		displayName: '整体卡片的点击跳转事件',
		name: 'card_action',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '整体卡片的点击跳转事件，text_notice必填，news_notice不需要，JSON格式',
	},
	{
		displayName: '任务id',
		name: 'task_id',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '任务id，同一个应用任务id不能重复，只能由数字、字母和"_-@"组成，最长128字节，填了action_menu字段的话本字段必填',
	},
	{
		displayName: '按钮列表',
		name: 'button_list',
		type: 'json',
		typeOptions: {
			rows: 4,
		},
		default: '[]',
		displayOptions: {
			show: {
				...showOnlySendTemplateCard,
				card_type: ['button_interaction'],
			},
		},
		description: '按钮交互型卡片的按钮列表，该字段可为空数组，但有数据的话需确认对应字段是否必填，列表长度不超过6，JSON数组格式',
	},
	{
		displayName: '选择题key值',
		name: 'checkbox_question_key',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlySendTemplateCard,
				card_type: ['vote_interaction', 'multiple_interaction'],
			},
		},
		description: '选择题key值，用户提交选项后，会产生回调事件，回调事件会将本参数作为EventKey返回，最长支持1024字节',
	},
	{
		displayName: '选择题模式',
		name: 'checkbox_mode',
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
				...showOnlySendTemplateCard,
				card_type: ['vote_interaction', 'multiple_interaction'],
			},
		},
		description: '选择题模式，单选为single，多选为multiple，不填默认单选',
	},
	{
		displayName: '选项列表',
		name: 'option_list',
		type: 'json',
		typeOptions: {
			rows: 4,
		},
		default: '[]',
		displayOptions: {
			show: {
				...showOnlySendTemplateCard,
				card_type: ['vote_interaction', 'multiple_interaction'],
			},
		},
		required: true,
		description: '选项列表，列表长度不超过10，JSON数组格式。每个选项包含id和text字段',
	},
	{
		displayName: '提交按钮文案',
		name: 'submit_button_text',
		type: 'string',
		default: '提交',
		displayOptions: {
			show: {
				...showOnlySendTemplateCard,
				card_type: ['vote_interaction', 'multiple_interaction'],
			},
		},
		description: '提交按钮文案，建议不超过10个字，不填默认为提交',
	},
	{
		displayName: '提交按钮key值',
		name: 'submit_button_key',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				...showOnlySendTemplateCard,
				card_type: ['vote_interaction', 'multiple_interaction'],
			},
		},
		required: true,
		description: '提交按钮key值，用户提交选项后，会产生回调事件，回调事件会将本参数作为EventKey返回，最长支持1024字节',
	},
	{
		displayName: '图片样式',
		name: 'image_text_area',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				...showOnlySendTemplateCard,
				card_type: ['news_notice'],
			},
		},
		description: '左图右文样式，JSON格式',
	},
	{
		displayName: '卡片右上角更多操作按钮',
		name: 'action_menu',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: '卡片右上角更多操作按钮，JSON格式',
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: 'Whether to enable ID translation. 0 means no, 1 means yes, default is 0.',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendTemplateCard,
		},
		description: 'Whether to enable duplicate message check. 0 means no, 1 means yes, default is 0.',
	},
	{
		displayName: '重复消息检查时间',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendTemplateCard,
				enable_duplicate_check: [true],
			},
		},
		description: '表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时',
	},
];

