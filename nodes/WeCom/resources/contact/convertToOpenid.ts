import type { INodeProperties } from 'n8n-workflow';

const showOnlyConvertToOpenid = {
	resource: ['contact'],
	operation: ['convertToOpenid'],
};

export const convertToOpenidDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		placeholder: 'zhangsan',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyConvertToOpenid,
		},
		description:
			'成员 UserID。企业支付/红包等场景需将 userid 转为 openid；成员须使用微信登录企业微信或关注微信插件，且在应用可见范围内。<a href="https://developer.work.weixin.qq.com/document/path/90202" target="_blank">官方文档</a>',
	},
];

