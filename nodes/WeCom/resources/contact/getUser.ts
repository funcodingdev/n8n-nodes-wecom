import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetUser = {
	resource: ['contact'],
	operation: ['getUser'],
};

export const getUserDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		placeholder: 'zhangsan',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyGetUser,
		},
		description:
			'成员 UserID。应用只能获取可见范围内的成员信息；自 2022-06-20 起新创建自建/代开发应用不再默认返回头像、性别、手机、邮箱等敏感字段。<a href="https://developer.work.weixin.qq.com/document/path/90196" target="_blank">官方文档</a>',
	},
];

