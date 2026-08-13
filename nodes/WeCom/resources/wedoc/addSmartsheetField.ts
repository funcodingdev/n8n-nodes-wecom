import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['addSmartsheetField'] };
export const addSmartsheetFieldDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id' },
	{
		displayName: '字段列表',
		name: 'fieldsCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加字段',
		typeOptions: { multipleValues: true },
		description: '要添加的字段列表',
		options: [
			{
				displayName: '字段',
				name: 'fields',
				values: [
					{
						displayName: '字段名称',
						name: 'field_title',
						type: 'string',
						default: '',
						required: true,
						description: '字段的显示名称',
					},
					{
						displayName: '字段类型',
						name: 'field_type',
						type: 'options',
						default: 'FIELD_TYPE_TEXT',
						required: true,
						options: [
							{ name: '文本', value: 'FIELD_TYPE_TEXT' },
							{ name: '数字', value: 'FIELD_TYPE_NUMBER' },
							{ name: '单选', value: 'FIELD_TYPE_SINGLE_SELECT' },
							{ name: '多选', value: 'FIELD_TYPE_SELECT' },
							{ name: '日期', value: 'FIELD_TYPE_DATE_TIME' },
							{ name: '图片', value: 'FIELD_TYPE_IMAGE' },
							{ name: '复选框', value: 'FIELD_TYPE_CHECKBOX' },
							{ name: '人员', value: 'FIELD_TYPE_USER' },
							{ name: '链接', value: 'FIELD_TYPE_URL' },
							{ name: '附件', value: 'FIELD_TYPE_ATTACHMENT' },
							{ name: '电话', value: 'FIELD_TYPE_PHONE_NUMBER' },
							{ name: '邮箱', value: 'FIELD_TYPE_EMAIL' },
							{ name: '地理位置', value: 'FIELD_TYPE_LOCATION' },
							{ name: '创建时间', value: 'FIELD_TYPE_CREATED_TIME' },
							{ name: '修改时间', value: 'FIELD_TYPE_MODIFIED_TIME' },
							{ name: '创建人', value: 'FIELD_TYPE_CREATED_USER' },
							{ name: '修改人', value: 'FIELD_TYPE_MODIFIED_USER' },
							{ name: '自动编号', value: 'FIELD_TYPE_AUTONUMBER' },
							{ name: '货币', value: 'FIELD_TYPE_CURRENCY' },
							{ name: '进度', value: 'FIELD_TYPE_PROGRESS' },
							{ name: '引用', value: 'FIELD_TYPE_REFERENCE' },
							{ name: '企业微信群', value: 'FIELD_TYPE_WWGROUP' },
							{ name: '百分数', value: 'FIELD_TYPE_PERCENTAGE' },
							{ name: '条码', value: 'FIELD_TYPE_BARCODE' },
						],
						description: '字段的数据类型',
					},
					{
						displayName: '选项列表（单选/多选）',
						name: 'select_options',
						type: 'string',
						default: '',
						displayOptions: {
							show: {
								field_type: ['FIELD_TYPE_SINGLE_SELECT', 'FIELD_TYPE_SELECT'],
							},
						},
						description: '选项列表，多个选项用英文逗号分隔；与下方 JSON 合并',
						placeholder: '例如: 选项1,选项2,选项3',
					},
					{
						displayName: '选项列表 JSON',
						name: 'select_options_json',
						type: 'json',
						default: '[]',
						displayOptions: {
							show: {
								field_type: ['FIELD_TYPE_SINGLE_SELECT', 'FIELD_TYPE_SELECT'],
							},
						},
						description:
							'可选。非空数组时与上方列表合并去重。支持 ["选项1"] 或 [{"text":"选项1"}]',
					},
					{
						displayName: '字段属性JSON',
						name: 'field_json',
						type: 'json',
						default: '{}',
						description:
							'按官方文档填写 property_number、property_date_time 等字段属性；文档 ID、标题和类型仍以上方表单为准',
					},
				],
			},
		],
	},
];
