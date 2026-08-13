import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSyncMsg = {
	resource: ['kf'],
	operation: ['syncMsg'],
};

export const syncMsgDescription: INodeProperties[] = [
	{
		displayName: '客服账号',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForSyncMsg,
		},
		default: '',
		description: '指定拉取消息的客服账号。接口仅可读取最近 3 天内的消息和事件。<a href="https://developer.work.weixin.qq.com/document/path/94670" target="_blank">官方文档</a>',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForSyncMsg,
		},
		default: '',
		description: '上一次调用返回的 next_cursor，最多 64 字节。首次可留空；建议持久化保存并结合 has_more 判断是否继续拉取。<a href="https://developer.work.weixin.qq.com/document/path/94670" target="_blank">官方文档</a>',
		placeholder: '',
	},
	{
		displayName: 'Token',
		name: 'token',
		type: 'string',
		typeOptions: { password: true },
		displayOptions: {
			show: showOnlyForSyncMsg,
		},
		default: '',
		description: '回调事件返回的 token，最多 128 字节且 10 分钟内有效。不填写时接口有严格频率限制。<a href="https://developer.work.weixin.qq.com/document/path/94670" target="_blank">官方文档</a>',
		placeholder: '',
	},
	{
		displayName: '拉取条数',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: showOnlyForSyncMsg,
		},
		default: 1000,
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
			numberStepSize: 1,
		},
		description: '期望拉取的消息数量，默认及最大均为 1000；返回条数可能更少，必须结合 has_more 判断。<a href="https://developer.work.weixin.qq.com/document/path/94670" target="_blank">官方文档</a>',
	},
	{
		displayName: '语音格式',
		name: 'voice_format',
		type: 'options',
		displayOptions: {
			show: showOnlyForSyncMsg,
		},
		options: [
			{
				name: 'AMR',
				value: 0,
			},
			{
				name: 'SILK',
				value: 1,
			},
		],
		default: 0,
		description: '可选。语音消息类型，0-AMR格式 1-SILK格式，默认0。<a href="https://developer.work.weixin.qq.com/document/path/94670" target="_blank">官方文档</a>',
	},
	{
		displayName: '解析消息类型',
		name: 'parse_message_types',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSyncMsg,
		},
		default: false,
		description: '是否额外添加 parsed_content 和 event_type 辅助字段；原始消息字段始终保留',
	},
];
