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
		displayName: '模板控件',
		name: 'templateControlsCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnlyForCreateApprovalTemplate },
		default: {},
		placeholder: '添加控件',
		typeOptions: { multipleValues: true },
		description: '简易控件列表；复杂 config 请用下方 JSON',
		options: [
			{
				displayName: '控件',
				name: 'controls',
				values: [
					{
						displayName: '控件类型',
						name: 'control',
						type: 'options',
						options: [
							{ name: '文本 Text', value: 'Text' },
							{ name: '多行文本 Textarea', value: 'Textarea' },
							{ name: '数字 Number', value: 'Number' },
							{ name: '金额 Money', value: 'Money' },
							{ name: '日期 Date', value: 'Date' },
							{ name: '单选/多选 Selector', value: 'Selector' },
							{ name: '成员/部门 Contact', value: 'Contact' },
							{ name: '说明 Tips', value: 'Tips' },
							{ name: '附件 File', value: 'File' },
							{ name: '明细 Table', value: 'Table' },
							{ name: '位置 Location', value: 'Location' },
							{ name: '关联审批 RelatedApproval', value: 'RelatedApproval' },
							{ name: '时长 DateRange', value: 'DateRange' },
							{ name: '电话 PhoneNumber', value: 'PhoneNumber' },
						],
						default: 'Text',
					},
					{
						displayName: '控件ID',
						name: 'id',
						type: 'string',
						default: '',
						placeholder: 'Text-01',
						description: '模板内唯一，格式 control-数字，如 Text-01',
					},
					{
						displayName: '控件标题',
						name: 'title',
						type: 'string',
						default: '',
					},
					{
						displayName: '占位说明',
						name: 'placeholder',
						type: 'string',
						default: '',
					},
					{
						displayName: '是否必填',
						name: 'require',
						type: 'boolean',
						default: true,
					},
					{
						displayName: '不打印',
						name: 'un_print',
						type: 'boolean',
						default: false,
					},
					{
						displayName: '选择器类型',
						name: 'selector_type',
						type: 'options',
						options: [
							{ name: '单选 single', value: 'single' },
							{ name: '多选 multi', value: 'multi' },
						],
						default: 'single',
						description: '仅 Selector 有效',
					},
					{
						displayName: '选项(逗号分隔)',
						name: 'selector_options',
						type: 'string',
						default: '',
						placeholder: '选项1,选项2',
						description: '仅 Selector 有效',
					},
				],
			},
		],
	},
	{
		displayName: '模板控件内容JSON',
		name: 'template_content_json',
		type: 'json',
		displayOptions: { show: showOnlyForCreateApprovalTemplate },
		default: '{}',
		description:
			'完整 template_content（含 controls）。非空时优先；空对象则使用上方控件表单',
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
