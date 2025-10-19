import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendFile = {
	resource: ['pushMessage'],
	operation: ['sendFile'],
};

export const sendFileDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendFile,
		},
		default: '',
		required: true,
		description: '文件的 media_ID',
		hint: '通过上传临时素材接口获取',
	},
];

