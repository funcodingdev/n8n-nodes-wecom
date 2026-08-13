import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getFollowUserList'],
};

export const getFollowUserListDescription: INodeProperties[] = [
	{
		displayName: '获取配置了客户联系功能的成员列表。该接口会返回所有配置了客户联系功能的成员UserID列表。<a href="https://developer.work.weixin.qq.com/document/path/92571" target="_blank">官方文档</a>',
		name: 'notice',
		type: 'notice',
		default: '',
		displayOptions: {
			show: showOnly,
		},
	},
];

