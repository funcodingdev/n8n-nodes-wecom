import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['updateAdvancedMeeting'] };

export const updateAdvancedMeetingDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description:
			'meetingid。<a href="https://developer.work.weixin.qq.com/document/path/98154" target="_blank">官方文档</a>',
	},
	{
		displayName: '会议标题',
		name: 'title',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: 'title',
	},
	{
		displayName: '会议开始时间',
		name: 'meeting_start',
		type: 'dateTime',
		displayOptions: { show: showOnly },
		default: '',
		description: 'meeting_start；修改时需同时指定 duration',
	},
	{
		displayName: '会议时长(秒)',
		name: 'meeting_duration',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 0,
		description: 'meeting_duration，0 表示不修改',
	},
	{
		displayName: '高级设置',
		name: 'advancedSettings',
		type: 'collection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加设置',
		options: [
			{
				displayName: '会议描述',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: '会议密码',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: '写入 settings.password',
			},
			{
				displayName: '允许主持人前入会',
				name: 'allow_enter_before_host',
				type: 'boolean',
				default: true,
			},
			{
				displayName: '入会时静音',
				name: 'enable_mute_on_entry',
				type: 'boolean',
				default: false,
				description: '映射为 settings.enable_enter_mute',
			},
		],
	},
	{
		displayName: '扩展请求JSON',
		name: 'updateMeetingExtraJson',
		type: 'json',
		displayOptions: { show: showOnly },
		default: '{}',
		description: '完整 settings/reminders 等，与上方合并',
	},
];
