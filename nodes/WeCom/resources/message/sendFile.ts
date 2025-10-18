import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendFile = {
	resource: ['message'],
	operation: ['sendFile'],
};

export const sendFileDescription: INodeProperties[] = [
	...getRecipientFields('sendFile'),
	{
		displayName: '文件来源',
		name: 'fileSource',
		type: 'options',
		required: true,
		default: 'mediaId',
		displayOptions: {
			show: showOnlySendFile,
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
				description: '从输入数据中上传文件',
			},
		],
	},
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				...showOnlySendFile,
				fileSource: ['mediaId'],
			},
		},
		description: '文件ID，可以调用上传临时素材接口获取',
	},
	{
		displayName: '输入数据字段名',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				...showOnlySendFile,
				fileSource: ['upload'],
			},
		},
		description: '包含文件数据的二进制属性名称',
	},
];

