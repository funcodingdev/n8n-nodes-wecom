import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddGrid = {
	resource: ['living'],
	operation: ['addGrid'],
};

export const addGridDescription: INodeProperties[] = [
	{
		displayName: '网格名称',
		name: 'grid_name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddGrid,
		},
		default: '',
		placeholder: '示例网格',
		description:
			'网格名称，不能超过30个字，同一目标网格下不能存在同名同级子网格。<a href="https://developer.work.weixin.qq.com/document/path/94478" target="_blank">官方文档</a>',
	},
	{
		displayName: '父网格ID',
		name: 'grid_parent_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddGrid,
		},
		default: '',
		placeholder: 'parent_grid_id',
		description:
			'父节点 grid_id，网格结构最多支持10层。<a href="https://developer.work.weixin.qq.com/document/path/94478" target="_blank">官方文档</a>',
	},
	{
		displayName: '负责人UserID列表',
		name: 'grid_admin',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddGrid,
		},
		default: '',
		placeholder: 'zhangsan,lisi',
		description:
			'网格「负责人」userid 列表，每个网格至少1个、最多20个，多个用逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/94478" target="_blank">官方文档</a>',
	},
	{
		displayName: '网格成员UserID列表',
		name: 'grid_member',
		type: 'string',
		displayOptions: {
			show: showOnlyForAddGrid,
		},
		default: '',
		placeholder: 'wangwu,zhaoliu',
		description:
			'可选。该节点成员 userid 列表，不能超过100个，多个用逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/94478" target="_blank">官方文档</a>',
	},
];
