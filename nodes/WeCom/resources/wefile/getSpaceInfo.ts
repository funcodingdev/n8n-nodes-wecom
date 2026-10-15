import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['getSpaceInfo', 'getSpaceAuthInfo'] };

export const getSpaceInfoDescription: INodeProperties[] = [
	{
		displayName: '空间ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '微盘空间的ID',
	},
];
