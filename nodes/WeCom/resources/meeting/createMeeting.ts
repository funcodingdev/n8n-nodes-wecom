import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['createMeeting'] };

export const createMeetingDescription: INodeProperties[] = [
	{
		displayName: '会议主题',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '会议主题，长度限制128个字符。<a href="https://developer.work.weixin.qq.com/document/path/98148" target="_blank">官方文档</a>',
		placeholder: '产品需求评审会',
	},
	{
		displayName: '会议开始时间',
		name: 'start_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '会议开始时间（Unix时间戳秒）',
	},
	{
		displayName: '会议结束时间',
		name: 'end_time',
		type: 'dateTime',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '会议结束时间（Unix时间戳秒），必须大于开始时间',
	},
	{
		displayName: '会议类型',
		name: 'type',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '预约会议', value: 0, description: '预约未来时间的会议' },
			{ name: '快速会议', value: 1, description: '立即开始的会议' },
		],
		default: 0,

	},
	{
		displayName: '参会人员',
		name: 'attendeesCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加参会人员',
		typeOptions: { multipleValues: true },
		description: '参会人员列表',
		options: [
			{
				displayName: '人员',
				name: 'attendees',
				values: [
					{
						displayName: '用户ID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '参会人员的企业微信UserID',
					},
				],
			},
		],
	},
];
