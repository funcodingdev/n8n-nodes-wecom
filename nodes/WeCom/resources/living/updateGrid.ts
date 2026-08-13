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
		typeOptions: { rows: 2 },
		description:
			'网格负责人 UserID 列表，每个网格至少 1 个、最多 20 个；支持逗号、中文逗号、竖线或换行分隔。<a href="https://developer.work.weixin.qq.com/document/path/94479" target="_blank">官方文档</a>',
	},
	{
		displayName: '更新网格成员',
		name: 'update_grid_member',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForUpdateGrid,
		},
		default: false,
		description: '关闭时保留现有网格成员；开启后按下方列表全量更新',
	},
	{
		displayName: '成员更新提示',
		name: 'gridMemberUpdateNotice',
		type: 'notice',
		displayOptions: {
			show: { ...showOnlyForUpdateGrid, update_grid_member: [true] },
		},
		default: '',
		description: '网格成员列表为全量更新。留空会清空所有成员，非空时最多 100 个。',
	},
	{
		displayName: '网格成员UserID列表',
		name: 'grid_member',
		type: 'string',
		displayOptions: {
			show: { ...showOnlyForUpdateGrid, update_grid_member: [true] },
		},
		default: '',
		placeholder: 'wangwu,zhaoliu',
		typeOptions: { rows: 3 },
		description:
			'成员 UserID 列表，最多 100 个；支持逗号、中文逗号、竖线或换行分隔。留空会清空所有成员。<a href="https://developer.work.weixin.qq.com/document/path/94479" target="_blank">官方文档</a>',
	},
];
