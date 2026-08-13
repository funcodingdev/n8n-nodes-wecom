import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['delSmartsheetField'] };
export const delSmartsheetFieldDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id' },
	{
		displayName: '字段ID列表',
		name: 'field_ids',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要删除的字段ID列表，多个用逗号分隔；与下方 JSON 合并去重',
		placeholder: '如: field_001,field_002',
	},
	{
		displayName: '字段ID列表 JSON',
		name: 'fieldIdsJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '[]',
		description:
			'可选。非空数组时与上方列表合并去重。支持 ["id1"] 或 [{"field_id":"id1"}]',
	},
];
