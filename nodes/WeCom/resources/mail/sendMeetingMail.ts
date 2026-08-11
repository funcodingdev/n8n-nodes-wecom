import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['mail'], operation: ['sendMeetingMail'] };

export const sendMeetingMailDescription: INodeProperties[] = [
	{
		displayName: '说明',
		name: 'notice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
		description:
			'发件人为应用绑定邮箱；会议时间映射为 schedule，并附带 meeting 对象。<a href="https://developer.work.weixin.qq.com/document/path/97855" target="_blank">官方文档</a>',
	},

	{
		displayName: '邮件主题',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '会议邀请',
		description: '会议邮件的主题',
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
					},
				],
			},
		],
	},
	// 会议信息
	{
		displayName: '会议标题',
		name: 'meetingTitle',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '周会',
		description: '会议的标题',
	},
	{
		displayName: '会议开始时间',
		name: 'meetingStartTime',
		type: 'number',
		required: true,
		displayOptions: { show: showOnly },
		default: 0,
		description: '会议开始时间（Unix时间戳秒）',
		typeOptions: { minValue: 0 },
	},
	{
		displayName: '会议结束时间',
		name: 'meetingEndTime',
		type: 'number',
		required: true,
		displayOptions: { show: showOnly },
		default: 0,
		description: '会议结束时间（Unix时间戳秒）',
		typeOptions: { minValue: 0 },
	},
	{
		displayName: '会议地点',
		name: 'meetingLocation',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '线上会议 / 会议室B',
		description: '会议的地点（可选）',
	},
	{
		displayName: '会议描述',
		name: 'meetingDescription',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		typeOptions: { rows: 3 },
		description: '会议的详细描述（可选）',
	},
	{
		displayName: '附件',
		name: 'attachmentCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加附件',
		typeOptions: { multipleValues: true },
		description: '附件列表（可选）',
		options: [
			{
				displayName: '附件',
				name: 'attachments',
				values: [
					{
						displayName: '附件类型',
						name: 'type',
						type: 'options',
						default: 1,
						options: [
							{ name: '普通附件', value: 1 },
							{ name: '云附件', value: 2 },
						],
					},
					{
						displayName: 'Media ID',
						name: 'media_id',
						type: 'string',
						default: '',
						required: true,
						description: '通过上传接口获取的media_id',
					},
				],
			},
		],
	},
];
