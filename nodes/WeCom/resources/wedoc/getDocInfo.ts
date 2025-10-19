import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetInfo = {
	resource: ['wedoc'],
	operation: ['getDocInfo'],
};

export const getDocInfoDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetInfo,
		},
		default: '',
		description: '文档的docid。',
		hint: '文档ID',
	},
];
