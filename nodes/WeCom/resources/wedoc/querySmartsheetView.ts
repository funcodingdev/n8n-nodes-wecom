import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['querySmartsheetView'] };
export const querySmartsheetViewDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id' },
	{
		displayName: '视图ID列表',
		name: 'view_ids',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description:
			'指定要查询的视图ID列表，用逗号分隔；与下方 JSON 合并。不填则查询所有视图',
	},
	{
		displayName: '视图ID列表 JSON',
		name: 'viewIdsJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '[]',
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["id1"] 或 [{"view_id":"id1"}]',
	},
	{
		displayName: '偏移量',
		name: 'offset',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 0,
		typeOptions: { minValue: 0 },
		description: '从第几条记录开始返回（用于分页）。默认 0',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 50,
		typeOptions: { minValue: 0, maxValue: 1000 },
		description: '每页返回多少条数据。为 0 时按官方默认一次最多返回 1000 条，最大 1000',
	},
];
