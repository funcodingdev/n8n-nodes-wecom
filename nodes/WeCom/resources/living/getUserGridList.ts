import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetUserGridList = {
	resource: ['living'],
	operation: ['getUserGridList'],
};

export const getUserGridListDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetUserGridList,
		},
		default: '',
		placeholder: 'zhangsan',
		description:
			'需要查询的成员 userid。<a href="https://developer.work.weixin.qq.com/document/path/94482" target="_blank">官方文档</a>；可与下方选择二选一',
	},
	{
		displayName: '成员(选择)',
		name: 'userid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		default: '',
		displayOptions: {
			show: showOnlyForGetUserGridList,
		},
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
];
