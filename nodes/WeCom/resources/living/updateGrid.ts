import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateGrid = {
	resource: ['living'],
	operation: ['updateGrid'],
};

export const updateGridDescription: INodeProperties[] = [
	{
		displayName: '网格ID',
		name: 'grid_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateGrid,
		},
		default: '',
		placeholder: 'grid_id',
		description:
			'网格 id。<a href="https://developer.work.weixin.qq.com/document/path/94479" target="_blank">官方文档</a>',
	},
	{
		displayName: '网格名称',
		name: 'grid_name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateGrid,
		},
		default: '',
		placeholder: '更新后的网格名称',
		description:
			'网格名称，不能超过30个字。<a href="https://developer.work.weixin.qq.com/document/path/94479" target="_blank">官方文档</a>',
	},
	{
		displayName: '父网格ID',
		name: 'grid_parent_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateGrid,
		},
		default: '',
		placeholder: 'parent_grid_id',
		description:
			'父节点 grid_id，网格结构最多支持10层。<a href="https://developer.work.weixin.qq.com/document/path/94479" target="_blank">官方文档</a>',
	},
	{
		displayName: '负责人UserID列表',
		name: 'grid_admin',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateGrid,
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description:
			'网格「负责人」userid 列表，每个网格至少1个、最多20个。<a href="https://developer.work.weixin.qq.com/document/path/94479" target="_blank">官方文档</a>',
	},
	{
		displayName: '网格成员UserID列表',
		name: 'grid_member',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateGrid,
		},
		default: '',
		placeholder: 'wangwu,zhaoliu',
		description:
			'可选。成员 userid 列表，不能超过100个；为空则清空所有成员。<a href="https://developer.work.weixin.qq.com/document/path/94479" target="_blank">官方文档</a>',
	},
];
