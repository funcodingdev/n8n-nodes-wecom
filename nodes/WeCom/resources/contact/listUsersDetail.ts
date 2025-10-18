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
		default: '1',
		displayOptions: {
			show: showOnlyListUsersDetail,
		},
		description: '获取的部门ID，默认为根部门',
	},
	{
		displayName: '是否递归获取',
		name: 'fetch_child',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyListUsersDetail,
		},
		description: '是否递归获取子部门下的成员：1-递归获取，0-只获取本部门',
	},
];

