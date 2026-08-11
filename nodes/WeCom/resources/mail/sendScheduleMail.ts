import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['mail'], operation: ['sendScheduleMail'] };

export const sendScheduleMailDescription: INodeProperties[] = [
	{
		displayName: '说明',
		name: 'notice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
		description:
			'发件人为应用绑定邮箱；日程字段映射为 schedule.start_time/end_time/location。<a href="https://developer.work.weixin.qq.com/document/path/97854" target="_blank">官方文档</a>',
	},

	{
		displayName: '邮件主题',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '日程提醒',
		description: '日程邮件的主题',
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
	// 日程信息
	{
		displayName: '日程标题',
		name: 'calTitle',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '项目评审会议',
		description: '日程的标题',
	},
	{
		displayName: '日程开始时间',
		name: 'calStartTime',
		type: 'number',
		required: true,
		displayOptions: { show: showOnly },
		default: 0,
		description: '日程开始时间（Unix时间戳秒）',
		typeOptions: { minValue: 0 },
	},
	{
		displayName: '日程结束时间',
		name: 'calEndTime',
		type: 'number',
		required: true,
		displayOptions: { show: showOnly },
		default: 0,
		description: '日程结束时间（Unix时间戳秒）',
		typeOptions: { minValue: 0 },
	},
	{
		displayName: '日程地点',
		name: 'calLocation',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '会议室A',
		description: '日程的地点（可选）',
	},
	{
		displayName: '日程描述',
		name: 'calDescription',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		typeOptions: { rows: 3 },
		description: '日程的详细描述（可选）',
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
