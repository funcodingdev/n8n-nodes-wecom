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
		displayName: '输入方式',
		name: 'singleAgreeInputMode',
		type: 'options',
		displayOptions: { show: { ...showOnly, operation: ['checkSingleAgree'] } },
		options: [
			{ name: '表单', value: 'form' },
			{ name: 'JSON', value: 'json' },
		],
		default: 'form',
		description: '单聊会话对最多 100 项',
	},
	{
		displayName: '单聊会话对',
		name: 'singleAgreeCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: { ...showOnly, operation: ['checkSingleAgree'], singleAgreeInputMode: ['form'] },
		},
		default: {},
		placeholder: '添加会话对',
		typeOptions: { multipleValues: true },
		description: 'info 数组：企业成员与外部联系人',
		options: [
			{
				displayName: '会话对',
				name: 'pairs',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						required: true,
						default: '',
						typeOptions: { maxLength: 64 },
					},
					{
						displayName: '外部联系人OpenID',
						name: 'exteranalopenid',
						type: 'string',
						required: true,
						default: '',
						typeOptions: { maxLength: 128 },
						description: '官方字段拼写为 exteranalopenid',
					},
				],
			},
		],
	},
	{
		displayName: '群ID',
		name: 'roomid',
		type: 'string',
		required: true,
		displayOptions: {
			show: { ...showOnly, operation: ['getGroupChat', 'checkRoomAgree'] },
		},
		default: '',
		typeOptions: { maxLength: 128 },
		description: '内部群 roomid',
	},
	{
		displayName: '同意情况扩展JSON',
		name: 'infoJson',
		type: 'json',
		displayOptions: {
			show: { ...showOnly, operation: ['checkSingleAgree'], singleAgreeInputMode: ['json'] },
		},
		default: '[]',
		description: '1–100 个对象；每项必须包含 userid 与官方拼写 exteranalopenid',
	},
	{
		displayName: '返回内容包含客户或群成员的会话存档同意状态与变更时间，请按企业合规要求处理和保存。',
		name: 'agreeNotice',
		type: 'notice',
		displayOptions: {
			show: { ...showOnly, operation: ['checkSingleAgree', 'checkRoomAgree'] },
		},
		default: '',
	},
	{
		displayName: '机器人ID',
		name: 'robot_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, operation: ['getRobotInfo'] } },
		default: '',
		typeOptions: { maxLength: 128 },
		description: '会话内容中的机器人 external_userid，通常以 wb 开头；接口限频 600 次/分钟',
	},
];
