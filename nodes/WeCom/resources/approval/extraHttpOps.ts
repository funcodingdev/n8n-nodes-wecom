import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

/** 文档有、此前节点未封装的 approval 相关 HTTP 接口（一等操作） */
export const approvalExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'getapprovaldata', name: '[审批补全] 获取审批数据(旧版)', action: '获取审批数据(旧版)', description: '获取审批数据(旧版)', path: '/cgi-bin/corp/getapprovaldata', method: 'POST' },
	{ id: 'advancedFeatureGetApplyIdList', name: '[高级功能审批] advanced_feature/get_apply_id_list', action: 'advanced_feature/get_apply_id_list', description: 'advanced_feature/get_apply_id_list', path: '/cgi-bin/advanced_feature/get_apply_id_list', method: 'POST' },
	{ id: 'advancedFeatureSetApprovalDetail', name: '[高级功能审批] advanced_feature/set_approval_detail', action: 'advanced_feature/set_approval_detail', description: 'advanced_feature/set_approval_detail', path: '/cgi-bin/advanced_feature/set_approval_detail', method: 'POST' },
];

export const approvalExtraHttpOpsById: Record<string, ExtraHttpOp> = Object.fromEntries(
	approvalExtraHttpOps.map((o) => [o.id, o]),
);

export const approvalExtraHttpOpsOptionValues = approvalExtraHttpOps.map((o) => o.id);

export function getApprovalExtraHttpOpOptions() {
	return extraHttpOpOptions(approvalExtraHttpOps);
}

export const approvalExtraHttpOpsDescription: INodeProperties[] = [
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['approval'], operation: approvalExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '请求体 JSON，字段名与企业微信接口文档保持一致；GET 请求可留空',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['approval'], operation: approvalExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: 'URL 查询参数（访问凭证会自动附加，无需填写）',
	},
];
