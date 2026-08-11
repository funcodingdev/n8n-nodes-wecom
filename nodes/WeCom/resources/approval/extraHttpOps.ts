import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

export const approvalExtraHttpOps: ExtraHttpOp[] = [
	{ id: 'getapprovaldata', name: '[审批] 获取审批数据(旧版)', action: '获取审批数据（旧版）', description: '获取审批数据（旧版）', path: '/cgi-bin/corp/getapprovaldata', method: 'POST' },
	{ id: 'advancedFeatureGetApplyIdList', name: '[高级功能] 获取申请单列表', action: '获取高级功能申请单列表', description: '获取高级功能申请单列表', path: '/cgi-bin/advanced_feature/get_apply_id_list', method: 'POST' },
	{ id: 'advancedFeatureSetApprovalDetail', name: '[高级功能] 设置审批详情', action: '设置高级功能审批详情', description: '设置高级功能审批详情', path: '/cgi-bin/advanced_feature/set_approval_detail', method: 'POST' },
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
		displayName: '开始时间',
		name: 'appr_starttime',
		type: 'number',
		displayOptions: {
			show: { resource: ['approval'], operation: ['getapprovaldata'] },
		},
		default: 0,
		description: '开始时间戳（秒），旧版审批数据接口',
	},
	{
		displayName: '结束时间',
		name: 'appr_endtime',
		type: 'number',
		displayOptions: {
			show: { resource: ['approval'], operation: ['getapprovaldata'] },
		},
		default: 0,
		description: '结束时间戳（秒）',
	},
	{
		displayName: '下一条审批单号',
		name: 'next_spnum',
		type: 'string',
		displayOptions: {
			show: { resource: ['approval'], operation: ['getapprovaldata'] },
		},
		default: '',
		description: '分页用 next_spnum，首次可不传',
	},
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['approval'], operation: approvalExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '其余字段与上方合并；高级功能审批详情等写在这里',
	},
	{
		displayName: 'Query参数JSON',
		name: 'requestQuery',
		type: 'json',
		displayOptions: {
			show: { resource: ['approval'], operation: approvalExtraHttpOpsOptionValues },
		},
		default: '{}',
	},
];
