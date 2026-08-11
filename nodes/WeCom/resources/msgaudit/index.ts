import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['msgaudit'] };

export const msgauditDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnly },
		options: [
			{
				name: '[存档] 获取开启成员列表',
				value: 'getPermitUserList',
				action: '获取开启成员列表',
				description: '获取会话内容存档开启成员列表',
			},
			{
				name: '[同意] 查询单聊同意情况',
				value: 'checkSingleAgree',
				action: '查询单聊同意情况',
				description: '获取单聊会话同意情况',
			},
			{
				name: '[同意] 查询群聊同意情况',
				value: 'checkRoomAgree',
				action: '查询群聊同意情况',
				description: '获取群聊会话同意情况',
			},
			{
				name: '[群信息] 获取内部群信息',
				value: 'getGroupChat',
				action: '获取内部群信息',
				description: '获取会话内容存档内部群信息',
			},
			{
				name: '[机器人] 获取机器人信息',
				value: 'getRobotInfo',
				action: '获取机器人信息',
				description: '获取机器人信息',
			},
		],
		default: 'getPermitUserList',
	},
	{
		displayName: '版本类型',
		name: 'type',
		type: 'options',
		displayOptions: { show: { ...showOnly, operation: ['getPermitUserList'] } },
		options: [
			{ name: '全部', value: 0 },
			{ name: '办公版', value: 1 },
			{ name: '服务版', value: 2 },
			{ name: '企业版', value: 3 },
		],
		default: 0,
		description:
			'type，不传返回全量。<a href="https://developer.work.weixin.qq.com/document/path/91614" target="_blank">官方文档</a>',
	},
	{
		displayName: '同意情况JSON',
		name: 'infoJson',
		type: 'json',
		required: true,
		displayOptions: {
			show: { ...showOnly, operation: ['checkSingleAgree', 'checkRoomAgree'] },
		},
		default: '[]',
		description:
			'单聊为 info 数组（userid/exteranalopenid）；群聊为 roomid 等字段，见官方文档',
	},
	{
		displayName: '群ID',
		name: 'roomid',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, operation: ['getGroupChat'] } },
		default: '',
		description: '内部群 ID',
	},
	{
		displayName: '机器人ID',
		name: 'robot_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, operation: ['getRobotInfo'] } },
		default: '',
	},
];
