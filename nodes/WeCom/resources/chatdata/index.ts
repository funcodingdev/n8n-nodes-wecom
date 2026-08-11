import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['chatdata'] };

export const chatdataDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnly },
		options: [
			{
				name: '[基础] 设置公钥',
				value: 'setPublicKey',
				action: '设置公钥',
				description: 'chatdata/set_public_key',
			},
			{
				name: '[基础] 获取授权存档成员列表',
				value: 'getAuthUserList',
				action: '获取授权存档成员列表',
				description: 'chatdata/get_auth_user_list',
			},
			{
				name: '[基础] 设置专区接收回调',
				value: 'setReceiveCallback',
				action: '设置专区接收回调',
				description: 'chatdata/set_receive_callback',
			},
			{
				name: '[基础] 设置敏感信息隐藏',
				value: 'setHideSensitiveInfoConfig',
				action: '设置敏感信息隐藏',
				description: 'chatdata/set_hide_sensitiveinfo_config',
			},
			{
				name: '[基础] 获取敏感信息隐藏配置',
				value: 'getHideSensitiveInfoConfig',
				action: '获取敏感信息隐藏配置',
				description: 'chatdata/get_hide_sensitiveinfo_config',
			},
			{
				name: '[基础] 设置日志级别',
				value: 'setLogLevel',
				action: '设置日志级别',
				description: 'chatdata/set_log_level',
			},
			{
				name: '[基础] 获取日志级别',
				value: 'getLogLevel',
				action: '获取日志级别',
				description: 'chatdata/get_log_level',
			},
			{
				name: '[调用] 同步调用专区程序',
				value: 'syncCallProgram',
				action: '同步调用专区程序',
				description: 'chatdata/sync_call_program',
			},
			{
				name: '[调用] 创建异步调用任务',
				value: 'asyncProgramTask',
				action: '创建异步调用任务',
				description: 'chatdata/async_program_task',
			},
			{
				name: '[调用] 获取异步任务结果',
				value: 'asyncProgramResult',
				action: '获取异步任务结果',
				description: 'chatdata/async_program_result',
			},
			{
				name: '[调试] 开启调试模式',
				value: 'openDebugMode',
				action: '开启调试模式',
				description: 'chatdata/open_debug_mode',
			},
			{
				name: '[调试] 关闭调试模式',
				value: 'closeDebugMode',
				action: '关闭调试模式',
				description: 'chatdata/close_debug_mode',
			},
			{
				name: '[调试] 获取调试模式状态',
				value: 'checkDebugMode',
				action: '获取调试模式状态',
				description: 'chatdata/check_debug_mode',
			},
		],
		default: 'getAuthUserList',
	},
	// setPublicKey
	{
		displayName: '公钥PEM',
		name: 'public_key',
		type: 'string',
		required: true,
		typeOptions: { rows: 6 },
		displayOptions: { show: { ...showOnly, operation: ['setPublicKey'] } },
		default: '',
		description:
			'RSA-2048 公钥 PEM。<a href="https://developer.work.weixin.qq.com/document/path/99845" target="_blank">官方文档</a>',
	},
	{
		displayName: '公钥版本号',
		name: 'public_key_ver',
		type: 'number',
		required: true,
		displayOptions: { show: { ...showOnly, operation: ['setPublicKey'] } },
		default: 1,
		description: 'public_key_ver，更换公钥时需大于旧版本号',
	},
	// getAuthUserList
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: { ...showOnly, operation: ['getAuthUserList'] } },
		default: '',
		description: '分页 cursor',
	},
	{
		displayName: '条数限制',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { ...showOnly, operation: ['getAuthUserList'] } },
		default: 200,
		description: '最大 1000，默认 200',
	},
	// program_id shared
	{
		displayName: '程序ID',
		name: 'program_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnly,
				operation: [
					'setReceiveCallback',
					'setLogLevel',
					'getLogLevel',
					'syncCallProgram',
					'asyncProgramTask',
					'openDebugMode',
					'closeDebugMode',
					'checkDebugMode',
				],
			},
		},
		default: '',
		description: '应用关联的 program_id',
	},
	// sensitive info
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnly,
				operation: ['setHideSensitiveInfoConfig', 'getHideSensitiveInfoConfig'],
			},
		},
		default: '',
	},
	{
		displayName: '隐藏手机号',
		name: 'hide_mobile',
		type: 'boolean',
		displayOptions: { show: { ...showOnly, operation: ['setHideSensitiveInfoConfig'] } },
		default: false,
	},
	{
		displayName: '隐藏身份证号',
		name: 'hide_idcard',
		type: 'boolean',
		displayOptions: { show: { ...showOnly, operation: ['setHideSensitiveInfoConfig'] } },
		default: false,
	},
	{
		displayName: '隐藏银行卡号',
		name: 'hide_bankno',
		type: 'boolean',
		displayOptions: { show: { ...showOnly, operation: ['setHideSensitiveInfoConfig'] } },
		default: false,
	},
	// log level
	{
		displayName: '日志级别',
		name: 'log_level',
		type: 'options',
		required: true,
		displayOptions: { show: { ...showOnly, operation: ['setLogLevel'] } },
		options: [
			{ name: 'ERR', value: 1 },
			{ name: 'INFO', value: 2 },
			{ name: 'DBG', value: 3 },
		],
		default: 2,
	},
	// call program
	{
		displayName: '能力ID',
		name: 'ability_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: { ...showOnly, operation: ['syncCallProgram', 'asyncProgramTask'] },
		},
		default: '',
	},
	{
		displayName: '请求数据JSON',
		name: 'request_data',
		type: 'string',
		required: true,
		typeOptions: { rows: 4 },
		displayOptions: {
			show: { ...showOnly, operation: ['syncCallProgram', 'asyncProgramTask'] },
		},
		default: '{}',
		description: 'request_data，与配置输入协议匹配的 JSON 字符串',
	},
	{
		displayName: '通知ID',
		name: 'notify_id',
		type: 'string',
		displayOptions: { show: { ...showOnly, operation: ['syncCallProgram'] } },
		default: '',
		description: 'notify_id，可选，由专区通知应用返回',
	},
	{
		displayName: '任务ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, operation: ['asyncProgramResult'] } },
		default: '',
	},
	// debug
	{
		displayName: '调试Token',
		name: 'debug_token',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, operation: ['openDebugMode'] } },
		default: '',
	},
];
