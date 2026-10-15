import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetDepartment = {
	resource: ['contact'],
	operation: ['getDepartment'],
};

export const getDepartmentDescription: INodeProperties[] = [
	{
		displayName: '部门',
		name: 'id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDepartments',
		},
		default: '',
		displayOptions: {
			show: showOnlyGetDepartment,
		},
		description: '从列表中选择部门，或使用表达式指定部门 ID；留空获取全量组织架构（含子部门）。<a href="https://developer.work.weixin.qq.com/document/path/90208" target="_blank">官方文档</a>。Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

