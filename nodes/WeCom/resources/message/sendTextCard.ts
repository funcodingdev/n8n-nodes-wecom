import type { INodeProperties } from 'n8n-workflow';

const showOnlySendTextCard = {
	resource: ['message'],
	operation: ['sendTextCard'],
};

export const sendTextCardDescription: INodeProperties[] = [
	{
		displayName: '接收人',
		name: 'touser',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description: '成员ID列表（消息接收者，多个接收者用 | 分隔，最多支持1000个）。特殊情况：指定为 @all，则向该企业应用的全部成员发送',
	},
	{
		displayName: '部门ID',
		name: 'toparty',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description: '部门ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '标签ID',
		name: 'totag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description: '标签ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '卡片标题',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description: '标题，不超过128个字节，超过会自动截断',
	},
	{
		displayName: '卡片描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description: '描述，不超过512个字节，超过会自动截断',
	},
	{
		displayName: '跳转链接',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description: '点击后跳转的链接。最长2048字节，请确保包含了协议头(http/https)',
	},
	{
		displayName: '按钮文字',
		name: 'btntxt',
		type: 'string',
		default: '详情',
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description: '按钮文字。默认为"详情"，不超过4个文字，超过自动截断',
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description: 'Whether to enable ID translation. 0 means no, 1 means yes, default is 0.',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendTextCard,
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
				...showOnlySendTextCard,
				enable_duplicate_check: [true],
			},
		},
		description: '表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时',
	},
];

