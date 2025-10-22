import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['transferCustomer'],
};

export const transferCustomerDescription: INodeProperties[] = [
	{
		displayName: '原成员UserID',
		name: 'handover_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '原跟进成员的userid',
		description: '原跟进成员的userid',
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
	{
		displayName: '转移说明',
		name: 'transfer_success_msg',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '转移成功后发给客户的消息，最多200个字符',
		description: '转移成功后发给客户的消息',
	},
];

