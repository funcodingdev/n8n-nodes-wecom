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
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description:
			'原跟进成员的企业成员 UserID，客户将从该成员转出；可与下方选择二选一。<a href="https://developer.work.weixin.qq.com/document/path/92125" target="_blank">官方文档</a>',
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
			'接替成员的企业成员 UserID，客户将转给该成员；可与下方选择二选一。<a href="https://developer.work.weixin.qq.com/document/path/92125" target="_blank">官方文档</a>',
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
		displayName: '客户UserID列表',
		name: 'external_userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '要转移的客户external_userid列表，多个用英文逗号分隔，一次最多转移100个客户。<a href="https://developer.work.weixin.qq.com/document/path/92125" target="_blank">官方文档</a>。要转移的客户external_userid列表，多个用逗号分隔',
		placeholder: 'wmxxxxxxxxxxxxxxxxxx,wmyyyyyyyyyyyyyyyyyy',
	},
	{
		displayName: '转移说明',
		name: 'transfer_success_msg',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '转移成功后自动发送给客户的消息，用于告知客户更换跟进人。最多200个字符。<a href="https://developer.work.weixin.qq.com/document/path/92125" target="_blank">官方文档</a>。可选。转移成功后发给客户的消息，最多200个字符',
		placeholder: '您好，您的专属服务人员已更换为xxx',
	},
];

