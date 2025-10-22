import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSubmitApproval = {
	resource: ['approval'],
	operation: ['submitApproval'],
};

export const submitApprovalDescription: INodeProperties[] = [
	{
		displayName: '审批申请数据',
		name: 'approvalData',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForSubmitApproval,
		},
		default: '{}',
		description: 'Approval application data in JSON format',
		hint: '审批申请数据，包含creator_userid、template_id、apply_data等字段',
	},
];

