import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendVoice = {
	resource: ['appChat'],
	operation: ['sendVoice'],
};

export const sendVoiceDescription: INodeProperties[] = [
	{
		displayName: '群聊ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendVoice,
		},
		default: '',
		placeholder: 'mychat001',
		required: true,
		description:
			'群聊的唯一标识，必须是该应用所创建的群。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
	},
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendVoice,
		},
		default: '',
		placeholder: 'MEDIA_ID',
		required: true,
		description:
			'语音文件ID，可以调用上传临时素材接口获取。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
	},
];
