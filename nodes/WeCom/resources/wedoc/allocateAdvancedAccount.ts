import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['allocateAdvancedAccount'] };
export const allocateAdvancedAccountDescription: INodeProperties[] = [
	{ displayName: 'UserID列表', name: 'userids', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '成员userid列表，多个用逗号分隔。', hint: 'UserID列表' },
];
