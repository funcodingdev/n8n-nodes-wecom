import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['invoice'],
	operation: ['getInvoiceInfo'],
};

export const getInvoiceInfoDescription: INodeProperties[] = [
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
		hint: '加密的发票code，从接收事件中获取',
		description: '加密的发票code',
	},
];

