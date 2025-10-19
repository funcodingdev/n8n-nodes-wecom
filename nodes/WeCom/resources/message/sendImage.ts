import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendImage = {
	resource: ['message'],
	operation: ['sendImage'],
};

export const sendImageDescription: INodeProperties[] = [
	...getRecipientFields('sendImage'),
	{
		displayName: '图片来源',
		name: 'imageSource',
		type: 'options',
		required: true,
		default: 'mediaId',
		displayOptions: {
			show: showOnlySendImage,
		},
		options: [
			{
				name: 'Media ID',
				value: 'mediaId',
				description: '使用已上传的 Media ID',
			},
			{
				name: '上传文件',
				value: 'upload',
				description: '从输入数据中上传图片文件',
			},
		],
	},
	{
		displayName: 'Media ID',
		name: 'media_ID',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlySendImage,
				imageSource: ['mediaId'],
			},
		},
		description: '图片媒体文件ID，可以调用上传临时素材接口获取',
	},
	{
		displayName: '输入数据字段名',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				...showOnlySendImage,
				imageSource: ['upload'],
			},
		},
		description: '包含图片文件数据的二进制属性名称',
	},
];

