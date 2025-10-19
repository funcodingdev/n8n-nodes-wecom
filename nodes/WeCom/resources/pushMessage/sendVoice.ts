import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendVoice = {
	resource: ['pushMessage'],
	operation: ['sendVoice'],
};

export const sendVoiceDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendVoice,
		},
		default: '',
		required: true,
		description: '语音文件的 media_ID',
		hint: '通过上传临时素材接口获取，格式为AMR或SILK，大小不超过2M',
	},
];

