import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['getFormInfo'] };
export const getFormInfoDescription: INodeProperties[] = [
	{ displayName: '收集表ID', name: 'formid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '收集表的formid。', hint: '收集表ID' },
];
