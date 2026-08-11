import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateAppMailbox = {
	resource: ['mail'],
	operation: ['updateAppMailbox'],
};

export const updateAppMailboxDescription: INodeProperties[] = [
	{
		displayName: '新应用邮箱账号',
		name: 'new_email',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateAppMailbox,
		},
		default: '',
		placeholder: 'youxiangceshi@ceshi.wecom.work',
		description:
			'修改后的应用邮箱账号 new_email；原账号将作为别名邮箱。<a href="https://developer.work.weixin.qq.com/document/path/97373" target="_blank">官方文档</a>',
	},
];
