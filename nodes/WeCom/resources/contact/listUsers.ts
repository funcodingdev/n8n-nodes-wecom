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
		description: '获取的部门ID，默认为根部门. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: '是否递归获取',
		name: 'fetch_child',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyListUsers,
		},
		description: 'Whether to recursively fetch members from sub-departments: 1 - fetch recursively, 0 - fetch only from this department',
	},
];

