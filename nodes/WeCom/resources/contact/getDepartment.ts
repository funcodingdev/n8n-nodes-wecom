import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetDepartment = {
	resource: ['contact'],
	operation: ['getDepartment'],
};

export const getDepartmentDescription: INodeProperties[] = [
	{
		displayName: '部门 ID',
		name: 'id',
		type: 'string',
		default: '1',
		displayOptions: {
			show: showOnlyGetDepartment,
		},
		description: '部门ID。（注：如果不填，默认获取全量组织架构）',
	},
];

