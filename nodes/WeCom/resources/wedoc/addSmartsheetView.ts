import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['addSmartsheetView'] };
export const addSmartsheetViewDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id' },
	{
		displayName: '视图名称',
		name: 'view_title',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '视图名称，最多255个字符。视图标题',
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
		description: '视图的类型',
	},
	{
		displayName: '视图属性JSON',
		name: 'viewExtraJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description:
			'可填写官方 property_gantt 或 property_calendar。甘特图和日历视图必须提供对应属性',
		placeholder:
			'{"property_calendar":{"start_date_field_id":"FIELD1","end_date_field_id":"FIELD2"}}',
	},
];
