import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['agent'], operation: ['setWorkbenchData'] };

export const setWorkbenchDataDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnly },
	},
	{
		displayName: '用户ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
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
		],
		default: 'keydata',
		displayOptions: { show: showOnly },
	},

	{
		displayName: '关键数据项',
		name: 'keydataItems',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, type: ['keydata'] } },
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
		displayOptions: { show: { ...showOnly, type: ['image'] } },
		default: '',
	},
	{
		displayName: '图片跳转URL',
		name: 'image_jump_url',
		type: 'string',
		displayOptions: { show: { ...showOnly, type: ['image'] } },
		default: '',
	},
	{
		displayName: '图片小程序路径',
		name: 'image_pagepath',
		type: 'string',
		displayOptions: { show: { ...showOnly, type: ['image'] } },
		default: '',
	},
	{
		displayName: '列表项',
		name: 'listItems',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, type: ['list'] } },
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
		displayOptions: { show: { ...showOnly, type: ['webview'] } },
		default: '',
	},
	{
		displayName: 'Webview 跳转URL',
		name: 'webview_jump_url',
		type: 'string',
		displayOptions: { show: { ...showOnly, type: ['webview'] } },
		default: '',
	},
	{
		displayName: '模版扩展JSON',
		name: 'templateExtraJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description: '合并进对应 type 配置，JSON 优先',
	},

];
