import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['addSmartsheetSheet'] };
export const addSmartsheetSheetDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '智能表格的docid。文档ID',
	},
	{
		displayName: '智能表属性',
		name: 'formSetting',
		type: 'collection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加设置',
		options: [
			{
				displayName: '智能表标题',
				name: 'sheet_title',
				type: 'string',
				default: '',
			},
			{
				displayName: '智能表下标',
				name: 'sheet_index',
				type: 'number',
				typeOptions: { minValue: 0 },
				default: 0,
			},
		],
	},
];
