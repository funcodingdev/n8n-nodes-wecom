import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['invoice'], operation: ['batchGetInvoiceInfo'] };

export const batchGetInvoiceInfoDescription: INodeProperties[] = [
	{
		displayName: '发票列表输入方式',
		name: 'invoiceInputMode',
		type: 'options',
		options: [
			{ name: '表单', value: 'form' },
			{ name: 'JSON', value: 'json' },
		],
		default: 'form',
		displayOptions: { show: showOnly },
		description: '使用结构化表单添加发票，或直接提供企业微信 item_list JSON 数组',
	},
	{
		displayName: '发票列表',
		name: 'itemCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				...showOnly,
				invoiceInputMode: ['form'],
			},
		},
		default: {},
		placeholder: '添加发票',
		typeOptions: { multipleValues: true },
		description: '发票列表。批量查询返回发票类型、金额、开票时间、PDF URL 等结构化信息。<a href="https://developer.work.weixin.qq.com/document/path/90287" target="_blank">官方文档</a>',
		options: [
			{
				displayName: '发票',
				name: 'items',
				values: [
					{
						displayName: '发票卡券 ID',
						name: 'card_id',
						type: 'string',
						default: '',
						required: true,
						description: '发票ID。和encrypt_code共同构成一张发票卡券的唯一标识',
						placeholder: 'pXXXXXXXXXXXXXXXX',
					},
					{
						displayName: '加密 Code',
						name: 'encrypt_code',
						type: 'string',
						default: '',
						required: true,
						description: '加密code。和card_id共同构成一张发票卡券的唯一标识',
						placeholder: 'encrypt_code_example',
					},
				],
			},
		],
	},
	{
		displayName: '发票列表 JSON',
		name: 'itemListJson',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: {
			show: {
				...showOnly,
				invoiceInputMode: ['json'],
			},
		},
		description: 'item_list 数组；每项必须包含非空 card_id 与 encrypt_code',
	},
];
