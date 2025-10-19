import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['modDocSafeRule'] };
export const modDocSafeRuleDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '文档的docid。', hint: '文档ID' },
	{ displayName: '安全设置', name: 'safe_setting', type: 'json', required: true, displayOptions: { show: showOnly }, default: '{}', description: '安全设置，JSON格式。', hint: '安全设置JSON' },
];
