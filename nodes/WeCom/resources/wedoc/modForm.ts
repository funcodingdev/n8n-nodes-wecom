import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['modForm'] };
export const modFormDescription: INodeProperties[] = [
	{ displayName: '收集表ID', name: 'formid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '收集表的formid。收集表ID' },
	{
		displayName: '收集表标题',
		name: 'form_title',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '新的收集表标题，留空则不修改',
	},
	{
		displayName: '收集表描述',
		name: 'form_description',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '新的收集表描述，留空则不修改',
	},
	{
		displayName: '收集表设置',
		name: 'formSetting',
		type: 'collection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加设置',
		description: '收集表的高级设置',
		options: [
			{
				displayName: '允许匿名填写',
				name: 'allow_anonymous',
				type: 'boolean',
				default: false,
			},
			{
				displayName: '限制每人填写次数',
				name: 'limit_fill_count',
				type: 'number',
				default: 0,
				description: '每人最多填写次数，0表示不限制',
			},
			{
				displayName: '截止时间',
				name: 'deadline',
				type: 'dateTime',
				default: '',
				description: '收集表的截止时间',
			},
			{
				displayName: '是否开启收集',
				name: 'is_collecting',
				type: 'boolean',
				default: true,
				description: '是否正在收集中',
			},
		],
	},
];
