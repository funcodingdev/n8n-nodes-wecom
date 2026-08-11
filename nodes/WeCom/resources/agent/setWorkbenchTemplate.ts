import type { INodeProperties } from 'n8n-workflow';

const showOnlySetWorkbenchTemplate = {
	resource: ['agent'],
	operation: ['setWorkbenchTemplate'],
};

export const setWorkbenchTemplateDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnlySetWorkbenchTemplate },
	},
	{
		displayName: '模版类型',
		name: 'type',
		type: 'options',
		required: true,
		options: [
			{ name: '关键数据型', value: 'keydata' },
			{ name: '图片型', value: 'image' },
			{ name: '列表型', value: 'list' },
			{ name: 'Webview型', value: 'webview' },
			{ name: '普通模式', value: 'normal' },
		],
		default: 'keydata',
		displayOptions: { show: showOnlySetWorkbenchTemplate },
	},
	{
		displayName: '关键数据项',
		name: 'keydataItems',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnlySetWorkbenchTemplate, type: ['keydata'] } },
		default: {},
		placeholder: '添加数据项',
		typeOptions: { multipleValues: true },
		description: '最多 4 项',
		options: [
			{
				displayName: '数据项',
				name: 'items',
				values: [
					{ displayName: '名称', name: 'key', type: 'string', default: '' },
					{ displayName: '数值', name: 'data', type: 'string', default: '' },
					{ displayName: '跳转URL', name: 'jump_url', type: 'string', default: '' },
					{ displayName: '小程序路径', name: 'pagepath', type: 'string', default: '' },
				],
			},
		],
	},
	{
		displayName: '图片URL',
		name: 'image_url',
		type: 'string',
		displayOptions: { show: { ...showOnlySetWorkbenchTemplate, type: ['image'] } },
		default: '',
		description: '最佳比例约 3.35:1',
	},
	{
		displayName: '图片跳转URL',
		name: 'image_jump_url',
		type: 'string',
		displayOptions: { show: { ...showOnlySetWorkbenchTemplate, type: ['image'] } },
		default: '',
	},
	{
		displayName: '图片小程序路径',
		name: 'image_pagepath',
		type: 'string',
		displayOptions: { show: { ...showOnlySetWorkbenchTemplate, type: ['image'] } },
		default: '',
	},
	{
		displayName: '列表项',
		name: 'listItems',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnlySetWorkbenchTemplate, type: ['list'] } },
		default: {},
		placeholder: '添加列表项',
		typeOptions: { multipleValues: true },
		description: '最多 3 项',
		options: [
			{
				displayName: '列表项',
				name: 'items',
				values: [
					{ displayName: '标题', name: 'title', type: 'string', default: '' },
					{ displayName: '跳转URL', name: 'jump_url', type: 'string', default: '' },
					{ displayName: '小程序路径', name: 'pagepath', type: 'string', default: '' },
				],
			},
		],
	},
	{
		displayName: 'Webview URL',
		name: 'webview_url',
		type: 'string',
		displayOptions: { show: { ...showOnlySetWorkbenchTemplate, type: ['webview'] } },
		default: '',
	},
	{
		displayName: 'Webview 跳转URL',
		name: 'webview_jump_url',
		type: 'string',
		displayOptions: { show: { ...showOnlySetWorkbenchTemplate, type: ['webview'] } },
		default: '',
	},
	{
		displayName: 'Webview 高度',
		name: 'webview_height',
		type: 'options',
		displayOptions: { show: { ...showOnlySetWorkbenchTemplate, type: ['webview'] } },
		options: [
			{ name: '单行 single_row', value: 'single_row' },
			{ name: '双行 double_row', value: 'double_row' },
		],
		default: 'double_row',
	},
	{
		displayName: '隐藏标题',
		name: 'webview_hide_title',
		type: 'boolean',
		displayOptions: { show: { ...showOnlySetWorkbenchTemplate, type: ['webview'] } },
		default: false,
	},
	{
		displayName: '开启链接跳转',
		name: 'webview_enable_click',
		type: 'boolean',
		displayOptions: { show: { ...showOnlySetWorkbenchTemplate, type: ['webview'] } },
		default: false,
	},
	{
		displayName: '覆盖用户数据',
		name: 'replace_user_data',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlySetWorkbenchTemplate,
				type: ['keydata', 'image', 'list', 'webview'],
			},
		},
	},
	{
		displayName: '模版扩展JSON',
		name: 'templateExtraJson',
		type: 'json',
		displayOptions: {
			show: {
				...showOnlySetWorkbenchTemplate,
				type: ['keydata', 'image', 'list', 'webview'],
			},
		},
		default: '{}',
		description: '合并进对应 type 配置对象，JSON 优先',
	},
];
