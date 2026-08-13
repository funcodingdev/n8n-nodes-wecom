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
		description:
			'审批单号。提交审批申请后返回的sp_no。<a href="https://developer.work.weixin.qq.com/document/path/91983" target="_blank">官方文档</a>',
		placeholder: '202301010001',
	},
];
