import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetDepartment = {
	resource: ['contact'],
	operation: ['getDepartment'],
};

export const getDepartmentDescription: INodeProperties[] = [
	{
		displayName: '部门 Name or ID',
		name: 'id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDepartments',
		},
		default: '',
		displayOptions: {
			show: showOnlyGetDepartment,
		},
		description: '部门ID。（注：如果不填，默认获取全量组织架构）从列表中选择，或使用<a href="https://docs.n8n.io/code/expressions/">表达式</a>指定ID',
	},
];

