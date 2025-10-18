import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetUser = {
	resource: ['contact'],
	operation: ['getUser'],
};

export const getUserDescription: INodeProperties[] = [
	{
		displayName: '成员',
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
		description: '成员UserID。对应管理端的账号，企业内必须唯一',
	},
];

