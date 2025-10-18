import type { INodeProperties } from 'n8n-workflow';

const showOnlyListUsers = {
	resource: ['contact'],
	operation: ['listUsers'],
};

export const listUsersDescription: INodeProperties[] = [
	{
		displayName: '部门 ID',
		name: 'department_id',
		type: 'string',
		required: true,
		default: '1',
		displayOptions: {
			show: showOnlyListUsers,
		},
		description: '获取的部门id，默认为根部门',
	},
	{
		displayName: '是否递归获取',
		name: 'fetch_child',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyListUsers,
		},
		description: '是否递归获取子部门下面的成员：1-递归获取，0-只获取本部门',
	},
];

