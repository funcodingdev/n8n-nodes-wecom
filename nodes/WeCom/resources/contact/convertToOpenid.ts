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
		description: '从列表中选择成员，或使用表达式指定 UserID。用于企业红包/向员工付款；成员需用微信登录企业微信或关注微信插件。<a href="https://developer.work.weixin.qq.com/document/path/90202" target="_blank">官方文档</a>。Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

