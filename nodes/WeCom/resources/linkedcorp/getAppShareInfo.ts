import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['linkedcorp'], operation: ['getAppShareInfo'] };

export const getAppShareInfoDescription: INodeProperties[] = [
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '留空时使用当前企业微信 API 凭证中的 AgentID；可与下方选择二选一',
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
