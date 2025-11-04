import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSyncMsg = {
	resource: ['kf'],
	operation: ['syncMsg'],
};

export const syncMsgDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
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
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		hint: '客服账号',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForSyncMsg,
		},
		default: '',
		description: '上一次调用的next_cursor，第一次拉取可以不填。持久化保存游标可以实现增量拉取。',
		hint: '增量拉取的游标，第一次可不填',
	},
	{
		displayName: 'Token',
		name: 'token',
		type: 'string',
		displayOptions: {
			show: showOnlyForSyncMsg,
		},
		default: '',
		description: '回调事件返回的token字段，10分钟内有效。可选，如果不填接口有严格的频率限制。',
		hint: '回调事件的token，可选',
	},
	{
		displayName: '拉取条数',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: showOnlyForSyncMsg,
		},
		default: 100,
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		description: '期望请求的数据量，默认100，最大1000。实际返回可能小于设定值。',
		hint: '期望拉取的消息数量，最大1000',
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
		description: '语音消息类型，0-Amr 1-Silk，默认0。可根据需求选择合适的语音格式。',
		hint: '语音消息的格式',
	},
	{
		displayName: '解析消息类型',
		name: 'parse_message_types',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSyncMsg,
		},
		default: true,
		description: '是否自动解析并展开不同的消息类型到单独的字段，便于后续处理',
		hint: '自动解析消息类型',
	},
];
