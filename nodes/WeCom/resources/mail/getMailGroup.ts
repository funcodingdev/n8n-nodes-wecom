import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMailGroup = {
	resource: ['mail'],
	operation: ['getMailGroup'],
};

export const getMailGroupDescription: INodeProperties[] = [
	{
		displayName: '群组地址',
		name: 'groupid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetMailGroup,
		},
		default: '',
		description: '群组邮箱地址',
		hint: '群组地址',
	},
];

