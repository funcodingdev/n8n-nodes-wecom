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
		description: '客服账号的唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/94670" target="_blank">官方文档</a>.',
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
		description: '可选。上一次调用返回的next_cursor，第一次拉取可以不填。持久化保存游标可以实现增量拉取。<a href="https://developer.work.weixin.qq.com/document/path/94670" target="_blank">官方文档</a>',
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
		description: '可选。回调事件返回的token字段，10分钟内有效。如果不填接口有严格的频率限制。<a href="https://developer.work.weixin.qq.com/document/path/94670" target="_blank">官方文档</a>',
		placeholder: '',
	},
	{
		displayName: '拉取条数',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: showOnlyForSyncMsg,
		},
		default: 50,
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		description: '可选。期望拉取的消息数量，取值范围1~1000，默认50。<a href="https://developer.work.weixin.qq.com/document/path/94670" target="_blank">官方文档</a>',
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
		description: '是否自动解析消息类型，方便在n8n中处理不同类型的消息。<a href="https://developer.work.weixin.qq.com/document/path/94670" target="_blank">官方文档</a>',
	},
];
