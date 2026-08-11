import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['createAdvancedMeeting'] };

export const createAdvancedMeetingDescription: INodeProperties[] = [
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
		displayName: '管理员UserID',
		name: 'admin_userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '会议管理员的企业微信UserID。如果不指定，默认为当前操作用户',
	},
	{
		displayName: '受邀成员',
		name: 'inviteesCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加受邀成员',
		typeOptions: { multipleValues: true },
		description: '受邀成员列表',
		options: [
			{
				displayName: '成员',
				name: 'invitees',
				values: [
					{
						displayName: '用户ID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '受邀成员的企业微信UserID',
					},
				],
			},
		],
	},
	{
		displayName: '高级设置',
		name: 'advancedSettings',
		type: 'collection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加高级设置',
		options: [
			{
				displayName: '会议描述',
				name: 'description',
				type: 'string',
				default: '',
				description: '会议描述信息',
			},
			{
				displayName: '会议密码',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: '会议密码，留空则无密码',
			},
			{
				displayName: '入会前静音',
				name: 'enable_mute_on_entry',
				type: 'boolean',
				default: false,
				description: '是否在入会时自动静音',
			},
			{
				displayName: '允许成员在主持人前入会',
				name: 'allow_enter_before_host',
				type: 'boolean',
				default: true,
				description: '是否允许成员在主持人之前加入会议',
			},
		],
	},
];
