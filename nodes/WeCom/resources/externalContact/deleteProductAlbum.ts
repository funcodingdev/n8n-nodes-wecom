import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['deleteProductAlbum'],
};

export const deleteProductAlbumDescription: INodeProperties[] = [
	{
		displayName: '商品ID',
		name: 'product_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '商品id',
	},
];

