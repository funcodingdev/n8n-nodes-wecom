import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['linkedcorp'], operation: ['getChainInfo'] };

export const getChainInfoDescription: INodeProperties[] = [
	{
		displayName: '查询内容',
		name: 'chain_query_type',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '上下游列表', value: 'chains' },
			{ name: '分组下企业列表', value: 'corps' },
		],
		default: 'chains',
	},
	{
		displayName: '上下游 ID',
		name: 'chain_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, chain_query_type: ['corps'] } },
		default: '',
	},
	{
		displayName: '分组 ID',
		name: 'groupid',
		type: 'number',
		typeOptions: { minValue: 0 },
		displayOptions: { show: { ...showOnly, chain_query_type: ['corps'] } },
		default: 0,
		description: '设为 0 时表示根目录',
	},
	{
		displayName: '包含未加入企业',
		name: 'need_pending',
		type: 'boolean',
		displayOptions: { show: { ...showOnly, chain_query_type: ['corps'] } },
		default: false,
		description: '是否返回尚未加入上下游的企业',
	},
	{
		displayName: '分页大小',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 0 },
		displayOptions: { show: { ...showOnly, chain_query_type: ['corps'] } },
		default: 100,
		description: '大于 0 时启用分页；设为 0 时不分页',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: { ...showOnly, chain_query_type: ['corps'] } },
		default: '',
		description: '首次请求留空，后续填写上一次返回的 next_cursor',
	},
];
