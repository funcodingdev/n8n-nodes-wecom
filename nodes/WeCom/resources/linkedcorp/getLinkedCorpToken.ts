import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['linkedcorp'], operation: ['getLinkedCorpToken'] };

export const getLinkedCorpTokenDescription: INodeProperties[] = [
	{
		displayName: '下级/下游企业 CorpID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'ww1234567890abcdef',
		description: '已授权的下级/下游企业 CorpID',
	},
	{
		displayName: '下级/下游应用 AgentID',
		name: 'agentid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '1000001',
		description: '已授权的下级/下游企业应用 ID',
	},
	{
		displayName: '业务类型',
		name: 'business_type',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '企业互联/局校互联', value: 0 },
			{ name: '上下游企业', value: 1 },
		],
		default: 0,
		description: '不传时企业微信默认按企业互联处理',
	},
];
