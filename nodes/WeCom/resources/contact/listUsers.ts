import type { INodeProperties } from 'n8n-workflow';

const showOnlyListUsers = {
	resource: ['contact'],
	operation: ['listUsers'],
};

export const listUsersDescription: INodeProperties[] = [
	{
		displayName: '部门 Name or ID',
		name: 'department_id',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDepartments',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyListUsers,
		},
		description: '获取的部门ID，默认为根部门。从列表中选择，或使用<a href="https://docs.n8n.io/code/expressions/">表达式</a>指定ID',
	},
	{
		displayName: '是否递归获取',
		name: 'fetch_child',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyListUsers,
		},
		description: '是否递归获取子部门成员：true - 递归获取，false - 仅获取本部门',
	},
];

