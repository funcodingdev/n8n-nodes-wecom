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
		description: '从列表中选择成员，或使用表达式指定 UserID。应用只能获取可见范围内的成员信息，且每种应用获取的字段有所不同。从2022年6月20号20点开始，新创建的自建应用与代开发应用，不再返回以下字段：头像、性别、手机、邮箱、企业邮箱、员工个人二维码、地址，需要通过oauth2手工授权的方式获取管理员与员工本人授权的字段。<a href="https://developer.work.weixin.qq.com/document/path/90196" target="_blank">官方文档</a>。Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
	},
];

