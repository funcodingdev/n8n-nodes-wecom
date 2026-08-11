import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddEventCategory = {
	resource: ['living'],
	operation: ['addEventCategory'],
};

export const addEventCategoryDescription: INodeProperties[] = [
	{
		displayName: '分类名称',
		name: 'category_name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddEventCategory,
		},
		default: '',
		placeholder: '环境卫生',
		description:
			'分类名称，不能超过30个字；同一一级分类下二级分类名称不能重复。<a href="https://developer.work.weixin.qq.com/document/path/94536" target="_blank">官方文档</a>',
	},
	{
		displayName: '分类层级',
		name: 'level',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForAddEventCategory,
		},
		options: [
			{ name: '一级分类', value: 1 },
			{ name: '二级分类', value: 2 },
		],
		default: 1,
		description:
			'分类层级，只能为 1 或 2。<a href="https://developer.work.weixin.qq.com/document/path/94536" target="_blank">官方文档</a>',
	},
	{
		displayName: '所属一级分类ID',
		name: 'parent_category_id',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForAddEventCategory,
				level: [2],
			},
		},
		default: '',
		placeholder: 'parent_category_id',
		description:
			'level 为 2 时必填，所属一级分类 id。<a href="https://developer.work.weixin.qq.com/document/path/94536" target="_blank">官方文档</a>',
	},
];
