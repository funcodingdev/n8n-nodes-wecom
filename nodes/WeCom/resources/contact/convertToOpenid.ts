import type { INodeProperties } from 'n8n-workflow';

const showOnlyConvertToOpenid = {
	resource: ['contact'],
	operation: ['convertToOpenid'],
};

export const convertToOpenidDescription: INodeProperties[] = [
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
			show: showOnlyConvertToOpenid,
		},
		description: '企业成员的 userid. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];

