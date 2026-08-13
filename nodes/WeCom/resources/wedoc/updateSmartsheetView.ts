import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wedoc'], operation: ['updateSmartsheetView'] };

export const updateSmartsheetViewDescription: INodeProperties[] = [
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
		displayName: '视图ID',
		name: 'view_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '视图的 view_id',
	},
	{
		displayName: '新视图名称',
		name: 'view_title',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '新的视图名称，最多 255 个字符。留空则不修改',
	},
	{
		displayName: '更新视图配置',
		name: 'updateViewProperty',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '开启后发送下方配置表单字段；可与 JSON 合并，JSON 优先',
	},
	{
		displayName: '自动排序',
		name: 'auto_sort',
		type: 'boolean',
		displayOptions: { show: { ...showOnly, updateViewProperty: [true] } },
		default: false,
		description: 'property.auto_sort',
	},
	{
		displayName: '冻结列数',
		name: 'frozen_field_count',
		type: 'number',
		displayOptions: { show: { ...showOnly, updateViewProperty: [true] } },
		default: 0,
		typeOptions: { minValue: 0, maxValue: 100 },
		description: 'property.frozen_field_count；0 表示不冻结',
	},
	{
		displayName: '视图配置JSON',
		name: 'viewPropertyJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description:
			'官方 property 对象，支持排序、过滤、分组、字段可见性、冻结列与填色配置；与上方表单合并，JSON 优先。标题与配置至少填写一项',
		placeholder: '{"auto_sort":false,"frozen_field_count":1}',
	},
];
