import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReplyStream = {
	resource: ['aibotPassiveReply'],
	operation: ['replyMessage'],
	replyType: ['stream'],
};

export const replyStreamDescription: INodeProperties[] = [
	{
		displayName: '流式消息 ID',
		name: 'stream_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyStream,
		},
		default: '',
		placeholder: '例如：stream_weather_001',
		description: '首次回复必填；流式刷新回调可留空并自动沿用回调中的 stream.id',
	},
	{
		displayName: '是否结束',
		name: 'finish',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForReplyStream,
		},
		default: false,
		description: '是否结束流式消息；关闭表示继续，开启表示结束',
	},
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: showOnlyForReplyStream,
		},
		default: '',
		placeholder: '**广州**今日天气：29度，大部分多云',
		description: '流式消息内容，最长 20480 字节，必须是 UTF-8 编码，支持 Markdown；后续回复会替换此前内容',
	},
	{
		displayName: '图片列表',
		name: 'msg_item',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				...showOnlyForReplyStream,
				finish: [true],
			},
		},
		default: {},
		placeholder: '添加图片',
		description: '图文混排图片列表，仅在结束流式消息时发送，最多 10 张',
		options: [
			{
				name: 'image',
				displayName: '图片',
				values: [
					{
						displayName: 'Base64 编码',
						name: 'base64',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						placeholder: 'iVBORw0KGgoAAAANSUhEUgAA...',
						required: true,
						description: '图片的 Base64 编码；原图最大 10 MB，仅支持 JPG、PNG',
					},
					{
						displayName: 'MD5 值',
						name: 'md5',
						type: 'string',
						default: '',
						placeholder: 'd41d8cd98f00b204e9800998ecf8427e',
						required: true,
						description: '原始图片内容的 32 位十六进制 MD5 值',
					},
				],
			},
		],
	},
	{
		displayName: '反馈 ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyStream,
		},
		default: '',
		placeholder: '例如：feedback_weather_001',
		description: '仅在首次回复时设置；非空时用户反馈会触发回调，最长 256 字节（UTF-8）',
	},
];
