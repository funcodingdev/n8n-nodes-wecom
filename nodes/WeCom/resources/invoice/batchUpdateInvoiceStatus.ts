import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['invoice'],
	operation: ['batchUpdateInvoiceStatus'],
};

export const batchUpdateInvoiceStatusDescription: INodeProperties[] = [
	{
		displayName: 'OpenID',
		name: 'openid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '用户的openid',
		description: '用户的openid',
	},
	{
		displayName: '发票状态',
		name: 'reimburse_status',
		type: 'options',
		options: [
			{
				name: '发票已锁定',
				value: 'INVOICE_REIMBURSE_INIT',
			},
			{
				name: '发票已核销',
				value: 'INVOICE_REIMBURSE_LOCK',
			},
			{
				name: '发票已完成报销',
				value: 'INVOICE_REIMBURSE_CLOSURE',
			},
		],
		required: true,
		default: 'INVOICE_REIMBURSE_INIT',
		displayOptions: {
			show: showOnly,
		},
		hint: '发票报销状态',
		description: '发票报销状态',
	},
	{
		displayName: '发票列表',
		name: 'invoice_list',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON数组，包含card_id和encrypt_code',
		description: '发票列表，格式：[{"card_id":"","encrypt_code":""}]',
	},
];

