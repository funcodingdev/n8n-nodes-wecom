import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMailContent = {
	resource: ['mail'],
	operation: ['getMailContent'],
};

export const getMailContentDescription: INodeProperties[] = [
	{
		displayName: '邮件ID',
		name: 'mail_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetMailContent,
		},
		default: '',
		placeholder: 'MAIL_ID',
		description:
			'邮件 id（mail_id），来自 get_mail_list。<a href="https://developer.work.weixin.qq.com/document/path/97979" target="_blank">官方文档</a>',
	},
];
