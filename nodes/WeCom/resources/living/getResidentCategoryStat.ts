import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetResidentCategoryStat = {
	resource: ['living'],
	operation: ['getResidentCategoryStat'],
};

export const getResidentCategoryStatDescription: INodeProperties[] = [
	{
		displayName: '分类ID',
		name: 'category_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetResidentCategoryStat,
		},
		default: '',
		placeholder: 'category_id',
		description:
			'可选。分类 ID；不传拉取所有一级分类数据。<a href="https://developer.work.weixin.qq.com/document/path/93517" target="_blank">官方文档</a>',
	},
];
