import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeleteEventCategory = {
	resource: ['living'],
	operation: ['deleteEventCategory'],
};

export const deleteEventCategoryDescription: INodeProperties[] = [
	{
		displayName: '类别ID',
		name: 'category_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeleteEventCategory,
		},
		default: '',
		placeholder: 'cat_001',
		description:
			'分类 id。<a href="https://developer.work.weixin.qq.com/document/path/94538" target="_blank">官方文档</a>',
	},
];
