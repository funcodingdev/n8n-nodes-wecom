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
		displayName: '应用 ID',
		name: 'agentid',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '已授权的下级/下游企业应用 ID；可与下方选择二选一',
	},
	{
		displayName: '应用(选择)',
		name: 'agentid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAgents' },
		displayOptions: { show: showOnly },
		default: '',
		description: '与上方字段二选一；均填写时以上方为准',
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
