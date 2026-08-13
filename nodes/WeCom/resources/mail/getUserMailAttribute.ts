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
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan',
		description:
			'用户 userid。<a href="https://developer.work.weixin.qq.com/document/path/95513" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: { show: showOnly },
		description: '与上方字符串二选一；均填写时以字符串为准',
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
