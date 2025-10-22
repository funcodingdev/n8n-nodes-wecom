import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetApprovalDetail = {
	resource: ['approval'],
	operation: ['getApprovalDetail'],
};

export const getApprovalDetailDescription: INodeProperties[] = [
	{
		displayName: '审批单号',
		name: 'sp_no',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetApprovalDetail,
		},
		default: '',
		description: 'Approval number',
		hint: '审批单号',
	},
];

