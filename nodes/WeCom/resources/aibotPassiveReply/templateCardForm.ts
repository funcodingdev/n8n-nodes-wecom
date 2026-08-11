import type { IDataObject, IDisplayOptions, INodeProperties } from 'n8n-workflow';

/** 智能机器人 template_card 表单（text_notice 常用字段 + JSON 覆盖） */

export function templateCardFormProperties(
	showBase: NonNullable<IDisplayOptions['show']>,
): INodeProperties[] {
	const showForm = {
		...showBase,
		template_card_input_mode: ['form'],
	} as NonNullable<IDisplayOptions['show']>;
	const showJson = {
		...showBase,
		template_card_input_mode: ['json'],
	} as NonNullable<IDisplayOptions['show']>;

	return [
		{
			displayName: '输入方式',
			name: 'template_card_input_mode',
			type: 'options',
			options: [
				{ name: '表单输入', value: 'form' },
				{ name: 'JSON输入', value: 'json' },
			],
			default: 'form',
			displayOptions: { show: showBase },
			description: 'text_notice 常用字段可用表单；复杂结构请用 JSON',
		},
		{
			displayName: '主标题',
			name: 'tc_main_title',
			type: 'string',
			required: true,
			displayOptions: { show: showForm },
			default: '',
			description: 'main_title.title',
		},
		{
			displayName: '主标题说明',
			name: 'tc_main_desc',
			type: 'string',
			displayOptions: { show: showForm },
			default: '',
			description: 'main_title.desc',
		},
		{
			displayName: '副标题文本',
			name: 'tc_sub_title_text',
			type: 'string',
			displayOptions: { show: showForm },
			default: '',
			description: 'sub_title_text',
		},
		{
			displayName: '关键数据',
			name: 'tc_emphasis_title',
			type: 'string',
			displayOptions: { show: showForm },
			default: '',
			description: 'emphasis_content.title，如 99%',
		},
		{
			displayName: '关键数据说明',
			name: 'tc_emphasis_desc',
			type: 'string',
			displayOptions: { show: showForm },
			default: '',
			description: 'emphasis_content.desc',
		},
		{
			displayName: '点击跳转类型',
			name: 'tc_card_action_type',
			type: 'options',
			displayOptions: { show: showForm },
			options: [
				{ name: '跳转URL', value: 1 },
				{ name: '打开小程序', value: 2 },
			],
			default: 1,
			description: 'card_action.type',
		},
		{
			displayName: '跳转URL',
			name: 'tc_card_action_url',
			type: 'string',
			displayOptions: {
				show: { ...showForm, tc_card_action_type: [1] },
			},
			default: 'https://work.weixin.qq.com',
			description: 'card_action.url',
		},
		{
			displayName: '小程序AppID',
			name: 'tc_card_action_appid',
			type: 'string',
			displayOptions: {
				show: { ...showForm, tc_card_action_type: [2] },
			},
			default: '',
			description: 'card_action.appid',
		},
		{
			displayName: '小程序页面路径',
			name: 'tc_card_action_pagepath',
			type: 'string',
			displayOptions: {
				show: { ...showForm, tc_card_action_type: [2] },
			},
			default: '',
			description: 'card_action.pagepath',
		},
		{
			displayName: '来源描述',
			name: 'tc_source_desc',
			type: 'string',
			displayOptions: { show: showForm },
			default: '',
			description: 'source.desc',
		},
		{
			displayName: '来源图标URL',
			name: 'tc_source_icon',
			type: 'string',
			displayOptions: { show: showForm },
			default: '',
			description: 'source.icon_url',
		},
		{
			displayName: '水平内容列表',
			name: 'tcHorizontalContentCollection',
			type: 'fixedCollection',
			displayOptions: { show: showForm },
			default: {},
			placeholder: '添加一行',
			typeOptions: { multipleValues: true },
			description: 'horizontal_content_list，最多 6 项',
			options: [
				{
					displayName: '内容行',
					name: 'items',
					values: [
						{
							displayName: '键名',
							name: 'keyname',
							type: 'string',
							default: '',
						},
						{
							displayName: '值',
							name: 'value',
							type: 'string',
							default: '',
						},
						{
							displayName: '类型',
							name: 'type',
							type: 'options',
							options: [
								{ name: '文本', value: 0 },
								{ name: 'URL', value: 1 },
								{ name: '文件附件', value: 2 },
								{ name: '成员详情', value: 3 },
							],
							default: 0,
						},
						{
							displayName: '跳转URL',
							name: 'url',
							type: 'string',
							default: '',
							description: 'type=1 时有效',
						},
					],
				},
			],
		},
		{
			displayName: '模板卡片JSON',
			name: 'template_card',
			type: 'json',
			typeOptions: { rows: 8 },
			displayOptions: { show: showJson },
			default: `{
  "card_type": "text_notice",
  "main_title": {
    "title": "标题",
    "desc": "说明"
  },
  "card_action": {
    "type": 1,
    "url": "https://work.weixin.qq.com"
  }
}`,
			required: true,
			description: '完整 template_card；表单模式下可用扩展 JSON 覆盖',
		},
		{
			displayName: '扩展JSON',
			name: 'template_card_extra_json',
			type: 'json',
			displayOptions: { show: showForm },
			default: '{}',
			description: '与上方表单合并，同名字段以 JSON 为准',
		},
	];
}

export function buildTemplateCardFromForm(params: {
	tc_main_title: string;
	tc_main_desc?: string;
	tc_sub_title_text?: string;
	tc_emphasis_title?: string;
	tc_emphasis_desc?: string;
	tc_card_action_type?: number;
	tc_card_action_url?: string;
	tc_card_action_appid?: string;
	tc_card_action_pagepath?: string;
	tc_source_desc?: string;
	tc_source_icon?: string;
	horizontalCollection?: IDataObject;
	extraJson?: string;
}): IDataObject {
	const card: IDataObject = {
		card_type: 'text_notice',
		main_title: {
			title: params.tc_main_title || '',
			...(params.tc_main_desc ? { desc: params.tc_main_desc } : {}),
		},
	};

	if (params.tc_sub_title_text) card.sub_title_text = params.tc_sub_title_text;

	if (params.tc_emphasis_title || params.tc_emphasis_desc) {
		card.emphasis_content = {
			...(params.tc_emphasis_title ? { title: params.tc_emphasis_title } : {}),
			...(params.tc_emphasis_desc ? { desc: params.tc_emphasis_desc } : {}),
		};
	}

	const actionType = params.tc_card_action_type ?? 1;
	const card_action: IDataObject = { type: actionType };
	if (actionType === 1 && params.tc_card_action_url) {
		card_action.url = params.tc_card_action_url;
	}
	if (actionType === 2) {
		if (params.tc_card_action_appid) card_action.appid = params.tc_card_action_appid;
		if (params.tc_card_action_pagepath) card_action.pagepath = params.tc_card_action_pagepath;
	}
	card.card_action = card_action;

	if (params.tc_source_desc || params.tc_source_icon) {
		card.source = {
			...(params.tc_source_icon ? { icon_url: params.tc_source_icon } : {}),
			...(params.tc_source_desc ? { desc: params.tc_source_desc } : {}),
		};
	}

	const items = ((params.horizontalCollection?.items as IDataObject[]) || [])
		.filter((row) => row.keyname)
		.slice(0, 6)
		.map((row) => {
			const item: IDataObject = {
				keyname: row.keyname,
				value: row.value || '',
				type: row.type ?? 0,
			};
			if (Number(row.type) === 1 && row.url) item.url = row.url;
			return item;
		});
	if (items.length) card.horizontal_content_list = items;

	try {
		const extra = JSON.parse(params.extraJson || '{}') as IDataObject;
		if (extra && typeof extra === 'object' && !Array.isArray(extra)) {
			Object.assign(card, extra);
		}
	} catch {
		// ignore
	}

	return card;
}
