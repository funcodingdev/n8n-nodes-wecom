import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['mail'],
	operation: ['getUserMailAttribute'],
};

export const getUserMailAttributeDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan',
		description:
			'用户 userid。<a href="https://developer.work.weixin.qq.com/document/path/95513" target="_blank">官方文档</a>',
	},
	{
		displayName: '属性类型',
		name: 'type',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '1,2,3,4',
		description:
			'功能属性类型列表，逗号分隔。1 强制安全登录 2 IMAP/SMTP 3 POP/SMTP 4 是否启用安全登录',
	},
];
