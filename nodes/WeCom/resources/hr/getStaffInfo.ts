import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetStaffInfo = {
	resource: ['hr'],
	operation: ['getStaffInfo'],
};

export const getStaffInfoDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetStaffInfo,
		},
		default: '',
		description: 'User ID of the employee',
		hint: '员工的UserID',
	},
];

