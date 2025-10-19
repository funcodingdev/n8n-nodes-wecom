import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['modForm'] };
export const modFormDescription: INodeProperties[] = [
	{ displayName: '收集表ID', name: 'formid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '收集表的formid。', hint: '收集表ID' },
	{ displayName: '收集表配置', name: 'form_setting', type: 'json', required: true, displayOptions: { show: showOnly }, default: '{}', description: '收集表配置，JSON格式。', hint: '配置JSON' },
];
