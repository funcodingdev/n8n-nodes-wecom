import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['getSheetData'] };
export const getSheetDataDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '表格文档的docid。', hint: '文档ID' },
	{ displayName: '范围', name: 'range', type: 'string', displayOptions: { show: showOnly }, default: '', description: '要获取的数据范围，如"Sheet1!A1:C10"。', hint: '数据范围' },
];
