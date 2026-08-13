import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['listCustomerAcquisitionLink'],
};

export const listCustomerAcquisitionLinkDescription: INodeProperties[] = [
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '由上一次调用返回；首次调用留空',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		displayOptions: {
			show: showOnly,
		},
		description: '返回的最大记录数，范围 1–100',
	},
];
