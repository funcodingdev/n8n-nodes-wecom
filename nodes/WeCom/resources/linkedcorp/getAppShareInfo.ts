import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['linkedcorp'], operation: ['getAppShareInfo'] };

export const getAppShareInfoDescription: INodeProperties[] = [
	{
		displayName: '上级/上游应用 AgentID',
		name: 'agentid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '1000001',
		description: '留空时使用当前企业微信 API 凭证中的 AgentID',
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
	},
	{
		displayName: '下级/下游企业 CorpID',
		name: 'corpid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'ww1234567890abcdef',
		description: '可选；填写后仅拉取该企业的应用共享信息',
	},
	{
		displayName: '分页大小',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 0, maxValue: 100 },
		displayOptions: { show: showOnly },
		default: 100,
		description: '最大 100；设为 0 时拉取全量数据',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '首次请求留空，后续填写上一次返回的 next_cursor',
	},
];
