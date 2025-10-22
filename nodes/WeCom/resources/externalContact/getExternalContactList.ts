import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getExternalContactList'],
};

export const getExternalContactListDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '企业成员的userid',
		description: '企业成员的userid',
	},
];

