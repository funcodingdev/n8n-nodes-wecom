import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendScheduleMail = {
	resource: ['mail'],
	operation: ['sendScheduleMail'],
};

export const sendScheduleMailDescription: INodeProperties[] = [
	{
		displayName: '发件人邮箱',
		name: 'sender',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSendScheduleMail,
		},
		default: '',
		description: '发件人邮箱地址',
		hint: '发件人邮箱',
	},
	{
		displayName: '收件人',
		name: 'receiver',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForSendScheduleMail,
		},
		default: '{"to_list": [], "cc_list": [], "bcc_list": []}',
		description: '收件人信息，包含to_list（收件人）、cc_list（抄送）、bcc_list（密送）',
		hint: '收件人列表JSON',
	},
	{
		displayName: '邮件主题',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSendScheduleMail,
		},
		default: '',
		description: '邮件主题',
		hint: '邮件主题',
	},
	{
		displayName: '日程信息',
		name: 'cal_content',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForSendScheduleMail,
		},
		default: '{}',
		description: '日程内容，包含标题、时间、地点等信息',
		hint: '日程信息JSON',
	},
	{
		displayName: '附件',
		name: 'attachment_list',
		type: 'json',
		displayOptions: {
			show: showOnlyForSendScheduleMail,
		},
		default: '[]',
		description: '附件列表',
		hint: '附件列表JSON（可选）',
	},
];

