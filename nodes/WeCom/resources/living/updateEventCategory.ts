import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateEventCategory = {
	resource: ['living'],
	operation: ['updateEventCategory'],
};

export const updateEventCategoryDescription: INodeProperties[] = [
	{
		displayName: '分类ID',
		name: 'category_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateEventCategory,
		},
		default: '',
		placeholder: 'category_id',
		description:
			'分类 id。<a href="https://developer.work.weixin.qq.com/document/path/94537" target="_blank">官方文档</a>',
	},
	{
		displayName: '分类名称',
		name: 'category_name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateEventCategory,
		},
		default: '',
		placeholder: '环境卫生管理',
		description:
			'分类名称，不能超过30个字。<a href="https://developer.work.weixin.qq.com/document/path/94537" target="_blank">官方文档</a>',
	},
	{
		displayName: '分类层级',
		name: 'level',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateEventCategory,
		},
		options: [
			{ name: '一级分类', value: 1 },
			{ name: '二级分类', value: 2 },
		],
		default: 1,
		description:
			'分类层级，只能为 1 或 2。<a href="https://developer.work.weixin.qq.com/document/path/94537" target="_blank">官方文档</a>',
	},
	{
		displayName: '所属一级分类ID',
		name: 'parent_category_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForUpdateEventCategory,
				level: [2],
			},
		},
		default: '',
		placeholder: 'parent_category_id',
		description:
			'level 为 2 时必填。<a href="https://developer.work.weixin.qq.com/document/path/94537" target="_blank">官方文档</a>',
	},
];
