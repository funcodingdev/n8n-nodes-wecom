import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['resignedTransferCustomer'],
};

export const resignedTransferCustomerDescription: INodeProperties[] = [
	{
		displayName: '原成员',
		name: 'handover_userid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '离职成员的企业成员UserID，该成员必须已离职。<a href="https://developer.work.weixin.qq.com/document/path/94081" target="_blank">官方文档</a>.。离职成员的UserID',
		placeholder: 'zhangsan',
	},
	{
		displayName: '接替成员',
		name: 'takeover_userid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '接替成员的企业成员UserID，该成员将继承离职成员的客户。<a href="https://developer.work.weixin.qq.com/document/path/94081" target="_blank">官方文档</a>.。接替成员的UserID，继承离职成员的客户',
		placeholder: 'lisi',
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
		description: '要转移的客户external_userid列表，多个用英文逗号分隔，一次最多转移100个客户。只能转移该离职成员的客户。<a href="https://developer.work.weixin.qq.com/document/path/94081" target="_blank">官方文档</a>。要转移的客户external_userid列表，多个用逗号分隔',
		placeholder: 'wmxxxxxxxxxxxxxxxxxx,wmyyyyyyyyyyyyyyyyyy',
	},
];

