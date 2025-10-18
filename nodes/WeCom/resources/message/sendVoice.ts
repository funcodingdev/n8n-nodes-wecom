import type { INodeProperties } from 'n8n-workflow';

const showOnlySendVoice = {
	resource: ['message'],
	operation: ['sendVoice'],
};

export const sendVoiceDescription: INodeProperties[] = [
	{
		displayName: '接收人',
		name: 'touser',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendVoice,
		},
		description: '成员ID列表（消息接收者，多个接收者用 | 分隔，最多支持1000个）。特殊情况：指定为 @all，则向该企业应用的全部成员发送',
	},
	{
		displayName: '部门ID',
		name: 'toparty',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendVoice,
		},
		description: '部门ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '标签ID',
		name: 'totag',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlySendVoice,
		},
		description: '标签ID列表，多个接收者用 | 分隔，最多支持100个。当touser为@all时忽略本参数',
	},
	{
		displayName: '语音来源',
		name: 'voiceSource',
		type: 'options',
		options: [
			{
				name: '使用已有Media ID',
				value: 'mediaId',
			},
			{
				name: '上传语音文件',
				value: 'upload',
			},
		],
		default: 'upload',
		displayOptions: {
			show: showOnlySendVoice,
		},
		description: '选择语音来源方式',
	},
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlySendVoice,
				voiceSource: ['mediaId'],
			},
		},
		description: '语音文件的media_id，可以调用上传临时素材接口获取',
	},
	{
		displayName: '二进制属性名',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				...showOnlySendVoice,
				voiceSource: ['upload'],
			},
		},
		description: '包含语音文件的输入字段名称',
	},
	{
		displayName: '安全保密消息',
		name: 'safe',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendVoice,
		},
		description: 'Whether this is a confidential message. 0 means no, 1 means yes, default is 0.',
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendVoice,
		},
		description: 'Whether to enable ID translation. 0 means no, 1 means yes, default is 0.',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendVoice,
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
				...showOnlySendVoice,
				enable_duplicate_check: [true],
			},
		},
		description: '表示是否重复消息检查的时间间隔，默认1800s，最大不超过4小时',
	},
];

