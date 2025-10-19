import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendImage = {
	resource: ['appChat'],
	operation: ['sendImage'],
};

export const sendImageDescription: INodeProperties[] = [
	{
		displayName: '群聊ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendImage,
		},
		default: '',
		required: true,
		description: '群聊的唯一标识',
		hint: '群聊会话的 chatid',
	},
	{
		displayName: '图片来源',
		name: 'imageSource',
		type: 'options',
		displayOptions: {
			show: showOnlyForSendImage,
		},
		options: [
			{
				name: '使用 Media ID',
				value: 'mediaId',
			},
			{
				name: '上传二进制文件',
				value: 'binary',
			},
		],
		default: 'binary',
		description: '选择图片来源方式',
		hint: '可以直接提供 media_id 或上传二进制文件',
	},
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendImage,
				imageSource: ['mediaId'],
			},
		},
		default: '',
		required: true,
		description: '图片的 media_id',
		hint: '通过素材管理接口上传图片获得',
	},
	{
		displayName: '二进制属性',
		name: 'binaryPropertyName',
		type: 'string',
		displayOptions: {
			show: {
				...showOnlyForSendImage,
				imageSource: ['binary'],
			},
		},
		default: 'data',
		required: true,
		description: '包含图片数据的二进制属性名',
		hint: '存储图片文件的二进制属性',
	},
	{
		displayName: '保密消息',
		name: 'safe',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendImage,
		},
		default: false,
		description: 'Whether the message is confidential',
		hint: '保密消息会话中的消息在发送后不会显示在聊天记录中',
	},
];

