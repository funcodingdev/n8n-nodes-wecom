import type { INodeProperties } from 'n8n-workflow';

const showOnlySendMpNews = {
	resource: ['message'],
	operation: ['sendMpNews'],
};

export const sendMpNewsDescription: INodeProperties[] = [
	{
		displayName: '接收人',
		name: 'touser',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendMpNews,
		},
		description: '成员ID列表（消息接收者，多个接收者用 | 分隔，最多支持1000个）。特殊情况：指定为 @all，则向该企业应用的全部成员发送',
	},
	{
		displayName: '部门ID',
		name: 'toparty',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendMpNews,
		},
		description: '部门ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '标签ID',
		name: 'totag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendMpNews,
		},
		description: '标签ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '图文列表',
		name: 'articles',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		placeholder: '添加图文',
		displayOptions: {
			show: showOnlySendMpNews,
		},
		description: 'Mpnews类型的图文消息，一个图文消息支持1到8条图文',
		options: [
			{
				displayName: '图文',
				name: 'article',
				values: [
					{
						displayName: '作者',
						name: 'author',
						type: 'string',
						default: '',
						description: '图文消息的作者，不超过64个字节',
					},
					{
						displayName: '图文消息点击\'阅读原文\'之后的页面链接',
						name: 'content_source_url',
						type: 'string',
						default: '',
					},
					{
						displayName: '图文消息的内容',
						name: 'content',
						type: 'string',
							required:	true,
						default: '',
						description: '图文消息的内容，支持html标签，不超过666 K个字节',
					},
					{
						displayName: '图文消息的描述',
						name: 'digest',
						type: 'string',
						default: '',
						description: '图文消息的描述，不超过512个字节，超过会自动截断',
					},
					{
						displayName: '图文消息缩略图的Media_id',
						name: 'thumb_media_id',
						type: 'string',
							required:	true,
						default: '',
						description: '图文消息缩略图的media_id，可以在上传多媒体文件接口中获得。此处thumb_media_id即上传接口返回的media_id',
					},
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
							required:	true,
						default: '',
						description: '标题，不超过128个字节，超过会自动截断',
					},
				],
			},
		],
	},
	{
		displayName: '安全保密消息',
		name: 'safe',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMpNews,
		},
		description: 'Whether this is a confidential message. 0 means no, 1 means yes, default is 0.',
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMpNews,
		},
		description: 'Whether to enable ID translation. 0 means no, 1 means yes, default is 0.',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMpNews,
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
				...showOnlySendMpNews,
				enable_duplicate_check: [true],
			},
		},
		description: '表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时',
	},
];

