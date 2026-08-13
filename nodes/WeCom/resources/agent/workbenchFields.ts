import type { INodeProperties } from 'n8n-workflow';

type WorkbenchShowOnly = {
	resource: string[];
	operation: string[];
};

const typeOptions = [
	{ name: '关键数据型', value: 'keydata' },
	{ name: '图片型', value: 'image' },
	{ name: '列表型', value: 'list' },
	{ name: 'Webview 型', value: 'webview' },
];

const linkTypeOptions = [
	{ name: '不设置', value: 'none' },
	{ name: '网页 URL', value: 'url' },
	{ name: '小程序页面路径', value: 'pagepath' },
];

export function getWorkbenchFields(
	showOnly: WorkbenchShowOnly,
	options: {
		allowNormal?: boolean;
		optionalTemplateData?: boolean;
		includeReplaceUserData?: boolean;
	} = {},
): INodeProperties[] {
	const customTypes = ['keydata', 'image', 'list', 'webview'];
	const availableTypes = options.allowNormal
		? [...typeOptions, { name: '普通模式', value: 'normal' }]
		: typeOptions;
	const dataGate = options.optionalTemplateData ? { setDefaultData: [true] } : {};
	const fields: INodeProperties[] = [
		{
			displayName: '模版类型',
			name: 'type',
			type: 'options',
			required: true,
			options: availableTypes,
			default: 'keydata',
			displayOptions: { show: showOnly },
			description: options.allowNormal
				? '选择自定义工作台模版；普通模式会取消自定义展示'
				: '必须与应用当前配置的工作台模版类型一致',
		},
	];

	if (options.optionalTemplateData) {
		fields.push({
			displayName: '设置企业默认数据',
			name: 'setDefaultData',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: { ...showOnly, type: customTypes },
			},
			description: '是否同时设置企业级默认展示数据。关闭时只切换模版类型',
		});
	}

	fields.push({
		displayName: '模版数据输入方式',
		name: 'workbenchInputMode',
		type: 'options',
		options: [
			{ name: '表单', value: 'form' },
			{ name: 'JSON', value: 'json' },
		],
		default: 'form',
		displayOptions: {
			show: { ...showOnly, type: customTypes, ...dataGate },
		},
		description: '通过结构化表单配置所选类型的数据，或直接提供该类型的数据对象',
	});

	fields.push(
		{
			displayName: '关键数据项',
			name: 'keydataItems',
			type: 'fixedCollection',
			required: true,
			default: {},
			placeholder: '添加数据项',
			typeOptions: { multipleValues: true },
			displayOptions: {
				show: {
					...showOnly,
					type: ['keydata'],
					workbenchInputMode: ['form'],
					...dataGate,
				},
			},
			description: '添加 1–4 项；数据必填且不超过 64 个字符',
			options: [
				{
					displayName: '数据项',
					name: 'items',
					values: [
						{
							displayName: '名称',
							name: 'key',
							type: 'string',
							default: '',
							description: '可选，不超过 64 个字符',
						},
						{
							displayName: '数据',
							name: 'data',
							type: 'string',
							required: true,
							default: '',
							description: '不超过 64 个字符',
						},
						{
							displayName: '跳转方式',
							name: 'linkType',
							type: 'options',
							options: linkTypeOptions,
							default: 'none',
						},
						{
							displayName: '跳转 URL',
							name: 'jump_url',
							type: 'string',
							required: true,
							default: '',
							displayOptions: { show: { linkType: ['url'] } },
						},
						{
							displayName: '小程序页面路径',
							name: 'pagepath',
							type: 'string',
							required: true,
							default: '',
							displayOptions: { show: { linkType: ['pagepath'] } },
						},
					],
				},
			],
		},
		{
			displayName: '图片 URL',
			name: 'image_url',
			type: 'string',
			required: true,
			default: '',
			displayOptions: {
				show: {
					...showOnly,
					type: ['image'],
					workbenchInputMode: ['form'],
					...dataGate,
				},
			},
			description: '必填，建议使用约 3.35:1 的图片',
		},
		{
			displayName: '图片跳转方式',
			name: 'imageLinkType',
			type: 'options',
			options: linkTypeOptions,
			default: 'none',
			displayOptions: {
				show: {
					...showOnly,
					type: ['image'],
					workbenchInputMode: ['form'],
					...dataGate,
				},
			},
		},
		{
			displayName: '图片跳转 URL',
			name: 'image_jump_url',
			type: 'string',
			required: true,
			default: '',
			displayOptions: {
				show: {
					...showOnly,
					type: ['image'],
					workbenchInputMode: ['form'],
					imageLinkType: ['url'],
					...dataGate,
				},
			},
		},
		{
			displayName: '图片小程序页面路径',
			name: 'image_pagepath',
			type: 'string',
			required: true,
			default: '',
			displayOptions: {
				show: {
					...showOnly,
					type: ['image'],
					workbenchInputMode: ['form'],
					imageLinkType: ['pagepath'],
					...dataGate,
				},
			},
		},
		{
			displayName: '列表项',
			name: 'listItems',
			type: 'fixedCollection',
			required: true,
			default: {},
			placeholder: '添加列表项',
			typeOptions: { multipleValues: true },
			displayOptions: {
				show: {
					...showOnly,
					type: ['list'],
					workbenchInputMode: ['form'],
					...dataGate,
				},
			},
			description: '添加 1–3 项；每项标题不超过 128 个字节',
			options: [
				{
					displayName: '列表项',
					name: 'items',
					values: [
						{
							displayName: '标题',
							name: 'title',
							type: 'string',
							required: true,
							default: '',
						},
						{
							displayName: '跳转方式',
							name: 'linkType',
							type: 'options',
							options: linkTypeOptions,
							default: 'none',
						},
						{
							displayName: '跳转 URL',
							name: 'jump_url',
							type: 'string',
							required: true,
							default: '',
							displayOptions: { show: { linkType: ['url'] } },
						},
						{
							displayName: '小程序页面路径',
							name: 'pagepath',
							type: 'string',
							required: true,
							default: '',
							displayOptions: { show: { linkType: ['pagepath'] } },
						},
					],
				},
			],
		},
		{
			displayName: 'Webview URL',
			name: 'webview_url',
			type: 'string',
			required: true,
			default: '',
			displayOptions: {
				show: {
					...showOnly,
					type: ['webview'],
					workbenchInputMode: ['form'],
					...dataGate,
				},
			},
			description: '用于渲染工作台内容的 HTTP(S) URL',
		},
		{
			displayName: 'Webview 跳转方式',
			name: 'webviewLinkType',
			type: 'options',
			options: linkTypeOptions,
			default: 'none',
			displayOptions: {
				show: {
					...showOnly,
					type: ['webview'],
					workbenchInputMode: ['form'],
					...dataGate,
				},
			},
		},
		{
			displayName: 'Webview 跳转 URL',
			name: 'webview_jump_url',
			type: 'string',
			required: true,
			default: '',
			displayOptions: {
				show: {
					...showOnly,
					type: ['webview'],
					workbenchInputMode: ['form'],
					webviewLinkType: ['url'],
					webview_enable_click: [false],
					...dataGate,
				},
			},
			description: '开启 Webview 内链接跳转时此字段失效，因此不会发送',
		},
		{
			displayName: 'Webview 小程序页面路径',
			name: 'webview_pagepath',
			type: 'string',
			required: true,
			default: '',
			displayOptions: {
				show: {
					...showOnly,
					type: ['webview'],
					workbenchInputMode: ['form'],
					webviewLinkType: ['pagepath'],
					...dataGate,
				},
			},
		},
		{
			displayName: 'Webview 高度',
			name: 'webview_height',
			type: 'options',
			options: [
				{ name: '单行', value: 'single_row' },
				{ name: '双行', value: 'double_row' },
			],
			default: 'double_row',
			displayOptions: {
				show: {
					...showOnly,
					type: ['webview'],
					workbenchInputMode: ['form'],
					...dataGate,
				},
			},
		},
		{
			displayName: '隐藏应用标题',
			name: 'webview_hide_title',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: {
					...showOnly,
					type: ['webview'],
					workbenchInputMode: ['form'],
					...dataGate,
				},
			},
		},
		{
			displayName: '允许 Webview 内链接跳转',
			name: 'webview_enable_click',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: {
					...showOnly,
					type: ['webview'],
					workbenchInputMode: ['form'],
					...dataGate,
				},
			},
			description: '开启后 Webview 内仅支持 wxwork://openurl?url=… 链接，且外层 jump_url 失效',
		},
		{
			displayName: '模版数据 JSON',
			name: 'workbenchDataJson',
			type: 'json',
			required: true,
			default: '{}',
			typeOptions: { rows: 10 },
			displayOptions: {
				show: {
					...showOnly,
					type: customTypes,
					workbenchInputMode: ['json'],
					...dataGate,
				},
			},
			description: '所选模版类型的数据对象，例如 keydata 的 {"items":[…]}；会执行与表单相同的校验',
		},
	);

	if (options.includeReplaceUserData) {
		fields.push({
			displayName: '覆盖所有用户数据',
			name: 'replace_user_data',
			type: 'boolean',
			default: false,
			displayOptions: {
				show: { ...showOnly, type: customTypes },
			},
			description: '启用后会覆盖企业所有用户当前设置的工作台数据',
		});
	}

	return fields;
}
