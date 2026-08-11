import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['updateProductAlbum'] };

export const updateProductAlbumDescription: INodeProperties[] = [
	{
		displayName: '商品ID（必填）',
		name: 'product_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '要更新的商品ID',
	},
	{
		displayName: '商品描述',
		name: 'description',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		typeOptions: { rows: 3 },
		description: '商品的名称、特色等，不超过300个字。不需更新的字段可不填',
		placeholder: '世界上最好的商品',
	},
	{
		displayName: '商品价格（分）',
		name: 'price',
		type: 'number',
		default: 0,
		displayOptions: { show: showOnly },
		description: '商品的价格，单位为分；最大不超过5万元。不需更新的字段可不填',
	},
	{
		displayName: '商品编码',
		name: 'product_sn',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '商品编码；不超过128个字节；只能输入数字和字母。不需更新的字段可不填',
		placeholder: 'SKU001',
	},
	{
		displayName: '更新商品图片',
		name: 'updateAttachments',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
	},
	{
		displayName: '商品图片',
		name: 'attachmentCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, updateAttachments: [true] } },
		default: {},
		placeholder: '添加图片',
		typeOptions: { multipleValues: true },
		description: '商品图片列表，最多不超过9个附件',
		options: [
			{
				displayName: '图片',
				name: 'attachments',
				values: [
					{
						displayName: '图片Media ID',
						name: 'media_id',
						type: 'string',
						default: '',
						required: true,
						description: '图片的media_id，仅支持通过上传附件资源接口的资源',
					},
				],
			},
		],
	},
];
