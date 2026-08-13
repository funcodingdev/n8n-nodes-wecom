import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendVideo = {
	resource: ['appChat'],
	operation: ['sendVideo'],
};

export const sendVideoDescription: INodeProperties[] = [
	{
		displayName: '群聊ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendVideo,
		},
		default: '',
		placeholder: 'mychat001',
		required: true,
		description:
			'群聊的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
	},
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendVideo,
		},
		default: '',
		placeholder: 'MEDIA_ID',
		required: true,
		description:
			'视频媒体文件ID，可以调用上传临时素材接口获取。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
	},
	{
		displayName: '标题',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendVideo,
		},
		default: '',
		placeholder: '视频标题',
		description:
			'可选。视频消息的标题，不超过128个字节，超过会自动截断。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
	},
	{
		displayName: '描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: showOnlyForSendVideo,
		},
		default: '',
		placeholder: '视频描述',
		description:
			'可选。视频消息的描述，不超过512个字节，超过会自动截断。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
	},
	{
		displayName: '保密消息',
		name: 'safe',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendVideo,
		},
		default: false,
		description:
			'可选。表示是否是保密消息，0表示否，1表示是，默认0。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
	},
];
