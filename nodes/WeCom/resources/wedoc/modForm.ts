import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wedoc'], operation: ['modForm'] };

export const modFormDescription: INodeProperties[] = [
	{
		displayName: '收集表ID',
		name: 'formid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
	},
	{
		displayName: '修改类型',
		name: 'formOper',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '全量修改问题', value: 1 },
			{ name: '全量修改设置', value: 2 },
		],
		default: 1,
		description: '对应官方 oper 字段；两类内容需分开调用',
	},
	{
		displayName: '收集表标题',
		name: 'form_title',
		type: 'string',
		displayOptions: { show: { ...showOnly, formOper: [1] } },
		default: '',
	},
	{
		displayName: '收集表描述',
		name: 'form_description',
		type: 'string',
		displayOptions: { show: { ...showOnly, formOper: [1] } },
		default: '',
	},
	{
		displayName: '收集表头图',
		name: 'form_header',
		type: 'string',
		displayOptions: { show: { ...showOnly, formOper: [1] } },
		default: '',
		description: '收集表表头背景图链接',
	},
	{
		displayName: '完整Form Info JSON',
		name: 'formInfoJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description:
			'按官方 form_info 结构填写 form_question 或 form_setting。JSON 与表单合并，表单中非空的标题、描述和头图优先',
	},
];
