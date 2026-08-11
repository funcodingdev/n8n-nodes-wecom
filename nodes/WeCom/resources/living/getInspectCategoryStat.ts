import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetInspectCategoryStat = {
	resource: ['living'],
	operation: ['getInspectCategoryStat'],
};

export const getInspectCategoryStatDescription: INodeProperties[] = [
	{
		displayName: '分类ID',
		name: 'category_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetInspectCategoryStat,
		},
		default: '',
		placeholder: 'category_id',
		description:
			'可选。分类 ID；不传拉取所有一级分类数据，传一级分类 id 可拉取其下二级分类数据。<a href="https://developer.work.weixin.qq.com/document/path/93534" target="_blank">官方文档</a>',
	},
];
