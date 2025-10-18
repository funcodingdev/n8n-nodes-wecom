import type { INodeProperties } from 'n8n-workflow';

const showOnlyUploadPermanent = {
	resource: ['material'],
	operation: ['uploadPermanent'],
};

export const uploadPermanentDescription: INodeProperties[] = [
	{
		displayName: '素材类型',
		name: 'type',
		type: 'options',
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
		required: true,
		displayOptions: {
			show: showOnlyUploadPermanent,
		},
		description: '素材类型',
	},
	{
		displayName: '文件',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyUploadPermanent,
		},
		description: '要上传的二进制文件属性名称',
	},
];

