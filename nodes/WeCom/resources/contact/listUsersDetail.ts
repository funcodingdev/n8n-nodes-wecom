import type { INodeProperties } from 'n8n-workflow';

const showOnlyListUsersDetail = {
	resource: ['contact'],
	operation: ['listUsersDetail'],
};

export const listUsersDetailDescription: INodeProperties[] = [
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
			show: showOnlyListUsersDetail,
		},
		description: '获取的部门ID，默认为根部门. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: '是否递归获取',
		name: 'fetch_child',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyListUsersDetail,
		},
		description: 'Whether to recursively get members from sub-departments',
	},
];

