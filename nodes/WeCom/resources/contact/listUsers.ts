import type { INodeProperties } from 'n8n-workflow';

const showOnlyListUsers = {
	resource: ['contact'],
	operation: ['listUsers'],
};

export const listUsersDescription: INodeProperties[] = [
	{
		displayName: '部门ID',
		name: 'department_id',
		type: 'string',
		displayOptions: {
			show: showOnlyListUsers,
		},
		default: '1',
		placeholder: '1',
		description:
			'部门 ID；可与下方选择二选一。从 2022-08-15 起通讯录同步新增 IP 不宜再调此接口，可改用「获取成员 ID 列表」等。<a href="https://developer.work.weixin.qq.com/document/path/90200" target="_blank">官方文档</a>',
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
			show: showOnlyListUsers,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '是否递归获取',
		name: 'fetch_child',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyListUsers,
		},
		description:
			'是否递归获取子部门的成员。true 表示递归获取所有子部门成员，false 表示仅获取当前部门成员。<a href="https://developer.work.weixin.qq.com/document/path/90200" target="_blank">官方文档</a>',
	},
];
