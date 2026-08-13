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
		displayOptions: {
			show: showOnlyForGetDeptDetail,
		},
		default: '',
		placeholder: '2',
		description: '部门ID，获取指定部门的详细信息；可与下方选择二选一',
	},
	{
		displayName: '部门(选择)',
		name: 'id_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: {
			show: showOnlyForGetDeptDetail,
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];

