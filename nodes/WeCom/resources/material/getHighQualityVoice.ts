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
];

