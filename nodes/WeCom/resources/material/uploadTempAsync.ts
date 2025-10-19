import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUploadAsync = {
	resource: ['material'],
	operation: ['uploadTempAsync'],
};

export const uploadTempAsyncDescription: INodeProperties[] = [
	{
		displayName: '素材类型',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		options: [
			{
				name: '图片',
				value: 'image',
			},
			{
				name: '语音',
				value: 'voice',
			},
			{
				name: '视频',
				value: 'video',
			},
			{
				name: '文件',
				value: 'file',
			},
		],
		default: 'image',
		description: '媒体文件类型，分别有图片（image）、语音（voice）、视频（video）、普通文件（file）。',
		hint: '素材类型',
	},
	{
		displayName: '文件',
		name: 'file',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		default: 'data',
		description: '要上传的文件的二进制属性名称',
		hint: '二进制数据属性名',
	},
	{
		displayName: '文件名',
		name: 'filename',
		type: 'string',
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		default: '',
		description: '文件名称',
		hint: '文件名',
	},
	{
		displayName: 'Attachment类型',
		name: 'attachment_type',
		type: 'number',
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		default: 1,
		description: '附件类型，1表示临时素材（默认）。',
		hint: '附件类型',
	},
];

