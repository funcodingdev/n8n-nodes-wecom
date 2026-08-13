import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['linkedcorp'], operation: ['getLinkedCustomer'] };

export const getLinkedCustomerDescription: INodeProperties[] = [
	{
		displayName: 'UnionID',
		name: 'unionid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '微信客户的 UnionID',
	},
	{
		displayName: 'OpenID',
		name: 'openid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '与 UnionID 来自同一小程序的 OpenID',
	},
	{
		displayName: '下游企业 CorpID',
		name: 'corpid',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '可选；留空时查询所有已共享应用的下游企业',
	},
	{
		displayName: '高频调用凭据',
		name: 'mass_call_ticket',
		type: 'string',
		typeOptions: { password: true },
		displayOptions: { show: showOnly },
		default: '',
		description: '可选；数据初始化等大批量调用场景使用',
	},
];
