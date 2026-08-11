import type { INodeProperties } from 'n8n-workflow';

const showOnlyConvertToOpenid = {
	resource: ['contact'],
	operation: ['convertToOpenid'],
};

export const convertToOpenidDescription: INodeProperties[] = [
	{
		displayName: '成员',
		name: 'userid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllUsers',
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyConvertToOpenid,
		},
		description: '从列表中选择成员，或使用表达式指定 UserID。该接口使用场景为企业支付，在使用企业红包和向员工付款时，需要自行将企业微信的userid转成openid。注：需要成员使用微信登录企业微信或者关注微信插件（原企业号）才能转成openid；如果是外部联系人，请使用外部联系人openid转换接口转换openid。成员必须处于应用的可见范围内。<a href="https://developer.work.weixin.qq.com/document/path/90202" target="_blank">官方文档</a>。Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

