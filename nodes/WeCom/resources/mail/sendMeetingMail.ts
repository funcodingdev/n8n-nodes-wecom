import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendMeetingMail = {
	resource: ['mail'],
	operation: ['sendMeetingMail'],
};

export const sendMeetingMailDescription: INodeProperties[] = [
	{
		displayName: '发件人邮箱',
		name: 'sender',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSendMeetingMail,
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
			show: showOnlyForSendMeetingMail,
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
			show: showOnlyForSendMeetingMail,
		},
		default: '',
		description: '邮件主题',
		hint: '邮件主题',
	},
	{
		displayName: '会议信息',
		name: 'meeting_content',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForSendMeetingMail,
		},
		default: '{}',
		description: '会议内容，包含会议标题、时间、会议室等信息',
		hint: '会议信息JSON',
	},
	{
		displayName: '附件',
		name: 'attachment_list',
		type: 'json',
		displayOptions: {
			show: showOnlyForSendMeetingMail,
		},
		default: '[]',
		description: '附件列表',
		hint: '附件列表JSON（可选）',
	},
];

