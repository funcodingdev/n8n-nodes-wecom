import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['linkedcorp'], operation: ['getSubCorpChainList'] };

export const getSubCorpChainListDescription: INodeProperties[] = [
	{
		displayName: '下级企业 CorpID',
		name: 'corpid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '可选；不填时返回当前应用可见范围内企业加入的上下游',
	},
];
