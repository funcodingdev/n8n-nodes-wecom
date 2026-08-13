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
		displayOptions: {
			show: showOnlyForGetVacationQuota,
		},
		default: '',
		description: '要查询假期余额的成员UserID；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: showOnlyForGetVacationQuota,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];
