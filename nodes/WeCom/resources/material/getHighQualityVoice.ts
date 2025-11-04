import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetVoice = {
	resource: ['material'],
	operation: ['getHighQualityVoice'],
};

export const getHighQualityVoiceDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'media_ID',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetVoice,
		},
		default: '',
		description: '通过JSSDK的uploadVoice接口上传的语音文件ID。',
		hint: '语音文件Media ID',
	},
	{
		displayName: '下载到二进制属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: showOnlyForGetVoice,
		},
		description: '将下载的高清语音文件存储到的二进制属性名称',
	},
];

