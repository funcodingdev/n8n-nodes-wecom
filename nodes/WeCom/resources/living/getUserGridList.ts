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
		required: true,
		displayOptions: {
			show: showOnlyForGetUserGridList,
		},
		default: '',
		placeholder: 'zhangsan',
		description:
			'需要查询的成员 userid。<a href="https://developer.work.weixin.qq.com/document/path/94482" target="_blank">官方文档</a>',
	},
];
