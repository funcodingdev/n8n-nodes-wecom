import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetUser = {
	resource: ['contact'],
	operation: ['getUser'],
};

export const getUserDescription: INodeProperties[] = [
	{
		displayName: '成员 Name or ID',
		name: 'userid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyGetUser,
		},
		description: '成员UserID。对应管理端的账号，企业内必须唯一。从列表中选择，或使用<a href="https://docs.n8n.io/code/expressions/">表达式</a>指定ID',
	},
];

