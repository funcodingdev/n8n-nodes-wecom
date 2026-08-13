import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['linkedcorp'], operation: ['getMiniProgramSession'] };

export const getMiniProgramSessionDescription: INodeProperties[] = [
	{
		displayName: '下级/下游企业 CorpID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'ww1234567890abcdef',
		description: '用于自动获取下级/下游企业 access_token',
	},
	{
		displayName: '下级/下游应用 AgentID',
		name: 'agentid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '1000001',
		description: '已共享到下级/下游企业的应用 ID',
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
		default: 1,
		description: '用于获取下级/下游企业 access_token',
	},
	{
		displayName: '加密用户 ID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '通过上级/上游企业 code2Session 获取的加密 userid，最长 64 字节',
	},
	{
		displayName: '上级/上游会话密钥',
		name: 'session_key',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '通过上级/上游企业 code2Session 获取的 session_key，最长 64 字节',
	},
];
