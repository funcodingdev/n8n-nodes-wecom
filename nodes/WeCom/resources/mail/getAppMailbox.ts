import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetAppMailbox = {
	resource: ['mail'],
	operation: ['getAppMailbox'],
};

export const getAppMailboxDescription: INodeProperties[] = [
	{
		displayName: '说明',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForGetAppMailbox,
		},
		default: '',
		description:
			'查询当前应用的邮箱账号及别名邮箱，调用 get_email_alias，无需额外参数。<a href="https://developer.work.weixin.qq.com/document/path/97991" target="_blank">官方文档</a>',
	},
];
