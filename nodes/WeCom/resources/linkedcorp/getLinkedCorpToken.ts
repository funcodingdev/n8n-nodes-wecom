import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetToken = {
	resource: ['linkedcorp'],
	operation: ['getLinkedCorpToken'],
};

export const getLinkedCorpTokenDescription: INodeProperties[] = [
	{
		displayName: '业务类型',
		name: 'business_type',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForGetToken,
		},
		options: [
			{
				name: '互联企业',
				value: 'linked_corp',
			},
			{
				name: '上下游',
				value: 'chain',
			},
		],
		default: 'linked_corp',
		description: '业务类型。linked_corp表示互联企业，chain表示上下游。',
		hint: '业务类型',
	},
	{
		displayName: '下级/下游企业CorpID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetToken,
		},
		default: '',
		description: '下级/下游企业的corpid。',
		hint: '企业CorpID',
	},
	{
		displayName: '应用AgentID',
		name: 'agentid',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetToken,
		},
		default: '',
		description: '上级/上游企业应用的agentid。如果不填，默认使用凭证中的agentid。',
		hint: '应用AgentID（可选）',
	},
];

