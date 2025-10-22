import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeleteMailGroup = {
	resource: ['mail'],
	operation: ['deleteMailGroup'],
};

export const deleteMailGroupDescription: INodeProperties[] = [
	{
		displayName: '群组地址',
		name: 'groupid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeleteMailGroup,
		},
		default: '',
		description: '要删除的群组邮箱地址',
		hint: '群组地址',
	},
];

