import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCustomerInfo = {
	resource: ['kf'],
	operation: ['getCustomerInfo'],
};

export const getCustomerInfoDescription: INodeProperties[] = [
	{
		displayName: '客服账号ID',
		name: 'open_kfid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetCustomerInfo,
		},
		default: '',
		hint: '客服账号ID',
	},
	{
		displayName: '外部联系人ID',
		name: 'external_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetCustomerInfo,
		},
		default: '',
		hint: '客户UserID',
	},
];

