import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['invoice'],
	operation: ['getInvoiceInfo'],
};

export const getInvoiceInfoDescription: INodeProperties[] = [
	{
		displayName: '发票卡券 ID',
		name: 'card_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '发票ID。报销方在获得用户选择的电子发票标识参数后，可以通过该接口查询电子发票的结构化信息，并获取发票PDF文件。',
		placeholder: 'pXXXXXXXXXXXXXXXX',
	},
	{
		displayName: '加密 Code',
		name: 'encrypt_code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '从接收事件中获取的加密发票 code，与 card_id 一起用于查询电子发票信息。<a href="https://developer.work.weixin.qq.com/document/path/90284" target="_blank">官方文档</a>',
		placeholder: 'encrypt_code_example',
	},
];
