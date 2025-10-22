import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['addProductAlbum'],
};

export const addProductAlbumDescription: INodeProperties[] = [
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

