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
		typeOptions: { rows: 2 },
		description:
			'网格负责人 UserID 列表，每个网格至少 1 个、最多 20 个；支持逗号、中文逗号、竖线或换行分隔，重复值会自动去除。<a href="https://developer.work.weixin.qq.com/document/path/94478" target="_blank">官方文档</a>',
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
		typeOptions: { rows: 3 },
		description:
			'可选。网格成员 UserID 列表，最多 100 个；支持逗号、中文逗号、竖线或换行分隔，重复值会自动去除。<a href="https://developer.work.weixin.qq.com/document/path/94478" target="_blank">官方文档</a>',
	},
];
