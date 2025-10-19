import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['updateSmartsheetView'] };
export const updateSmartsheetViewDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid。', hint: '文档ID' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id。', hint: '子表ID' },
	{ displayName: '视图ID', name: 'view_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '视图的view_id。', hint: '视图ID' },
	{ displayName: '视图配置', name: 'properties', type: 'json', displayOptions: { show: showOnly }, default: '{}', description: '视图配置，JSON格式。', hint: '视图配置JSON' },
];
