import type { INodeProperties } from 'n8n-workflow';

export const appAuthDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
			},
		},
		options: [
			{
				name: '[第三方应用授权] 获取第三方应用凭证',
				value: 'getSuiteToken',
				description: '获取第三方应用凭证',
				action: '获取第三方应用凭证',
			},
			{
				name: '[第三方应用授权] 获取预授权码',
				value: 'getPreAuthCode',
				description: '获取预授权码，用于企业授权时的第三方服务商安全验证',
				action: '获取预授权码',
			},
			{
				name: '[第三方应用授权] 设置授权配置',
				value: 'setSessionInfo',
				description: '对某次授权进行配置，可支持测试模式（应用未发布时）',
				action: '设置授权配置',
			},
			{
				name: '[第三方应用授权] 获取企业永久授权码',
				value: 'getPermanentCode',
				description: '使用临时授权码换取授权方的永久授权码以及企业信息',
				action: '获取企业永久授权码',
			},
			{
				name: '[第三方应用授权] 获取企业授权信息',
				value: 'getAuthInfo',
				description: '通过永久授权码换取企业微信的授权信息',
				action: '获取企业授权信息',
			},
			{
				name: '[第三方应用授权] 获取企业凭证',
				value: 'getCorpToken',
				description: '使用永久授权码获取企业访问凭证',
				action: '获取企业凭证',
			},
			{
				name: '[第三方应用授权] 获取应用二维码',
				value: 'getAppQrcode',
				description: '用于获取第三方应用二维码',
				action: '获取应用二维码',
			},
			{
				name: '[第三方应用授权] 明文corpid转换为加密corpid',
				value: 'corpidToOpencorpid',
				description: '将已有的明文corpid转换为第三方的加密corpid',
				action: '明文corpid转换为加密corpid',
			},
			{
				name: '[第三方应用授权] 获取应用权限详情',
				value: 'getPermissions',
				description: '获取代开发应用或第三方应用用户授权的权限详情',
				action: '获取应用权限详情',
			},
			{
				name: '[第三方应用授权] 获取应用管理员列表',
				value: 'getAdminList',
				description: '获取授权企业中某个第三方应用或者代开发应用的管理员列表（不包括外部管理员）',
				action: '获取应用管理员列表',
			},
			{
				name: '[第三方应用授权] 获取订单列表',
				value: 'getOrderList',
				description: '服务商可以使用该接口查询指定时间段内的订单列表',
				action: '获取订单列表',
			},
			{
				name: '[第三方应用授权] 获取订单详情',
				value: 'getOrder',
				description: '服务商可以使用该接口查询指定订单的详情',
				action: '获取订单详情',
			},
			{
				name: '[第三方应用授权] 延长试用期',
				value: 'prolongTry',
				description: '服务商可以使用该接口延长应用的试用期',
				action: '延长试用期',
			},
		],
		default: 'getSuiteToken',
	},
	{
		displayName: '第三方应用ID',
		name: 'suiteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getSuiteToken'],
			},
		},
		default: '',
		description: '第三方应用ID或者代开发应用模板ID。第三方应用以ww或wx开头应用ID（对应于旧的以tj开头的套件ID）；代开发应用以dk开头',
	},
	{
		displayName: '第三方应用Secret',
		name: 'suiteSecret',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getSuiteToken'],
			},
		},
		default: '',
		description: '第三方应用secret 或者代开发应用模板secret。从企业微信服务商后台获取',
	},
	{
		displayName: 'Suite Ticket',
		name: 'suiteTicket',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getSuiteToken'],
			},
		},
		default: '',
		description: '企业微信后台推送的ticket。suite_ticket由企业微信后台定时推送给"指令回调URL"，每十分钟更新一次。suite_ticket实际有效期为30分钟，请永远使用最新接收到的suite_ticket',
	},
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getPreAuthCode'],
			},
		},
		default: '',
		description: '第三方应用access_token，通过"获取第三方应用凭证"接口获取的suite_access_token，有效期为2小时',
	},
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['setSessionInfo'],
			},
		},
		default: '',
		description: '第三方应用access_token，通过"获取第三方应用凭证"接口获取的suite_access_token，有效期为2小时',
	},
	{
		displayName: '预授权码',
		name: 'preAuthCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['setSessionInfo'],
			},
		},
		default: '',
		description: '通过"获取预授权码"接口获取的pre_auth_code',
	},
	{
		displayName: '允许授权的应用ID（可选）',
		name: 'appid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['setSessionInfo'],
			},
		},
		default: '',
		description: '允许进行授权的应用ID。如1、2、3，多个应用ID用逗号分隔。不填或者填空都表示允许授权套件内所有应用（仅旧的多应用套件可传此参数，新开发者可忽略）',
		placeholder: '例如: 1,2,3',
	},
	{
		displayName: '授权类型',
		name: 'authType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['setSessionInfo'],
			},
		},
		options: [
			{
				name: '正式授权',
				value: 0,
				description: '正式授权',
			},
			{
				name: '测试授权',
				value: 1,
				description: '测试授权（应用未发布时）',
			},
		],
		default: 0,
		description: '授权类型。请确保应用在正式发布后的授权类型为"正式授权"',
	},
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getPermanentCode'],
			},
		},
		default: '',
		description: '第三方应用access_token，通过"获取第三方应用凭证"接口获取的suite_access_token，有效期为2小时',
	},
	{
		displayName: '临时授权码',
		name: 'authCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getPermanentCode'],
			},
		},
		default: '',
		description: '临时授权码会在授权成功时附加在redirect_uri中跳转回第三方服务商网站，或通过授权成功通知回调推送给服务商。长度为64至512个字节，临时授权码一次有效',
	},
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getAuthInfo'],
			},
		},
		default: '',
		description: '第三方应用access_token，通过"获取第三方应用凭证"接口获取的suite_access_token，有效期为2小时',
	},
	{
		displayName: '授权方企业ID',
		name: 'authCorpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getAuthInfo'],
			},
		},
		default: '',
		description: '授权方corpid，授权方企业微信ID，可通过"获取企业永久授权码"接口返回的auth_corp_info.corpid获取',
	},
	{
		displayName: '永久授权码',
		name: 'permanentCode',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getAuthInfo'],
			},
		},
		default: '',
		description: '通过"获取企业永久授权码"接口获取的permanent_code',
	},
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getCorpToken'],
			},
		},
		default: '',
		description: '第三方应用access_token，通过"获取第三方应用凭证"接口获取的suite_access_token，有效期为2小时',
	},
	{
		displayName: '授权方企业ID',
		name: 'authCorpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getCorpToken'],
			},
		},
		default: '',
		description: '授权方corpid，授权方企业微信ID，可通过"获取企业永久授权码"接口返回的auth_corp_info.corpid获取',
	},
	{
		displayName: '永久授权码',
		name: 'permanentCode',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getCorpToken'],
			},
		},
		default: '',
		description: '通过"获取企业永久授权码"接口获取的permanent_code',
	},
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getAppQrcode'],
			},
		},
		default: '',
		description: '第三方应用access_token，通过"获取第三方应用凭证"接口获取的suite_access_token，有效期为2小时',
	},
	{
		displayName: '第三方应用ID',
		name: 'suiteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getAppQrcode'],
			},
		},
		default: '',
		description: '第三方应用ID（即ww或wx开头的suiteid）。第三方应用ID，单应用不需要该参数，多应用旧套件才需要传该参数',
	},
	{
		displayName: '应用ID（可选）',
		name: 'appid',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getAppQrcode'],
			},
		},
		default: 1,
		description: '第三方应用ID。单应用不需要该参数，多应用旧套件才需要传该参数，若不传默认为1',
	},
	{
		displayName: 'State值（可选）',
		name: 'state',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getAppQrcode'],
			},
		},
		default: '',
		description: 'State值，用于区分不同的安装渠道。可以填写a-zA-Z0-9，长度不可超过32个字节，默认为空。扫应用带参二维码授权安装后，获取企业永久授权码接口会返回该state值',
	},
	{
		displayName: '二维码样式',
		name: 'style',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getAppQrcode'],
			},
		},
		options: [
			{
				name: '带说明外框的二维码（适合于实体物料）',
				value: 0,
			},
			{
				name: '带说明外框的二维码（适合于屏幕类）',
				value: 1,
			},
			{
				name: '不带说明外框（小尺寸）',
				value: 2,
			},
			{
				name: '不带说明外框（中尺寸）',
				value: 3,
			},
			{
				name: '不带说明外框（大尺寸）',
				value: 4,
			},
		],
		default: 2,
		description: '二维码样式选项，默认为不带说明外框小尺寸。具体样式与服务商管理端获取到的应用二维码样式一一对应',
	},
	{
		displayName: '结果返回方式',
		name: 'resultType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getAppQrcode'],
			},
		},
		options: [
			{
				name: '二维码图片buffer',
				value: 1,
				description: '返回二维码图片buffer（二进制数据）',
			},
			{
				name: '二维码图片URL',
				value: 2,
				description: '返回二维码图片URL（JSON格式）',
			},
		],
		default: 1,
		description: '结果返回方式，默认为返回二维码图片buffer',
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
				resource: ['appAuth'],
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
				resource: ['appAuth'],
				operation: ['corpidToOpencorpid'],
			},
		},
		default: '',
		description: '待转换的企业ID。待获取的明文corpid，仅限第三方服务商，转换已获授权企业的corpid',
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
				resource: ['appAuth'],
				operation: ['getPermissions'],
			},
		},
		default: '',
		description: '应用access_token，代开发自建应用access_token（获取方法参见获取access_token）或第三方应用access_token（获取方法参见获取企业凭证）',
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
				resource: ['appAuth'],
				operation: ['getAdminList'],
			},
		},
		default: '',
		description: '应用access_token，代开发自建应用access_token（获取方法参见获取access_token）或第三方应用access_token（获取方法参见获取企业凭证）',
	},
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getOrderList'],
			},
		},
		default: '',
		description: '第三方应用凭证，通过"获取第三方应用凭证"接口获取的suite_access_token',
	},
	{
		displayName: '起始时间',
		name: 'startTime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getOrderList'],
			},
		},
		default: '',
		description:
			'start_time（Unix 秒）。<a href="https://developer.work.weixin.qq.com/document/path/90600" target="_blank">官方文档</a>',
	},
	{
		displayName: '终止时间',
		name: 'endTime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getOrderList'],
			},
		},
		default: '',
		description: 'end_time（Unix 秒）',
	},
	{
		displayName: '测试模式',
		name: 'testMode',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getOrderList'],
			},
		},
		options: [
			{
				name: '正式授权',
				value: 0,
				description: '正式授权',
			},
			{
				name: '测试授权',
				value: 1,
				description: '测试授权',
			},
		],
		default: 0,
		description: '指定拉取正式或测试授权的订单，默认正式授权',
	},
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getOrder'],
			},
		},
		default: '',
		description: '第三方应用凭证，通过"获取第三方应用凭证"接口获取的suite_access_token',
	},
	{
		displayName: '订单号',
		name: 'orderid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['getOrder'],
			},
		},
		default: '',
		description: '要查询的订单号',
	},
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['prolongTry'],
			},
		},
		default: '',
		description: '第三方应用凭证，通过"获取第三方应用凭证"接口获取的suite_access_token',
	},
	{
		displayName: '购买方corpid',
		name: 'buyerCorpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['prolongTry'],
			},
		},
		default: '',
		description: '购买方企业ID',
	},
	{
		displayName: '延长天数',
		name: 'prolongDays',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['prolongTry'],
			},
		},
		default: 7,
		description: '一个应用可以多次延长试用，但是试用总天数不能超过60天',
		typeOptions: {
			minValue: 1,
		},
	},
	{
		displayName: '应用ID（可选）',
		name: 'appid',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['appAuth'],
				operation: ['prolongTry'],
			},
		},
		default: 1,
		description: '仅旧套件需要填此参数',
	},
];
