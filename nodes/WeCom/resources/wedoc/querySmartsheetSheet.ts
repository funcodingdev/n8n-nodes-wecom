import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['querySmartsheetSheet'] };
export const querySmartsheetSheetDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid' },
	{
		displayName: '子表ID',
		name: 'sheet_id',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '可选。指定时只查询该子表，留空查询全部子表',
	},
];
