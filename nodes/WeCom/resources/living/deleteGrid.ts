import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeleteGrid = {
	resource: ['living'],
	operation: ['deleteGrid'],
};

export const deleteGridDescription: INodeProperties[] = [
	{
		displayName: '删除根网格',
		name: 'delete_root_grid',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForDeleteGrid,
		},
		default: false,
		description: '开启后向接口传空 grid_id，删除根网格及符合条件的所有子网格',
	},
	{
		displayName: '网格 ID',
		name: 'grid_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: { ...showOnlyForDeleteGrid, delete_root_grid: [false] },
		},
		default: '',
		placeholder: 'grid_001',
		description:
			'要删除的网格 id。<a href="https://developer.work.weixin.qq.com/document/path/94480" target="_blank">官方文档</a>',
	},
	{
		displayName: '目标网格及其子网格不包含网格员时，接口会删除目标及全部子网格。此操作不可恢复。',
		name: 'deleteGridNotice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForDeleteGrid,
		},
		default: '',
	},
	{
		displayName: '根网格删除范围可能覆盖整棵网格树。请仅在确认需要删除所有符合条件的网格时执行。',
		name: 'deleteRootGridNotice',
		type: 'notice',
		displayOptions: {
			show: { ...showOnlyForDeleteGrid, delete_root_grid: [true] },
		},
		default: '',
	},
];
