import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['resignedTransferCustomer'],
};

export const resignedTransferCustomerDescription: INodeProperties[] = [
	{
		displayName: '原成员UserID',
		name: 'handover_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '离职成员的userid',
		description: '离职成员的userid',
	},
	{
		displayName: '接替成员UserID',
		name: 'takeover_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '接替成员的userid',
		description: '接替成员的userid',
	},
	{
		displayName: '客户UserID列表',
		name: 'external_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '客户的external_userid列表，用逗号分隔，最多100个',
		description: '客户的external_userid列表',
	},
];

