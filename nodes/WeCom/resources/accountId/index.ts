import type { INodeProperties } from 'n8n-workflow';

export const accountIdDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
			},
		},
		options: [
			{
				name: '[账号ID] userid转换',
				value: 'openuseridToUserid',
				description: '将代开发应用或第三方应用获取的密文open_userid转换为明文userid',
				action: 'userid转换',
			},
			{
				name: '[账号ID] userid转换（第三方应用）',
				value: 'useridToOpenuserid',
				description: '将企业主体下的明文userid转换为服务商主体下的密文userid',
				action: 'userid转换（第三方应用）',
			},
			{
				name: '[账号ID] external_userid转换',
				value: 'fromServiceExternalUserid',
				description: '将代开发应用或第三方应用获取的externaluserid转换成自建应用的externaluserid',
				action: 'external_userid转换',
			},
			{
				name: '[账号ID] external_userid转换（第三方应用）',
				value: 'getNewExternalUserid',
				description: '将企业主体下的external_userid转换为服务商主体下的external_userid',
				action: 'external_userid转换（第三方应用）',
			},
			{
				name: '[账号ID] external_userid转换（客户群成员）',
				value: 'getNewExternalUseridGroupchat',
				description: '将企业主体下的客户群成员external_userid转换为服务商主体下的external_userid',
				action: 'external_userid转换（客户群成员）',
			},
			{
				name: '[账号ID] tmp_external_userid转换',
				value: 'convertTmpExternalUserid',
				description: '将应用获取的外部用户临时ID转换为external_userid',
				action: 'tmp_external_userid转换',
			},
			{
				name: '[账号ID] corpid转换（第三方应用）',
				value: 'corpidToOpencorpid',
				description: '将企业主体的明文corpid转换为服务商主体的密文corpid',
				action: 'corpid转换（第三方应用）',
			},
			{
				name: '[账号ID] unionid转换（第三方应用）',
				value: 'unionidToExternalUserid',
				description: '将微信客户的unionid转为第三方主体的external_userid',
				action: 'unionid转换（第三方应用）',
			},
			{
				name: '[账号ID] external_userid查询pending_id（第三方应用）',
				value: 'externalUseridToPendingId',
				description: '通过external_userid查询pending_id，用于关联unionid和external_userid',
				action: 'external_userid查询pending_id（第三方应用）',
			},
			{
				name: '[账号ID] 客户标签ID转换（第三方应用）',
				value: 'externalTagidToOpenExternalTagid',
				description: '将企业主体下的客户标签ID(含标签组ID)转换成服务商主体下的客户标签ID',
				action: '客户标签ID转换（第三方应用）',
			},
			{
				name: '[账号ID] 微信客服ID转换（第三方应用）',
				value: 'openKfidToNewOpenKfid',
				description: '将企业主体下的微信客服ID转换成服务商主体下的微信客服ID',
				action: '微信客服ID转换（第三方应用）',
			},
			{
				name: '[账号ID] ID迁移完成状态设置（第三方应用）',
				value: 'finishOpenidMigration',
				description: '服务商完成企业下所有第三方应用的新旧ID迁移后，将该企业设置为"迁移完成"',
				action: 'ID迁移完成状态设置（第三方应用）',
			},
			{
				name: '[账号ID] 密文corpid转明文（服务商）',
				value: 'opencorpidToCorpid',
				description: '将服务商主体下的密文 corpid 转为企业明文 corpid',
				action: 'opencorpid转corpid',
			},
		],
		default: 'openuseridToUserid',
	},
	{
		displayName: '源应用ID',
		name: 'sourceAgentid',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['openuseridToUserid', 'fromServiceExternalUserid', 'opencorpidToCorpid'],
			},
		},
		default: 1,
		typeOptions: { minValue: 1, maxValue: 4294967295, numberStepSize: 1 },
		description: '企业授权的代开发自建应用或第三方应用的agentid',
	},
	{
		displayName: 'Open Userid列表',
		name: 'openUseridList',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['openuseridToUserid'],
			},
		},
		default: [],
		description: 'Open_userid列表，最多不超过1000个。必须是source_agentid对应的应用所获取的open_userid，多个值请使用"Add Value"按钮添加',
	},
	{
		displayName: 'External Userid',
		name: 'externalUserid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['fromServiceExternalUserid'],
			},
		},
		default: '',
		description: '服务商主体的external_userid。必须是source_agentid对应的应用所获取的external_userid',
	},
	{
		displayName: '业务类型',
		name: 'businessType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['convertTmpExternalUserid'],
			},
		},
		options: [
			{
				name: '会议',
				value: 1,
				description: '获取会议详情',
			},
			{
				name: '收集表',
				value: 2,
				description: '收集表的统计信息查询、读取收集表答案',
			},
			{
				name: '智能表格',
				value: 3,
				description: '智能表格获取记录',
			},
		],
		default: 1,
	},
	{
		displayName: '用户类型',
		name: 'userType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['convertTmpExternalUserid'],
			},
		},
		options: [
			{
				name: '客户',
				value: 1,
				description: '应用可见范围内，配置了客户联系功能的企业成员所添加的外部联系人',
			},
			{
				name: '企业互联',
				value: 2,
				description: '共享应用配置共享范围内的成员',
			},
			{
				name: '上下游',
				value: 3,
				description: '共享应用配置共享范围内的成员',
			},
			{
				name: '互联企业（圈子）',
				value: 4,
				description: '管理后台配置的应用可见范围内的成员',
			},
		],
		default: 1,
		description: '转换的目标用户类型',
	},
	{
		displayName: 'Tmp External Userid列表',
		name: 'tmpExternalUseridList',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['convertTmpExternalUserid'],
			},
		},
		default: [],
		description: '外部用户临时ID列表，最多不超过100个。外部用户临时ID，多个值请使用"Add Value"按钮添加',
	},
	{
		displayName: 'Provider Access Token',
		name: 'providerAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['corpidToOpencorpid'],
			},
		},
		default: '',
		description: '应用服务商的provider_access_token，获取方法参见服务商的凭证',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['corpidToOpencorpid'],
			},
		},
		default: '',
		description: '待获取的企业ID',
	},
	{
		displayName: '密文CorpID',
		name: 'opencorpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['opencorpidToCorpid'],
			},
		},
		default: '',
		description: '服务商主体下的密文 corpid',
	},
	{
		displayName: 'Userid列表',
		name: 'useridList',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['useridToOpenuserid'],
			},
		},
		default: [],
		description: '获取到的成员ID列表，最多不超过1000个。多个值请使用"Add Value"按钮添加',
	},
	{
		displayName: 'External Userid列表',
		name: 'externalUseridList',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['getNewExternalUserid', 'getNewExternalUseridGroupchat'],
			},
		},
		default: [],
		description: '企业主体下的external_userid列表，建议200个，最多不超过1000个。多个值请使用"Add Value"按钮添加',
	},
	{
		displayName: '客户群ID',
		name: 'chatId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['getNewExternalUseridGroupchat'],
			},
		},
		default: '',
	},
	{
		displayName: 'Unionid',
		name: 'unionid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['unionidToExternalUserid'],
			},
		},
		default: '',
		description: '微信客户的unionid',
	},
	{
		displayName: 'Openid',
		name: 'openid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['unionidToExternalUserid'],
			},
		},
		default: '',
		description: '微信客户的openid',
	},
	{
		displayName: '主体类型',
		name: 'subjectType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['unionidToExternalUserid'],
			},
		},
		options: [
			{
				name: '企业',
				value: 0,
				description: '主体名称是企业的',
			},
			{
				name: '服务商',
				value: 1,
				description: '主体名称是服务商的',
			},
		],
		default: 0,
	},
	{
		displayName: 'External Userid列表',
		name: 'externalUserid',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['externalUseridToPendingId'],
			},
		},
		default: [],
		description: '该企业的外部联系人ID，最多可同时查询100个外部联系人。多个值请使用"Add Value"按钮添加',
	},
	{
		displayName: '客户群ID（可选）',
		name: 'chatId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['externalUseridToPendingId'],
			},
		},
		default: '',
		description: '群ID，如果有传入该参数，则只检查群主是否在可见范围',
	},
	{
		displayName: 'External Tagid列表',
		name: 'externalTagidList',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['externalTagidToOpenExternalTagid'],
			},
		},
		default: [],
		description: '企业主体下的客户标签ID或标签组ID列表，最多不超过1000个。多个值请使用"Add Value"按钮添加',
	},
	{
		displayName: 'Open Kfid列表',
		name: 'openKfidList',
		type: 'string',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['openKfidToNewOpenKfid'],
			},
		},
		default: [],
		description: '微信客服ID列表，最多不超过1000个。多个值请使用"Add Value"按钮添加',
	},
	{
		displayName: 'Provider Access Token',
		name: 'providerAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['finishOpenidMigration'],
			},
		},
		default: '',
		description: '应用提供商的provider_access_token，获取方法参见服务商的凭证',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['finishOpenidMigration'],
			},
		},
		default: '',
		description: '企业corpid',
	},
	{
		displayName: 'ID类型',
		name: 'openidType',
		type: 'options',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['accountId'],
				operation: ['finishOpenidMigration'],
			},
		},
		options: [
			{
				name: 'Userid与Corpid',
				value: 1,
				description: 'Userid与corpid',
			},
			{
				name: 'External Userid',
				value: 3,
			},
		],
		default: 1,
		description: 'ID类型：1-userid与corpid; 3-external_userid。多个值请使用"Add Value"按钮添加',
	},
	{
		displayName: '仅在企业下所有第三方应用对应类型的新旧 ID 已全部迁移后执行。该状态用于宣告迁移完成，请勿提前设置。',
		name: 'finishMigrationNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['accountId'], operation: ['finishOpenidMigration'] },
		},
		default: '',
	},
];
