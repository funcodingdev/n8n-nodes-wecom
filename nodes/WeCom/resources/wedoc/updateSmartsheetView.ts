import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['updateSmartsheetView'] };
export const updateSmartsheetViewDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id' },
	{ displayName: '视图ID', name: 'view_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '视图的view_id' },
	{
		displayName: '新视图名称',
		name: 'view_title',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '新的视图名称，最多255个字符。留空则不修改。',
	},
	{
		displayName: '视图配置JSON',
		name: 'viewPropertyJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description:
			'官方 property 对象，支持排序、过滤、分组、字段可见性、冻结列与填色配置；与标题至少填写一项',
		placeholder: '{"auto_sort":false,"frozen_field_count":1}',
	},
];
