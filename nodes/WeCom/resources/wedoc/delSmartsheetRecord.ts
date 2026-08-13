import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['delSmartsheetRecord'] };
export const delSmartsheetRecordDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id' },
	{
		displayName: '记录ID列表',
		name: 'record_ids',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '记录ID列表，多个用逗号分隔；与下方 JSON 合并去重',
	},
	{
		displayName: '记录ID列表 JSON',
		name: 'recordIdsJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '[]',
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["id1"] 或 [{"record_id":"id1"}]',
	},
];
