import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetSubDept = {
	resource: ['contact'],
	operation: ['getSubDepartmentIds'],
};

export const getSubDepartmentIdsDescription: INodeProperties[] = [
	{
		displayName: '部门ID',
		name: 'id',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetSubDept,
		},
		default: '',
		description: '部门ID。获取指定部门及其下的子部门（以及子部门的子部门等等，递归）。如果不填，默认获取全量组织架构。',
		hint: '部门ID（可选）',
	},
];

