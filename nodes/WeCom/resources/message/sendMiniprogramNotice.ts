import type { INodeProperties } from 'n8n-workflow';

const showOnlySendMiniprogramNotice = {
	resource: ['message'],
	operation: ['sendMiniprogramNotice'],
};

export const sendMiniprogramNoticeDescription: INodeProperties[] = [
	{
		displayName: '接收人',
		name: 'touser',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '成员ID列表（消息接收者，多个接收者用 | 分隔，最多支持1000个）。特殊情况：指定为 @all，则向该企业应用的全部成员发送',
	},
	{
		displayName: '部门ID',
		name: 'toparty',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '部门ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '标签ID',
		name: 'totag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '标签ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '小程序appid',
		name: 'appid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '小程序appid，必须是与当前应用关联的小程序',
	},
	{
		displayName: '小程序page路径',
		name: 'page',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '点击消息卡片后的小程序页面，最长1024字节，仅限本小程序内的页面。该字段不填则消息点击后不跳转。',
	},
	{
		displayName: '消息标题',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '消息标题，长度限制4-12个汉字（支持id转译）',
	},
	{
		displayName: '消息描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		default: '',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '消息描述，长度限制4-12个汉字（支持id转译）',
	},
	{
		displayName: '是否放大第一个content_item',
		name: 'emphasis_first_item',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: 'Whether to emphasize the first content item',
	},
	{
		displayName: '消息内容键值对',
		name: 'content_items',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		placeholder: '添加内容项',
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: '消息内容键值对，最多允许10个item',
		options: [
			{
				displayName: '内容项',
				name: 'item',
				values: [
					{
						displayName: '长度10个汉字以内',
						name: 'key',
						type: 'string',
						required: true,
						default: '',
						description: '长度10个汉字以内',
					},
					{
						displayName: '长度30个汉字以内',
						name: 'value',
						type: 'string',
						required: true,
						default: '',
						description: '长度30个汉字以内（支持id转译）',
					},
				],
			},
		],
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: 'Whether to enable ID translation. 0 means no, 1 means yes, default is 0.',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMiniprogramNotice,
		},
		description: 'Whether to enable duplicate message check. 0 means no, 1 means yes, default is 0.',
	},
	{
		displayName: '重复消息检查时间',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendMiniprogramNotice,
				enable_duplicate_check: [true],
			},
		},
		description: '表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时',
	},
];

