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
		description: '可选。从列表中选择部门，或使用表达式指定部门 ID。获取指定部门及其下的子部门（以及子部门的子部门等等，递归）。如果不填，默认获取全量组织架构。从2022年8月15日10点开始，"企业管理后台 - 管理工具 - 通讯录同步"的新增IP将不能再调用此接口，企业可通过「获取部门ID列表」接口获取部门ID列表。由于该接口性能较低，建议换用获取子部门ID列表与获取单个部门详情。只能拉取token对应的应用的权限范围内的部门列表。<a href="https://developer.work.weixin.qq.com/document/path/90208" target="_blank">官方文档</a>。Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

