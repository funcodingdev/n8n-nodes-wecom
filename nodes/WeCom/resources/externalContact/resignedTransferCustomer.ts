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
		description:
			'离职成员的企业成员 UserID，该成员必须已离职。<a href="https://developer.work.weixin.qq.com/document/path/94081" target="_blank">官方文档</a>',
		placeholder: 'zhangsan',
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
		description:
			'接替成员的企业成员 UserID，将继承离职成员的客户。<a href="https://developer.work.weixin.qq.com/document/path/94081" target="_blank">官方文档</a>',
		placeholder: 'lisi',
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
