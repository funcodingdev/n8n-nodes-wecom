import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['invoice'],
	operation: ['batchGetInvoiceInfo'],
};

export const batchGetInvoiceInfoDescription: INodeProperties[] = [
	{
		displayName: '发票项列表',
		name: 'item_list',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: {
			show: showOnly,
		},
		hint: 'JSON数组，包含card_id和encrypt_code',
		description: '发票项列表，格式：[{"card_id":"","encrypt_code":""}]',
	},
];

