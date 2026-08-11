import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetGridList = {
	resource: ['living'],
	operation: ['getGridList'],
};

export const getGridListDescription: INodeProperties[] = [
	{
		displayName: '网格ID',
		name: 'grid_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetGridList,
		},
		default: '',
		placeholder: 'grid_id',
		description:
			'可选。网格 id，不填则拉取根节点及其子节点。<a href="https://developer.work.weixin.qq.com/document/path/94481" target="_blank">官方文档</a>',
	},
];
