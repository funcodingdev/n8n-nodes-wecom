import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreateApprovalTemplate = {
	resource: ['approval'],
	operation: ['createApprovalTemplate'],
};

export const createApprovalTemplateDescription: INodeProperties[] = [
	{
		displayName: '模板名称',
		name: 'template_name_text',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForCreateApprovalTemplate },
		default: '',
		description: 'template_name[0].text',
	},
	{
		displayName: '名称语言',
		name: 'template_name_lang',
		type: 'options',
		displayOptions: { show: showOnlyForCreateApprovalTemplate },
		options: [
			{ name: '中文 zh_CN', value: 'zh_CN' },
			{ name: '英文 en', value: 'en' },
		],
		default: 'zh_CN',
	},
	{
		displayName: '模板控件内容JSON',
		name: 'template_content_json',
		type: 'json',
		required: true,
		displayOptions: { show: showOnlyForCreateApprovalTemplate },
		default:
			'{\n  "controls": [\n    {\n      "property": {\n        "control": "Text",\n        "id": "Text-01",\n        "title": [{ "text": "文本", "lang": "zh_CN" }],\n        "require": 1,\n        "un_print": 0\n      },\n      "config": {}\n    }\n  ]\n}',
		description: 'template_content，含 controls 控件列表',
	},
	{
		displayName: '扩展请求JSON',
		name: 'templateExtraJson',
		type: 'json',
		displayOptions: { show: showOnlyForCreateApprovalTemplate },
		default: '{}',
		description: '其余字段与上方合并',
	},
];
