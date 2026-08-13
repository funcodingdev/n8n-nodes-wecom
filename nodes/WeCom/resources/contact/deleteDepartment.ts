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
		displayOptions: {
			show: showOnlyForDeleteDept,
		},
		default: '',
		placeholder: '100',
		description: '部门 ID。注意：不能删除根部门；不能删除含有子部门、成员的部门。删除前需要先清空子部门和成员。删除后不可恢复；可与下方选择二选一。<a href="https://developer.work.weixin.qq.com/document/path/90207" target="_blank">官方文档</a>',
	},
	{
		displayName: '部门(选择)',
		name: 'id_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: {
			show: showOnlyForDeleteDept,
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];

