import type { INodeProperties } from 'n8n-workflow';
import { composeFields } from './composeFields';

const showOnly = { resource: ['mail'], operation: ['sendMail'] };

export const sendMailDescription: INodeProperties[] = [
	{
		displayName: '说明',
		name: 'notice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
		description: '发件人为当前应用绑定的邮箱账号（由 access_token 决定）。<a href="https://developer.work.weixin.qq.com/document/path/97445" target="_blank">官方文档</a>',
	},
	...composeFields('sendMail'),
];
