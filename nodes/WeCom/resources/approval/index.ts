import type { INodeProperties } from 'n8n-workflow';

import { getTemplateDetailDescription } from './getTemplateDetail';
import { submitApprovalDescription } from './submitApproval';
import { getApprovalSpNoListDescription } from './getApprovalSpNoList';
import { getApprovalDetailDescription } from './getApprovalDetail';
import { getVacationConfigDescription } from './getVacationConfig';
import { getVacationQuotaDescription } from './getVacationQuota';
import { setVacationQuotaDescription } from './setVacationQuota';
import { createApprovalTemplateDescription } from './createApprovalTemplate';
import { updateApprovalTemplateDescription } from './updateApprovalTemplate';

const showOnlyForApproval = {
	resource: ['approval'],
};

export const approvalDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForApproval,
		},
		// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
		options: [
			{
				name: '获取审批模板详情',
				value: 'getTemplateDetail',
				action: '获取审批模板详情',
				description: 'Get approval template details',
			},
			{
				name: '提交审批申请',
				value: 'submitApproval',
				action: '提交审批申请',
				description: 'Submit approval application',
			},
			{
				name: '批量获取审批单号',
				value: 'getApprovalSpNoList',
				action: '批量获取审批单号',
				description: 'Batch get approval numbers',
			},
			{
				name: '获取审批申请详情',
				value: 'getApprovalDetail',
				action: '获取审批申请详情',
				description: 'Get approval application details',
			},
			{
				name: '获取企业假期管理配置',
				value: 'getVacationConfig',
				action: '获取假期配置',
				description: 'Get vacation management configuration',
			},
			{
				name: '获取成员假期余额',
				value: 'getVacationQuota',
				action: '获取假期余额',
				description: 'Get member vacation quota',
			},
			{
				name: '修改成员假期余额',
				value: 'setVacationQuota',
				action: '修改假期余额',
				description: 'Set member vacation quota',
			},
			{
				name: '创建审批模板',
				value: 'createApprovalTemplate',
				action: '创建审批模板',
				description: 'Create approval template',
			},
			{
				name: '更新审批模板',
				value: 'updateApprovalTemplate',
				action: '更新审批模板',
				description: 'Update approval template',
			},
		],
		default: 'getApprovalDetail',
	},
	...getTemplateDetailDescription,
	...submitApprovalDescription,
	...getApprovalSpNoListDescription,
	...getApprovalDetailDescription,
	...getVacationConfigDescription,
	...getVacationQuotaDescription,
	...setVacationQuotaDescription,
	...createApprovalTemplateDescription,
	...updateApprovalTemplateDescription,
];

