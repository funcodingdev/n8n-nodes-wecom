import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['modDocMemberRule'] };
export const modDocMemberRuleDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '文档的docid。', hint: '文档ID' },
	{ displayName: '成员规则', name: 'auth_info', type: 'json', required: true, displayOptions: { show: showOnly }, default: '{}', description: '成员权限规则，JSON格式。', hint: '成员规则JSON' },
];
