import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateApprovalTemplate = {
	resource: ['approval'],
	operation: ['updateApprovalTemplate'],
};

export const updateApprovalTemplateDescription: INodeProperties[] = [
	{
		displayName: '模板ID',
		name: 'template_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForUpdateApprovalTemplate },
		default: '',
	},
	{
		displayName: '模板名称',
		name: 'template_name_text',
		type: 'string',
		displayOptions: { show: showOnlyForUpdateApprovalTemplate },
		default: '',
		description: '可选，template_name[0].text',
	},
	{
		displayName: '名称语言',
		name: 'template_name_lang',
		type: 'options',
		displayOptions: { show: showOnlyForUpdateApprovalTemplate },
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
		displayOptions: { show: showOnlyForUpdateApprovalTemplate },
		default: '{}',
		description: 'template_content；不修改控件可留空对象',
	},
	{
		displayName: '扩展请求JSON',
		name: 'templateExtraJson',
		type: 'json',
		displayOptions: { show: showOnlyForUpdateApprovalTemplate },
		default: '{}',
		description: '其余字段与上方合并',
	},
];
