import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelete = {
	resource: ['contact'],
	operation: ['deleteUser'],
};

export const deleteUserDescription: INodeProperties[] = [
	{
		displayName: 'UserID',
		name: 'userid',
		type: 'string',
		displayOptions: {
			show: showOnlyForDelete,
		},
		default: '',
		placeholder: 'zhangsan',
		description: '成员 UserID，对应管理端的账号。若是绑定了腾讯企业邮，则会同时删除邮箱账号。删除后不可恢复。<a href="https://developer.work.weixin.qq.com/document/path/90198" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: showOnlyForDelete,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];

