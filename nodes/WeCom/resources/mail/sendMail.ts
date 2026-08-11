import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['mail'], operation: ['sendMail'] };

export const sendMailDescription: INodeProperties[] = [
	{
		displayName: '说明',
		name: 'notice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
		description:
			'发件人为当前应用绑定的邮箱账号（由 access_token 决定），无需传 sender。<a href="https://developer.work.weixin.qq.com/document/path/97445" target="_blank">官方文档</a>',
	},
	{
		displayName: '邮件主题',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '邮件主题',
		description: '邮件的主题 subject',
	},

	{
		displayName: '收件人',
		name: 'toListCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加收件人',
		typeOptions: { multipleValues: true },
		description: '收件人邮箱列表',
		options: [
			{
				displayName: '收件人',
				name: 'recipients',
				values: [
					{
						displayName: '邮箱地址',
						name: 'email',
						type: 'string',
						default: '',
						required: true,
						placeholder: 'recipient@example.com',
						description: '收件人邮箱地址',
					},
				],
			},
		],
	},
	{
		displayName: '抄送',
		name: 'ccListCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加抄送人',
		typeOptions: { multipleValues: true },
		description: '抄送人邮箱列表（可选）',
		options: [
			{
				displayName: '抄送人',
				name: 'recipients',
				values: [
					{
						displayName: '邮箱地址',
						name: 'email',
						type: 'string',
						default: '',
						placeholder: 'cc@example.com',
						description: '抄送人邮箱地址',
					},
				],
			},
		],
	},
	{
		displayName: '密送',
		name: 'bccListCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加密送人',
		typeOptions: { multipleValues: true },
		description: '密送人邮箱列表（可选）',
		options: [
			{
				displayName: '密送人',
				name: 'recipients',
				values: [
					{
						displayName: '邮箱地址',
						name: 'email',
						type: 'string',
						default: '',
						placeholder: 'bcc@example.com',
						description: '密送人邮箱地址',
					},
				],
			},
		],
	},
	{
		displayName: '收件人UserID列表',
		name: 'to_userids',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan,lisi',
		description: 'to.userids，企业内成员 userid，逗号分隔；与收件人邮箱至少填一类',
	},
	{
		displayName: '正文格式',
		name: 'contentType',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: 'HTML', value: 'html', description: 'content_type=html（默认）' },
			{ name: '纯文本', value: 'text', description: 'content_type=text' },
		],
		default: 'html',
		description: 'content_type：html 或 text',
	},
	{
		displayName: '邮件正文',
		name: 'content',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		typeOptions: { rows: 6 },
		description: '邮件正文 content',
		placeholder: '请输入邮件正文...',
	},
	{
		displayName: '开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: 'enable_id_trans，仅第三方应用需要',
	},
	{
		displayName: '附件',
		name: 'attachmentCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加附件',
		typeOptions: { multipleValues: true },
		description: '附件 attachment_list：file_name + content(base64)',
		options: [
			{
				displayName: '附件',
				name: 'attachments',
				values: [
					{
						displayName: '文件名',
						name: 'file_name',
						type: 'string',
						default: '',
						required: true,
						description: 'attachment_list[].file_name',
					},
					{
						displayName: '文件内容(Base64)',
						name: 'content',
						type: 'string',
						default: '',
						required: true,
						description: 'attachment_list[].content，Base64 编码',
					},
				],
			},
		],
	},
];
