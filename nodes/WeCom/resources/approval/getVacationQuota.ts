import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetVacationQuota = {
	resource: ['approval'],
	operation: ['getVacationQuota'],
};

export const getVacationQuotaDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetVacationQuota,
		},
		default: '',
		description: 'User ID of the employee',
		hint: '员工的UserID',
	},
];

