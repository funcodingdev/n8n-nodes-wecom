import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['addProductAlbum'] };

export const addProductAlbumDescription: INodeProperties[] = [
	{
		displayName: '商品描述（必填）',
		name: 'description',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		typeOptions: { rows: 3 },
		description: '商品的名称、特色等，不超过300个字',
		placeholder: '世界上最好的商品',
	},
	{
		displayName: '商品价格（分）（必填）',
		name: 'price',
		type: 'number',
		required: true,
		default: 0,
		typeOptions: { minValue: 0, maxValue: 500000 },
		displayOptions: { show: showOnly },
		description: '商品的价格，单位为分；最大不超过5万元（500000分）',
	},
	{
		displayName: '商品编码',
		name: 'product_sn',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '商品编码；不超过128个字节；只能输入数字和字母',
		placeholder: 'SKU001',
	},
	{
		displayName: '商品图片（必填）',
		name: 'attachmentCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加图片',
		typeOptions: { multipleValues: true },
		description:
			'商品图片列表，必须填写 1–9 个；下方 JSON 非空时覆盖表单；仅支持通过“上传附件资源”操作获得的资源',
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
						description: '图片的media_id，仅支持通过上传附件资源接口获得的资源',
					},
				],
			},
		],
	},
	{
		displayName: '商品图片 JSON',
		name: 'attachmentsJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '[]',
		description:
			'可选。非空数组时覆盖上方图片表单。支持 [{"media_id":"..."}] 或 ["media_id"]',
	},
];
