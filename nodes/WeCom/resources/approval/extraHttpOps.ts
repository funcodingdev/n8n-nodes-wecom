import type { INodeProperties } from 'n8n-workflow';
import type { ExtraHttpOp } from '../../shared/extraHttpOp';
import { extraHttpOpOptions } from '../../shared/extraHttpOp';

export const approvalExtraHttpOps: ExtraHttpOp[] = [
	{
		id: 'getapprovaldata',
		name: '[审批] 获取审批数据(旧版)',
		action: '获取审批数据（旧版）',
		description: '获取审批数据（旧版）',
		path: '/cgi-bin/corp/getapprovaldata',
		method: 'POST',
	},
	{
		id: 'advancedFeatureGetApplyIdList',
		name: '[高级功能] 获取申请单列表',
		action: '获取高级功能申请单列表',
		description: '获取高级功能申请单列表',
		path: '/cgi-bin/advanced_feature/get_apply_id_list',
		method: 'POST',
	},
	{
		id: 'advancedFeatureSetApprovalDetail',
		name: '[高级功能] 设置审批详情',
		action: '设置高级功能审批详情',
		description: '设置高级功能审批详情',
		path: '/cgi-bin/advanced_feature/set_approval_detail',
		method: 'POST',
	},
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
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: { resource: ['approval'], operation: ['getapprovaldata'] },
		},
		default: '',
		description: '开始时间 starttime（Unix 秒），旧版审批数据接口',
	},
	{
		displayName: '结束时间',
		name: 'appr_endtime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: { resource: ['approval'], operation: ['getapprovaldata'] },
		},
		default: '',
		description: '结束时间 endtime（Unix 秒）',
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
		displayName: '高级账号类型',
		name: 'af_business_type',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureGetApplyIdList'],
			},
		},
		options: [
			{ name: '邮件', value: 1 },
			{ name: '文档', value: 2 },
			{ name: '微盘', value: 3 },
			{ name: '会议', value: 4 },
		],
		default: 1,
		description: 'business_type',
	},
	{
		displayName: '申请人UserID',
		name: 'af_userid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureGetApplyIdList'],
			},
		},
		default: '',
		description: '申请的 userid；可与下方选择二选一',
	},
	{
		displayName: '申请人(选择)',
		name: 'af_userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureGetApplyIdList'],
			},
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '分页条数',
		name: 'af_limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureGetApplyIdList'],
			},
		},
		default: 100,
		typeOptions: { minValue: 1, maxValue: 200 },
		description: '默认 100，最大 200',
	},
	{
		displayName: '游标',
		name: 'af_cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureGetApplyIdList'],
			},
		},
		default: '',
		description: '分页 cursor，首次可不填',
	},
	{
		displayName: '申请单类型',
		name: 'af_req_type',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureGetApplyIdList'],
			},
		},
		options: [
			{ name: '所有', value: 0 },
			{ name: '仅 API 单', value: 1 },
			{ name: '非 API 申请单', value: 2 },
		],
		default: 0,
		description: 'req_type',
	},
	{
		displayName: '申请ID',
		name: 'af_apply_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureSetApprovalDetail'],
			},
		},
		default: '',
		description: 'apply_id',
	},
	{
		displayName: '审批ID',
		name: 'af_approval_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureSetApprovalDetail'],
			},
		},
		default: '',
		description: 'approval_id，与申请 id 一一对应',
	},
	{
		displayName: '审批状态',
		name: 'af_approval_status',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureSetApprovalDetail'],
			},
		},
		options: [
			{ name: '审批中', value: 1 },
			{ name: '已驳回', value: 2 },
			{ name: '已同意', value: 3 },
			{ name: '已撤销', value: 101 },
		],
		default: 1,
	},
	{
		displayName: '审批跳转链接',
		name: 'af_approval_url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureSetApprovalDetail'],
			},
		},
		default: '',
		description: '须以 http:// 或 https:// 开头',
	},
	{
		displayName: '审批节点',
		name: 'afProcessNodesCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureSetApprovalDetail'],
			},
		},
		default: {},
		placeholder: '添加节点',
		typeOptions: { multipleValues: true },
		description: 'process_list.node_list',
		options: [
			{
				displayName: '节点',
				name: 'nodes',
				values: [
					{
						displayName: '节点状态',
						name: 'node_apv_status',
						type: 'options',
						options: [
							{ name: '审批中', value: 1 },
							{ name: '已驳回', value: 2 },
							{ name: '已同意', value: 3 },
							{ name: '已撤销', value: 101 },
							{ name: '未到流程', value: 102 },
						],
						default: 1,
					},
					{
						displayName: '多人审批方式',
						name: 'node_apv_rel',
						type: 'options',
						options: [
							{ name: '会签', value: 1 },
							{ name: '或签', value: 2 },
							{ name: '依次审批', value: 3 },
						],
						default: 1,
					},
					{
						displayName: '当前审批人',
						name: 'current_approvers',
						type: 'string',
						default: '',
						placeholder: 'user1,user2',
						description: '逗号分隔；与下方选择合并',
					},
					{
						displayName: '当前审批人(选择)',
						name: 'current_approvers_selected',
						type: 'multiOptions',
						typeOptions: { loadOptionsMethod: 'getAllUsers' },
						default: [],
						description: '与上方列表合并去重',
					},
					{
						displayName: '已处理审批人',
						name: 'completed_approvers',
						type: 'string',
						default: '',
						placeholder: 'user0',
						description: '逗号分隔；与下方选择合并',
					},
					{
						displayName: '已处理审批人(选择)',
						name: 'completed_approvers_selected',
						type: 'multiOptions',
						typeOptions: { loadOptionsMethod: 'getAllUsers' },
						default: [],
						description: '与上方列表合并去重',
					},
					{
						displayName: '节点更新时间',
						name: 'apv_update_time',
						type: 'dateTime',
						default: '',
						description: 'apv_update_time（Unix 秒）',
					},
				],
			},
		],
	},
	{
		displayName: '审批节点扩展JSON',
		name: 'af_process_node_list_json',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['approval'],
				operation: ['advancedFeatureSetApprovalDetail'],
			},
		},
		default: '[]',
		description: '非空数组时覆盖上方节点表单',
	},
	{
		displayName: '请求体JSON',
		name: 'requestBody',
		type: 'json',
		displayOptions: {
			show: { resource: ['approval'], operation: approvalExtraHttpOpsOptionValues },
		},
		default: '{}',
		description: '其余字段与上方合并，同名字段以 JSON 为准',
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
