import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCustomer = {
	resource: ['linkedcorp'],
	operation: ['getLinkedCustomer'],
};

export const getLinkedCustomerDescription: INodeProperties[] = [
	{
		displayName: '客户类型',
		name: 'customer_type',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForGetCustomer,
		},
		options: [
			{
				name: '已添加客户',
				value: 'added',
			},
			{
				name: '未添加客户',
				value: 'pending',
			},
		],
		default: 'added',
		description: '客户类型。added表示已添加客户，pending表示未添加客户。',
		hint: '客户类型',
	},
	{
		displayName: '外部联系人ID',
		name: 'external_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetCustomer,
		},
		default: '',
		description: '外部联系人的userid。',
		hint: '外部联系人ID',
	},
	{
		displayName: '下游企业CorpID',
		name: 'corpid',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetCustomer,
		},
		default: '',
		description: '下游企业的corpid。仅对未添加客户类型有效。',
		hint: '企业CorpID（可选）',
	},
];

