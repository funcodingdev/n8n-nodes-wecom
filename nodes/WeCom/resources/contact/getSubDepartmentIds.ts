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
		placeholder: '1',
		description: '可选。部门ID。不填则获取全量组织架构；可与下方选择二选一',
	},
	{
		displayName: '部门(选择)',
		name: 'id_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: {
			show: showOnlyForGetSubDept,
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];

