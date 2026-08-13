import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wedoc'], operation: ['addSmartsheetView'] };

export const addSmartsheetViewDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '智能表格的 docid',
	},
	{
		displayName: '子表ID',
		name: 'sheet_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '子表的 sheet_id',
	},
	{
		displayName: '视图名称',
		name: 'view_title',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '视图名称，最多 255 个字符',
	},
	{
		displayName: '视图类型',
		name: 'view_type',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		default: 'VIEW_TYPE_GRID',
		options: [
			{ name: '表格视图', value: 'VIEW_TYPE_GRID', description: '表格形式展示' },
			{ name: '看板视图', value: 'VIEW_TYPE_KANBAN', description: '看板形式展示' },
			{ name: '画册视图', value: 'VIEW_TYPE_GALLERY', description: '画册形式展示' },
			{ name: '甘特图视图', value: 'VIEW_TYPE_GANTT', description: '甘特图形式展示' },
			{ name: '日历视图', value: 'VIEW_TYPE_CALENDAR', description: '日历形式展示' },
		],
		description: '视图类型；甘特/日历需配置下方日期字段',
	},
	{
		displayName: '开始日期字段ID',
		name: 'start_date_field_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: { ...showOnly, view_type: ['VIEW_TYPE_GANTT', 'VIEW_TYPE_CALENDAR'] },
		},
		default: '',
		description: '仅允许 FIELD_TYPE_DATE_TIME 字段；甘特/日历必填',
	},
	{
		displayName: '结束日期字段ID',
		name: 'end_date_field_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: { ...showOnly, view_type: ['VIEW_TYPE_GANTT', 'VIEW_TYPE_CALENDAR'] },
		},
		default: '',
		description: '仅允许 FIELD_TYPE_DATE_TIME 字段；甘特/日历必填',
	},
	{
		displayName: '视图属性扩展JSON',
		name: 'viewExtraJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description:
			'其余 property_gantt / property_calendar 字段与上方合并，JSON 优先。甘特/日历可只填上方字段',
		placeholder:
			'{"property_calendar":{"start_date_field_id":"FIELD1","end_date_field_id":"FIELD2"}}',
	},
];
