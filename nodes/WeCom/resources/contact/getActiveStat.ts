import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetActiveStat = {
	resource: ['contact'],
	operation: ['getActiveStat'],
};

export const getActiveStatDescription: INodeProperties[] = [
	{
		displayName: '具体某天',
		name: 'date',
		type: 'string',
		required: true,
		default: '',
		placeholder: '2020-03-27',
		displayOptions: {
			show: showOnlyGetActiveStat,
		},
		description: '具体某天的活跃人数，最长支持获取30天前数据，格式为 YYYY-MM-DD',
	},
];

