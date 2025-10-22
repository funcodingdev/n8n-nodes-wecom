import type { INodeProperties } from 'n8n-workflow';

const showOnlyForListServicer = {
	resource: ['kf'],
	operation: ['listServicer'],
};

export const listServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号ID',
		name: 'open_kfid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForListServicer,
		},
		default: '',
		hint: '客服账号ID',
	},
];

