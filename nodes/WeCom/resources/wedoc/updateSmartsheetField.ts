import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['updateSmartsheetField'] };
export const updateSmartsheetFieldDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid。', hint: '文档ID' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id。', hint: '子表ID' },
	{ displayName: '字段ID', name: 'field_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '字段的field_id。', hint: '字段ID' },
	{ displayName: '字段配置', name: 'properties', type: 'json', displayOptions: { show: showOnly }, default: '{}', description: '字段配置，JSON格式。', hint: '字段配置JSON' },
];
