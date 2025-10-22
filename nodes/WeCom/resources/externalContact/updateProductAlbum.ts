import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['updateProductAlbum'],
};

export const updateProductAlbumDescription: INodeProperties[] = [
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
	{
		displayName: '商品信息',
		name: 'product',
		type: 'json',
		required: true,
		default: '{}',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON格式的商品信息',
		description: '商品信息，包含商品名称、价格、描述等',
	},
];

