import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getContactWay'],
};

export const getContactWayDescription: INodeProperties[] = [
	{
		displayName: '联系方式配置ID',
		name: 'config_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '联系方式的配置id',
		description: '联系方式的配置ID',
	},
];

