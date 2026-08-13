import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['deleteProductAlbum'],
};

export const deleteProductAlbumDescription: INodeProperties[] = [
	{
		displayName: '删除后无法恢复。应用只能删除由自己创建的商品图册。',
		name: 'deleteNotice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '商品ID',
		name: 'product_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
	},
];
