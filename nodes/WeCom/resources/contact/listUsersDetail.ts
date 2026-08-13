import type { INodeProperties } from 'n8n-workflow';

const showOnlyListUsersDetail = {
	resource: ['contact'],
	operation: ['listUsersDetail'],
};

export const listUsersDetailDescription: INodeProperties[] = [
	{
		displayName: '部门ID',
		name: 'department_id',
		type: 'string',
		displayOptions: {
			show: showOnlyListUsersDetail,
		},
		default: '1',
		placeholder: '1',
		description:
			'部门 ID；可与下方选择二选一。应用只能获取可见范围内的成员信息；部分基础字段在新策略下不再返回。<a href="https://developer.work.weixin.qq.com/document/path/90201" target="_blank">官方文档</a>',
	},
	{
		displayName: '部门(选择)',
		name: 'department_id_selected',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDepartments',
		},
		default: '',
		displayOptions: {
			show: showOnlyListUsersDetail,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '是否递归获取',
		name: 'fetch_child',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyListUsersDetail,
		},
		description:
			'是否递归获取子部门的成员详情。true 表示递归获取所有子部门成员，false 表示仅获取当前部门成员。<a href="https://developer.work.weixin.qq.com/document/path/90201" target="_blank">官方文档</a>',
	},
];
