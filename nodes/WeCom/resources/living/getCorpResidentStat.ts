import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCorpResidentStat = {
	resource: ['living'],
	operation: ['getCorpResidentStat'],
};

export const getCorpResidentStatDescription: INodeProperties[] = [
	{
		displayName: '网格ID',
		name: 'grid_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetCorpResidentStat,
		},
		default: '',
		placeholder: 'grid_id',
		description:
			'可选。网格 id，不传则获取整个企业的概况。<a href="https://developer.work.weixin.qq.com/document/path/93515" target="_blank">官方文档</a>',
	},
];
