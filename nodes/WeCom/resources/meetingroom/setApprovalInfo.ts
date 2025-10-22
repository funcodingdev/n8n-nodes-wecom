import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSetApprovalInfo = {
	resource: ['meetingroom'],
	operation: ['setApprovalInfo'],
};

export const setApprovalInfoDescription: INodeProperties[] = [
	{
		displayName: '申请单ID',
		name: 'meeting_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSetApprovalInfo,
		},
		default: '',
		description: 'Meeting application ID',
		hint: '申请单ID',
	},
	{
		displayName: '审批结果',
		name: 'approve_status',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForSetApprovalInfo,
		},
		options: [
			{ name: '审批通过', value: 1 },
			{ name: '审批拒绝', value: 2 },
		],
		default: 1,
		description: 'Approval status',
		hint: '审批结果：1-通过，2-拒绝',
	},
	{
		displayName: '审批意见',
		name: 'approve_info',
		type: 'string',
		displayOptions: {
			show: showOnlyForSetApprovalInfo,
		},
		default: '',
		description: 'Approval comment',
		hint: '审批意见',
	},
];

