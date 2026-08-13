import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['invoice'], operation: ['batchUpdateInvoiceStatus'] };

export const batchUpdateInvoiceStatusDescription: INodeProperties[] = [
	{
		displayName: 'OpenID',
		name: 'openid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '用户 OpenID，可通过 UserID 与 OpenID 互换接口获取。列表中的发票必须全部属于该用户。<a href="https://developer.work.weixin.qq.com/document/path/90286" target="_blank">官方文档</a>',
		placeholder: 'oxxxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '发票状态',
		name: 'reimburse_status',
		type: 'options',
		options: [
			{
				name: '请选择发票状态',
				value: '',
			},
			{
				name: '发票初始状态（未锁定）',
				value: 'INVOICE_REIMBURSE_INIT',
				description: '发票初始状态，未锁定，可以提交报销',
			},
			{
				name: '发票已锁定',
				value: 'INVOICE_REIMBURSE_LOCK',
				description: '发票已锁定，无法重复提交报销。电子发票进入了企业的报销流程时应该执行锁定操作',
			},
			{
				name: '发票已核销',
				value: 'INVOICE_REIMBURSE_CLOSURE',
				description: '发票已核销，从用户卡包中移除。当电子发票报销完成后，应该使用本接口执行报销操作。注意，报销状态为不可逆状态，请开发者慎重调用',
			},
		],
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '选择整批发票的锁定、解锁或核销状态。此接口是事务性操作，任一发票失败时整批回滚。<a href="https://developer.work.weixin.qq.com/document/path/90286" target="_blank">官方文档</a>',
	},
	{
		displayName: '不可逆操作提示',
		name: 'closureWarning',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				...showOnly,
				reimburse_status: ['INVOICE_REIMBURSE_CLOSURE'],
			},
		},
		description: '核销是不可逆操作，成功后所有发票将从对应用户卡包中移除。批量接口具有事务性，任一发票失败时整批回滚。',
	},
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
		description: '使用结构化表单添加发票，或直接提供企业微信 invoice_list JSON 数组',
	},
	{
		displayName: '发票列表',
		name: 'invoiceCollection',
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
		description: '至少添加一张发票，且全部发票必须属于上方 OpenID',
		options: [
			{
				displayName: '发票',
				name: 'invoices',
				values: [
					{
						displayName: '发票卡券 ID',
						name: 'card_id',
						type: 'string',
						default: '',
						required: true,
						description: '发票卡券的card_id。和encrypt_code共同构成一张发票卡券的唯一标识',
						placeholder: 'pXXXXXXXXXXXXXXXX',
					},
					{
						displayName: '加密 Code',
						name: 'encrypt_code',
						type: 'string',
						default: '',
						required: true,
						description: '发票卡券的加密code。和card_id共同构成一张发票卡券的唯一标识',
						placeholder: 'encrypt_code_example',
					},
				],
			},
		],
	},
	{
		displayName: '发票列表 JSON',
		name: 'invoiceListJson',
		type: 'json',
		required: true,
		default: '[]',
		displayOptions: {
			show: {
				...showOnly,
				invoiceInputMode: ['json'],
			},
		},
		description: 'invoice_list 数组；每项必须包含非空 card_id 与 encrypt_code，且所有发票属于上方 OpenID',
	},
];
