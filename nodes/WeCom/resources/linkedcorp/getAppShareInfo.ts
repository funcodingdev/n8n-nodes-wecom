import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetAppShareInfo = {
	resource: ['linkedcorp'],
	operation: ['getAppShareInfo'],
};

export const getAppShareInfoDescription: INodeProperties[] = [
	{
		displayName: '应用AgentID',
		name: 'agentid',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetAppShareInfo,
		},
		default: '',
		description: '上级/上游企业应用的agentid。如果不填，默认使用凭证中的agentid。',
		hint: '应用AgentID（可选）',
	},
	{
		displayName: '企业CorpID',
		name: 'corpid',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetAppShareInfo,
		},
		default: '',
		description: '下级/下游企业的corpid。若需要获取自身企业的应用共享信息，则不需要填写。',
		hint: '企业CorpID（可选）',
	},
];

