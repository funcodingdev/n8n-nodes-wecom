import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['delSmartsheetRecord'] };
export const delSmartsheetRecordDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid。', hint: '文档ID' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id。', hint: '子表ID' },
	{ displayName: '记录ID列表', name: 'record_ids', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '记录ID列表，多个用逗号分隔。', hint: '记录ID列表' },
];
