import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['invoice'],
	operation: ['updateInvoiceStatus'],
};

export const updateInvoiceStatusDescription: INodeProperties[] = [
	{
		displayName: '发票卡券ID',
		name: 'card_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '发票卡券的card_id',
		description: '发票卡券的card_id',
	},
	{
		displayName: '加密Code',
		name: 'encrypt_code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '加密的发票code',
		description: '加密的发票code',
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
];

