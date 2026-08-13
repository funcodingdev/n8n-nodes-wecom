import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['linkedcorp'], operation: ['getCustomUserId'] };

export const getCustomUserIdDescription: INodeProperties[] = [
	{ displayName: '上下游 ID', name: 'chain_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '' },
	{ displayName: '已加入企业 CorpID', name: 'corpid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '' },
	{ displayName: '成员 UserID', name: 'userid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '' },
];
