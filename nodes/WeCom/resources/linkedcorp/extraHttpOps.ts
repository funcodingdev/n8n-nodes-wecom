import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

export const linkedcorpExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'corpGetChainCorpinfo', name: '[上下游] 获取企业信息', action: '获取上下游企业信息', description: '获取上下游企业信息', path: '/cgi-bin/corpgroup/corp/get_chain_corpinfo', method: 'POST' },
	{ id: 'corpGetChainGroup', name: '[上下游] 获取企业分组', action: '获取上下游企业分组', description: '获取上下游企业分组', path: '/cgi-bin/corpgroup/corp/get_chain_group', method: 'POST' },
	{ id: 'unionidToPendingId', name: '[上下游] unionid转pending_id', action: 'unionid 转 pending_id', description: 'unionid 转 pending_id', path: '/cgi-bin/corpgroup/unionid_to_pending_id', method: 'POST' },
];

export const linkedcorpExtraHttpOpsById: Record<string, ExtraHttpOp> = Object.fromEntries(
	linkedcorpExtraHttpOps.map((o) => [o.id, o]),
);

export const linkedcorpExtraHttpOpsOptionValues = linkedcorpExtraHttpOps.map((o) => o.id);

export function getLinkedcorpExtraHttpOpOptions() {
	return extraHttpOpOptions(linkedcorpExtraHttpOps);
}

export const linkedcorpExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '上下游ID',
		name: 'lc_chain_id',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['linkedcorp'],
				operation: ['corpGetChainCorpinfo', 'corpGetChainGroup'],
			},
		},
		default: '',
		description: 'chain_id',
	},
	{
		displayName: '企业ID',
		name: 'lc_corpid',
		type: 'string',
		displayOptions: {
			show: { resource: ['linkedcorp'], operation: ['corpGetChainCorpinfo'] },
		},
		default: '',
		description: '下级/下游企业 corpid',
	},
	{
		displayName: 'OpenID',
		name: 'lc_openid',
		type: 'string',
		displayOptions: {
			show: { resource: ['linkedcorp'], operation: ['unionidToPendingId'] },
		},
		default: '',
		description: '可选 openid，与 unionid 配合',
	},
	{
		displayName: 'UnionID',
		name: 'lc_unionid',
		type: 'string',
		displayOptions: {
			show: { resource: ['linkedcorp'], operation: ['unionidToPendingId'] },
		},
		default: '',
	},
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['linkedcorp'], operation: linkedcorpExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '其余字段与上方合并',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['linkedcorp'], operation: linkedcorpExtraHttpOpsOptionValues },
		},
		default: '{}',
	},
];
