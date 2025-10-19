import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeleteDept = {
	resource: ['contact'],
	operation: ['deleteDepartment'],
};

export const deleteDepartmentDescription: INodeProperties[] = [
	{
		displayName: '部门ID',
		name: 'id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeleteDept,
		},
		default: '',
		description: '部门id。（注：不能删除根部门；不能删除含有子部门、成员的部门）',
		hint: '要删除的部门ID',
	},
];

