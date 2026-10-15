import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendSchoolMessageVideo = {
	resource: ['externalContact'],
	operation: ['sendSchoolMessage'],
	msgtype: ['video'],
};

export const sendSchoolMessageVideoDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessageVideo,
		},
		default: '',
		placeholder: 'MEDIA_ID',
		required: true,
		description: '视频媒体文件ID，可以调用上传临时素材接口获取',
	},
	{
		displayName: '标题',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessageVideo,
		},
		default: '',
		placeholder: '视频标题',
		description:
			'可选。视频消息的标题，不超过128个字节，超过会自动截断。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>',
	},
	{
		displayName: '描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		displayOptions: {
			show: showOnlyForSendSchoolMessageVideo,
		},
		default: '',
		placeholder: '视频描述',
		description:
			'可选。视频消息的描述，不超过512个字节，超过会自动截断。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>',
	},
];
