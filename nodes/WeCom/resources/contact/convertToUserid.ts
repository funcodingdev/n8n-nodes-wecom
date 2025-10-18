import type { INodeProperties } from 'n8n-workflow';

const showOnlyConvertToUserid = {
	resource: ['contact'],
	operation: ['convertToUserid'],
};

export const convertToUseridDescription: INodeProperties[] = [
	{
		displayName: 'OpenID',
		name: 'openid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyConvertToUserid,
		},
		description: '在使用企业支付之后，返回结果的 openid',
	},
];

