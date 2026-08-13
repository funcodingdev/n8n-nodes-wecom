import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['kf'], operation: ['manageKnowledgeIntent'] };

const attachmentValues: INodeProperties[] = [
	{
		displayName: '附件类型',
		name: 'msgtype',
		type: 'options',
		options: [
			{ name: '图片', value: 'image' },
			{ name: '视频', value: 'video' },
			{ name: '链接', value: 'link' },
			{ name: '小程序', value: 'miniprogram' },
		],
		default: 'image',
	},
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { msgtype: ['image', 'video'] } },
		description: '通过上传临时素材接口获取',
	},
	{
		displayName: '链接标题',
		name: 'link_title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { msgtype: ['link'] } },
	},
	{
		displayName: '链接描述',
		name: 'link_desc',
		type: 'string',
		typeOptions: { rows: 2 },
		default: '',
		displayOptions: { show: { msgtype: ['link'] } },
	},
	{
		displayName: '链接 URL',
		name: 'link_url',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { msgtype: ['link'] } },
		placeholder: 'https://example.com',
	},
	{
		displayName: '缩略图 URL',
		name: 'link_pic_url',
		type: 'string',
		default: '',
		displayOptions: { show: { msgtype: ['link'] } },
		placeholder: 'https://example.com/image.jpg',
	},
	{
		displayName: '小程序标题',
		name: 'miniprogram_title',
		type: 'string',
		default: '',
		displayOptions: { show: { msgtype: ['miniprogram'] } },
		description: '可选，最多 64 字节',
	},
	{
		displayName: '小程序 AppID',
		name: 'miniprogram_appid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { msgtype: ['miniprogram'] } },
		description: '必须是已关联到企业的小程序 AppID',
	},
	{
		displayName: '小程序页面路径',
		name: 'miniprogram_pagepath',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { msgtype: ['miniprogram'] } },
		placeholder: '/path/index.html',
	},
	{
		displayName: '小程序封面 Media ID',
		name: 'miniprogram_thumb_media_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { msgtype: ['miniprogram'] } },
	},
];

function similarQuestionsProperty(
	name: string,
	displayName: string,
	displayOptions: INodeProperties['displayOptions'],
): INodeProperties {
	return {
		displayName,
		name,
		type: 'fixedCollection',
		displayOptions,
		default: {},
		placeholder: '添加相似问法',
		typeOptions: { multipleValues: true },
		description: '最多 100 个，每个不超过 200 个字；修改时留空表示清空相似问法',
		options: [
			{
				displayName: '问法',
				name: 'questions',
				values: [
					{
						displayName: '相似问题',
						name: 'text',
						type: 'string',
						required: true,
						default: '',
						typeOptions: { maxLength: 200 },
					},
				],
			},
		],
	};
}

function attachmentsProperty(
	name: string,
	displayOptions: INodeProperties['displayOptions'],
): INodeProperties {
	return {
		displayName: '回答附件',
		name,
		type: 'fixedCollection',
		displayOptions,
		default: {},
		placeholder: '添加附件',
		typeOptions: { multipleValues: true },
		description: '可选，最多 4 个，支持图片、视频、链接和小程序',
		options: [
			{
				displayName: '附件',
				name: 'attachments',
				values: attachmentValues,
			},
		],
	};
}

export const manageKnowledgeIntentDescription: INodeProperties[] = [
	{
		displayName: '仅企业内部开发支持知识库管理；第三方及代开发应用暂不支持。不同分组的问题不能重复，每个分组最多 200 个问答。<a href="https://developer.work.weixin.qq.com/document/path/95972" target="_blank">官方文档</a>',
		name: 'knowledgeIntentNotice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
	},
	{
		displayName: '操作类型',
		name: 'action_type',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '新增问答', value: 'add', description: '创建新的知识库问答' },
			{ name: '删除问答', value: 'del', description: '删除已存在的知识库问答' },
			{ name: '修改问答', value: 'mod', description: '按所选部分覆盖修改问答' },
			{ name: '获取问答列表', value: 'list', description: '分页查询知识库问答' },
		],
		default: 'list',
	},
	{
		displayName: '删除知识库问答会立即生效，请确认问答 ID 无误。',
		name: 'deleteKnowledgeIntentNotice',
		type: 'notice',
		displayOptions: { show: { ...showOnly, action_type: ['del'] } },
		default: '',
	},
	{
		displayName: '输入方式',
		name: 'intentInputMode',
		type: 'options',
		options: [
			{ name: '表单', value: 'form' },
			{ name: 'JSON', value: 'json' },
		],
		default: 'form',
		displayOptions: { show: { ...showOnly, action_type: ['add', 'mod'] } },
		description: '使用结构化表单，或提供符合企业微信接口结构的完整请求 JSON',
	},
	{
		displayName: '问答请求 JSON',
		name: 'intentBodyJson',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: { ...showOnly, action_type: ['add', 'mod'], intentInputMode: ['json'] },
		},
		description: '新增时须包含 group_id、question、answers；修改时须包含 intent_id，并至少包含 question、similar_questions、answers 之一。所有嵌套字段仍会按官方限制校验。',
	},
	{
		displayName: '分组 ID',
		name: 'group_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { ...showOnly, action_type: ['add'], intentInputMode: ['form'] },
		},
		description: '新增问答所属的知识库分组 ID',
	},
	{
		displayName: '问答 ID',
		name: 'intent_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { ...showOnly, action_type: ['del'] } },
	},
	{
		displayName: '主问题',
		name: 'question_text',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { maxLength: 200 },
		displayOptions: {
			show: { ...showOnly, action_type: ['add'], intentInputMode: ['form'] },
		},
		description: '主问题文本，不超过 200 个字',
		placeholder: '如何申请退款？',
	},
	similarQuestionsProperty('similarQuestionsCollection', '相似问法', {
		show: { ...showOnly, action_type: ['add'], intentInputMode: ['form'] },
	}),
	{
		displayName: '回答文本',
		name: 'answer_text',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { rows: 4 },
		displayOptions: {
			show: { ...showOnly, action_type: ['add'], intentInputMode: ['form'] },
		},
		description: '回答文本，不超过 500 个字',
		placeholder: '您可以在订单详情页面申请退款……',
	},
	attachmentsProperty('attachmentsCollection', {
		show: { ...showOnly, action_type: ['add'], intentInputMode: ['form'] },
	}),
	{
		displayName: '问答 ID',
		name: 'mod_intent_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: { ...showOnly, action_type: ['mod'], intentInputMode: ['form'] },
		},
	},
	{
		displayName: '修改主问题',
		name: 'updateQuestion',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { ...showOnly, action_type: ['mod'], intentInputMode: ['form'] },
		},
		description: '所选部分为覆盖写入',
	},
	{
		displayName: '新主问题',
		name: 'updated_question_text',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { maxLength: 200 },
		displayOptions: {
			show: {
				...showOnly,
				action_type: ['mod'],
				intentInputMode: ['form'],
				updateQuestion: [true],
			},
		},
	},
	{
		displayName: '修改相似问法',
		name: 'updateSimilarQuestions',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { ...showOnly, action_type: ['mod'], intentInputMode: ['form'] },
		},
		description: '开启后覆盖完整相似问法列表；不添加任何问法可清空列表',
	},
	similarQuestionsProperty('updatedSimilarQuestionsCollection', '新相似问法', {
		show: {
			...showOnly,
			action_type: ['mod'],
			intentInputMode: ['form'],
			updateSimilarQuestions: [true],
		},
	}),
	{
		displayName: '修改回答',
		name: 'updateAnswer',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: { ...showOnly, action_type: ['mod'], intentInputMode: ['form'] },
		},
		description: '开启后覆盖回答文本及全部附件',
	},
	{
		displayName: '新回答文本',
		name: 'updated_answer_text',
		type: 'string',
		required: true,
		default: '',
		typeOptions: { rows: 4 },
		displayOptions: {
			show: {
				...showOnly,
				action_type: ['mod'],
				intentInputMode: ['form'],
				updateAnswer: [true],
			},
		},
		description: '不超过 500 个字',
	},
	attachmentsProperty('updatedAttachmentsCollection', {
		show: {
			...showOnly,
			action_type: ['mod'],
			intentInputMode: ['form'],
			updateAnswer: [true],
		},
	}),
	{
		displayName: '分组 ID 筛选',
		name: 'list_intent_group_id',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, action_type: ['list'] } },
		description: '可选，指定后仅拉取该分组下的问答',
	},
	{
		displayName: '问答 ID 筛选',
		name: 'list_intent_id',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, action_type: ['list'] } },
		description: '可选，指定后仅拉取该问答',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, action_type: ['list'] } },
		description: '上一次调用返回的 next_cursor，首次留空',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		default: 500,
		displayOptions: { show: { ...showOnly, action_type: ['list'] } },
		description: '每次拉取的数据量，默认 500，最大 1000',
		typeOptions: { minValue: 1, maxValue: 1000, numberStepSize: 1 },
	},
];
