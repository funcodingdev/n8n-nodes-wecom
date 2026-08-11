import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 文档有、此前节点未封装的 linkedcorp 相关 HTTP 接口（一等操作） */
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
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['linkedcorp'], operation: linkedcorpExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '请求体 JSON，字段名与企业微信接口文档保持一致；GET 请求可留空',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['linkedcorp'], operation: linkedcorpExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'URL 查询参数（访问凭证会自动附加，无需填写）',
	},
];
