import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetDepartment = {
	resource: ['contact'],
	operation: ['getDepartment'],
};

export const getDepartmentDescription: INodeProperties[] = [
	{
		displayName: '部门ID',
		name: 'id',
		type: 'string',
		default: '',
		placeholder: '1',
		displayOptions: {
			show: showOnlyGetDepartment,
		},
		description:
			'可选。部门 ID；可与下方选择二选一。不填则默认获取全量组织架构。接口性能较低，建议改用子部门 ID 列表与部门详情。<a href="https://developer.work.weixin.qq.com/document/path/90208" target="_blank">官方文档</a>',
	},
	{
		displayName: '部门(选择)',
		name: 'id_selected',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDepartments',
		},
		default: '',
		displayOptions: {
			show: showOnlyGetDepartment,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];

