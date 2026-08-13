import type { INodeProperties } from 'n8n-workflow';
import { getBillListDescription } from './getBillListDescription';

export const paytoolDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
			},
		},
		options: [
			{
				name: '[收银台] 创建收款订单',
				value: 'createOrder',
				description: '服务商可以使用该接口创建各种业务的收款订单',
				action: '创建收款订单',
			},
			{
				name: '[收银台] 取消收款订单',
				value: 'cancelOrder',
				description: '服务商可以使用该接口取消指定的收款订单',
				action: '取消收款订单',
			},
			{
				name: '[收银台] 获取收款订单列表',
				value: 'getOrderList',
				description: '服务商可以使用该接口查询指定时间段内创建的各种业务的收款订单列表',
				action: '获取收款订单列表',
			},
			{
				name: '[收银台] 获取收款订单详情',
				value: 'getOrderDetail',
				description: '服务商可以使用该接口查询指定收款订单的详情',
				action: '获取收款订单详情',
			},
			{
				name: '[收银台] 获取发票列表',
				value: 'getInvoiceList',
				description: '服务商可以使用该接口查询某个客户或某段时间内申请的应用订单发票列表',
				action: '获取发票列表',
			},
			{
				name: '[收银台] 标记开票状态',
				value: 'markInvoiceStatus',
				description: '服务商可以使用该接口标记某个应用订单发票的开票状态',
				action: '标记开票状态',
			},
			{
				name: '[收银台] 获取代支付流水',
				value: 'getBillList',
				description: '服务商可通过此接口获取使用量代付流水',
				action: '获取代支付流水',
			},
		],
		default: 'createOrder',
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
				resource: ['paytool'],
				operation: [
					'createOrder',
					'cancelOrder',
					'getOrderList',
					'getOrderDetail',
					'getInvoiceList',
					'markInvoiceStatus',
				],
			},
		},
		default: '',
		description: '应用服务商的接口调用凭证（provider_access_token），获取方法参见服务商的凭证',
	},
	{
		displayName: '收银台API调用密钥',
		name: 'paytoolSecret',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['createOrder', 'cancelOrder', 'getOrderList', 'getOrderDetail'],
			},
		},
		default: '',
		description: '收银台API调用密钥，用于签名。获取路径：工作台->企业微信服务商助手->工具->收银台->收银台API调用密钥',
	},
	{
		displayName: '业务类型',
		name: 'businessType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['createOrder'],
			},
		},
		options: [
			{
				name: '普通第三方应用',
				value: 1,
				description: '普通第三方应用',
			},
			{
				name: '代开发应用',
				value: 2,
				description: '代开发应用',
			},
			{
				name: '行业解决方案',
				value: 3,
				description: '行业解决方案',
			},
		],
		default: 1,
	},
	{
		displayName: '支付方式',
		name: 'payType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['createOrder'],
			},
		},
		options: [
			{
				name: '客户支付',
				value: 0,
				description: '客户支付',
			},
			{
				name: '服务商代支付',
				value: 1,
				description: '服务商代支付',
			},
			{
				name: '免支付',
				value: 2,
				description: '免支付',
			},
		],
		default: 0,
	},
	{
		displayName: '产品配置输入方式',
		name: 'productInputMode',
		type: 'options',
		displayOptions: {
			show: { resource: ['paytool'], operation: ['createOrder'] },
		},
		options: [
			{ name: '逐项填写', value: 'form' },
			{ name: 'JSON 对象', value: 'json' },
		],
		default: 'form',
		description: '少量应用可逐项填写；复杂产品和大批量购买可直接提供与接口一致的 product_list JSON',
	},
	{
		displayName: '产品配置（JSON）',
		name: 'productListJson',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['createOrder'],
				productInputMode: ['json'],
			},
		},
		default: '{"third_app":{"order_type":0,"buy_info_list":[{"suiteid":"SUITE_ID","edition_id":"EDITION_ID","user_count":1,"duration_days":31}],"notify_custom_corp":1}}',
		description: '按业务类型填写 third_app、customized_app 或 promotion_case；节点会执行与表单模式相同的完整校验',
	},
	{
		displayName: '客户企业 CorpID',
		name: 'customCorpid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['createOrder'],
			},
		},
		default: '',
		description: '可以不指定，不多于64字节。代开发应用必须指定',
	},
	{
		displayName: '银行收款回单素材 ID',
		name: 'bankReceiptMediaId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['createOrder'],
				payType: [1],
			},
		},
		default: '',
		description: '支付方式选择服务商代支付时，需上传企业已支付服务商订单费用的凭证。该ID即通过服务商上传临时素材上传文件后得到的media_id。支持图片(jpg/png/jpeg/bmp)、pdf）。注意调用上传素材接口时，需要指定参数attachment_type=3，专用于收银台',
	},
	{
		displayName: '订单创建人（可选）',
		name: 'creator',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['createOrder'],
			},
		},
		default: '',
		description: '订单创建人的userid。设置的创建人需要有收银台收款的权限，设置后，如果有「企业取消应用订单」、「应用订单确认失败提醒」的消息会推送给创建人；可与下方选择二选一',
	},
	{
		displayName: '订单创建人(选择)',
		name: 'creator_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['createOrder'],
			},
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	// 普通第三方应用相关参数
	{
		displayName: '第三方应用购买详情',
		name: 'thirdApp',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['createOrder'],
				businessType: [1],
				productInputMode: ['form'],
			},
		},
		default: {},
		typeOptions: {
			multipleValues: false,
		},
		options: [
			{
				displayName: '购买类型',
				name: 'orderType',
				type: 'options',
				required: true,
				options: [
					{
						name: '新购',
						value: 0,
						description: '新购',
					},
					{
						name: '扩容',
						value: 1,
						description: '扩容',
					},
					{
						name: '续期',
						value: 2,
						description: '续期',
					},
				],
				default: 0,
			},
			{
				displayName: '购买应用列表',
				name: 'buyInfoList',
				type: 'fixedCollection',
				required: true,
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: '添加应用',
				description: '可填充个数：1 ~ 20',
				options: [
					{
						displayName: '应用',
						name: 'apps',
						values: [
							{
								displayName: '套件ID',
								name: 'suiteid',
								type: 'string',
								required: true,
								default: '',
								description: '不多于64字节',
							},
							{
								displayName: '发送旧套件应用 ID',
								name: 'includeAppid',
								type: 'boolean',
								default: false,
								description: '是否发送仅旧的多应用套件需要的 appid 字段',
							},
							{
								displayName: '旧套件应用 ID',
								name: 'appid',
								type: 'number',
								required: true,
								displayOptions: { show: { includeAppid: [true] } },
								default: 1,
								typeOptions: { minValue: 1, numberStepSize: 1 },
								description: '应用 ID（仅旧套件应用需要填）',
							},
							{
								displayName: '版本号ID',
								name: 'editionId',
								type: 'string',
								required: true,
								default: '',
								description: '不多于64字节',
							},
							{
								displayName: '购买人数',
								name: 'userCount',
								type: 'number',
								default: 0,
								description: '应用的购买人数，单位人。当购买类型是新购或扩容，且购买的版本非固定总价类型时，需要填。注意对于扩容类型，表示增加的人数。取值范围：1 ~ 1000000',
								typeOptions: { minValue: 0, maxValue: 1000000, numberStepSize: 1 },
							},
							{
								displayName: '购买时长（天）',
								name: 'durationDays',
								type: 'number',
								default: 0,
								description: '应用的购买时长，单位天。当购买类型是新购或续期时必填。取值范围：1 ~ 1825',
								typeOptions: { minValue: 0, maxValue: 1825, numberStepSize: 1 },
							},
							{
								displayName: '生效日期',
								name: 'takeEffectDate',
								type: 'string',
								default: '',
								description: '生效日期，格式如：20221212。只能是当天之后的日期，最迟不能超过一年。不填表示立即生效。不多于8字节',
							},
							{
								displayName: '优惠信息',
								name: 'discountInfo',
								type: 'fixedCollection',
								default: {},
								typeOptions: {
									multipleValues: false,
								},
								options: [
									{
										displayName: '优惠类型',
										name: 'discountType',
										type: 'options',
										required: true,
										options: [
											{
												name: '固定优惠',
												value: 1,
												description: '固定优惠',
											},
											{
												name: '价格折扣',
												value: 2,
												description: '价格折扣',
											},
										],
										default: 1,
									},
									{
										displayName: '优惠金额（分）',
										name: 'discountAmount',
										type: 'number',
										default: 0,
										description: '优惠金额，单位分',
										typeOptions: { minValue: 0, maxValue: 10000000, numberStepSize: 1 },
									},
									{
										displayName: '优惠折扣（%）',
										name: 'discountRatio',
										type: 'number',
										default: 0,
										description: '优惠折扣，单位%，如填75，表示75%优惠价，即7.5折',
										typeOptions: { minValue: 0, maxValue: 99, numberStepSize: 1 },
									},
									{
										displayName: '优惠原因',
										name: 'discountRemarks',
										type: 'string',
										required: true,
										default: '',
									},
								],
							},
						],
					},
				],
			},
			{
				displayName: '是否推送确认提醒',
				name: 'notifyCustomCorp',
				type: 'options',
				options: [
					{
						name: '否',
						value: 0,
					},
					{
						name: '是',
						value: 1,
					},
				],
				default: 1,
			},
		],
	},
	// 代开发应用相关参数
	{
		displayName: '代开发应用购买详情',
		name: 'customizedApp',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['createOrder'],
				businessType: [2],
				productInputMode: ['form'],
			},
		},
		default: {},
		typeOptions: {
			multipleValues: false,
		},
		options: [
			{
				displayName: '购买类型',
				name: 'orderType',
				type: 'options',
				required: true,
				options: [
					{
						name: '新购',
						value: 0,
						description: '新购',
					},
					{
						name: '扩容',
						value: 1,
						description: '扩容',
					},
					{
						name: '续期',
						value: 2,
						description: '续期',
					},
				],
				default: 0,
			},
			{
				displayName: '购买应用列表',
				name: 'buyInfoList',
				type: 'fixedCollection',
				required: true,
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: '添加应用',
				options: [
					{
						displayName: '应用',
						name: 'apps',
						values: [
							{
								displayName: '套件ID',
								name: 'suiteid',
								type: 'string',
								required: true,
								default: '',
								description: '不多于64字节',
							},
							{
								displayName: '应用总价（分）',
								name: 'totalPrice',
								type: 'number',
								required: true,
								default: 0,
								description: '应用总价，单位分。需大于0且不能超过500万',
								typeOptions: { minValue: 1, maxValue: 5000000, numberStepSize: 1 },
							},
							{
								displayName: '购买人数',
								name: 'userCount',
								type: 'number',
								default: 0,
								description: '应用的购买人数，单位人。当购买类型是新购或扩容时需要填。注意对于扩容类型，表示增加的人数。取值范围：1 ~ 1000000',
								typeOptions: { minValue: 0, maxValue: 1000000, numberStepSize: 1 },
							},
							{
								displayName: '购买时长（天）',
								name: 'durationDays',
								type: 'number',
								default: 0,
								description: '应用的购买时长，单位天。当购买类型是新购或续期时必填。取值范围：1 ~ 1825',
								typeOptions: { minValue: 0, maxValue: 1825, numberStepSize: 1 },
							},
							{
								displayName: '生效日期',
								name: 'takeEffectDate',
								type: 'string',
								default: '',
								description: '生效日期，格式如：20221212。新购选填，不填默认生效日期为当天。扩容不填，默认生效日期为当天。续期不填，默认生效日期为原生效版本结束日期。从生效日期当天开始计算购买时长。最迟不能超过一年。不多于8字节',
							},
						],
					},
				],
			},
			{
				displayName: '是否推送确认提醒',
				name: 'notifyCustomCorp',
				type: 'options',
				options: [
					{
						name: '否',
						value: 0,
					},
					{
						name: '是',
						value: 1,
					},
				],
				default: 1,
			},
		],
	},
	// 行业解决方案相关参数
	{
		displayName: '行业解决方案购买详情',
		name: 'promotionCase',
		type: 'fixedCollection',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['createOrder'],
				businessType: [3],
				productInputMode: ['form'],
			},
		},
		default: {},
		typeOptions: {
			multipleValues: false,
		},
		options: [
			{
				displayName: '购买类型',
				name: 'orderType',
				type: 'options',
				required: true,
				options: [
					{
						name: '新购',
						value: 0,
						description: '新购',
					},
					{
						name: '扩容',
						value: 1,
						description: '扩容',
					},
					{
						name: '续期',
						value: 2,
						description: '续期',
					},
				],
				default: 0,
			},
			{
				displayName: '行业方案ID',
				name: 'caseId',
				type: 'string',
				required: true,
				default: '',
			},
			{
				displayName: '行业方案版本名',
				name: 'promotionEditionName',
				type: 'string',
				required: true,
				default: '',
			},
			{
				displayName: '购买时长（天）',
			name: 'durationDays',
			type: 'number',
			default: 0,
			description: '应用的购买时长，单位天',
			typeOptions: { minValue: 0, maxValue: 1825, numberStepSize: 1 },
			},
			{
				displayName: '生效日期',
				name: 'takeEffectDate',
				type: 'string',
				default: '',
				description: '生效日期，格式如：20221212',
			},
			{
				displayName: '购买应用列表',
				name: 'buyInfoList',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				placeholder: '添加应用',
				options: [
					{
						displayName: '应用',
						name: 'apps',
						values: [
							{
								displayName: '套件ID',
								name: 'suiteid',
								type: 'string',
								required: true,
								default: '',
								description: '不多于64字节',
							},
							{
								displayName: '发送旧套件应用 ID',
								name: 'includeAppid',
								type: 'boolean',
								default: false,
								description: '是否发送仅旧的多应用套件需要的 appid 字段',
							},
							{
								displayName: '旧套件应用 ID',
								name: 'appid',
								type: 'number',
								required: true,
								displayOptions: { show: { includeAppid: [true] } },
								default: 1,
								typeOptions: { minValue: 1, numberStepSize: 1 },
								description: '应用 ID（仅旧套件应用需要填）',
							},
							{
								displayName: '购买人数',
								name: 'userCount',
								type: 'number',
								default: 0,
								description: '应用的购买人数，单位人。当购买类型是新购或扩容，且购买的版本非固定总价类型时，需要填。注意对于扩容类型，表示增加的人数。取值范围：1 ~ 1000000',
								typeOptions: { minValue: 0, maxValue: 1000000, numberStepSize: 1 },
							},
						],
					},
				],
			},
			{
				displayName: '是否推送确认提醒',
				name: 'notifyCustomCorp',
				type: 'options',
				options: [
					{
						name: '否',
						value: 0,
					},
					{
						name: '是',
						value: 1,
					},
				],
				default: 1,
			},
		],
	},
	// 取消收款订单相关参数
	{
		displayName: '收款订单号',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['cancelOrder'],
			},
		},
		default: '',
		description: '收款订单号，不多于64字节',
	},
	// 获取收款订单列表相关参数
	{
		displayName: '分页数量',
		name: 'limit',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['getOrderList'],
			},
		},
		default: 100,
		description: '预期请求的数据量。取值范围：1 ~ 2000',
		typeOptions: {
			minValue: 1,
			maxValue: 2000,
			numberStepSize: 1,
		},
	},
	{
		displayName: '业务类型',
		name: 'businessType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['getOrderList'],
			},
		},
		options: [
			{
				name: '全部业务类型',
				value: 0,
				description: '不发送 business_type，返回全部业务类型',
			},
			{
				name: '普通第三方应用',
				value: 1,
				description: '普通第三方应用',
			},
			{
				name: '代开发应用',
				value: 2,
				description: '代开发应用',
			},
			{
				name: '行业解决方案',
				value: 3,
				description: '行业解决方案',
			},
		],
		default: 0,
	},
	{
		displayName: '起始时间',
		name: 'startTime',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['getOrderList'],
			},
		},
		default: '',
		description: 'Unix时间戳（秒）',
	},
	{
		displayName: '结束时间',
		name: 'endTime',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['getOrderList'],
			},
		},
		default: '',
		description: 'Unix时间戳（秒）',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['getOrderList'],
			},
		},
		default: '',
		description: '用于分页查询的游标。字符串类型，由上一次调用返回，首次调用不填',
	},
	// 获取收款订单详情相关参数
	{
		displayName: '订单号',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['getOrderDetail'],
			},
		},
		default: '',
		description: '收款订单号',
	},
	// 获取发票列表相关参数
	{
		displayName: '开始时间',
		name: 'startTime',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['getInvoiceList'],
			},
		},
		default: '',
		description: '开始时间（申请时间），unix时间戳（秒）。不能单独指定该字段，start_time和end_time必须同时指定',
	},
	{
		displayName: '结束时间',
		name: 'endTime',
		type: 'dateTime',
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['getInvoiceList'],
			},
		},
		default: '',
		description: '结束时间（申请时间），unix时间戳（秒）。不能单独指定该字段，start_time和end_time必须同时指定',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['getInvoiceList'],
			},
		},
		default: '',
		description: '用于分页查询的游标。字符串类型，由上一次调用返回，首次调用可不填',
	},
	{
		displayName: '返回最大记录数',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['getInvoiceList'],
			},
		},
		default: 50,
		description: '返回的最大记录数。整型，最大值100，默认值50',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
			numberStepSize: 1,
		},
	},
	// 标记开票状态相关参数
	{
		displayName: '订单号',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['markInvoiceStatus'],
			},
		},
		default: '',
		description: '要标记开票状态的订单号',
	},
	{
		displayName: '操作人userid',
		name: 'operUserid',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['markInvoiceStatus'],
			},
		},
		default: '',
		description: '标记开票状态的操作人。操作人需要有「收银台-发票管理」的权限；可与下方选择二选一',
	},
	{
		displayName: '操作人(选择)',
		name: 'operUserid_selected',
		type: 'options',
		typeOptions: { loadOptionsMethod: 'getAllUsers' },
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['markInvoiceStatus'],
			},
		},
		default: '',
		description: '与上方字符串二选一；均填写时以字符串为准',
	},
	{
		displayName: '开票状态',
		name: 'invoiceStatus',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['markInvoiceStatus'],
			},
		},
		options: [
			{
				name: '已开具纸质发票，并邮寄给客户',
				value: 1,
				description: '已开具纸质发票，并邮寄给客户',
			},
			{
				name: '已开具电子发票，并发送至客户邮箱',
				value: 2,
				description: '已开具电子发票，并发送至客户邮箱',
			},
			{
				name: '取消开具发票',
				value: 3,
				description: '取消开具发票，取消后企业可再次申请',
			},
		],
		default: 1,
		description: '要标记的开票状态。若订单对应开票状态为已开票，此次标记将不生效',
	},
	{
		displayName: '开票备注',
		name: 'invoiceNote',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['paytool'],
				operation: ['markInvoiceStatus'],
			},
		},
		default: '',
		description: '填写开票备注，例如发票邮寄单号等，客户侧可见。不超过200字节',
	},
	...getBillListDescription,
];
