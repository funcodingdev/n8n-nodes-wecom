import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['modDocShareScope'] };
export const modDocShareScopeDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '文档的docid。', hint: '文档ID' },
	{ displayName: '查看规则', name: 'view_rule', type: 'json', required: true, displayOptions: { show: showOnly }, default: '{}', description: '查看规则，JSON格式。', hint: '查看规则JSON' },
];
