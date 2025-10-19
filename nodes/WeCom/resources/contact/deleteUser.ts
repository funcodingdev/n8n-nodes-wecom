import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelete = {
	resource: ['contact'],
	operation: ['deleteUser'],
};

export const deleteUserDescription: INodeProperties[] = [
	{
		displayName: 'UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDelete,
		},
		default: '',
		description: '成员UserID。对应管理端的账号。',
		hint: '要删除的成员UserID',
	},
];

