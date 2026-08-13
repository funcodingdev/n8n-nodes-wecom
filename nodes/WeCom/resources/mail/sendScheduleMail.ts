import type { INodeProperties } from 'n8n-workflow';
import { composeFields, scheduleAdminField, scheduleFields } from './composeFields';

const showOnly = { resource: ['mail'], operation: ['sendScheduleMail'] };

export const sendScheduleMailDescription: INodeProperties[] = [
	{
		displayName: '说明',
		name: 'notice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
		description: '邮件主题同时是日程标题，邮件正文同时是日程描述。<a href="https://developer.work.weixin.qq.com/document/path/97854" target="_blank">官方文档</a>',
	},
	...composeFields('sendScheduleMail'),
	...scheduleFields('sendScheduleMail', '日程'),
	scheduleAdminField('sendScheduleMail'),
];
