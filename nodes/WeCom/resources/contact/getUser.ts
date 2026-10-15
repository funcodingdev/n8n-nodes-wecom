import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetUser = {
	resource: ['contact'],
	operation: ['getUser'],
};

export const getUserDescription: INodeProperties[] = [
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
			show: showOnlyGetUser,
		},
		description: '从列表中选择成员，或使用表达式指定 UserID。仅能获取可见范围内的成员；新建的自建应用不再返回头像、手机、邮箱等敏感字段。<a href="https://developer.work.weixin.qq.com/document/path/90196" target="_blank">官方文档</a>。Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

