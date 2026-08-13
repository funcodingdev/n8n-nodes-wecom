import type { INodeProperties } from 'n8n-workflow';

export const licenseDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['license'],
			},
		},
		options: [
			{
				name: '[接口许可] 下单购买账号',
				value: 'createNewOrder',
				description: '服务商下单为企业购买新的账号，可以同时购买基础账号与互通账号',
				action: '下单购买账号',
			},
			{
				name: '[接口许可] 创建续期任务',
				value: 'createRenewOrderJob',
				description: '创建续期任务，为一批已激活账号的成员续期',
				action: '创建续期任务',
			},
			{
				name: '[接口许可] 提交续期订单',
				value: 'submitOrderJob',
				description: '提交续期订单，完成续期订单的支付流程',
				action: '提交续期订单',
			},
			{
				name: '[接口许可] 获取订单列表',
				value: 'listOrder',
				description: '服务商查询自己某段时间内的平台能力服务订单列表',
				action: '获取订单列表',
			},
			{
				name: '[接口许可] 获取订单详情',
				value: 'getOrder',
				description: '查询某个订单的详情，包括订单的状态、基础账号个数、互通账号个数、账号购买时长等',
				action: '获取订单详情',
			},
			{
				name: '[接口许可] 获取订单中的账号列表',
				value: 'listOrderAccount',
				description: '查询指定订单下的平台能力服务账号列表（账号激活码列表或续期账号成员列表）',
				action: '获取订单中的账号列表',
			},
			{
				name: '[接口许可] 取消订单',
				value: 'cancelOrder',
				description: '取消接口许可购买和续费订单，只可取消未支付且未失效的订单',
				action: '取消订单',
			},
			{
				name: '[接口许可] 创建多企业新购任务',
				value: 'createNewOrderJob',
				description: '创建多企业新购任务，为多个企业购买新的账号',
				action: '创建多企业新购任务',
			},
			{
				name: '[接口许可] 提交多企业新购订单',
				value: 'submitNewOrderJob',
				description: '提交多企业新购订单，完成多企业订单的支付流程',
				action: '提交多企业新购订单',
			},
			{
				name: '[接口许可] 获取多企业新购订单提交结果',
				value: 'newOrderJobResult',
				description: '获取多企业新购订单提交结果，查询订单创建状态',
				action: '获取多企业新购订单提交结果',
			},
			{
				name: '[接口许可] 获取多企业订单详情',
				value: 'getUnionOrder',
				description: '查询某个多企业订单的详情，包括订单的状态、购买的企业、基础账号个数、互通账号个数、账号购买时长等',
				action: '获取多企业订单详情',
			},
			{
				name: '[接口许可] 提交余额支付订单任务',
				value: 'submitPayJob',
				description: '使用充值账户余额进行订单支付，创建支付任务',
				action: '提交余额支付订单任务',
			},
			{
				name: '[接口许可] 获取订单支付结果',
				value: 'payJobResult',
				description: '获取余额订单支付任务的执行结果',
				action: '获取订单支付结果',
			},
			{
				name: '[接口许可] 激活账号',
				value: 'activeAccount',
				description: '将激活码绑定到某个企业员工，以对其激活相应的平台服务能力',
				action: '激活账号',
			},
			{
				name: '[接口许可] 批量激活账号',
				value: 'batchActiveAccount',
				description: '在一次请求里为一个企业的多个成员激活许可账号，便于服务商批量化处理',
				action: '批量激活账号',
			},
			{
				name: '[接口许可] 指定账号类型激活',
				value: 'activeAccountByType',
				description: '从当前企业中选择一个该指定类型的激活截止时间最早的未激活的激活码进行激活',
				action: '指定账号类型激活',
			},
			{
				name: '[接口许可] 获取激活码详情',
				value: 'getActiveInfoByCode',
				description: '查询某个账号激活码的状态以及激活绑定情况',
				action: '获取激活码详情',
			},
			{
				name: '[接口许可] 批量获取激活码详情',
				value: 'batchGetActiveInfoByCode',
				description: '批量查询账号激活码的状态以及激活绑定情况',
				action: '批量获取激活码详情',
			},
			{
				name: '[接口许可] 获取企业的账号列表',
				value: 'listActivedAccount',
				description: '查询指定企业下的平台能力服务账号列表',
				action: '获取企业的账号列表',
			},
			{
				name: '[接口许可] 获取成员的激活详情',
				value: 'getActiveInfoByUser',
				description: '查询某个企业成员的激活情况',
				action: '获取成员的激活详情',
			},
			{
				name: '[接口许可] 账号继承',
				value: 'batchTransferLicense',
				description: '在企业员工离职或者工作范围的有变更时，允许将其许可账号继承给其他员工',
				action: '账号继承',
			},
			{
				name: '[接口许可] 分配激活码给下游/下级企业',
				value: 'batchShareActiveCode',
				description: '将为上游/上级企业购买的激活码分配给下游/下级企业使用',
				action: '分配激活码给下游/下级企业',
			},
			{
				name: '[接口许可] 获取应用的接口许可状态',
				value: 'getAppLicenseInfo',
				description: '获取某个授权企业的应用接口许可试用期',
				action: '获取应用的接口许可状态',
			},
			{
				name: '[接口许可] 设置企业的许可自动激活状态',
				value: 'setAutoActiveStatus',
				description: '设置授权企业的许可自动激活状态，设置为自动激活后，对应授权企业的员工使用服务商应用时，接口许可表现为自动激活',
				action: '设置企业的许可自动激活状态',
			},
			{
				name: '[接口许可] 查询企业的许可自动激活状态',
				value: 'getAutoActiveStatus',
				description: '查询授权企业的许可自动激活状态',
				action: '查询企业的许可自动激活状态',
			},
			{
				name: '[接口许可] 充值账户余额查询',
				value: 'getAccountBalance',
				description: '查询服务商充值账户余额',
				action: '充值账户余额查询',
			},
			{
				name: '[接口许可] 民生优惠条件查询',
				value: 'supportPolicyQuery',
				description: '查询企业是否满足民生行业政策的优惠条件（注：民生行业接口许可优惠政策于2023年3月31日到期，到期后不再支持查询）',
				action: '民生优惠条件查询',
			},
		],
		default: 'createNewOrder',
	},
	{
		displayName: '查询服务商充值账户余额（单位：分）。仅需 Provider Access Token，无其他业务参数。',
		name: 'licenseBalanceNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['license'], operation: ['getAccountBalance'] },
		},
		default: '',
	},
	{
		displayName: '提交余额支付任务成功后，订单将无法再变更支付方式；请先核对订单 ID 和充值账户余额。',
		name: 'licensePaymentNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['license'], operation: ['submitPayJob'] },
		},
		default: '',
	},
	{
		displayName: '取消操作会立即关闭符合条件的未支付订单，请确认订单 ID 和订单类型。',
		name: 'licenseCancelNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['license'], operation: ['cancelOrder'] },
		},
		default: '',
	},
	{
		displayName: '企业微信文档注明：民生行业接口许可优惠政策已于 2023 年 3 月 31 日到期，当前接口可能不再支持查询。',
		name: 'licensePolicyExpiredNotice',
		type: 'notice',
		displayOptions: {
			show: { resource: ['license'], operation: ['supportPolicyQuery'] },
		},
		default: '',
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
				resource: ['license'],
			},
		},
		default: '',
		description: '应用服务商的接口调用凭证（provider_access_token），获取方法参见服务商的凭证',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createNewOrder'],
			},
		},
		default: '',
		description: '待购买接口许可的企业ID',
	},
	{
		displayName: '下单人',
		name: 'buyerUserid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createNewOrder'],
			},
		},
		default: '',
		description: '服务商企业内成员的明文userid。该userid必须登录过企业微信，并且企业微信已绑定微信，且必须为服务商企业内具有"购买接口许可"权限的管理员。最终也支持由其他人支付',
	},
	{
		displayName: '基础账号个数',
		name: 'baseCount',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createNewOrder'],
			},
		},
		default: 0,
		description: '最多1000000个。若企业为服务商测试企业，最多购买1000个。基础账号跟互通账号不能同时为0',
		typeOptions: { minValue: 0, maxValue: 1000000, numberStepSize: 1 },
	},
	{
		displayName: '互通账号个数',
		name: 'externalContactCount',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createNewOrder'],
			},
		},
		default: 0,
		description: '最多1000000个。若企业为服务商测试企业，最多购买1000个。基础账号跟互通账号不能同时为0',
		typeOptions: { minValue: 0, maxValue: 1000000, numberStepSize: 1 },
	},
	{
		displayName: '购买月数',
		name: 'months',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createNewOrder'],
			},
		},
		default: 1,
		description: '购买的月数。每个月按照31天计算。总购买时长为(months*31+days)天，最少购买1个月(31天)，最多购买60个月(1860天)。若企业为服务商测试企业，只支持购买1个月',
		typeOptions: { minValue: 0, maxValue: 60, numberStepSize: 1 },
	},
	{
		displayName: '购买天数（可选）',
		name: 'days',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createNewOrder'],
			},
		},
		default: 0,
		description: '总购买时长为(months*31+days)天，最少购买1个月(31天)，最多购买60个月(1860天)。若企业为服务商测试企业，不支持指定天购买',
		typeOptions: { minValue: 0, maxValue: 1860, numberStepSize: 1 },
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createRenewOrderJob'],
			},
		},
		default: '',
		description: '待续期接口许可的企业ID',
	},
	{
		displayName: '续期账号输入方式',
		name: 'renewInputMode',
		type: 'options',
		displayOptions: {
			show: { resource: ['license'], operation: ['createRenewOrderJob'] },
		},
		options: [
			{ name: '逐项填写', value: 'form' },
			{ name: 'JSON 数组', value: 'json' },
		],
		default: 'form',
		description: '少量账号可逐项填写；大批量账号可直接提供 JSON 数组',
	},
	{
		displayName: '续期账号列表',
		name: 'accountCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createRenewOrderJob'],
				renewInputMode: ['form'],
			},
		},
		default: {},
		placeholder: '添加账号',
		typeOptions: { multipleValues: true },
		description: '续期的账号列表，每次最多1000个。同一个jobid最多关联1000000个基础账号跟1000000个互通账号',
		options: [
			{
				displayName: '账号',
				name: 'accounts',
				values: [
					{
						displayName: '用户ID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '企业微信成员UserID',
					},
					{
						displayName: '账号类型',
						name: 'type',
						type: 'options',
						default: 1,
						required: true,
						description: '续期账号类型',
						options: [
							{
								name: '基础账号',
								value: 1,
								description: '基础账号',
							},
							{
								name: '互通账号',
								value: 2,
								description: '互通账号',
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: '续期账号列表（JSON）',
		name: 'accountListJson',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createRenewOrderJob'],
				renewInputMode: ['json'],
			},
		},
		default: '[{"userid":"USERID","type":1}]',
		description: '1–1000 项的 JSON 数组。每项包含 userid 和 type（1 为基础账号，2 为互通账号）',
	},
	{
		displayName: '任务ID（可选）',
		name: 'jobid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createRenewOrderJob'],
			},
		},
		default: '',
		description: '若不传则默认创建一个新任务。若指定第一次调用后拿到jobid，可以通过该接口将jobid关联多个userid',
	},
	{
		displayName: '任务ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['submitOrderJob'],
			},
		},
		default: '',
		description: '通过"创建续期任务"接口获取的jobid',
	},
	{
		displayName: '下单人',
		name: 'buyerUserid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['submitOrderJob'],
			},
		},
		default: '',
		description: '服务商企业内成员的明文userid。该userid必须登录过企业微信，并且企业微信已绑定微信，且必须为服务商企业内具有"购买接口许可"权限的管理员',
	},
	{
		displayName: '时长类型',
		name: 'durationType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['submitOrderJob'],
			},
		},
		options: [
			{
				name: '购买月数',
				value: 'months',
				description: '指定购买的月数',
			},
			{
				name: '新到期时间',
				value: 'newExpireTime',
				description: '指定新的到期时间戳',
			},
		],
		default: 'months',
		description: '账号购买时长类型。months 与 new_expire_time 二者填其一',
	},
	{
		displayName: '购买月数',
		name: 'months',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['submitOrderJob'],
				durationType: ['months'],
			},
		},
		default: 1,
		description: '每个月按照31天计算。最多购买60个月。若企业为服务商测试企业，每次续期只能续期1个月',
		typeOptions: { minValue: 1, maxValue: 60, numberStepSize: 1 },
	},
	{
		displayName: '新到期时间',
		name: 'newExpireTime',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['submitOrderJob'],
				durationType: ['newExpireTime'],
			},
		},
		default: '',
		description: '指定的新到期时间。不可为今天和过去的时间，不可为1860天后的时间。须填当天的24时0分0秒，否则系统自动处理为当天的24时0分0秒。若企业为服务商测试企业，不支持指定新的到期时间来续期',
	},
	{
		displayName: '企业ID（可选）',
		name: 'corpid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['listOrder'],
			},
		},
		default: '',
		description: '若指定corpid且corpid为服务商测试企业，则返回的订单列表为测试订单列表。否则只返回正式订单列表',
	},
	{
		displayName: '开始时间（可选）',
		name: 'startTime',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['listOrder'],
			},
		},
		default: '',
		description: '开始时间（下单时间），时间戳（秒）。start_time 和 end_time 必须同时指定，不能单独指定。起始时间跟结束时间不能超过31天',
	},
	{
		displayName: '结束时间（可选）',
		name: 'endTime',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['listOrder'],
			},
		},
		default: '',
		description: '结束时间（下单时间），时间戳（秒）。start_time 和 end_time 必须同时指定，不能单独指定。起始时间跟结束时间不能超过31天',
	},
	{
		displayName: '分页游标（可选）',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['listOrder'],
			},
		},
		default: '',
		description: '用于分页查询的游标。字符串类型，由上一次调用返回，首次调用可不填',
	},
	{
		displayName: '返回最大记录数（可选）',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['listOrder'],
			},
		},
		default: 500,
		description: '返回的最大记录数。整型，最大值1000，默认值500',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
			numberStepSize: 1,
		},
	},
	{
		displayName: '订单ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getOrder'],
			},
		},
		default: '',
		description: '通过"获取订单列表"或"下单购买账号"等接口获取的订单ID。注意：此接口不支持获取多企业订单详情',
	},
	{
		displayName: '订单ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['listOrderAccount'],
			},
		},
		default: '',
		description: '通过"获取订单列表"或"下单购买账号"等接口获取的订单ID。如果是多企业订单，请使用子订单ID (sub_order_id)',
	},
	{
		displayName: '分页游标（可选）',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['listOrderAccount'],
			},
		},
		default: '',
		description: '用于分页查询的游标。字符串类型，由上一次调用返回，首次调用可不填',
	},
	{
		displayName: '返回最大记录数（可选）',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['listOrderAccount'],
			},
		},
		default: 500,
		description: '返回的最大记录数。整型，最大值1000，默认值500',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
			numberStepSize: 1,
		},
	},
	{
		displayName: '订单ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['cancelOrder'],
			},
		},
		default: '',
		description: '待取消的订单ID',
	},
	{
		displayName: '是否多企业新购订单（可选）',
		name: 'isMultiCorpOrder',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['cancelOrder'],
			},
		},
		default: false,
		description: '如果是多企业新购订单，则不需要填写企业ID；否则企业ID必填',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['cancelOrder'],
				isMultiCorpOrder: [false],
			},
		},
		default: '',
		description: '如果是多企业新购订单时不填，否则必填',
	},
	{
		displayName: '企业新购信息输入方式',
		name: 'buyListInputMode',
		type: 'options',
		displayOptions: {
			show: { resource: ['license'], operation: ['createNewOrderJob'] },
		},
		options: [
			{ name: '逐项填写', value: 'form' },
			{ name: 'JSON 数组', value: 'json' },
		],
		default: 'form',
		description: '少量企业可逐项填写；也可直接提供包含购买信息的 JSON 数组',
	},
	{
		displayName: '企业新购信息列表',
		name: 'buyListCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createNewOrderJob'],
				buyListInputMode: ['form'],
			},
		},
		default: {},
		placeholder: '添加企业',
		typeOptions: { multipleValues: true },
		description: '企业新购信息列表，每次最多传10个。每个jobid最多关联100000个BuyInfo',
		options: [
			{
				displayName: '企业',
				name: 'buyInfos',
				values: [
					{
						displayName: '企业ID',
						name: 'corpid',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: '基础账号个数（可选）',
						name: 'baseCount',
						type: 'number',
						default: 0,
						typeOptions: { minValue: 0, maxValue: 1000000, numberStepSize: 1 },
					},
					{
						displayName: '互通账号个数（可选）',
						name: 'externalContactCount',
						type: 'number',
						default: 0,
						typeOptions: { minValue: 0, maxValue: 1000000, numberStepSize: 1 },
					},
					{
						displayName: '购买月数（可选）',
						name: 'months',
						type: 'number',
						default: 1,
						description: '购买的月数',
						typeOptions: { minValue: 0, maxValue: 60, numberStepSize: 1 },
					},
					{
						displayName: '购买天数（可选）',
						name: 'days',
						type: 'number',
						default: 0,
						description: '购买的天数',
						typeOptions: { minValue: 0, maxValue: 1860, numberStepSize: 1 },
					},
					{
						displayName: '是否开启自动激活（可选）',
						name: 'autoActiveStatus',
						type: 'options',
						default: 1,
						options: [
							{
								name: '开启',
								value: 1,
							},
							{
								name: '关闭',
								value: 0,
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: '企业新购信息列表（JSON）',
		name: 'buyListJson',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createNewOrderJob'],
				buyListInputMode: ['json'],
			},
		},
		default: '[{"corpid":"CORPID","base_count":1,"external_contact_count":0,"months":1,"days":0,"auto_active_status":1}]',
		description: '1–10 项的 JSON 数组。支持 base_count、external_contact_count、months、days 和 auto_active_status 字段',
	},
	{
		displayName: '任务ID（可选）',
		name: 'jobid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['createNewOrderJob'],
			},
		},
		default: '',
		description: '若不传则默认创建一个新任务。若指定第一次调用后拿到jobid，可以通过该接口将jobid关联多个新企业的购买账号信息',
	},
	{
		displayName: '任务ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['submitNewOrderJob'],
			},
		},
		default: '',
		description: '通过"创建多企业新购任务"接口获取的jobid',
	},
	{
		displayName: '下单人',
		name: 'buyerUserid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['submitNewOrderJob'],
			},
		},
		default: '',
		description: '服务商企业内成员的明文userid。该userid必须登录过企业微信，并且企业微信已绑定微信，且必须为服务商企业内具有"购买接口许可"权限的管理员',
	},
	{
		displayName: '任务ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['newOrderJobResult'],
			},
		},
		default: '',
		description: '通过"提交多企业新购订单"接口使用的jobid。该结果仅在提交多企业新购订单后7天内可获取',
	},
	{
		displayName: '订单ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getUnionOrder'],
			},
		},
		default: '',
		description: '多企业订单ID',
	},
	{
		displayName: '分页游标（可选）',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getUnionOrder'],
			},
		},
		default: '',
		description: '用于分页查询的游标。字符串类型，填写上一次调用返回的 next_cursor，首次调用可不填',
	},
	{
		displayName: '返回最大记录数（可选）',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getUnionOrder'],
			},
		},
		default: 500,
		description: '返回的最大记录数。整型，最大值1000，默认值500',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
			numberStepSize: 1,
		},
	},
	{
		displayName: '支付人',
		name: 'payerUserid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['submitPayJob'],
			},
		},
		default: '',
		description: '服务商企业内成员的明文userid，用于充值账户的流水记录。该userid必须登录过企业微信，并且企业微信已绑定微信，且必须为服务商企业内具有"购买接口许可"权限的管理员',
	},
	{
		displayName: '订单ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['submitPayJob'],
			},
		},
		default: '',
		description: '要使用充值账户余额支付的接口许可订单ID。可以支付的订单包括单企业购买、单企业续期、多企业购买创建的订单。提交成功后，该订单无法再变更支付方式',
	},
	{
		displayName: '支付任务ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['payJobResult'],
			},
		},
		default: '',
		description: '通过"提交余额支付订单任务"接口返回的jobid。该结果仅在提交了"余额支付订单任务"后的7天内可获取',
	},
	{
		displayName: '账号激活码',
		name: 'activeCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['activeAccount'],
			},
		},
		default: '',
		description: '通过"获取订单中的账号列表"接口获取的账号激活码',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['activeAccount'],
			},
		},
		default: '',
		description: '激活码所属企业ID',
	},
	{
		displayName: '企业成员userid',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['activeAccount'],
			},
		},
		default: '',
		description: '待绑定激活的企业成员userid。一个userid允许激活一个基础账号以及一个互通账号',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchActiveAccount'],
			},
		},
		default: '',
		description: '激活码所属企业ID',
	},
	{
		displayName: '激活账号输入方式',
		name: 'activeListInputMode',
		type: 'options',
		displayOptions: {
			show: { resource: ['license'], operation: ['batchActiveAccount'] },
		},
		options: [
			{ name: '逐项填写', value: 'form' },
			{ name: 'JSON 数组', value: 'json' },
		],
		default: 'form',
		description: '少量账号可逐项填写；大批量账号可直接提供 JSON 数组',
	},
	{
		displayName: '激活账号列表',
		name: 'activeListCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchActiveAccount'],
				activeListInputMode: ['form'],
			},
		},
		default: {},
		placeholder: '添加账号',
		typeOptions: { multipleValues: true },
		description: '需要激活的账号列表，单次激活的员工数量不超过1000',
		options: [
			{
				displayName: '账号',
				name: 'accounts',
				values: [
					{
						displayName: '账号激活码',
						name: 'activeCode',
						type: 'string',
						default: '',
						required: true,
					},
					{
						displayName: '企业成员userid',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '待绑定激活的企业成员userid',
					},
				],
			},
		],
	},
	{
		displayName: '激活账号列表（JSON）',
		name: 'activeListJson',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchActiveAccount'],
				activeListInputMode: ['json'],
			},
		},
		default: '[{"active_code":"ACTIVE_CODE","userid":"USERID"}]',
		description: '1–1000 项的 JSON 数组。每项包含 active_code 和 userid',
	},
	{
		displayName: '账号类型',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['activeAccountByType'],
			},
		},
		options: [
			{
				name: '基础账号',
				value: 1,
				description: '基础账号',
			},
			{
				name: '互通账号',
				value: 2,
				description: '互通账号',
			},
		],
		default: 1,
		description: 'Userid当前必须未激活指定类型的许可或者绑定的该类型账号已过期',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['activeAccountByType'],
			},
		},
		default: '',
		description: '激活码所属企业ID',
	},
	{
		displayName: '企业成员userid',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['activeAccountByType'],
			},
		},
		default: '',
		description: '待绑定激活的企业成员userid。从当前企业中选择一个该指定类型的激活截止时间最早的未激活的激活码进行激活',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getActiveInfoByCode'],
			},
		},
		default: '',
		description: '要查询的企业的corpid',
	},
	{
		displayName: '激活码',
		name: 'activeCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getActiveInfoByCode'],
			},
		},
		default: '',
		description: '要查询的账号激活码',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchGetActiveInfoByCode'],
			},
		},
		default: '',
		description: '要查询的企业的corpid',
	},
	{
		displayName: '激活码列表',
		name: 'activeCodeList',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchGetActiveInfoByCode'],
			},
		},
		default: '',
		description: '激活码列表，最多 1000 个；支持使用逗号、竖线或换行分隔，重复值会自动去除',
		placeholder: '例如：code1,code2,code3',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['listActivedAccount'],
			},
		},
		default: '',
		description: '若为上下游场景，为上游企业corpid。若为上下游场景，corpid指定的为上游企业，仅返回上游企业激活的账号；若corpid指定为下游企业，若激活码为上游企业分享过来的且已绑定，也会返回',
	},
	{
		displayName: '分页游标（可选）',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['listActivedAccount'],
			},
		},
		default: '',
		description: '用于分页查询的游标。字符串类型，由上一次调用返回，首次调用可不填',
	},
	{
		displayName: '返回最大记录数（可选）',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['listActivedAccount'],
			},
		},
		default: 500,
		description: '返回的最大记录数。整型，最大值1000，默认值500',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
			numberStepSize: 1,
		},
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getActiveInfoByUser'],
			},
		},
		default: '',
		description: '要查询的企业ID',
	},
	{
		displayName: '企业成员userid',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getActiveInfoByUser'],
			},
		},
		default: '',
		description: '要查询的企业成员userid',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchTransferLicense'],
			},
		},
		default: '',
		description: '待绑定激活的成员所属企业corpid。转移成员和接收成员属于同一个企业',
	},
	{
		displayName: '继承信息输入方式',
		name: 'transferListInputMode',
		type: 'options',
		displayOptions: {
			show: { resource: ['license'], operation: ['batchTransferLicense'] },
		},
		options: [
			{ name: '逐项填写', value: 'form' },
			{ name: 'JSON 数组', value: 'json' },
		],
		default: 'form',
		description: '少量继承关系可逐项填写；大批量关系可直接提供 JSON 数组',
	},
	{
		displayName: '继承信息列表',
		name: 'transferListCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchTransferLicense'],
				transferListInputMode: ['form'],
			},
		},
		default: {},
		placeholder: '添加继承信息',
		typeOptions: { multipleValues: true },
		description: '单次转移的账号数限制在1000以内',
		options: [
			{
				displayName: '继承信息',
				name: 'transfers',
				values: [
					{
						displayName: '转移成员userid',
						name: 'handoverUserid',
						type: 'string',
						default: '',
						required: true,
						description: '转移成员的userid',
					},
					{
						displayName: '接收成员userid',
						name: 'takeoverUserid',
						type: 'string',
						default: '',
						required: true,
						description: '接收成员的userid',
					},
				],
			},
		],
	},
	{
		displayName: '继承信息列表（JSON）',
		name: 'transferListJson',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchTransferLicense'],
				transferListInputMode: ['json'],
			},
		},
		default: '[{"handover_userid":"OLD_USERID","takeover_userid":"NEW_USERID"}]',
		description: '1–1000 项的 JSON 数组。每项包含 handover_userid 和 takeover_userid',
	},
	{
		displayName: '上游/上级企业ID',
		name: 'fromCorpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchShareActiveCode'],
			},
		},
		default: '',
		description: '上游/上级企业corpid。上游/上级企业有共享该服务商的第三方应用或代开发应用给下游/下级企业',
	},
	{
		displayName: '下游/下级企业ID',
		name: 'toCorpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchShareActiveCode'],
			},
		},
		default: '',
		description: '下游/下级企业corpid。分配给下游/下级企业的激活码，当前未激活，且属于上游/上级企业的，且未分配给其他下游/下级企业',
	},
	{
		displayName: '激活码输入方式',
		name: 'shareListInputMode',
		type: 'options',
		displayOptions: {
			show: { resource: ['license'], operation: ['batchShareActiveCode'] },
		},
		options: [
			{ name: '逐项填写', value: 'form' },
			{ name: 'JSON 数组', value: 'json' },
		],
		default: 'form',
		description: '少量激活码可逐项填写；大批量激活码可直接提供 JSON 数组',
	},
	{
		displayName: '分配的接口许可列表',
		name: 'shareListCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchShareActiveCode'],
				shareListInputMode: ['form'],
			},
		},
		default: {},
		placeholder: '添加激活码',
		typeOptions: { multipleValues: true },
		description: '每次分配激活码不可超过1000个，且每次分配给下游/下级企业的激活码数不可超过上下游/企业互联通讯录中该下游企业人数的2倍',
		options: [
			{
				displayName: '激活码',
				name: 'codes',
				values: [
					{
						displayName: '激活码',
						name: 'activeCode',
						type: 'string',
						default: '',
						required: true,
						description: '分配的激活码',
					},
				],
			},
		],
	},
	{
		displayName: '分配的接口许可列表（JSON）',
		name: 'shareListJson',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchShareActiveCode'],
				shareListInputMode: ['json'],
			},
		},
		default: '[{"active_code":"ACTIVE_CODE"}]',
		description: '1–1000 项的 JSON 数组。每项包含 active_code',
	},
	{
		displayName: '分配场景（可选）',
		name: 'corpLinkType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['batchShareActiveCode'],
			},
		},
		options: [
			{
				name: '上下游',
				value: 0,
				description: '上下游',
			},
			{
				name: '企业互联',
				value: 1,
				description: '企业互联',
			},
		],
		default: 0,
		description: '分配的场景。不填默认为0（上下游）',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getAppLicenseInfo'],
			},
		},
		default: '',
		description: '企业必须已安装了该第三方应用或者代开发应用才允许调用',
	},
	{
		displayName: '套件ID',
		name: 'suiteId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getAppLicenseInfo'],
			},
		},
		default: '',
		description: '第三方应用或代开发应用的套件ID',
	},
	{
		displayName: '发送旧套件应用 ID',
		name: 'includeAppid',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getAppLicenseInfo'],
			},
		},
		default: false,
		description: '是否发送仅旧的多应用套件需要的 appid 字段；新开发者请保持关闭',
	},
	{
		displayName: '旧套件应用 ID',
		name: 'appid',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getAppLicenseInfo'],
				includeAppid: [true],
			},
		},
		default: 1,
		typeOptions: { minValue: 1, numberStepSize: 1 },
		description: '旧的多应用套件中的应用 ID',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['setAutoActiveStatus'],
			},
		},
		default: '',
		description: '要求服务商为企业购买过接口许可，购买指支付完成，购买并退款成功包括在内',
	},
	{
		displayName: '许可自动激活状态',
		name: 'autoActiveStatus',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['setAutoActiveStatus'],
			},
		},
		options: [
			{
				name: '关闭',
				value: 0,
				description: '关闭许可自动激活',
			},
			{
				name: '打开',
				value: 1,
				description: '打开许可自动激活',
			},
		],
		default: 1,
		description: '设置为自动激活后，对应授权企业的员工使用服务商应用时，接口许可表现为自动激活',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['getAutoActiveStatus'],
			},
		},
		default: '',
		description: '查询的企业corpid，要求服务商为企业购买过接口许可才有查询结果',
	},
	{
		displayName: '企业ID',
		name: 'corpid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['license'],
				operation: ['supportPolicyQuery'],
			},
		},
		default: '',
		description: '支持加密和非加密的corpid。查询的企业必须安装了服务商的第三方应用或者代开发应用。一个企业在30天内最多只能查询一次',
	},
];
