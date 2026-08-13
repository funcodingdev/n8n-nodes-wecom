import type { INodeProperties } from 'n8n-workflow';

export const promotionQrcodeDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
			},
		},
		options: [
			{
				name: '[推广二维码] 获取注册码',
				value: 'getRegisterCode',
				description: '根据注册推广包生成注册码（register_code）',
				action: '获取注册码',
			},
			{
				name: '[推广二维码] 查询注册状态',
				value: 'getRegisterInfo',
				description: '查询通过注册定制化新创建的企业注册状态',
				action: '查询注册状态',
			},
			{
				name: '[推广二维码] 设置授权应用可见范围',
				value: 'setAgentScope',
				description: '设置授权应用的可见范围（成员、部门、标签）',
				action: '设置授权应用可见范围',
			},
			{
				name: '[推广二维码] 设置通讯录同步完成',
				value: 'setContactSyncSuccess',
				description: '设置通讯录同步完成，解除通讯录锁定状态',
				action: '设置通讯录同步完成',
			},
		],
		default: 'getRegisterCode',
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
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode', 'getRegisterInfo'],
			},
		},
		default: '',
		description: '服务商provider_access_token，获取方法参见服务商的凭证',
	},
	{
		displayName: '推广包ID',
		name: 'templateId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		typeOptions: { maxLength: 128 },
		description: '推广二维码的模板ID，最长为128个字节。在"服务商管理端-应用管理-推广二维码"，创建的推广码详情可查看',
	},
	{
		displayName: '企业名称',
		name: 'corpName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		typeOptions: { maxLength: 256 },
		description: '企业名称。若传递该参数，则在进入注册企业填写信息时，相应的值会自动填到表格中',
	},
	{
		displayName: '管理员姓名',
		name: 'adminName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		typeOptions: { maxLength: 64 },
		description: '管理员姓名。若传递该参数，则在进入注册企业填写信息时，相应的值会自动填到表格中',
	},
	{
		displayName: '管理员手机号',
		name: 'adminMobile',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		typeOptions: { maxLength: 20 },
		description: '管理员手机号。若传递该参数，则在进入注册企业填写信息时，相应的值会自动填到表格中',
	},
	{
		displayName: 'State值',
		name: 'state',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		typeOptions: { maxLength: 128 },
		description: '用户自定义的状态值。只支持英文字母和数字，最长为128字节。若指定该参数，接口"查询注册状态"及"注册完成回调事件"会相应返回该字段值',
	},
	{
		displayName: '跟进人userid',
		name: 'followUser',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		typeOptions: { maxLength: 64 },
		description:
			'跟进人的userid。必须是服务商所在企业的成员；可与下方选择二选一。若配置该值，则由该注册码创建的企业，在服务商管理后台，该企业的报备记录会自动标注跟进人员为指定成员',
	},
	{
		displayName: '跟进人(选择)',
		name: 'followUser_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '返回的 register_code 只能消费一次；请在 expires_in 有效期内生成注册链接并完成跳转。',
		name: 'registerCodeNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['promotionQrcode'], operation: ['getRegisterCode'] },
		},
		default: '',
	},
	{
		displayName: '注册码',
		name: 'registerCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterInfo'],
			},
		},
		default: '',
		typeOptions: { maxLength: 512 },
		description: '查询的注册码。register_code生成后的查询有效期为24小时。仅支持注册完成回调事件或者获取注册码返回的register_code调用',
	},
	{
		displayName: '注册码生成后仅可在 24 小时内查询；仅支持本接口生成或注册完成回调返回的 register_code。',
		name: 'registerInfoNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['promotionQrcode'], operation: ['getRegisterInfo'] },
		},
		default: '',
	},
	{
		displayName: 'Access Token',
		name: 'accessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '',
		description: '查询注册状态接口返回的access_token（跟注册完成回调事件的AccessToken参数一致，请注意与provider_access_token的区别）',
	},
	{
		displayName: '应用 ID',
		name: 'agentid',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0, numberStepSize: 1 },
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		description: '需要设置可见范围的应用ID；可与下方选择二选一',
	},
	{
		displayName: '应用(选择)',
		name: 'agentid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAgents' },
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '',
		description: '与上方数字二选一；均填写时以数字为准',
	},
	{
		displayName: '应用可见范围（成员）',
		name: 'allowUser',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '',
		description:
			'成员 userid 列表，支持逗号、中文逗号、竖线或换行分隔并自动去重；与下方选择合并；未填且未选择会清空成员范围',
		placeholder: '例如: zhansan,lisi',
	},
	{
		displayName: '应用可见范围成员(选择)',
		name: 'allowUser_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: [],
		description: '与上方成员列表合并去重',
	},
	{
		displayName: '应用可见范围成员 JSON',
		name: 'allowUserJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 ["userid1"] 或 [{"userid":"userid1"}]',
	},
	{
		displayName: '应用可见范围（部门）',
		name: 'allowParty',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '',
		description:
			'正整数部门 ID 列表，支持逗号、中文逗号、竖线或换行分隔；与下方选择合并；未填且未选择会清空部门范围',
		placeholder: '例如: 1,2,3',
	},
	{
		displayName: '应用可见范围部门(选择)',
		name: 'allowParty_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getDepartments' },
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: [],
		description: '与上方部门列表合并去重',
	},
	{
		displayName: '应用可见范围部门 JSON',
		name: 'allowPartyJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 [1,2] 或 [{"partyid":1}]',
	},
	{
		displayName: '应用可见范围（标签）',
		name: 'allowTag',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '',
		description:
			'正整数标签 ID 列表，支持逗号、中文逗号、竖线或换行分隔；与下方选择合并；未填且未选择会清空标签范围',
		placeholder: '例如: 1,2,3',
	},
	{
		displayName: '应用可见范围标签(选择)',
		name: 'allowTag_selected',
		type: 'multiOptions',
		typeOptions: { loadOptionsMethod: 'getTags' },
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: [],
		description: '与上方标签列表合并去重',
	},
	{
		displayName: '应用可见范围标签 JSON',
		name: 'allowTagJson',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '[]',
		description:
			'可选。非空数组时与上方列表/选择合并去重。支持 [1,2] 或 [{"tagid":1}]',
	},
	{
		displayName: '该接口会覆盖应用可见范围；任一列表留空都会清空对应成员、部门或标签范围。通讯录同步完成或迁移 Access Token 超过约 30 分钟后不可再调用。',
		name: 'agentScopeNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['promotionQrcode'], operation: ['setAgentScope'] },
		},
		default: '',
	},
	{
		displayName: 'Access Token',
		name: 'accessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setContactSyncSuccess'],
			},
		},
		default: '',
		description: '查询注册状态接口返回的access_token（跟注册完成回调事件的AccessToken参数一致，请注意与provider_access_token的区别）',
	},
	{
		displayName: '执行后会解除通讯录锁定并使迁移 Access Token 失效，之后不能再设置授权应用可见范围。请确认所有通讯录与范围设置都已完成。',
		name: 'contactSyncNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['promotionQrcode'], operation: ['setContactSyncSuccess'] },
		},
		default: '',
	},
];
