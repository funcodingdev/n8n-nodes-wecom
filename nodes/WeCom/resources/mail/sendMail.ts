import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendMail = {
	resource: ['mail'],
	operation: ['sendMail'],
};

export const sendMailDescription: INodeProperties[] = [
	{
		displayName: '发件人邮箱',
		name: 'sender',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSendMail,
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
			show: showOnlyForSendMail,
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
			show: showOnlyForSendMail,
		},
		default: '',
		hint: '邮件主题',
	},
	{
		displayName: '邮件正文',
		name: 'doc_content',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForSendMail,
		},
		default: '{"content_type": 1, "content": ""}',
		description: '邮件正文内容，content_type: 1-纯文本 2-HTML',
		hint: '邮件正文JSON',
	},
	{
		displayName: '附件',
		name: 'attachment_list',
		type: 'json',
		displayOptions: {
			show: showOnlyForSendMail,
		},
		default: '[]',
		description: '附件列表，包含附件ID等信息',
		hint: '附件列表JSON（可选）',
	},
];

