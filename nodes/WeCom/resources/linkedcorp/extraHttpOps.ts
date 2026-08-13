import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

export const linkedcorpExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'corpGetChainCorpinfo', name: '[上下游] 获取企业信息', action: '获取上下游企业信息', description: '获取指定已加入或待加入企业的信息', path: '/cgi-bin/corpgroup/corp/get_chain_corpinfo', method: 'POST' },
	{ id: 'corpGetChainGroup', name: '[上下游] 获取企业分组', action: '获取上下游企业分组', description: '获取全部或指定上下游分组', path: '/cgi-bin/corpgroup/corp/get_chain_group', method: 'POST' },
	{ id: 'unionidToPendingId', name: '[客户管理] 未添加客户 ID 转换', action: '转换未添加客户 ID', description: '将 UnionID 或 External UserID 转为 Pending ID', path: '/cgi-bin/corpgroup/unionid_to_pending_id', method: 'POST' },
];

export const linkedcorpExtraHttpOpsById: Record<string, ExtraHttpOp> = Object.fromEntries(
	linkedcorpExtraHttpOps.map((operation) => [operation.id, operation]),
);

export function getLinkedcorpExtraHttpOpOptions() {
	return extraHttpOpOptions(linkedcorpExtraHttpOps);
}

const resource = ['linkedcorp'];

export const linkedcorpExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '上下游 ID',
		name: 'lc_chain_id',
		type: 'string',
		required: true,
		displayOptions: { show: { resource, operation: ['corpGetChainCorpinfo', 'corpGetChainGroup'] } },
		default: '',
	},
	{
		displayName: '企业状态',
		name: 'lc_corp_type',
		type: 'options',
		displayOptions: { show: { resource, operation: ['corpGetChainCorpinfo'] } },
		options: [
			{ name: '已加入企业', value: 'joined' },
			{ name: '待加入企业', value: 'pending' },
		],
		default: 'joined',
	},
	{
		displayName: '企业 CorpID',
		name: 'lc_corpid',
		type: 'string',
		required: true,
		displayOptions: { show: { resource, operation: ['corpGetChainCorpinfo'], lc_corp_type: ['joined'] } },
		default: '',
	},
	{
		displayName: '待加入企业 CorpID',
		name: 'lc_pending_corpid',
		type: 'string',
		required: true,
		displayOptions: { show: { resource, operation: ['corpGetChainCorpinfo'], lc_corp_type: ['pending'] } },
		default: '',
	},
	{
		displayName: '分组 ID',
		name: 'lc_groupid',
		type: 'number',
		typeOptions: { minValue: 0 },
		displayOptions: { show: { resource, operation: ['corpGetChainGroup'] } },
		default: 0,
		description: '设为 0 时返回全部分组',
	},
	{
		displayName: '转换方式',
		name: 'pending_conversion_type',
		type: 'options',
		displayOptions: { show: { resource, operation: ['unionidToPendingId'] } },
		options: [
			{ name: 'UnionID 转 Pending ID', value: 'unionid' },
			{ name: 'External UserID 批量转 Pending ID', value: 'external_userid' },
		],
		default: 'unionid',
	},
	{
		displayName: 'UnionID',
		name: 'lc_unionid',
		type: 'string',
		required: true,
		displayOptions: { show: { resource, operation: ['unionidToPendingId'], pending_conversion_type: ['unionid'] } },
		default: '',
	},
	{
		displayName: 'OpenID',
		name: 'lc_openid',
		type: 'string',
		required: true,
		displayOptions: { show: { resource, operation: ['unionidToPendingId'], pending_conversion_type: ['unionid'] } },
		default: '',
	},
	{
		displayName: 'External UserID 列表',
		name: 'lc_external_userids',
		type: 'string',
		required: true,
		displayOptions: { show: { resource, operation: ['unionidToPendingId'], pending_conversion_type: ['external_userid'] } },
		default: '',
		description: '支持逗号、竖线或换行分隔，最多 100 个',
	},
	{
		displayName: '客户群 ID',
		name: 'lc_chat_id',
		type: 'string',
		displayOptions: { show: { resource, operation: ['unionidToPendingId'], pending_conversion_type: ['external_userid'] } },
		default: '',
		description: '可选；填写后仅检查群主可见范围，并忽略群外客户',
	},
];
