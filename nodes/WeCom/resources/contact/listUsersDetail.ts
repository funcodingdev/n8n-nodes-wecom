import type { INodeProperties } from 'n8n-workflow';

const showOnlyListUsersDetail = {
	resource: ['contact'],
	operation: ['listUsersDetail'],
};

export const listUsersDetailDescription: INodeProperties[] = [
	{
		displayName: '部门',
		name: 'department_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDepartments',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyListUsersDetail,
		},
		description: '从列表中选择部门，或使用表达式指定部门 ID。仅返回应用可见范围内的成员；新建的自建应用不再返回头像、手机、邮箱等敏感字段。<a href="https://developer.work.weixin.qq.com/document/path/90201" target="_blank">官方文档</a>。Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
	{
		displayName: '是否递归获取',
		name: 'fetch_child',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyListUsersDetail,
		},
		description: '是否递归获取子部门的成员详情。true表示递归获取所有子部门成员，false表示仅获取当前部门成员。如需获取该部门及其子部门的所有成员，需先获取该部门下的子部门，然后再获取子部门下的部门成员，逐层递归获取。<a href="https://developer.work.weixin.qq.com/document/path/90201" target="_blank">官方文档</a>',
	},
];
