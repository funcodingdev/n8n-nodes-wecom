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
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'离职成员的企业成员 UserID，该成员必须已离职；可与下方选择二选一。<a href="https://developer.work.weixin.qq.com/document/path/94081" target="_blank">官方文档</a>',
		placeholder: 'zhangsan',
	},
	{
		displayName: '原成员(选择)',
		name: 'handover_userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnly },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '接替成员UserID',
		name: 'takeover_userid',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'接替成员的企业成员 UserID，将继承离职成员的客户；可与下方选择二选一。<a href="https://developer.work.weixin.qq.com/document/path/94081" target="_blank">官方文档</a>',
		placeholder: 'lisi',
	},
	{
		displayName: '接替成员(选择)',
		name: 'takeover_userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: { show: showOnly },
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '客户ExternalUserID列表',
		name: 'external_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'要转移的客户 external_userid，逗号分隔，一次最多 100 个；只能转移该离职成员的客户。<a href="https://developer.work.weixin.qq.com/document/path/94081" target="_blank">官方文档</a>',
		placeholder: 'wmxxxxxxxxxxxxxxxxxx,wmyyyyyyyyyyyyyyyyyy',
	},
];
