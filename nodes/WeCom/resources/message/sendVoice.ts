import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendVoice = {
	resource: ['message'],
	operation: ['sendVoice'],
};

export const sendVoiceDescription: INodeProperties[] = [
	...getRecipientFields('sendVoice'),
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
		hint: '保密消息，开启后消息不可转发、复制等',
		description: 'Whether this is a confidential message',
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendVoice,
		},
		hint: '开启后会将消息中的userid转为@对应成员',
		description: 'Whether to enable ID translation',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendVoice,
		},
		hint: '开启后在时间间隔内相同内容的消息不会重复发送',
		description: 'Whether to enable duplicate message check',
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

