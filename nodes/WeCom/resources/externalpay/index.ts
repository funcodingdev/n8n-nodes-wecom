import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalpay'] };

export const externalpayDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: showOnly },
		options: [
			{
				name: '[商户号] 查询商户号详情',
				value: 'getMerchant',
				action: '查询商户号详情',
				description: 'externalpay/getmerchant',
			},
			{
				name: '[商户号] 设置商户号使用范围',
				value: 'setMchUseScope',
				action: '设置商户号使用范围',
				description: 'externalpay/set_mch_use_scope',
			},
			{
				name: '[收款] 获取对外收款记录',
				value: 'getBillList',
				action: '获取对外收款记录',
				description: 'externalpay/get_bill_list',
			},
			{
				name: '[收款] 获取收款项目商户单号',
				value: 'getPaymentInfo',
				action: '获取收款项目商户单号',
				description: 'externalpay/get_payment_info',
			},
			{
				name: '[资金] 获取资金流水',
				value: 'getFundFlow',
				action: '获取资金流水',
				description: 'externalpay/get_fund_flow',
			},
		],
		default: 'getBillList',
	},
	{
		displayName: '说明',
		name: 'corpPayNotice',
		type: 'notice',
		displayOptions: { show: showOnly },
		default: '',
		description:
			'本资源覆盖企业微信 OpenAPI 对外收款（/cgi-bin/externalpay/*）。企业红包、向员工付款走微信支付商户平台 XML 接口（api.mch.weixin.qq.com，需商户证书与双重签名），与当前 weComApi 凭证模型不同，暂不封装。小程序进件见「小程序对外收款」apply_mch。',
	},
	// getMerchant / setMchUseScope
	{
		displayName: '商户号',
		name: 'mch_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: { ...showOnly, operation: ['getMerchant', 'setMchUseScope'] },
		},
		default: '',
		description:
			'微信支付商户号 mch_id。<a href="https://developer.work.weixin.qq.com/document/path/93666" target="_blank">官方文档</a>',
	},
	{
		displayName: '商户号',
		name: 'mch_id',
		type: 'string',
		displayOptions: {
			show: { ...showOnly, operation: ['getFundFlow'] },
		},
		default: '',
		description: '商户号 ID，不填则拉取所有商户号的资金流水',
	},

	{
		displayName: '使用范围成员',
		name: 'scope_users',
		type: 'string',
		displayOptions: { show: { ...showOnly, operation: ['setMchUseScope'] } },
		default: '',
		placeholder: 'zhangsan,lisi',
		description: 'allow_use_scope.user，逗号分隔',
	},
	{
		displayName: '使用范围部门',
		name: 'scope_partyids',
		type: 'string',
		displayOptions: { show: { ...showOnly, operation: ['setMchUseScope'] } },
		default: '',
		placeholder: '1,2',
		description: 'allow_use_scope.partyid，逗号分隔',
	},
	{
		displayName: '使用范围标签',
		name: 'scope_tagids',
		type: 'string',
		displayOptions: { show: { ...showOnly, operation: ['setMchUseScope'] } },
		default: '',
		placeholder: '1,2',
		description: 'allow_use_scope.tagid，逗号分隔',
	},
	// getBillList / getFundFlow
	{
		displayName: '开始时间',
		name: 'begin_time',
		type: 'number',
		required: true,
		displayOptions: {
			show: { ...showOnly, operation: ['getBillList', 'getFundFlow'] },
		},
		default: 0,
		description: '开始时间戳（秒）',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'number',
		required: true,
		displayOptions: {
			show: { ...showOnly, operation: ['getBillList', 'getFundFlow'] },
		},
		default: 0,
		description: '结束时间戳（秒），与开始时间间隔不超过约 1 个月',
	},
	{
		displayName: '收款成员UserID',
		name: 'payee_userid',
		type: 'string',
		displayOptions: { show: { ...showOnly, operation: ['getBillList'] } },
		default: '',
		description: '企业收款成员 userid，不填则为全部成员',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: { ...showOnly, operation: ['getBillList', 'getFundFlow'] },
		},
		default: '',
		description: '分页游标 cursor',
	},
	{
		displayName: '条数限制',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: { ...showOnly, operation: ['getBillList', 'getFundFlow'] },
		},
		default: 10,
		description: '最大记录数；收款记录最大 1000，资金流水最大 200',
	},
	// getPaymentInfo
	{
		displayName: '收款项目单号',
		name: 'payment_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, operation: ['getPaymentInfo'] } },
		default: '',
		description:
			'payment_id，发起对外收款返回。<a href="https://developer.work.weixin.qq.com/document/path/95944" target="_blank">官方文档</a>',
	},
];
