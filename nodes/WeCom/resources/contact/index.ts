import type { INodeProperties } from 'n8n-workflow';
import { getUserDescription } from './getUser';
import { listUsersDescription } from './listUsers';
import { getDepartmentDescription } from './getDepartment';

const showOnlyForContact = {
	resource: ['contact'],
};

export const contactDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForContact,
		},
		options: [
			{
				name: '获取成员信息',
				value: 'getUser',
				action: '获取成员信息',
				description: '读取成员详细信息',
			},
			{
				name: '获取部门成员',
				value: 'listUsers',
				action: '获取部门成员列表',
				description: '获取部门成员列表',
			},
			{
				name: '获取部门信息',
				value: 'getDepartment',
				action: '获取部门信息',
				description: '获取部门列表',
			},
		],
		default: 'getUser',
	},
	...getUserDescription,
	...listUsersDescription,
	...getDepartmentDescription,
];

