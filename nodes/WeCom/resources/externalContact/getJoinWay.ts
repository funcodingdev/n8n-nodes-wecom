import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getJoinWay'],
};

export const getJoinWayDescription: INodeProperties[] = [
	{
		displayName: '配置ID',
		name: 'config_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '加入群聊的配置id',
		description: '加入群聊的配置ID',
	},
];

