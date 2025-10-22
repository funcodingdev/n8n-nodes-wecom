import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateStaffInfo = {
	resource: ['hr'],
	operation: ['updateStaffInfo'],
};

export const updateStaffInfoDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateStaffInfo,
		},
		default: '',
		description: 'User ID of the employee',
		hint: '员工的UserID',
	},
	{
		displayName: '更新数据',
		name: 'staffData',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateStaffInfo,
		},
		default: '{}',
		description: 'Staff information to update in JSON format',
		hint: '要更新的员工花名册信息，JSON格式',
	},
];

