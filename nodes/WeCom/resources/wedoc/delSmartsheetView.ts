import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['delSmartsheetView'] };
export const delSmartsheetViewDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id' },
	{
		displayName: '视图ID列表',
		name: 'view_ids',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要删除的视图 ID；与下方 JSON 合并去重；支持逗号、中文逗号、竖线或换行分隔',
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
];
