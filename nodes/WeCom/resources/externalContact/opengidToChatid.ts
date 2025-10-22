import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['opengidToChatid'],
};

export const opengidToChatidDescription: INodeProperties[] = [
	{
		displayName: 'Opengid',
		name: 'opengid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '客户群的opengid',
		description: '客户群的opengid',
	},
];

