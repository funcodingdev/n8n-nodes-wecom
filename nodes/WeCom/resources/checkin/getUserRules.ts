import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetUserRules = {
	resource: ['checkin'],
	operation: ['getUserRules'],
};

export const getUserRulesDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetUserRules,
		},
		default: '',
		description: 'User ID of the employee',
		hint: '员工的UserID',
	},
];

