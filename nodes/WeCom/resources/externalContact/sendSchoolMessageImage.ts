import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendSchoolMessageImage = {
	resource: ['externalContact'],
	operation: ['sendSchoolMessage'],
	msgtype: ['image'],
};

export const sendSchoolMessageImageDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessageImage,
		},
		default: '',
		placeholder: 'MEDIA_ID',
		required: true,
		description: '图片媒体文件ID，可以调用上传临时素材接口获取。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>',
	},
];
