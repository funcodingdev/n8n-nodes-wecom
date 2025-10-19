import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['querySmartsheetRecord'] };
export const querySmartsheetRecordDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid。', hint: '文档ID' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id。', hint: '子表ID' },
	{ displayName: '视图ID', name: 'view_id', type: 'string', displayOptions: { show: showOnly }, default: '', description: '视图的view_id。不填则使用默认视图。', hint: '视图ID（可选）' },
	{ displayName: '过滤条件', name: 'filter', type: 'json', displayOptions: { show: showOnly }, default: '{}', description: '过滤条件，JSON格式。', hint: '过滤条件JSON' },
];
