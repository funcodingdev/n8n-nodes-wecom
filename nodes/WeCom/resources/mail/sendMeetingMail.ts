import type { INodeProperties } from 'n8n-workflow';
import { composeFields, meetingFields, scheduleFields } from './composeFields';

const showOnly = { resource: ['mail'], operation: ['sendMeetingMail'] };

export const sendMeetingMailDescription: INodeProperties[] = [
	{
		displayName: '邮件主题同时是会议标题，邮件正文同时是会议描述。<a href="https://developer.work.weixin.qq.com/document/path/97855" target="_blank">官方文档</a>',
		name: 'notice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
	},
	...composeFields('sendMeetingMail'),
	...scheduleFields('sendMeetingMail', '会议'),
	...meetingFields('sendMeetingMail'),
];
