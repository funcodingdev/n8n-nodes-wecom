import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['createForm'] };
export const createFormDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '关联的文档docid。', hint: '文档ID' },
	{ displayName: '收集表标题', name: 'title', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '收集表标题。', hint: '标题' },
	{ displayName: '收集表配置', name: 'form_setting', type: 'json', displayOptions: { show: showOnly }, default: '{}', description: '收集表配置，JSON格式。', hint: '配置JSON' },
];
