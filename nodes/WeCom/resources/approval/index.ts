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
		options: [
			// 审批申请
			{
				name: '[审批申请] 提交审批申请',
				value: 'submitApproval',
				action: '提交审批申请',
				description: '提交一个新的审批申请单',
			},
			{
				name: '[审批申请] 获取审批申请详情',
				value: 'getApprovalDetail',
				action: '获取审批申请详情',
				description: '获取指定审批申请的详细信息和审批状态',
			},
			{
				name: '[审批申请] 批量获取审批单号',
				value: 'getApprovalSpNoList',
				action: '批量获取审批单号',
				description: '批量获取符合条件的审批单号列表',
			},
			{
				name: '[审批申请] 获取审批数据(旧版)',
				value: 'getOpenApprovalData',
				action: '获取审批数据旧版',
				description: 'corp/getopenapprovaldata，兼容旧接口',
			},
			// 审批模板
			{
				name: '[审批模板] 获取审批模板详情',
				value: 'getTemplateDetail',
				action: '获取审批模板详情',
				description: '获取指定审批模板的详细配置信息',
			},
			{
				name: '[审批模板] 创建审批模板',
				value: 'createApprovalTemplate',
				action: '创建审批模板',
				description: '创建新的审批模板',
			},
			{
				name: '[审批模板] 更新审批模板',
				value: 'updateApprovalTemplate',
				action: '更新审批模板',
				description: '更新已有审批模板的配置',
			},
			// 假期管理
			{
				name: '[假期管理] 获取企业假期管理配置',
				value: 'getVacationConfig',
				action: '获取假期配置',
				description: '获取企业假期类型配置和管理规则',
			},
			{
				name: '[假期管理] 获取成员假期余额',
				value: 'getVacationQuota',
				action: '获取假期余额',
				description: '获取指定成员的假期余额信息',
			},
			{
				name: '[假期管理] 修改成员假期余额',
				value: 'setVacationQuota',
				action: '修改假期余额',
				description: '修改指定成员的假期余额配额',
			},
		],
		default: 'getApprovalDetail',
	},
	...getTemplateDetailDescription,
	...submitApprovalDescription,
	...getApprovalSpNoListDescription,
	...getApprovalDetailDescription,
	{
		displayName: '第三方审批单号',
		name: 'thirdNo',
		type: 'string',
		required: true,
		displayOptions: {
			show: { resource: ['approval'], operation: ['getOpenApprovalData'] },
		},
		default: '',
		description: 'thirdNo，审批单号',
	},
	...getVacationConfigDescription,
	...getVacationQuotaDescription,
	...setVacationQuotaDescription,
	...createApprovalTemplateDescription,
	...updateApprovalTemplateDescription,
];

