import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['mail'],
	operation: ['getMailUnreadCount'],
};

export const getMailUnreadCountDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan',
		description:
			'成员 userid。<a href="https://developer.work.weixin.qq.com/document/path/95514" target="_blank">官方文档</a>',
	},
];
