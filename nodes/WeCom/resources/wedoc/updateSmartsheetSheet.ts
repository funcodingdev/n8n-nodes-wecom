import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['updateSmartsheetSheet'] };
export const updateSmartsheetSheetDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid。', hint: '文档ID' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id。', hint: '子表ID' },
	{ displayName: '子表配置', name: 'properties', type: 'json', required: true, displayOptions: { show: showOnly }, default: '{}', description: '子表配置，JSON格式。', hint: '子表配置JSON' },
];
