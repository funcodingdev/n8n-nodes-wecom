import type { INodeProperties } from 'n8n-workflow';
import { templateControlFields } from './templateControlFields';

const showOnly = { resource: ['approval'], operation: ['createApprovalTemplate'] };

export const createApprovalTemplateDescription: INodeProperties[] = [
	{
		displayName: '模板名称',
		name: 'template_name_text',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: 'template_name[0].text，最多 40 个字符',
	},
	{
		displayName: '名称语言',
		name: 'template_name_lang',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '中文', value: 'zh_CN' },
			{ name: '英文', value: 'en' },
		],
		default: 'zh_CN',
	},
	{
		displayName: '模板控件',
		name: 'templateControlsCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加控件',
		typeOptions: { multipleValues: true },
		description: '常用控件可直接配置；复杂结构可使用控件配置 JSON 或下方完整模板内容 JSON',
		options: [{ displayName: '控件', name: 'controls', values: templateControlFields }],
	},
	{
		displayName: '模板控件内容JSON',
		name: 'template_content_json',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description: '完整 template_content。非空对象时优先；空对象则使用上方控件表单',
	},
	{
		displayName: '扩展请求JSON',
		name: 'templateExtraJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description: '其余顶层字段与表单合并，同名字段以 JSON 为准',
	},
];
