import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetDeptDetail = {
	resource: ['contact'],
	operation: ['getDepartmentDetail'],
};

export const getDepartmentDetailDescription: INodeProperties[] = [
	{
		displayName: '部门ID',
		name: 'id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetDeptDetail,
		},
		default: '',
		description: '部门ID。',
		hint: '部门ID',
	},
];

